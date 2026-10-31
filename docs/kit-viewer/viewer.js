import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

// With no explode.dir, a piece moves this many times its offset from the kit centre.
const EXPLODE_SPREAD = 1.2;
const FRAME_MS = 450;

const $ = (id) => document.getElementById(id);
const canvas = $('scene');
const status = $('status');
const bubble = $('bubble');
const explodeInput = $('explode');
const narrow = matchMedia('(max-width: 800px)');
const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(35, 1, 0.001, 10);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let accent = new THREE.Color();
const applyTheme = () => {
  scene.background = new THREE.Color(css('--bg'));
  accent = new THREE.Color(css('--accent'));
};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
applyTheme();

new ResizeObserver(() => {
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}).observe(canvas);

let gltf, parts;
try {
  [gltf, parts] = await Promise.all([
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('kit.glb'),
    fetch('parts.json').then((r) => r.json()),
  ]);
} catch (err) {
  status.textContent = `Couldn't load the kit model: ${err.message}`;
  throw err;
}
status.hidden = true;
scene.add(gltf.scene);
scene.updateMatrixWorld(true);

const [assembly] = gltf.scene.children;
const nodeName = (object) => {
  const index = gltf.parser.associations.get(object)?.nodes;
  return index === undefined ? undefined : gltf.parser.json.nodes[index].name;
};

// A piece is one top-level assembly instance; a part (parts.json) owns one or more pieces.
const partByNode = new Map(parts.flatMap((part) => part.nodes.map((n) => [n, part])));
const partByObject = new Map();
for (const part of parts) part.pieces = [];
const pieces = assembly.children.map((object) => {
  const piece = { object, rest: object.position.clone(), offset: new THREE.Vector3() };
  const part = partByNode.get(nodeName(object));
  if (part) {
    part.pieces.push(piece);
    partByObject.set(object, part);
  }
  return piece;
});

const kitBox = new THREE.Box3().setFromObject(assembly);
const kitCenter = kitBox.getCenter(new THREE.Vector3());
const kitRadius = kitBox.getBoundingSphere(new THREE.Sphere()).radius;

const clusters = new Map();
for (const piece of pieces) {
  const key = partByObject.get(piece.object)?.explode?.group ?? piece;
  clusters.set(key, [...(clusters.get(key) ?? []), piece]);
}
for (const members of clusters.values()) {
  const box = new THREE.Box3();
  members.forEach((m) => box.expandByObject(m.object));
  const center = box.getCenter(new THREE.Vector3());
  const dir = partByObject.get(members[0].object)?.explode?.dir;
  const worldOffset = dir
    ? new THREE.Vector3(...dir).multiplyScalar(kitRadius)
    : center.clone().sub(kitCenter).multiplyScalar(EXPLODE_SPREAD);
  for (const m of members) {
    const parent = m.object.parent;
    const from = parent.worldToLocal(center.clone());
    m.offset.copy(parent.worldToLocal(center.clone().add(worldOffset)).sub(from));
  }
}

const setExplode = (t) => {
  for (const p of pieces) p.object.position.copy(p.rest).addScaledVector(p.offset, t);
  explodeInput.value = String(t);
};
explodeInput.addEventListener('input', () => setExplode(Number(explodeInput.value)));
const currentKitBox = () => new THREE.Box3().setFromObject(assembly);
explodeInput.addEventListener('change', () => frameBox(selected ? partBox(selected) : currentKitBox()));

const partBox = (part) => {
  const box = new THREE.Box3();
  part.pieces.forEach((p) => box.expandByObject(p.object));
  return box;
};

let tween = null;
const frameBox = (box) => {
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const fov = THREE.MathUtils.degToRad(camera.fov) / 2;
  const distance = Math.max(sphere.radius, kitRadius * 0.25) / Math.sin(Math.min(fov, fov * camera.aspect)) * 1.15;
  const dir = camera.position.clone().sub(controls.target).normalize();
  tween = {
    start: performance.now(),
    fromTarget: controls.target.clone(),
    toTarget: sphere.center,
    fromPos: camera.position.clone(),
    toPos: sphere.center.clone().addScaledVector(dir, distance),
  };
};

const stepTween = (now) => {
  if (!tween) return;
  const k = Math.min(1, (now - tween.start) / FRAME_MS);
  const e = 1 - (1 - k) ** 3;
  controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
  camera.position.lerpVectors(tween.fromPos, tween.toPos, e);
  if (k === 1) tween = null;
};

// The selected part glows in the accent colour; everything else fades to a ghost.
const lookFor = (mesh, mode) => {
  const u = mesh.userData;
  u.base ??= mesh.material;
  if (mode === 'base') return u.base;
  if (mode === 'ghost') {
    return u.ghost ??= Object.assign(u.base.clone(), { transparent: true, opacity: 0.12, depthWrite: false });
  }
  u.tint ??= Object.assign(u.base.clone(), { emissiveIntensity: 0.6 });
  u.tint.emissive?.copy(accent);
  return u.tint;
};
const isGhost = (object) => object.material === object.userData.ghost;

const applyFocus = () => {
  for (const piece of pieces) {
    const part = partByObject.get(piece.object);
    const mode = !selected ? 'base' : part === selected ? 'tint' : 'ghost';
    piece.object.traverse((o) => {
      if (o.isMesh) o.material = lookFor(o, mode);
    });
  }
};

const list = $('parts-list');
const buttons = new Map();
for (const part of parts) {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = part.title;
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    select(part === selected ? null : part, { frame: true });
    if (narrow.matches) setDrawer(false);
  });
  li.append(button);
  list.append(li);
  buttons.set(part, button);
}

let selected = null;
const select = (part, { frame = false } = {}) => {
  if (selected) buttons.get(selected).setAttribute('aria-pressed', 'false');
  selected = part;
  applyFocus();
  const url = new URL(location.href);
  if (!part) {
    bubble.hidden = true;
    url.searchParams.delete('part');
    history.replaceState(null, '', url);
    return;
  }
  buttons.get(part).setAttribute('aria-pressed', 'true');
  $('bubble-title').textContent = part.title;
  $('bubble-body').textContent = part.body;
  const docs = $('bubble-docs');
  docs.hidden = !part.docs;
  if (part.docs) docs.href = part.docs;
  bubble.hidden = false;
  url.searchParams.set('part', part.id);
  history.replaceState(null, '', url);
  if (frame) frameBox(partBox(part));
};

const anchor = new THREE.Vector3();
const placeBubble = () => {
  if (!selected || bubble.hidden || narrow.matches) return;
  partBox(selected).getCenter(anchor).project(camera);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const x = (anchor.x * 0.5 + 0.5) * w + 24;
  const y = (-anchor.y * 0.5 + 0.5) * h - bubble.offsetHeight / 2;
  const listWidth = $('parts').offsetWidth + 24;
  bubble.style.left = `${Math.max(12, Math.min(x, w - listWidth - bubble.offsetWidth - 12))}px`;
  bubble.style.top = `${Math.max(64, Math.min(y, h - bubble.offsetHeight - 12))}px`;
};

const pointerDown = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
canvas.addEventListener('pointerdown', (e) => pointerDown.set(e.clientX, e.clientY));
canvas.addEventListener('pointerup', (e) => {
  if (pointerDown.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 5) return;
  const rect = canvas.getBoundingClientRect();
  raycaster.setFromCamera(new THREE.Vector2(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    -((e.clientY - rect.top) / rect.height) * 2 + 1,
  ), camera);
  const hits = raycaster.intersectObject(assembly, true);
  let hit = (hits.find((h) => !isGhost(h.object)) ?? hits[0])?.object;
  while (hit && !partByObject.has(hit)) hit = hit.parent;
  select(hit ? partByObject.get(hit) : null);
});

$('bubble-close').addEventListener('click', () => select(null));
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') select(null);
});
$('reset').addEventListener('click', () => {
  select(null);
  frameBox(currentKitBox());
});
const setDrawer = (open) => {
  $('parts').classList.toggle('open', open);
  $('parts-toggle').setAttribute('aria-expanded', String(open));
};
$('parts-toggle').addEventListener('click', () => setDrawer(!$('parts').classList.contains('open')));

camera.position.copy(kitCenter).add(new THREE.Vector3(1, 0.7, 1.3).normalize().multiplyScalar(kitRadius * 4));
controls.target.copy(kitCenter);
controls.minDistance = kitRadius * 0.3;
controls.maxDistance = kitRadius * 12;

const params = new URLSearchParams(location.search);
setExplode(Math.min(1, Math.max(0, Number(params.get('explode')) || 0)));
const deepLinked = parts.find((p) => p.id === params.get('part'));
if (deepLinked) select(deepLinked, { frame: true });
else frameBox(currentKitBox());
tween.start = -Infinity;

renderer.setAnimationLoop((now) => {
  stepTween(now);
  controls.update();
  renderer.render(scene, camera);
  placeBubble();
});

window.kitViewer = { parts, select, setExplode };

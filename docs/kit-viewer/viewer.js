import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

// With no explode.dir, a piece moves this many times its offset from the kit centre.
const EXPLODE_SPREAD = 1.2;
const GHOST_OPACITY = 0.1;
const HOVER_GLOW = 0.45;

const $ = (id) => document.getElementById(id);
const canvas = $('scene');
const bubble = $('bubble');
const tooltip = $('tooltip');
const explodeInput = $('explode');
const narrow = matchMedia('(max-width: 800px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const easeOut = (k) => 1 - (1 - k) ** 3;
const expoOut = (k) => (k === 1 ? 1 : 1 - 2 ** (-10 * k));
const easeInOut = (k) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2);

// Every animation runs through here so reduced motion is one switch.
const tweens = new Set();
const animate = (ms, ease, step) => {
  const t = { start: performance.now(), ms: reducedMotion.matches ? 0 : ms, ease, step };
  tweens.add(t);
  return t;
};
const stepTweens = (now) => {
  for (const t of tweens) {
    const k = t.ms ? clamp((now - t.start) / t.ms, 0, 1) : 1;
    t.step(t.ease(k));
    if (k === 1) tweens.delete(t);
  }
};

const embedded = window !== top;
if (embedded) document.documentElement.dataset.embedded = '';
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: embedded });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.65;
const camera = new THREE.PerspectiveCamera(35, 1, 0.001, 10);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = !reducedMotion.matches;

// Follow the docs site's palette toggle when embedded; it can differ from the OS setting.
const docsBody = (() => {
  try { return embedded ? parent.document.body : null; } catch { return null; }
})();
const accent = new THREE.Color();
const ghostColor = new THREE.Color();
const ghosts = new Map();
const glows = new Map();
let dim = 0;
const applyTheme = () => {
  const scheme = docsBody?.getAttribute('data-md-color-scheme');
  const dark = scheme ? scheme === 'slate' : matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  // A frame whose color-scheme differs from its <iframe> element gets an opaque backdrop.
  if (docsBody) document.documentElement.style.colorScheme = getComputedStyle(frameElement).colorScheme;
  scene.background = embedded ? null : new THREE.Color(css('--bg'));
  accent.set(css('--accent'));
  ghostColor.set(css('--ghost'));
  tintGhosts();
  for (const m of glows.values()) m.emissive?.copy(accent);
};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
if (docsBody) new MutationObserver(applyTheme).observe(docsBody, { attributes: true, attributeFilter: ['data-md-color-scheme'] });
applyTheme();

new ResizeObserver(() => {
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}).observe(canvas);

let gltf, parts;
try {
  [gltf, parts] = await Promise.all([
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('kit.glb', (e) => {
      if (e.total) $('progress-bar').style.transform = `scaleX(${e.loaded / e.total})`;
    }),
    fetch('parts.json').then((r) => r.json()),
  ]);
} catch (err) {
  $('status-text').textContent = `Couldn't load the kit model: ${err.message}`;
  throw err;
}
$('status').classList.add('done');
canvas.classList.add('ready');
scene.add(gltf.scene);
scene.updateMatrixWorld(true);

const [assembly] = gltf.scene.children;

// Cells are drawn rather than stored in kit.glb: dark silicon, a silver border and fine
// grid lines, on UVs the build lays out per cell. The ghost fade starts from fadeFrom,
// since a textured material's color has to be white.
const cellTexture = (background) => {
  const c = Object.assign(document.createElement('canvas'), { width: 512, height: 280 });
  const g = c.getContext('2d');
  g.fillStyle = background;
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = 'rgba(190, 196, 204, 0.12)';
  g.lineWidth = 1;
  for (let x = 12; x < c.width; x += 12) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, c.height);
    g.stroke();
  }
  g.fillStyle = 'rgba(205, 210, 216, 0.4)';
  for (const y of [c.height / 3, (2 * c.height) / 3]) g.fillRect(0, y - 1, c.width, 2);
  // Inset, because the cell's side walls sample the texture's outer edge.
  g.fillStyle = background;
  g.fillRect(0, 0, c.width, 6);
  g.fillRect(0, c.height - 6, c.width, 6);
  g.fillRect(0, 0, 6, c.height);
  g.fillRect(c.width - 6, 0, 6, c.height);
  g.strokeStyle = '#c4c8cc';
  g.lineWidth = 3;
  g.strokeRect(7.5, 7.5, c.width - 15, c.height - 15);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
};
const cellMaterials = new Set();
gltf.scene.traverse((o) => {
  if (o.isMesh && o.material.name === 'solar-cell') cellMaterials.add(o.material);
});
for (const m of cellMaterials) {
  m.userData.fadeFrom = m.color.clone();
  m.map = cellTexture(`#${m.color.getHexString()}`);
  m.color.set(0xffffff);
  m.needsUpdate = true;
}
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

let explodeTween = null;
const setExplode = (t) => {
  for (const p of pieces) p.object.position.copy(p.rest).addScaledVector(p.offset, t);
  explodeInput.value = String(t);
  explodeInput.style.setProperty('--fill', `${t * 100}%`);
};
explodeInput.addEventListener('input', () => {
  tweens.delete(explodeTween);
  setExplode(Number(explodeInput.value));
});
$('explode-toggle').addEventListener('click', () => {
  const from = Number(explodeInput.value);
  const to = from > 0.5 ? 0 : 1;
  tweens.delete(explodeTween);
  explodeTween = animate(600, easeInOut, (e) => setExplode(from + (to - from) * e));
});

const partBox = (part) => {
  const box = new THREE.Box3();
  part.pieces.forEach((p) => box.expandByObject(p.object));
  return box;
};

// Framed for a half-exploded kit, so the slider never has to move the camera and the
// closed kit still fills the view.
setExplode(0.5);
const homeBox = new THREE.Box3().setFromObject(assembly);
setExplode(0);

let flight = null;
const frameBox = (box, { from = 1 } = {}) => {
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const fov = THREE.MathUtils.degToRad(camera.fov) / 2;
  const distance = Math.max(sphere.radius, kitRadius * 0.45) / Math.sin(Math.min(fov, fov * camera.aspect)) * 1.35;
  const dir = camera.position.clone().sub(controls.target).normalize();
  const fromTarget = controls.target.clone();
  const fromPos = from === 1 ? camera.position.clone() : sphere.center.clone().addScaledVector(dir, distance * from);
  const toPos = sphere.center.clone().addScaledVector(dir, distance);
  const travel = fromPos.distanceTo(toPos) + fromTarget.distanceTo(sphere.center);
  const ms = clamp(250 + 120 * Math.log2(1 + travel / kitRadius), 250, 520);
  tweens.delete(flight);
  controls.enableDamping = false;
  flight = animate(ms, expoOut, (e) => {
    controls.target.lerpVectors(fromTarget, sphere.center, e);
    camera.position.lerpVectors(fromPos, toPos, e);
    if (e === 1) controls.enableDamping = !reducedMotion.matches;
  });
};
controls.addEventListener('start', () => {
  if (tweens.delete(flight)) controls.enableDamping = !reducedMotion.matches;
  bubble.classList.add('dragging');
  hideTooltip();
});
controls.addEventListener('end', () => bubble.classList.remove('dragging'));

// Focus by dimming context: the selected part keeps its own look, everything else fades
// to one neutral ghost. Clones are per source material, so a fade touches only a handful.
const ghostOf = (base) => {
  if (!ghosts.has(base)) {
    ghosts.set(base, Object.assign(base.clone(), { transparent: true, depthWrite: false, map: null }));
  }
  return ghosts.get(base);
};
const glowOf = (base) => {
  if (!glows.has(base)) glows.set(base, Object.assign(base.clone(), { emissiveIntensity: 0 }));
  return glows.get(base);
};

let selected = null;
let hovered = null;
// The part everything else is dimmed around. It outlives `selected` while the dimming fades out.
let dimmedFor = null;

const paint = () => {
  for (const piece of pieces) {
    const part = partByObject.get(piece.object);
    piece.object.traverse((o) => {
      if (!o.isMesh) return;
      const base = (o.userData.base ??= o.material);
      if (part && part === hovered && part !== selected) o.material = glowOf(base);
      else if (dimmedFor && part !== dimmedFor) o.material = ghostOf(base);
      else o.material = base;
    });
  }
};

function tintGhosts() {
  for (const [base, ghost] of ghosts) {
    ghost.color.lerpColors(base.userData.fadeFrom ?? base.color, ghostColor, dim);
    ghost.opacity = 1 - (1 - GHOST_OPACITY) * dim;
  }
}

let fade = null;
const dimAround = (part) => {
  if (part) dimmedFor = part;
  paint();
  tintGhosts();
  const from = dim;
  const to = part ? 1 : 0;
  tweens.delete(fade);
  fade = animate(part ? 180 : 140, easeOut, (e) => {
    dim = from + (to - from) * e;
    tintGhosts();
    if (e === 1 && !part) {
      dimmedFor = null;
      paint();
    }
  });
};

let glow = null;
const setHover = (part) => {
  if (part === hovered) return;
  hovered = part;
  paint();
  tweens.delete(glow);
  glow = animate(120, easeOut, (e) => {
    for (const m of glows.values()) {
      m.emissive?.copy(accent);
      m.emissiveIntensity = HOVER_GLOW * e;
    }
  });
};

const list = $('parts-list');
const buttons = new Map();
let lastGroup = null;
for (const part of parts) {
  if (part.group !== lastGroup) {
    lastGroup = part.group;
    const head = document.createElement('li');
    head.className = 'group';
    head.textContent = part.group;
    list.append(head);
  }
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = part.label ?? part.title;
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    select(part === selected ? null : part, { frame: true });
    if (narrow.matches) setDrawer(false);
  });
  button.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && setHover(part));
  button.addEventListener('pointerleave', () => setHover(null));
  button.addEventListener('focus', () => setHover(part));
  button.addEventListener('blur', () => setHover(null));
  li.append(button);
  list.append(li);
  buttons.set(part, button);
}

let drawerOpen = false;
const showBubble = () => bubble.classList.toggle('open', Boolean(selected) && !(narrow.matches && drawerOpen));
const setDrawer = (open) => {
  drawerOpen = open;
  $('parts').classList.toggle('open', open);
  $('parts-toggle').setAttribute('aria-expanded', String(open));
  showBubble();
};
$('parts-toggle').addEventListener('click', () => setDrawer(!drawerOpen));

const more = $('bubble-more');
more.addEventListener('click', () => bubble.classList.add('expanded'));

const select = (part, { frame = false } = {}) => {
  if (selected) buttons.get(selected).setAttribute('aria-pressed', 'false');
  const previous = selected;
  selected = part;
  if (part !== previous) dimAround(part);
  const url = new URL(location.href);
  if (part) url.searchParams.set('part', part.id);
  else url.searchParams.delete('part');
  history.replaceState(null, '', url);
  if (part && part !== previous) {
    const button = buttons.get(part);
    button.setAttribute('aria-pressed', 'true');
    button.scrollIntoView({ block: 'nearest' });
    $('bubble-group').textContent = part.group;
    $('bubble-title').textContent = part.title;
    $('bubble-body').textContent = part.body;
    bubble.classList.remove('expanded');
    const body = $('bubble-body');
    more.hidden = body.scrollHeight <= body.clientHeight + 1;
    const docs = $('bubble-docs');
    docs.hidden = !part.docs;
    if (part.docs) docs.href = part.docs;
    bubbleAt = null;
  } else if (part) {
    buttons.get(part).setAttribute('aria-pressed', 'true');
  }
  showBubble();
  if (part && frame) frameBox(partBox(part));
};

// The bubble sits beside the part's projected bounds, never on top of it, and trails
// the part smoothly during orbit instead of snapping every frame.
const corner = new THREE.Vector3();
let bubbleAt = null;
const placeBubble = () => {
  if (!selected || narrow.matches) return;
  const box = partBox(selected);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < 8; i++) {
    corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera);
    minX = Math.min(minX, corner.x); maxX = Math.max(maxX, corner.x);
    minY = Math.min(minY, corner.y); maxY = Math.max(maxY, corner.y);
  }
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const bw = bubble.offsetWidth;
  const bh = bubble.offsetHeight;
  const right = w - $('parts').offsetWidth - 24;
  const left = (minX * 0.5 + 0.5) * w - 16 - bw;
  let x = (maxX * 0.5 + 0.5) * w + 16;
  if (x + bw > right && left >= 12) x = left;
  const y = (-(maxY + minY) / 2 * 0.5 + 0.5) * h - bh / 2;
  const target = [clamp(x, 12, right - bw), clamp(y, 64, h - bh - 12)];
  bubbleAt = bubbleAt && !reducedMotion.matches
    ? bubbleAt.map((v, i) => v + (target[i] - v) * 0.35)
    : target;
  bubble.style.left = `${bubbleAt[0]}px`;
  bubble.style.top = `${bubbleAt[1]}px`;
};

// On phones the open sheet covers the bottom of the canvas, so lift the view above it.
let viewLift = 0;
const liftView = () => {
  const sheet = narrow.matches ? [bubble, $('parts')].find((el) => el.classList.contains('open')) : null;
  const target = sheet ? sheet.offsetHeight / 2 : 0;
  if (Math.abs(target - viewLift) < 0.5) {
    if (viewLift === target) return;
    viewLift = target;
  } else {
    viewLift += (target - viewLift) * (reducedMotion.matches ? 1 : 0.25);
  }
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (viewLift) camera.setViewOffset(w, h, 0, viewLift, w, h);
  else camera.clearViewOffset();
};

const raycaster = new THREE.Raycaster();
const pickAt = (clientX, clientY) => {
  const rect = canvas.getBoundingClientRect();
  raycaster.setFromCamera(new THREE.Vector2(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1,
  ), camera);
  const hits = raycaster.intersectObject(assembly, true);
  const isGhost = (o) => o.material.transparent && ghosts.get(o.userData.base) === o.material;
  let hit = (hits.find((h) => !isGhost(h.object)) ?? hits[0])?.object;
  while (hit && !partByObject.has(hit)) hit = hit.parent;
  return hit ? partByObject.get(hit) : null;
};

let tooltipTimer = 0;
const hideTooltip = () => {
  clearTimeout(tooltipTimer);
  tooltip.classList.remove('show');
};
let pointer = null;
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' || e.buttons) return;
  pointer = e;
});
canvas.addEventListener('pointerleave', () => {
  pointer = null;
  setHover(null);
  canvas.classList.remove('over-part');
  hideTooltip();
});
const peek = () => {
  if (!pointer) return;
  const e = pointer;
  pointer = null;
  const part = pickAt(e.clientX, e.clientY);
  const wasOver = Boolean(hovered);
  setHover(part);
  canvas.classList.toggle('over-part', Boolean(part));
  if (!part || part === selected) return hideTooltip();
  const rect = canvas.getBoundingClientRect();
  tooltip.textContent = part.label ?? part.title;
  tooltip.style.transform = `translate(${e.clientX - rect.left + 12}px, ${e.clientY - rect.top + 12}px)`;
  if (tooltip.classList.contains('show') || wasOver) return tooltip.classList.add('show');
  clearTimeout(tooltipTimer);
  tooltipTimer = setTimeout(() => tooltip.classList.add('show'), 150);
};

const pointerDown = new THREE.Vector2();
canvas.addEventListener('pointerdown', (e) => pointerDown.set(e.clientX, e.clientY));
canvas.addEventListener('pointerup', (e) => {
  if (pointerDown.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 5) return;
  const part = pickAt(e.clientX, e.clientY);
  hideTooltip();
  if (part && part === selected) frameBox(partBox(part));
  else select(part);
});

$('bubble-close').addEventListener('click', () => select(null));
addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const row = selected && list.contains(document.activeElement) ? buttons.get(selected) : null;
  if (drawerOpen) setDrawer(false);
  select(null);
  row?.focus();
});
$('reset').addEventListener('click', () => {
  select(null);
  frameBox(homeBox);
});

camera.position.copy(kitCenter).add(new THREE.Vector3(1, 0.7, 1.3).normalize().multiplyScalar(kitRadius * 4));
controls.target.copy(kitCenter);
controls.minDistance = kitRadius * 0.3;
controls.maxDistance = kitRadius * 12;

const params = new URLSearchParams(location.search);
setExplode(clamp(Number(params.get('explode')) || 0, 0, 1));
const deepLinked = parts.find((p) => p.id === params.get('part'));
if (deepLinked) select(deepLinked, { frame: true });
else frameBox(homeBox, { from: 1.3 });

renderer.setAnimationLoop((now) => {
  stepTweens(now);
  peek();
  controls.update();
  liftView();
  renderer.render(scene, camera);
  placeBubble();
});

window.kitViewer = { parts, select, setExplode, camera, controls };

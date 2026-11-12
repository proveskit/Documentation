// Brings the Electra export up to the current kit hardware so build_kit_glb.mjs
// can turn the result into kit.glb:
//   - the stowed antennas become the deployed tapes from Michael's
//     "Simplified Assy Orpheus - Copy - Copy (Antenna Copy)" assembly
//     (d/2aa4d5c24d2c27cf307d2c65/w/2db8379cf346fb1a8f8d9000/e/230a0c911e341066d018e596);
//   - each frame half becomes the corner-spanning "Half U" part studio
//     (d/b6b15b1b44122aeefa2d92a0/w/f0b2d4bb33711d965a749bd7/e/a78b0d429985727b32869212);
//   - the eight long feet become the short feet in proveskit/1U_structure feet/,
//     gusset feet (with the inhibit switches) at three top corners, solid elsewhere.
//
//   node graft_current_parts.mjs <electra-raw.glb> <deployed-raw.gltf> <half-u.gltf> <foot_solid.glb> <foot_gusset.glb> <out.glb>
//
// The foot meshes are the STEP files tessellated to metres. They share the old
// foot's part frame, so each takes the old foot body's place unchanged.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { transformPrimitive } from '@gltf-transform/functions';
import { mat4 } from 'gl-matrix';

const [electraPath, deployedPath, halfUPath, solidFootPath, gussetFootPath, output] = process.argv.slice(2);
if (!output) {
  console.error('usage: node graft_current_parts.mjs <electra-raw.glb> <deployed-raw.gltf> <half-u.gltf> <foot_solid.glb> <foot_gusset.glb> <out.glb>');
  process.exit(2);
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const [electra, deployed, halfU, solidFoot, gussetFoot] = await Promise.all(
  [electraPath, deployedPath, halfUPath, solidFootPath, gussetFootPath].map((p) => io.read(p)),
);
const sceneRoot = (doc) => doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];
const assembly = sceneRoot(electra).listChildren()[0];
const buffer = electra.getRoot().listBuffers()[0];

const only = (nodes, what) => {
  if (nodes.length !== 1) throw new Error(`expected one ${what}, found ${nodes.length}`);
  return nodes[0];
};
const findAll = (root, predicate) => {
  const found = [];
  root.traverse((node) => { if (predicate(node)) found.push(node); });
  return found;
};
const apply = (m, p) => [0, 1, 2].map((r) => m[r] * p[0] + m[4 + r] * p[1] + m[8 + r] * p[2] + m[12 + r]);
const worldPoints = (root) => {
  const points = [];
  root.traverse((n) => {
    const mesh = n.getMesh();
    if (!mesh) return;
    const world = n.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const position = prim.getAttribute('POSITION');
      const p = [];
      for (let i = 0; i < position.getCount(); i++) points.push(apply(world, position.getElement(i, p)));
    }
  });
  return points;
};
const box = (points) => {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const p of points) p.forEach((v, k) => { min[k] = Math.min(min[k], v); max[k] = Math.max(max[k], v); });
  return { min, max, center: min.map((v, k) => (v + max[k]) / 2), size: min.map((v, k) => max[k] - v) };
};
const disposeChildren = (node) => node.listChildren().forEach((child) => child.traverse((n) => n.dispose()));

// Copies every mesh under `source` into one Electra mesh, placed by `place(world)`,
// which maps a source node's world matrix to a matrix local to the new node's parent.
const copyMesh = (name, source, place, color) => {
  const mesh = electra.createMesh(name);
  source.traverse((n) => {
    const from = n.getMesh();
    if (!from) return;
    for (const prim of from.listPrimitives()) {
      const material = prim.getMaterial();
      const copy = electra.createPrimitive().setMode(prim.getMode()).setMaterial(
        electra.createMaterial(material?.getName() ?? name).setBaseColorFactor(color ?? material.getBaseColorFactor()),
      );
      for (const semantic of ['POSITION', 'NORMAL']) {
        const a = prim.getAttribute(semantic);
        if (a) copy.setAttribute(semantic, electra.createAccessor().setBuffer(buffer).setType(a.getType()).setArray(new Float32Array(a.getArray())));
      }
      const idx = prim.getIndices();
      if (idx) copy.setIndices(electra.createAccessor().setBuffer(buffer).setType('SCALAR').setArray(new Uint32Array(idx.getArray())));
      transformPrimitive(copy, place(n.getWorldMatrix()));
      mesh.addPrimitive(copy);
    }
  });
  return mesh;
};
const localTo = (parent) => {
  const toParent = mat4.invert(mat4.create(), parent.getWorldMatrix());
  return (extra) => (world) => mat4.multiply(mat4.create(), toParent, mat4.multiply(mat4.create(), extra, world));
};

// Antennas.
{
  const pcbName = 'antenna_top_cap_v2_PCB <1>';
  const electraPcb = only(findAll(assembly, (n) => n.getName() === pcbName), `${pcbName} in Electra`);
  const deployedAssembly = sceneRoot(deployed).listChildren()[0];
  const deployedPcb = only(findAll(deployedAssembly, (n) => n.getName() === pcbName), `${pcbName} in the deployed export`);
  const shift = box(worldPoints(electraPcb)).center.map((v, k) => v - box(worldPoints(deployedPcb)).center[k]);
  console.log(`antennas: top cap offset ${shift.map((v) => (v * 1000).toFixed(2)).join(', ')} mm`);

  const topCap = only(deployedAssembly.listChildren().filter((n) => n.getName() === 'antenna_top_cap_v2 (1) <1>'), 'deployed top cap');
  const tapes = topCap.listChildren().filter((n) => /^Part 1 <[12]>$/.test(n.getName())).sort((a, b) => a.getName().localeCompare(b.getName()));
  if (tapes.length !== 2) throw new Error(`expected two deployed tapes, found ${tapes.length}`);
  const stowed = assembly.listChildren().filter((n) => /^antenna <[12]>$/.test(n.getName())).sort((a, b) => a.getName().localeCompare(b.getName()));
  if (stowed.length !== 2) throw new Error(`expected two stowed antennas, found ${stowed.length}`);

  const place = localTo(assembly)(mat4.fromTranslation(mat4.create(), shift));
  stowed.forEach((node, i) => {
    disposeChildren(node);
    node.setMatrix(mat4.create()).setMesh(null)
      .addChild(electra.createNode(`${node.getName()} tape`).setMesh(copyMesh(node.getName(), tapes[i], place)));
  });
}

// Frame halves. The Half U part studio has its own origin and axes, so each
// copy is registered onto the old half: of the 24 axis-aligned rotations whose
// box matches, take the one whose vertices sit closest to the old mesh.
{
  const source = sceneRoot(halfU);
  const sourcePoints = worldPoints(source);
  const rotations = [];
  for (const axes of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) {
    for (let signs = 0; signs < 8; signs++) {
      const m = mat4.create().fill(0);
      axes.forEach((a, row) => { m[a * 4 + row] = signs & (1 << row) ? -1 : 1; });
      m[15] = 1;
      if (mat4.determinant(m) > 0) rotations.push(m);
    }
  }
  const sample = sourcePoints.filter((_, i) => i % Math.max(1, Math.floor(sourcePoints.length / 3000)) === 0);
  for (const half of assembly.listChildren().filter((n) => /^Chassis <[12]>$/.test(n.getName()))) {
    const target = worldPoints(half);
    const targetBox = box(target);
    const cell = 0.002;
    const grid = new Map();
    for (const p of target) {
      const key = p.map((v) => Math.floor(v / cell)).join();
      grid.set(key, [...(grid.get(key) ?? []), p]);
    }
    const nearest = (p) => {
      const c = p.map((v) => Math.floor(v / cell));
      let best = 0.003;
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
        for (const q of grid.get([c[0] + dx, c[1] + dy, c[2] + dz].join()) ?? []) best = Math.min(best, Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]));
      }
      return best;
    };
    let best;
    for (const rotation of rotations) {
      const rotated = box(sourcePoints.map((p) => apply(rotation, p)));
      if (rotated.size.some((v, k) => Math.abs(v - targetBox.size[k]) > 0.003)) continue;
      const m = mat4.multiply(mat4.create(), mat4.fromTranslation(mat4.create(), targetBox.center.map((v, k) => v - rotated.center[k])), rotation);
      const error = sample.reduce((sum, p) => sum + nearest(apply(m, p)), 0) / sample.length;
      if (!best || error < best.error) best = { m, error };
    }
    if (!best) throw new Error(`no rotation of Half U matches the box of ${half.getName()}`);
    console.log(`frame: ${half.getName()} registered, mean gap ${(best.error * 1000).toFixed(2)} mm`);
    disposeChildren(half);
    half.addChild(electra.createNode('Half U').setMesh(copyMesh('Half U', source, localTo(half)(best.m))));
  }
}

// Feet. The four feet nearest the antenna board are the top feet.
{
  const footBody = (instance) => only(findAll(instance, (n) => n.getName() === 'V4_STRUCTURE_FEET_COMMON' && n.getMesh()), `foot body in ${instance.getName()}`);
  const feet = assembly.listChildren()
    .filter((n) => /^(V4_STRUCTURE_FEET_COMMON \(2\)|No screw feet) <\d>$/.test(n.getName()))
    .map((instance) => ({ instance, body: footBody(instance), height: box(worldPoints(footBody(instance))).center[1] }))
    .sort((a, b) => b.height - a.height || a.instance.getName().localeCompare(b.instance.getName()));
  if (feet.length !== 8) throw new Error(`expected eight feet, found ${feet.length}`);
  const gray = [0.4969, 0.4969, 0.4969, 1];
  feet.forEach(({ instance, body }, i) => {
    const style = i < 3 ? gussetFoot : solidFoot;
    const bodyWorld = body.getWorldMatrix();
    disposeChildren(instance);
    instance.addChild(electra.createNode('V4_STRUCTURE_FEET_COMMON')
      .setMesh(copyMesh('V4_STRUCTURE_FEET_COMMON', sceneRoot(style), localTo(instance)(bodyWorld), gray)));
    console.log(`feet: ${instance.getName()} -> ${i < 3 ? 'gusset' : 'solid'}${i < 4 ? ' (top)' : ''}`);
  });
}

await io.write(output, electra);
console.log(`wrote ${output}`);

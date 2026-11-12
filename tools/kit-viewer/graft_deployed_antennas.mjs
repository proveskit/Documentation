// Replaces the stowed antennas in the Electra export with the deployed tapes
// from Michael's "Simplified Assy Orpheus - Copy - Copy (Antenna Copy)" export,
// so build_kit_glb.mjs can turn the result into a kit with deployed antennas.
//
//   node graft_deployed_antennas.mjs <electra-raw.glb> <deployed-raw.gltf> <out.glb>
//
// Deployed export:
//   d/2aa4d5c24d2c27cf307d2c65/w/2db8379cf346fb1a8f8d9000/e/230a0c911e341066d018e596
// The two assemblies place the top cap PCB about 2 mm apart, so each tape is
// shifted by the offset between the two "antenna_top_cap_v2_PCB <1>" boxes.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { transformPrimitive } from '@gltf-transform/functions';
import { mat4 } from 'gl-matrix';

const [electraPath, deployedPath, output] = process.argv.slice(2);
if (!output) {
  console.error('usage: node graft_deployed_antennas.mjs <electra-raw.glb> <deployed-raw.gltf> <out.glb>');
  process.exit(2);
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const [electra, deployed] = await Promise.all([io.read(electraPath), io.read(deployedPath)]);
const assemblyOf = (doc) => (doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0]).listChildren()[0];

const findAll = (root, predicate) => {
  const found = [];
  root.traverse((node) => { if (predicate(node)) found.push(node); });
  return found;
};

const worldBoxCenter = (node) => {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  node.traverse((n) => {
    const mesh = n.getMesh();
    if (!mesh) return;
    const world = n.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const position = prim.getAttribute('POSITION');
      const p = [];
      for (let i = 0; i < position.getCount(); i++) {
        position.getElement(i, p);
        const w = [0, 1, 2].map((r) => world[r] * p[0] + world[4 + r] * p[1] + world[8 + r] * p[2] + world[12 + r]);
        w.forEach((v, k) => { min[k] = Math.min(min[k], v); max[k] = Math.max(max[k], v); });
      }
    }
  });
  return min.map((v, k) => (v + max[k]) / 2);
};

const only = (nodes, what) => {
  if (nodes.length !== 1) throw new Error(`expected one ${what}, found ${nodes.length}`);
  return nodes[0];
};

const electraAssembly = assemblyOf(electra);
const deployedAssembly = assemblyOf(deployed);
const pcbName = 'antenna_top_cap_v2_PCB <1>';
const electraPcb = only(findAll(electraAssembly, (n) => n.getName() === pcbName), `${pcbName} in Electra`);
const deployedPcb = only(findAll(deployedAssembly, (n) => n.getName() === pcbName), `${pcbName} in the deployed export`);
const shift = worldBoxCenter(electraPcb).map((v, k) => v - worldBoxCenter(deployedPcb)[k]);
console.log(`top cap offset (mm): ${shift.map((v) => (v * 1000).toFixed(2)).join(', ')}`);

const topCap = only(deployedAssembly.listChildren().filter((n) => n.getName() === 'antenna_top_cap_v2 (1) <1>'), 'deployed top cap');
const tapes = topCap.listChildren().filter((n) => /^Part 1 <[12]>$/.test(n.getName()));
if (tapes.length !== 2) throw new Error(`expected two deployed tapes under the top cap, found ${tapes.length}`);

const stowed = electraAssembly.listChildren().filter((n) => /^antenna <[12]>$/.test(n.getName()));
if (stowed.length !== 2) throw new Error(`expected two stowed antennas in Electra, found ${stowed.length}`);
const stowedNames = stowed.map((n) => n.getName()).sort();
for (const node of stowed) node.traverse((n) => n.dispose());

const toAssembly = mat4.invert(mat4.create(), electraAssembly.getWorldMatrix());
const shiftMatrix = mat4.fromTranslation(mat4.create(), shift);
const buffer = electra.getRoot().listBuffers()[0];

tapes.sort((a, b) => a.getName().localeCompare(b.getName())).forEach((tape, i) => {
  const mesh = electra.createMesh(stowedNames[i]);
  tape.traverse((n) => {
    const source = n.getMesh();
    if (!source) return;
    const local = mat4.multiply(mat4.create(), toAssembly, mat4.multiply(mat4.create(), shiftMatrix, n.getWorldMatrix()));
    for (const prim of source.listPrimitives()) {
      const material = prim.getMaterial();
      const copy = electra.createPrimitive().setMode(prim.getMode())
        .setMaterial(electra.createMaterial(material.getName()).setBaseColorFactor(material.getBaseColorFactor()));
      for (const semantic of prim.listSemantics()) {
        const a = prim.getAttribute(semantic);
        copy.setAttribute(semantic, electra.createAccessor().setBuffer(buffer).setType(a.getType()).setArray(a.getArray().slice()));
      }
      const idx = prim.getIndices();
      if (idx) copy.setIndices(electra.createAccessor().setBuffer(buffer).setType('SCALAR').setArray(new Uint32Array(idx.getArray())));
      transformPrimitive(copy, local);
      mesh.addPrimitive(copy);
    }
  });
  electraAssembly.addChild(electra.createNode(stowedNames[i]).addChild(electra.createNode(`${stowedNames[i]} tape`).setMesh(mesh)));
});

await io.write(output, electra);
console.log(`wrote ${output} with deployed ${stowedNames.join(' and ')}`);

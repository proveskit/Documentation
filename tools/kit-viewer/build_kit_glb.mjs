// Turns a raw Onshape assembly glTF export into docs/kit-viewer/kit.glb.
//
//   node build_kit_glb.mjs <raw-export.gltf|glb> [out.glb]
//
// Get the raw export by opening this URL in a browser signed in to Onshape:
//   https://cad.onshape.com/api/assemblies/d/<doc>/w/<workspace>/e/<element>/gltf?outputFaceAppearances=true
// kit.glb currently comes from "PROVES - Electra Assembly":
//   d/acc5f9bc92965fa5d217bfe2/w/d08f4ac9f9109027620bb594/e/2cdf5fa55e1dd2b19a03dfd0
//
// Each top-level assembly instance becomes one node, named exactly as in
// Onshape, holding one primitive per material. parts.json addresses these names,
// and palette.mjs decides the materials.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMaterialsClearcoat } from '@gltf-transform/extensions';
import { dedup, joinPrimitives, meshopt, prune, simplify, transformPrimitive, weld } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { mat4 } from 'gl-matrix';
import { fileURLToPath } from 'node:url';
import { PALETTE, materialKey } from './palette.mjs';

const [input, output = fileURLToPath(new URL('../../docs/kit-viewer/kit.glb', import.meta.url))] = process.argv.slice(2);
if (!input) {
  console.error('usage: node build_kit_glb.mjs <raw-export.gltf|glb> [out.glb]');
  process.exit(2);
}

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(input);
const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];
const [assembly] = scene.listChildren();

const copyPrimitive = (prim) => {
  const out = doc.createPrimitive().setMode(prim.getMode()).setMaterial(prim.getMaterial());
  for (const semantic of prim.listSemantics()) {
    const a = prim.getAttribute(semantic);
    out.setAttribute(semantic, doc.createAccessor().setType(a.getType()).setArray(a.getArray().slice()).setNormalized(a.getNormalized()));
  }
  const idx = prim.getIndices();
  out.setIndices(doc.createAccessor().setType('SCALAR').setArray(
    idx ? new Uint32Array(idx.getArray()) : Uint32Array.from({ length: prim.getAttribute('POSITION').getCount() }, (_, i) => i),
  ));
  return out;
};

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const clearcoat = doc.createExtension(KHRMaterialsClearcoat);
const materials = Object.fromEntries(Object.entries(PALETTE).map(([key, { hex, metal, rough, clearcoat: coat }]) => {
  const rgb = [1, 3, 5].map((i) => srgbToLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
  const material = doc.createMaterial(key).setBaseColorFactor([...rgb, 1]).setMetallicFactor(metal).setRoughnessFactor(rough);
  if (coat) material.setExtension('KHR_materials_clearcoat', clearcoat.createClearcoat().setClearcoatFactor(coat).setClearcoatRoughnessFactor(0.2));
  return [key, material];
}));

// CAD colors are only lookup keys for palette.mjs.
const rawHex = (material) => material.getBaseColorFactor().slice(0, 3)
  .map((v) => Math.round(v ** (1 / 2.2) * 255).toString(16).padStart(2, '0')).join('');

const extent = (prim) => {
  const position = prim.getAttribute('POSITION');
  const [min, max] = [position.getMin([]), position.getMax([])];
  return { min, size: max.map((v, i) => v - min[i]) };
};

// Maps one cell's own flat face onto 0..1, u along its long side.
const addCellUVs = (prim) => {
  const { min, size } = extent(prim);
  const [, b, a] = [0, 1, 2].sort((i, j) => size[i] - size[j]);
  const position = prim.getAttribute('POSITION');
  const uv = new Float32Array(position.getCount() * 2);
  const p = [];
  for (let i = 0; i < position.getCount(); i++) {
    position.getElement(i, p);
    uv[i * 2] = (p[a] - min[a]) / size[a];
    uv[i * 2 + 1] = (p[b] - min[b]) / size[b];
  }
  prim.setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setArray(uv));
};

for (const instance of assembly.listChildren()) {
  const toInstance = mat4.invert(mat4.create(), instance.getWorldMatrix());
  const byMaterial = new Map();
  instance.traverse((node) => {
    const mesh = node.getMesh();
    if (!mesh) return;
    const local = mat4.multiply(mat4.create(), toInstance, node.getWorldMatrix());
    for (const prim of mesh.listPrimitives()) {
      const p = copyPrimitive(prim);
      transformPrimitive(p, local);
      const materialName = materialKey({
        part: instance.getName(),
        leaf: node.getName(),
        color: rawHex(prim.getMaterial()),
        size: Math.max(...extent(p).size),
      });
      if (materialName === 'solar-cell') addCellUVs(p);
      p.setMaterial(materials[materialName]);
      const groups = byMaterial.get(materialName) ?? new Map();
      const key = `${prim.getMode()}|${p.listAttributes().map((a) => `${a.getType()}:${a.getComponentType()}`).join(',')}|${p.listSemantics().join(',')}`;
      groups.set(key, [...(groups.get(key) ?? []), p]);
      byMaterial.set(materialName, groups);
    }
  });
  const merged = doc.createMesh(instance.getName());
  for (const prims of [...byMaterial.values()].flatMap((groups) => [...groups.values()])) {
    merged.addPrimitive(prims.length === 1 ? prims[0] : joinPrimitives(prims));
    if (prims.length > 1) prims.forEach((p) => p.dispose());
  }
  const descendants = [];
  for (const child of instance.listChildren()) child.traverse((n) => descendants.push(n));
  descendants.forEach((n) => n.dispose());
  instance.setMesh(merged);
}

// keepAttributes: the cell UVs have no texture in the file; viewer.js supplies it.
await doc.transform(
  prune({ keepAttributes: true }),
  dedup(),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.25, error: 0.001 }),
  prune({ keepAttributes: true }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
);
await io.write(output, doc);
console.log(`wrote ${output}`);

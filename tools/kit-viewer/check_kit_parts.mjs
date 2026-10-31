// Fails when docs/kit-viewer/parts.json names a node that kit.glb lacks,
// or when two parts claim the same node.
//
//   node check_kit_parts.mjs [kit.glb] [parts.json]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const [glbPath = here('../../docs/kit-viewer/kit.glb'), partsPath = here('../../docs/kit-viewer/parts.json')] = process.argv.slice(2);

const glb = readFileSync(glbPath);
if (glb.readUInt32LE(0) !== 0x46546c67) throw new Error(`${glbPath} is not a GLB`);
const jsonLength = glb.readUInt32LE(12);
const gltf = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8'));
const nodeNames = new Set(gltf.nodes.map((n) => n.name));

const parts = JSON.parse(readFileSync(partsPath, 'utf8'));
const errors = [];
const owner = new Map();
const ids = new Set();
for (const part of parts) {
  if (ids.has(part.id)) errors.push(`duplicate part id "${part.id}"`);
  ids.add(part.id);
  if (!part.nodes?.length) errors.push(`${part.id}: no nodes`);
  for (const node of part.nodes ?? []) {
    if (!nodeNames.has(node)) errors.push(`${part.id}: node "${node}" not in ${glbPath}`);
    if (owner.has(node)) errors.push(`${part.id}: node "${node}" already claimed by ${owner.get(node)}`);
    owner.set(node, part.id);
  }
}

const unclaimed = gltf.nodes.filter((n) => n.mesh !== undefined && !owner.has(n.name)).map((n) => n.name);
console.log(`${parts.length} parts cover ${owner.size} of ${nodeNames.size} nodes; ${unclaimed.length} mesh nodes unannotated`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

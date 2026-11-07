// Fails when docs/kit-viewer/parts.json names a node that kit.glb lacks,
// when two parts claim the same node, or when a guide.json step names a
// part or node that does not exist.
//
//   node check_kit_parts.mjs [kit.glb] [parts.json] [guide.json]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const [
  glbPath = here('../../docs/kit-viewer/kit.glb'),
  partsPath = here('../../docs/kit-viewer/parts.json'),
  guidePath = here('../../docs/kit-viewer/guide.json'),
] = process.argv.slice(2);

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

const guide = JSON.parse(readFileSync(guidePath, 'utf8'));
guide.forEach((step, i) => {
  const where = `guide step ${i + 1}`;
  if (!step.title || !step.body) errors.push(`${where}: needs a title and a body`);
  if (!(step.focus ?? step.add)?.length) errors.push(`${where}: nothing to focus; give it add or focus`);
  const refs = [...(step.add ?? []), ...(step.remove ?? []), ...(step.focus ?? []), ...Object.keys(step.pose ?? {})];
  for (const ref of refs) {
    if (!ids.has(ref) && !nodeNames.has(ref)) errors.push(`${where}: "${ref}" is neither a part id nor a node`);
  }
  for (const [ref, v] of Object.entries(step.pose ?? {})) {
    if (typeof v !== 'number' && !(Array.isArray(v) && v.length === 3)) errors.push(`${where}: pose for "${ref}" must be a number or [x, y, z]`);
  }
  if (step.view && step.view.length !== 3) errors.push(`${where}: view must be [x, y, z]`);
});

const unclaimed = gltf.nodes.filter((n) => n.mesh !== undefined && !owner.has(n.name)).map((n) => n.name);
console.log(`${guide.length} guide steps; ${parts.length} parts cover ${owner.size} of ${nodeNames.size} nodes; ${unclaimed.length} mesh nodes unannotated`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

// Applies cad_fixes.mjs to an already-built kit.glb by rewriting node transforms
// in its JSON chunk; the mesh buffers are copied untouched. Run it once per fix
// added after the last full rebuild; a node it has already moved moves again.
//
//   node apply_cad_fixes.mjs <node name>... [--glb kit.glb]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CAD_FIXES } from './cad_fixes.mjs';

const args = process.argv.slice(2);
const glbAt = args.indexOf('--glb');
const glbPath = glbAt === -1 ? fileURLToPath(new URL('../../docs/kit-viewer/kit.glb', import.meta.url)) : args.splice(glbAt, 2)[1];
if (!args.length) {
  console.error(`usage: node apply_cad_fixes.mjs <node name>... [--glb kit.glb]\nfixes: ${Object.keys(CAD_FIXES).join(', ')}`);
  process.exit(2);
}

const glb = readFileSync(glbPath);
const jsonLength = glb.readUInt32LE(12);
const gltf = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8'));
for (const name of args) {
  const fix = CAD_FIXES[name];
  const node = gltf.nodes.find((n) => n.name === name);
  if (!fix || !node) throw new Error(`no ${fix ? 'node' : 'fix'} named "${name}"`);
  if (node.matrix) throw new Error(`${name} uses a matrix; expected translation/rotation`);
  Object.assign(node, fix({ translation: node.translation ?? [0, 0, 0], rotation: node.rotation ?? [0, 0, 0, 1] }));
  console.log(`moved ${name}`);
}

const json = Buffer.from(JSON.stringify(gltf));
const padded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
const rest = glb.subarray(20 + jsonLength);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(20 + padded.length + rest.length, 8);
header.writeUInt32LE(padded.length, 12);
header.writeUInt32LE(0x4e4f534a, 16);
writeFileSync(glbPath, Buffer.concat([header, padded, rest]));

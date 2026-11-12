// What the kit is made of, matched to photos of the flight hardware. The raw Onshape
// export only carries CAD colors, so build_kit_glb.mjs maps every primitive to one
// material here.
//
// hex is sRGB. metal and rough are glTF metallic and roughness factors.
export const PALETTE = {
  frame: { hex: '#141416', metal: 0.6, rough: 0.45 },
  feet: { hex: '#1a1a1a', metal: 0, rough: 0.8 },
  stainless: { hex: '#c9ccd0', metal: 1, rough: 0.3 },
  'pcb-black': { hex: '#0d0f12', metal: 0, rough: 0.35 },
  'track-black': { hex: '#181b20', metal: 0, rough: 0.35 },
  'pcb-green': { hex: '#0f5a3c', metal: 0, rough: 0.35 },
  'track-green': { hex: '#14704c', metal: 0, rough: 0.35 },
  enig: { hex: '#c8a24a', metal: 1, rough: 0.35 },
  // viewer.js draws this material's texture from its color; the name is the link.
  'solar-cell': { hex: '#1c2128', metal: 0.3, rough: 0.25, clearcoat: 0.3 },
  busbar: { hex: '#c4c8cc', metal: 1, rough: 0.35 },
  'tape-yellow': { hex: '#f2c318', metal: 0, rough: 0.5 },
  zinc: { hex: '#a7adb3', metal: 0.8, rough: 0.5 },
  lead: { hex: '#6f7378', metal: 0.4, rough: 0.7 },
  tin: { hex: '#d0d2d4', metal: 1, rough: 0.4 },
  plastic: { hex: '#1c1c1e', metal: 0, rough: 0.6 },
  ceramic: { hex: '#a48c7e', metal: 0, rough: 0.6 },
  'led-lens': { hex: '#9cd6b0', metal: 0, rough: 0.2 },
};

const CELL_MIN_SIZE_M = 0.02;

// First match wins. Every field a rule names must match; color is the raw CAD color
// (see rawHex in build_kit_glb.mjs), part the top-level instance, leaf the node holding the mesh.
const RULES = [
  { part: /^Assembly 1 <1>/, leaf: /^Lead Block/, key: 'lead' },
  { part: /^Assembly 1 <1>/, key: 'zinc' },
  { color: 'bababa', leaf: /V4_STRUCTURE_FEET/, key: 'feet' },
  { color: 'bababa', leaf: /D2F/, key: 'plastic' },
  { color: 'bababa', key: 'stainless' },
  { color: ['e6e9f8', 'cbd1d7'], key: 'stainless' },
  { color: 'cde8f7', key: 'frame' },
  { color: ['96b7aa', '0000ff'], key: 'pcb-black' },
  { color: '97b8aa', key: 'pcb-green' },
  { color: 'ede600', leaf: /track/, key: 'track-black' },
  { color: 'ede600', key: 'enig' },
  { color: 'ede700', key: 'track-green' },
  { color: 'dedede', key: 'enig' },
  { color: '0000e0', minSize: CELL_MIN_SIZE_M, key: 'solar-cell' },
  { color: ['0000e0', 'ffff00'], key: 'busbar' },
  { color: ['e0e000', 'fde68b'], key: 'tape-yellow' },
  { color: '97e000', key: 'zinc' },
  { color: 'eedeb9', key: 'enig' },
  { color: ['e9e9e4', 'cecece', 'd7d4ca', 'f2f2e8', 'e0e0e0', 'fefffe', 'ffffff', 'bbbbbb', '67a9dc'], key: 'tin' },
  { color: ['6a6969', '505255', '525457', '818181', '888888', '000000'], key: 'plastic' },
  { color: ['a48c7e', 'a48d7f'], key: 'ceramic' },
  { color: '9cd6b0', key: 'led-lens' },
];

const hits = (rule, { part, leaf, color, size }) =>
  (!rule.part || rule.part.test(part))
  && (!rule.leaf || rule.leaf.test(leaf))
  && (!rule.color || [rule.color].flat().includes(color))
  && (!rule.minSize || size >= rule.minSize);

export const materialKey = (primitive) => {
  const rule = RULES.find((r) => hits(r, primitive));
  if (!rule) throw new Error(`no palette rule for ${JSON.stringify(primitive)}; add one to palette.mjs`);
  return rule.key;
};

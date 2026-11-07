// Corrections to the Onshape assembly that have not been made in the CAD yet.
// build_kit_glb.mjs applies them to every fresh export, and apply_cad_fixes.mjs
// applies them to the committed kit.glb without re-encoding its meshes.

// The battery board's card brackets only fit the frame when they mount to the
// component side of the board, but Electra's assembly has them on the cell side.
// Flipping each one 180° about the X axis through the PCB's mid-plane moves it
// onto the other face. Plane height is in metres, read from the board's
// pcb-green primitive (32.7 to 34.3 mm).
const BATTERY_PCB_MID_Y = 0.0335;
const flipAcrossBatteryPcb = ({ translation: [x, y, z], rotation: [qx, qy, qz, qw] }) => ({
  translation: [x, 2 * BATTERY_PCB_MID_Y - y, z],
  // (1, 0, 0, 0) * (qx, qy, qz, qw)
  rotation: [qw, -qz, qy, -qx],
});

export const CAD_FIXES = {
  'Part 1 <1>': flipAcrossBatteryPcb,
  'Part 1 <2>': flipAcrossBatteryPcb,
};

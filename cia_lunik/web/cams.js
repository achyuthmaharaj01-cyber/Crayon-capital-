// Cameraman's pass: per-shot camera overrides (move / moves / handheld / trans / push / focus / cams / grain).
// Loaded after every shots_*.js file; never touches draw(). See CAMERA.md.
const CAM_UNKNOWN = [];
function cam(k, o) { if (SHOTS[k]) Object.assign(SHOTS[k], o); else CAM_UNKNOWN.push(k); }
window.camUnknown = () => CAM_UNKNOWN;

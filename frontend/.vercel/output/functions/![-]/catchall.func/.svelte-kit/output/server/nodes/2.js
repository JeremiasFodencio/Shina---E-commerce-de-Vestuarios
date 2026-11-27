import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.D8n8tcv_.js","_app/immutable/chunks/RNgElSY1.js","_app/immutable/chunks/-UyI9lYi.js","_app/immutable/chunks/B0XwC4Ot.js","_app/immutable/chunks/anJzt-hi.js","_app/immutable/chunks/CFhfcKPW.js","_app/immutable/chunks/CHRQ-8je.js","_app/immutable/chunks/UbF3isWE.js","_app/immutable/chunks/C8Y-sCY4.js","_app/immutable/chunks/CMkQLrv2.js","_app/immutable/chunks/R-4fBUQ2.js","_app/immutable/chunks/BFtsu3Zf.js","_app/immutable/chunks/COnEfCVq.js"];
export const stylesheets = ["_app/immutable/assets/ProdutoCartao.BA7W1PSw.css","_app/immutable/assets/2.DQQPwKsn.css"];
export const fonts = [];

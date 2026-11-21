import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.BAWezDe8.js","_app/immutable/chunks/RNgElSY1.js","_app/immutable/chunks/-UyI9lYi.js","_app/immutable/chunks/B0XwC4Ot.js","_app/immutable/chunks/Corn4xp5.js","_app/immutable/chunks/DIK79qx7.js","_app/immutable/chunks/BBpLJ3ul.js","_app/immutable/chunks/ClhYQFjq.js","_app/immutable/chunks/BuagCF9i.js","_app/immutable/chunks/CKW35aD5.js","_app/immutable/chunks/D9Zb4W2W.js","_app/immutable/chunks/BMQnELjz.js","_app/immutable/chunks/BMFykXCG.js","_app/immutable/chunks/CL7UW4CQ.js"];
export const stylesheets = [];
export const fonts = [];

import { error } from "@sveltejs/kit";
import { a as buscarProduto } from "../../../../chunks/api.js";
async function load({ fetch, params }) {
  try {
    return { p: await buscarProduto(fetch, params.slug) };
  } catch (e) {
    error(e.status ?? 500, e.status === 404 ? "Produto não encontrado." : e.message);
  }
}
export {
  load
};

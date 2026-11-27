import { error } from "@sveltejs/kit";
import { a as buscarProduto, l as listarProdutos } from "../../../../chunks/api.js";
async function load({ fetch, params }) {
  let p;
  try {
    p = await buscarProduto(fetch, params.slug);
  } catch (e) {
    error(e.status ?? 500, e.status === 404 ? "Produto não encontrado." : e.message);
  }
  let relacionados = [];
  try {
    const lista = await listarProdutos(fetch, { por_pagina: 8 });
    relacionados = lista.filter((item) => item.slug !== p.slug).slice(0, 4);
  } catch {
    relacionados = [];
  }
  return { p, relacionados };
}
export {
  load
};

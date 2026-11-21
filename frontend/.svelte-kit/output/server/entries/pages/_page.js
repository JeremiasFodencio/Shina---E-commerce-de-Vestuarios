import { error } from "@sveltejs/kit";
import { l as listarProdutos } from "../../chunks/api.js";
const POR_PAGINA = 12;
async function load({ fetch, url }) {
  const q = url.searchParams.get("q") ?? "";
  const pagina = Math.max(1, Number(url.searchParams.get("pagina") ?? 1) || 1);
  try {
    const produtos = await listarProdutos(fetch, { q, pagina, por_pagina: POR_PAGINA });
    return { produtos, q, pagina, temMais: produtos.length === POR_PAGINA };
  } catch (e) {
    error(e.status ?? 500, e.message);
  }
}
export {
  load
};

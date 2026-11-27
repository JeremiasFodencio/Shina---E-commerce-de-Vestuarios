import { error } from '@sveltejs/kit';
import { buscarProduto, listarProdutos } from '$lib/api';

export async function load({ fetch, params }) {
  let p;
  try {
    p = await buscarProduto(fetch, params.slug);
  } catch (e) {
    error(e.status ?? 500, e.status === 404 ? 'Produto não encontrado.' : e.message);
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

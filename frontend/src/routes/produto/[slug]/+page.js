import { error } from '@sveltejs/kit';
import { buscarProduto } from '$lib/api';

export async function load({ fetch, params }) {
  try {
    return { p: await buscarProduto(fetch, params.slug) };
  } catch (e) {
    error(e.status ?? 500, e.status === 404 ? 'Produto não encontrado.' : e.message);
  }
}

import { error } from '@sveltejs/kit';
import { buscarPedido } from '$lib/api';

export async function load({ fetch, params }) {
  try {
    return { pedido: await buscarPedido(fetch, params.id) };
  } catch (e) {
    error(e.status ?? 500, e.status === 404 ? 'Pedido não encontrado.' : e.message);
  }
}

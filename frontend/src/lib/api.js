import { env } from '$env/dynamic/public';

const BASE = env.PUBLIC_API_URL || 'http://localhost:8080';

async function req(f, caminho, opcoes) {
  let r;
  try {
    r = await f(BASE + caminho, opcoes);
  } catch {
    const e = new Error('Servidor indisponível. Tente novamente em instantes.');
    e.status = 503;
    throw e;
  }
  const corpo = await r.json().catch(() => null);
  if (!r.ok) {
    const e = new Error(corpo?.erro ?? 'Não foi possível concluir a operação.');
    e.status = r.status;
    throw e;
  }
  return corpo;
}

export function listarProdutos(f, { q = '', pagina = 1, por_pagina = 12 } = {}) {
  const params = new URLSearchParams({ pagina, por_pagina });
  if (q) params.set('q', q);
  return req(f, `/api/produtos?${params}`);
}

export const buscarProduto = (f, slug) => req(f, `/api/produtos/${encodeURIComponent(slug)}`);

export const criarPedido = (f, pedido) =>
  req(f, '/api/pedidos', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(pedido)
  });

export const buscarPedido = (f, id) => req(f, `/api/pedidos/${encodeURIComponent(id)}`);

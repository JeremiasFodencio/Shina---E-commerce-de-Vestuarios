import { p as public_env } from "./shared-server.js";
const BASE = public_env.PUBLIC_API_URL || "http://localhost:8080";
async function req(f, caminho, opcoes) {
  let r;
  try {
    r = await f(BASE + caminho, opcoes);
  } catch {
    const e = new Error("Servidor indisponível. Tente novamente em instantes.");
    e.status = 503;
    throw e;
  }
  const corpo = await r.json().catch(() => null);
  if (!r.ok) {
    const e = new Error(corpo?.erro ?? "Não foi possível concluir a operação.");
    e.status = r.status;
    throw e;
  }
  return corpo;
}
function listarProdutos(f, { q = "", pagina = 1, por_pagina = 12 } = {}) {
  const params = new URLSearchParams({ pagina, por_pagina });
  if (q) params.set("q", q);
  return req(f, `/api/produtos?${params}`);
}
const buscarProduto = (f, slug) => req(f, `/api/produtos/${encodeURIComponent(slug)}`);
const buscarPedido = (f, id) => req(f, `/api/pedidos/${encodeURIComponent(id)}`);
export {
  buscarProduto as a,
  buscarPedido as b,
  listarProdutos as l
};

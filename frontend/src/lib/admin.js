import { env } from '$env/dynamic/public';

const BASE = env.PUBLIC_API_URL || 'http://localhost:8080';
const CHAVE = 'admin-key';

// A chave fica só na sessão do navegador (some ao fechar a aba)
export const lerChave = () => sessionStorage.getItem(CHAVE) ?? '';
export const salvarChave = (k) => sessionStorage.setItem(CHAVE, k);
export const sairAdmin = () => sessionStorage.removeItem(CHAVE);

function falha(mensagem, status) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

async function enviar(metodo, caminho, corpo, ehFormData = false) {
  let r;
  try {
    r = await fetch(BASE + caminho, {
      method: metodo,
      headers: {
        'x-admin-key': lerChave(),
        // com FormData o navegador define o content-type (com o boundary) sozinho
        ...(corpo && !ehFormData ? { 'content-type': 'application/json' } : {})
      },
      body: corpo ? (ehFormData ? corpo : JSON.stringify(corpo)) : undefined
    });
  } catch {
    throw falha('Servidor indisponível. Tente novamente em instantes.', 503);
  }
  const json = await r.json().catch(() => null);
  if (!r.ok) throw falha(json?.erro ?? 'Não foi possível concluir a operação.', r.status);
  return json;
}

const req = (metodo, caminho, corpo) => enviar(metodo, caminho, corpo);

export const admin = {
  produtos: () => req('GET', '/api/admin/produtos'),
  criarProduto: (p) => req('POST', '/api/admin/produtos', p),
  editarProduto: (id, d) => req('PATCH', `/api/admin/produtos/${id}`, d),
  criarVariante: (id, v) => req('POST', `/api/admin/produtos/${id}/variantes`, v),
  estoque: (sku, estoque) =>
    req('PATCH', `/api/admin/variantes/${encodeURIComponent(sku)}/estoque`, { estoque }),
  pedidos: () => req('GET', '/api/admin/pedidos'),
  status: (id, status) => req('PATCH', `/api/admin/pedidos/${id}/status`, { status }),
  enviarImagem: (arquivo) => {
    const dados = new FormData();
    dados.append('arquivo', arquivo);
    return enviar('POST', '/api/admin/imagens', dados, true);
  }
};

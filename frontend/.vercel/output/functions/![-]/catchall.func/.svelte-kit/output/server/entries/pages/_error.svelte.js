import { h as head, e as escape_html, d as derived } from "../../chunks/index.js";
import { p as page } from "../../chunks/index2.js";
import { I as Icone } from "../../chunks/Icone.js";
function _error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const naoEncontrada = derived(() => page.status === 404);
    const titulo = derived(() => naoEncontrada() ? "Página não encontrada" : "Algo deu errado");
    const GENERICAS = ["Not Found", "Internal Error", "Internal Server Error"];
    const mensagem = derived(() => {
      const msg = page.error?.message;
      if (!msg || GENERICAS.includes(msg)) {
        return naoEncontrada() ? "O endereço que você abriu não existe ou a peça saiu do catálogo." : "Não conseguimos carregar esta página agora. Tente novamente em instantes.";
      }
      return msg;
    });
    head("1j96wlh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(page.status)} — ${escape_html(titulo())}</title>`);
      });
    });
    $$renderer2.push(`<section class="erro svelte-1j96wlh"><p class="codigo svelte-1j96wlh" aria-hidden="true">${escape_html(page.status)}</p> <p class="rotulo">${escape_html(naoEncontrada() ? "Caminho perdido" : "Erro inesperado")}</p> <h1 class="svelte-1j96wlh">${escape_html(titulo())}</h1> <p class="mensagem svelte-1j96wlh">${escape_html(mensagem())}</p> <div class="acoes svelte-1j96wlh"><a class="btn" href="/">Voltar ao início</a> <a class="btn-texto" href="/ajuda">Central de ajuda `);
    Icone($$renderer2, { nome: "seta", tamanho: 16 });
    $$renderer2.push(`<!----></a></div> <div class="sugestoes svelte-1j96wlh"><p class="rotulo">Talvez você procure</p> <div class="chips svelte-1j96wlh"><a href="/" class="svelte-1j96wlh">Novidades</a> <a href="/favoritos" class="svelte-1j96wlh">Lista de desejos</a> <a href="/carrinho" class="svelte-1j96wlh">Sacola</a></div></div></section>`);
  });
}
export {
  _error as default
};

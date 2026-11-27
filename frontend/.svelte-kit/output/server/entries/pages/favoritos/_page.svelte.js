import { h as head, e as escape_html, c as ensure_array_like, d as derived } from "../../../chunks/index.js";
import { f as favoritos } from "../../../chunks/favoritos.svelte.js";
import { P as ProdutoCartao } from "../../../chunks/ProdutoCartao.js";
import { I as Icone } from "../../../chunks/Icone.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const vazio = derived(() => favoritos.itens.length === 0);
    head("1owpg7o", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Lista de desejos — Shina</title>`);
      });
    });
    $$renderer2.push(`<section class="pagina svelte-1owpg7o"><header class="topo-pagina svelte-1owpg7o"><div><p class="rotulo">Lista de desejos</p> <h1 class="svelte-1owpg7o">Peças que você guardou</h1></div> `);
    if (!vazio()) {
      $$renderer2.push(`<!--[0--><div class="topo-acoes svelte-1owpg7o"><p class="contagem svelte-1owpg7o">${escape_html(favoritos.quantidade)}
          ${escape_html(favoritos.quantidade === 1 ? "peça" : "peças")}</p> <button type="button" class="limpar svelte-1owpg7o">Limpar lista</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></header> `);
    if (vazio()) {
      $$renderer2.push(`<!--[0--><div class="vazio-caixa">`);
      Icone($$renderer2, { nome: "coracao", tamanho: 30 });
      $$renderer2.push(`<!----> <h2>Sua lista ainda está vazia</h2> <p>Toque no coração das peças que você gosta para guardá-las aqui. A lista fica salva
        neste navegador.</p> <div class="vazio-acoes svelte-1owpg7o"><a class="btn" href="/">Explorar a coleção</a> <a class="btn-texto" href="/carrinho">Ver sacola</a></div></div>`);
    } else {
      $$renderer2.push(`<!--[-1--><ul class="grade svelte-1owpg7o"><!--[-->`);
      const each_array = ensure_array_like(favoritos.itens);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let item = each_array[i];
        ProdutoCartao($$renderer2, { produto: item, indice: i });
      }
      $$renderer2.push(`<!--]--></ul> <p class="nota svelte-1owpg7o">`);
      Icone($$renderer2, { nome: "coracao", tamanho: 15 });
      $$renderer2.push(`<!----> Sua lista é salva localmente, sem necessidade de
      cadastro.</p>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  _page as default
};

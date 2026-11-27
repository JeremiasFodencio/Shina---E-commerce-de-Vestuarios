import { b as attr, s as stringify, f as attr_style, e as escape_html, a as attr_class, d as derived } from "./index.js";
import { b as brl, p as parcela, P as PARCELAS } from "./formato.js";
import { f as favoritos } from "./favoritos.svelte.js";
import { I as Icone } from "./Icone.js";
function ProdutoCartao($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { produto, indice = 0 } = $$props;
    const PALETAS = [
      ["#f0eae0", "#dfd4c3"],
      ["#e9e2d7", "#d6cab8"],
      ["#f2ede5", "#e4dbcd"],
      ["#e6ddd0", "#d2c5b1"]
    ];
    const paleta = derived(() => PALETAS[(produto.nome.charCodeAt(0) + indice) % PALETAS.length] ?? PALETAS[0]);
    const favorito = derived(() => favoritos.tem(produto.id));
    $$renderer2.push(`<li class="cartao svelte-sgbpi2"><div class="midia svelte-sgbpi2"><a class="midia-link svelte-sgbpi2"${attr("href", `/produto/${stringify(produto.slug)}`)}${attr("aria-label", `Ver ${stringify(produto.nome)}`)}>`);
    if (produto.imagem_url) {
      $$renderer2.push(`<!--[0--><img${attr("src", produto.imagem_url)}${attr("alt", produto.nome)} loading="lazy" decoding="async" class="svelte-sgbpi2"/>`);
    } else {
      $$renderer2.push(`<!--[-1--><span class="monograma svelte-sgbpi2"${attr_style(`--a:${paleta()[0]};--b:${paleta()[1]}`)}><span aria-hidden="true" class="svelte-sgbpi2">${escape_html(produto.nome[0])}</span></span>`);
    }
    $$renderer2.push(`<!--]--> <span class="veu svelte-sgbpi2" aria-hidden="true">Ver peça</span></a> <button type="button"${attr_class("coracao svelte-sgbpi2", void 0, { "ativo": favorito() })}${attr("aria-pressed", favorito())}${attr("aria-label", favorito() ? `Remover ${produto.nome} dos favoritos` : `Favoritar ${produto.nome}`)}>`);
    Icone($$renderer2, { nome: "coracao", tamanho: 17, cheio: favorito() });
    $$renderer2.push(`<!----></button> `);
    if (produto.estoque_total === 0) {
      $$renderer2.push(`<!--[0--><span class="selo escuro svelte-sgbpi2">Esgotado</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <a class="info svelte-sgbpi2"${attr("href", `/produto/${stringify(produto.slug)}`)}><h3 class="svelte-sgbpi2">${escape_html(produto.nome)}</h3> <p class="preco svelte-sgbpi2">${escape_html(brl(produto.preco_centavos))}</p> <p class="parcelas svelte-sgbpi2">ou ${escape_html(PARCELAS)}× de ${escape_html(brl(parcela(produto.preco_centavos)))} sem juros</p></a></li>`);
  });
}
export {
  ProdutoCartao as P
};

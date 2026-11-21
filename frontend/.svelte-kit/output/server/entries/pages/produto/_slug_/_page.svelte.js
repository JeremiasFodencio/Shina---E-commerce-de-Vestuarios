import { h as head, a as attr, e as ensure_array_like, a6 as attr_class, a5 as derived } from "../../../../chunks/index.js";
import { b as brl, o as ordenarTamanhos } from "../../../../chunks/formato.js";
import { N as NOME_LOJA } from "../../../../chunks/config.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const p = derived(() => data.p);
    const cores = derived(() => [...new Set(p().variantes.map((v) => v.cor))]);
    const tamanhos = derived(() => ordenarTamanhos([...new Set(p().variantes.map((v) => v.tamanho))]));
    let corEscolhida = null;
    let tamanho = null;
    const cor = derived(() => cores().includes(corEscolhida) ? corEscolhida : cores()[0]);
    const variante = derived(() => p().variantes.find((v) => v.cor === cor() && v.tamanho === tamanho));
    const preco = derived(() => variante()?.preco_centavos ?? p().preco_centavos);
    const estoqueDe = (t) => p().variantes.find((v) => v.cor === cor() && v.tamanho === t)?.estoque ?? 0;
    head("1ls10ps", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(p().nome)} — ${escape_html(NOME_LOJA)}</title>`);
      });
    });
    $$renderer2.push(`<article class="detalhe"><div class="foto">`);
    if (p().imagem_url) {
      $$renderer2.push(`<!--[0--><img${attr("src", p().imagem_url)}${attr("alt", p().nome)}/>`);
    } else {
      $$renderer2.push(`<!--[-1--><span aria-hidden="true">${escape_html(p().nome[0])}</span>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="info"><h1>${escape_html(p().nome)}</h1> <p class="preco grande">${escape_html(brl(preco()))}</p> `);
    if (p().descricao) {
      $$renderer2.push(`<!--[0--><p class="descricao">${escape_html(p().descricao)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <fieldset class="grupo"><legend>Cor: <strong>${escape_html(cor())}</strong></legend> <div class="cores"><!--[-->`);
    const each_array = ensure_array_like(cores());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let c = each_array[$$index];
      $$renderer2.push(`<button type="button"${attr_class("cor", void 0, { "ativo": c === cor() })}${attr("aria-pressed", c === cor())}>${escape_html(c)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></fieldset> <fieldset class="grupo"><legend>Tamanho</legend> <div class="fita"><!--[-->`);
    const each_array_1 = ensure_array_like(tamanhos());
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let t = each_array_1[$$index_1];
      const est = estoqueDe(t);
      $$renderer2.push(`<button type="button"${attr_class("seg", void 0, { "ativo": tamanho === t, "sem": est <= 0 })}${attr("disabled", est <= 0, true)}${attr("aria-pressed", tamanho === t)}${attr("aria-label", est <= 0 ? `${t}, indisponível` : t)}>${escape_html(t)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></fieldset> `);
    if (variante()) {
      $$renderer2.push(`<!--[0--><p class="dica">${escape_html(variante().estoque <= 5 ? `Restam ${variante().estoque} unidades` : "Em estoque")} · Código ${escape_html(variante().sku)}</p>`);
    } else {
      $$renderer2.push(`<!--[-1--><p class="dica">Escolha um tamanho para continuar.</p>`);
    }
    $$renderer2.push(`<!--]--> <div><button type="button" class="btn btn-primario"${attr("disabled", !variante(), true)}>Adicionar ao carrinho</button></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></article>`);
  });
}
export {
  _page as default
};

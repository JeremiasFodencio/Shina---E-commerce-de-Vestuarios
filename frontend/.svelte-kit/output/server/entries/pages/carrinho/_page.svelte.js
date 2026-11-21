import { h as head, e as ensure_array_like, a as attr, s as stringify } from "../../../chunks/index.js";
import { b as brl } from "../../../chunks/formato.js";
import { c as carrinho } from "../../../chunks/carrinho.svelte.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("18gxmuv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Carrinho</title>`);
      });
    });
    $$renderer2.push(`<h1>Carrinho</h1> `);
    if (carrinho.itens.length === 0) {
      $$renderer2.push(`<!--[0--><p class="vazio">Seu carrinho está vazio. <a href="/">Ver o catálogo</a></p>`);
    } else {
      $$renderer2.push(`<!--[-1--><ul class="linhas"><!--[-->`);
      const each_array = ensure_array_like(carrinho.itens);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let i = each_array[$$index];
        $$renderer2.push(`<li class="linha"><div><p><a${attr("href", `/produto/${stringify(i.slug)}`)}>${escape_html(i.produto)}</a></p> <p class="sub">${escape_html(i.cor)} · ${escape_html(i.tamanho)} · ${escape_html(brl(i.preco_centavos))}</p> <button type="button" class="remover">Remover</button></div> <div class="qtd"><button type="button" aria-label="Diminuir quantidade">−</button> <span>${escape_html(i.quantidade)}</span> <button type="button" aria-label="Aumentar quantidade">+</button></div> <p><strong>${escape_html(brl(i.preco_centavos * i.quantidade))}</strong></p></li>`);
      }
      $$renderer2.push(`<!--]--></ul> <div class="resumo"><p class="total">Total: ${escape_html(brl(carrinho.total))}</p> <a href="/checkout" class="btn btn-primario">Finalizar compra</a></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};

import { e as escape_html } from "../../chunks/escaping.js";
import "clsx";
import { c as carrinho } from "../../chunks/carrinho.svelte.js";
import { N as NOME_LOJA } from "../../chunks/config.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    $$renderer2.push(`<header class="topo"><div class="container barra"><a href="/" class="marca">${escape_html(NOME_LOJA)}</a> <nav><a href="/carrinho">Carrinho`);
    if (carrinho.quantidade > 0) {
      $$renderer2.push(`<!--[0--><span class="contador">${escape_html(carrinho.quantidade)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></a></nav></div></header> <main class="container">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main> <footer class="container">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} ${escape_html(NOME_LOJA)}</footer>`);
  });
}
export {
  _layout as default
};

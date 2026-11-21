import { h as head, a as attr } from "../../../chunks/index.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { b as brl } from "../../../chunks/formato.js";
import { c as carrinho } from "../../../chunks/carrinho.svelte.js";
import "../../../chunks/api.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let nome = "";
    let email = "";
    let endereco = "";
    let enviando = false;
    head("jbcej5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Finalizar compra</title>`);
      });
    });
    $$renderer2.push(`<h1>Finalizar compra</h1> `);
    if (carrinho.itens.length === 0) {
      $$renderer2.push(`<!--[0--><p class="vazio">Seu carrinho está vazio. <a href="/">Ver o catálogo</a></p>`);
    } else {
      $$renderer2.push(`<!--[-1--><p>${escape_html(carrinho.quantidade)} ${escape_html(carrinho.quantidade === 1 ? "item" : "itens")} · <strong>${escape_html(brl(carrinho.total))}</strong> · <a href="/carrinho">Editar carrinho</a></p> <form class="form-checkout"><label class="campo">Nome completo <input${attr("value", nome)} required="" autocomplete="name"/></label> <label class="campo">E-mail <input type="email"${attr("value", email)} required="" autocomplete="email"/></label> <label class="campo">Endereço de entrega <input${attr("value", endereco)} required="" autocomplete="street-address"/></label> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button class="btn btn-primario"${attr("disabled", enviando, true)}>${escape_html("Fazer pedido")}</button></form>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};

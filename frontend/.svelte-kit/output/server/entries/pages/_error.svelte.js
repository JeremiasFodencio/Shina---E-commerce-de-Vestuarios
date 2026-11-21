import { g as getContext, h as head } from "../../chunks/index.js";
import "../../chunks/state.svelte.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import { e as escape_html } from "../../chunks/escaping.js";
function context() {
  return getContext("__request__");
}
const page$1 = {
  get error() {
    return context().page.error;
  },
  get status() {
    return context().page.status;
  }
};
const page = page$1;
function _error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("1j96wlh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Erro ${escape_html(page.status)}</title>`);
      });
    });
    $$renderer2.push(`<h1>${escape_html(page.status === 404 ? "Página não encontrada" : "Algo deu errado")}</h1> <p>${escape_html(page.error?.message)}</p> <p><a href="/">Voltar ao catálogo</a></p>`);
  });
}
export {
  _error as default
};

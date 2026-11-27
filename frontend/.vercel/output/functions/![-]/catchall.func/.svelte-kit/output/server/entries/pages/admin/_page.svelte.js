import { h as head, a as attr } from "../../../chunks/index.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import { p as public_env } from "../../../chunks/shared-server.js";
public_env.PUBLIC_API_URL || "http://localhost:8080";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const chaveDemo = public_env.PUBLIC_ADMIN_DEMO_KEY ?? "";
    let chaveInput = "";
    head("1jef3w8", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<meta name="robots" content="noindex"/>`);
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Administração</title>`);
      });
    });
    $$renderer2.push(`<h1>Administração</h1> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push(`<!--[0--><form class="form-checkout"><label class="campo">Chave de administração <input type="password"${attr("value", chaveInput)} required="" autocomplete="off"/></label> `);
      if (chaveDemo) {
        $$renderer2.push(`<!--[0--><p class="demo svelte-1jef3w8">Modo demonstração: a chave de acesso é <code class="svelte-1jef3w8">${escape_html(chaveDemo)}</code> <button type="button" class="remover">Preencher</button></p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button class="btn btn-primario">Entrar</button></form>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};

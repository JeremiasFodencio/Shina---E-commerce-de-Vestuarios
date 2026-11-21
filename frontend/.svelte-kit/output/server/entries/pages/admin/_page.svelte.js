import { h as head, a as attr } from "../../../chunks/index.js";
import { p as public_env } from "../../../chunks/shared-server.js";
public_env.PUBLIC_API_URL || "http://localhost:8080";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
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
      $$renderer2.push(`<!--[0--><form class="form-checkout"><label class="campo">Chave de administração <input type="password"${attr("value", chaveInput)} required="" autocomplete="off"/></label> <button class="btn btn-primario">Entrar</button></form>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};

import { h as head, b as attr, e as escape_html } from "../../../chunks/index.js";
import { p as public_env } from "../../../chunks/shared-server.js";
public_env.PUBLIC_API_URL || "http://localhost:8080";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const chaveDemo = public_env.PUBLIC_ADMIN_DEMO_KEY ?? "";
    let chaveInput = "";
    head("1jef3w8", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<meta name="robots" content="noindex"/>`);
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Administração — Shina</title>`);
      });
    });
    $$renderer2.push(`<section class="painel svelte-1jef3w8"><header class="topo-painel svelte-1jef3w8"><div><p class="rotulo">Administração</p> <h1 class="svelte-1jef3w8">Painel da loja</h1></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></header> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push(`<!--[0--><div class="login svelte-1jef3w8"><h2 class="svelte-1jef3w8">Acesso restrito</h2> <p class="login-sub svelte-1jef3w8">Informe a chave de administração para gerenciar produtos, estoque e pedidos.</p> <form class="svelte-1jef3w8"><label class="campo"><span>Chave de administração</span> <input type="password"${attr("value", chaveInput)} required="" autocomplete="off"/></label> `);
      if (chaveDemo) {
        $$renderer2.push(`<!--[0--><p class="demo svelte-1jef3w8">Modo demonstração: a chave é <code class="svelte-1jef3w8">${escape_html(chaveDemo)}</code> <button type="button" class="link preencher svelte-1jef3w8">Preencher</button></p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button class="btn btn-primario btn-bloco">Entrar</button></form></div>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  _page as default
};

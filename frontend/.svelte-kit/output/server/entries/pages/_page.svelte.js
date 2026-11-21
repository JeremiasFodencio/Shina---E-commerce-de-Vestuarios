import { h as head, a as attr, e as ensure_array_like, s as stringify } from "../../chunks/index.js";
import { b as brl } from "../../chunks/formato.js";
import { N as NOME_LOJA } from "../../chunks/config.js";
import { e as escape_html } from "../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    function link(pagina) {
      const params = new URLSearchParams();
      if (data.q) params.set("q", data.q);
      if (pagina > 1) params.set("pagina", pagina);
      const s = params.toString();
      return s ? `/?${s}` : "/";
    }
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(NOME_LOJA)} — Moda e vestuário</title>`);
      });
    });
    $$renderer2.push(`<form class="busca" method="GET" action="/" role="search"><input name="q"${attr("value", data.q)} placeholder="Buscar peças" aria-label="Buscar produtos"/> <button class="btn btn-primario">Buscar</button></form> `);
    if (data.produtos.length === 0) {
      $$renderer2.push(`<!--[0--><p class="vazio">Nenhuma peça encontrada`);
      if (data.q) {
        $$renderer2.push(`<!--[0-->para “${escape_html(data.q)}”`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->. `);
      if (data.q) {
        $$renderer2.push(`<!--[0--><a href="/">Ver todo o catálogo</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></p>`);
    } else {
      $$renderer2.push(`<!--[-1--><ul class="grade-produtos"><!--[-->`);
      const each_array = ensure_array_like(data.produtos);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let p = each_array[$$index];
        $$renderer2.push(`<li><a${attr("href", `/produto/${stringify(p.slug)}`)} class="cartao"><div class="foto">`);
        if (p.imagem_url) {
          $$renderer2.push(`<!--[0--><img${attr("src", p.imagem_url)}${attr("alt", p.nome)} loading="lazy"/>`);
        } else {
          $$renderer2.push(`<!--[-1--><span aria-hidden="true">${escape_html(p.nome[0])}</span>`);
        }
        $$renderer2.push(`<!--]--></div> <h2>${escape_html(p.nome)}</h2> <p class="preco">${escape_html(brl(p.preco_centavos))}</p> `);
        if (p.estoque_total <= 0) {
          $$renderer2.push(`<!--[0--><p class="esgotado">Esgotado</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></a></li>`);
      }
      $$renderer2.push(`<!--]--></ul> `);
      if (data.pagina > 1 || data.temMais) {
        $$renderer2.push(`<!--[0--><nav class="paginacao" aria-label="Paginação">`);
        if (data.pagina > 1) {
          $$renderer2.push(`<!--[0--><a${attr("href", link(data.pagina - 1))}>Página anterior</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (data.temMais) {
          $$renderer2.push(`<!--[0--><a${attr("href", link(data.pagina + 1))}>Próxima página</a>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></nav>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};

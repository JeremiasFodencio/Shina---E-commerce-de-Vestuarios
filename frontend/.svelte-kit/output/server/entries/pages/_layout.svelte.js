import { e as escape_html, a as attr_class, b as attr, d as derived, s as stringify } from "../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
import { p as page } from "../../chunks/index2.js";
import { c as carrinho } from "../../chunks/carrinho.svelte.js";
import { f as favoritos } from "../../chunks/favoritos.svelte.js";
import { b as brl, F as FRETE_GRATIS, N as NOME_LOJA, A as ASSINATURA, D as DESCRICAO_LOJA, I as INSTAGRAM, E as EMAIL_CONTATO } from "../../chunks/formato.js";
import { I as Icone } from "../../chunks/Icone.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    let menuAberto = false;
    let rolado = false;
    let emailNews = "";
    const caminho = derived(() => page.url.pathname);
    const ano = (/* @__PURE__ */ new Date()).getFullYear();
    $$renderer2.push(`<a class="pular" href="#conteudo">Pular para o conteúdo</a> <div class="aviso svelte-12qhfyh"><span class="svelte-12qhfyh">Frete grátis acima de ${escape_html(brl(FRETE_GRATIS))}</span> <span class="aviso-sep svelte-12qhfyh" aria-hidden="true">·</span> <span class="svelte-12qhfyh">Trocas em até 30 dias</span> <span class="aviso-sep svelte-12qhfyh" aria-hidden="true">·</span> <span class="svelte-12qhfyh">Até 3× sem juros</span></div> <header${attr_class("topo svelte-12qhfyh", void 0, { "compacto": rolado })}><div class="container barra svelte-12qhfyh"><button type="button" class="icone menu-btn svelte-12qhfyh" aria-label="Abrir menu"${attr("aria-expanded", menuAberto)}>`);
    Icone($$renderer2, { nome: "menu" });
    $$renderer2.push(`<!----></button> <nav class="nav so-desktop svelte-12qhfyh" aria-label="Navegação principal"><a href="/"${attr_class("svelte-12qhfyh", void 0, { "ativo": caminho() === "/" })}>Novidades</a> <a href="/#destaques" class="svelte-12qhfyh">Essenciais</a> <a href="/#sobre" class="svelte-12qhfyh">Sobre</a> <a href="/ajuda"${attr_class("svelte-12qhfyh", void 0, { "ativo": caminho().startsWith("/ajuda") })}>Ajuda</a></nav> <a class="marca svelte-12qhfyh" href="/"${attr("aria-label", `${stringify(NOME_LOJA)} — página inicial`)}>${escape_html(NOME_LOJA)} <small class="svelte-12qhfyh">${escape_html(ASSINATURA)}</small></a> <div class="acoes svelte-12qhfyh"><button type="button" class="icone svelte-12qhfyh" aria-label="Buscar">`);
    Icone($$renderer2, { nome: "busca" });
    $$renderer2.push(`<!----></button> <a class="icone so-desktop svelte-12qhfyh" href="/favoritos" aria-label="Lista de desejos">`);
    Icone($$renderer2, { nome: "coracao", cheio: favoritos.quantidade > 0 });
    $$renderer2.push(`<!----> `);
    if (favoritos.quantidade > 0) {
      $$renderer2.push(`<!--[0--><span class="contador svelte-12qhfyh">${escape_html(favoritos.quantidade)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></a> <a class="icone svelte-12qhfyh" href="/carrinho" aria-label="Sacola">`);
    Icone($$renderer2, { nome: "sacola" });
    $$renderer2.push(`<!----> `);
    if (carrinho.quantidade > 0) {
      $$renderer2.push(`<!--[0--><span class="contador svelte-12qhfyh">${escape_html(carrinho.quantidade)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></a></div></div></header> <main id="conteudo" class="principal"><div class="container">`);
    children($$renderer2);
    $$renderer2.push(`<!----></div></main> <footer class="rodape svelte-12qhfyh"><section class="container newsletter svelte-12qhfyh"><div class="news-texto svelte-12qhfyh"><p class="rotulo svelte-12qhfyh">Newsletter</p> <h2 class="svelte-12qhfyh">Novidades em primeira mão.</h2> <p class="svelte-12qhfyh">Lançamentos, reposições e histórias da coleção. Sem excesso de e-mails.</p></div> <div class="news-acao">`);
    {
      $$renderer2.push(`<!--[-1--><form class="news-form svelte-12qhfyh"><label class="sr" for="email-news">Seu e-mail</label> <input id="email-news" type="email"${attr("value", emailNews)} placeholder="seu@email.com" autocomplete="email" required="" class="svelte-12qhfyh"/> <button class="btn svelte-12qhfyh" type="submit">Assinar</button></form> <p class="news-nota svelte-12qhfyh">Ao assinar, você concorda em receber nossos e-mails.</p>`);
    }
    $$renderer2.push(`<!--]--></div></section> <div class="container colunas svelte-12qhfyh"><div class="marca-coluna svelte-12qhfyh"><p class="marca-rodape svelte-12qhfyh">${escape_html(NOME_LOJA)}</p> <p class="marca-texto svelte-12qhfyh">${escape_html(DESCRICAO_LOJA)}</p> <div class="sociais svelte-12qhfyh"><span class="svelte-12qhfyh">`);
    Icone($$renderer2, { nome: "instagram", tamanho: 16 });
    $$renderer2.push(`<!----> ${escape_html(INSTAGRAM)}</span> <a${attr("href", `mailto:${stringify(EMAIL_CONTATO)}`)} class="svelte-12qhfyh">`);
    Icone($$renderer2, { nome: "email", tamanho: 16 });
    $$renderer2.push(`<!----> ${escape_html(EMAIL_CONTATO)}</a></div></div> <div class="coluna svelte-12qhfyh"><h3 class="svelte-12qhfyh">Atendimento</h3> <ul class="svelte-12qhfyh"><li><a href="/ajuda" class="svelte-12qhfyh">Central de ajuda</a></li> <li><a href="/ajuda#trocas" class="svelte-12qhfyh">Trocas e devoluções</a></li> <li><a href="/ajuda#tamanhos" class="svelte-12qhfyh">Guia de tamanhos</a></li> <li><a${attr("href", `mailto:${stringify(EMAIL_CONTATO)}`)} class="svelte-12qhfyh">Fale conosco</a></li></ul></div> <div class="coluna svelte-12qhfyh"><h3 class="svelte-12qhfyh">A Shina</h3> <ul class="svelte-12qhfyh"><li><a href="/#sobre" class="svelte-12qhfyh">Nossa história</a></li> <li><a href="/#destaques" class="svelte-12qhfyh">Essenciais</a></li> <li><a href="/favoritos" class="svelte-12qhfyh">Lista de desejos</a></li> <li><a href="/admin" class="svelte-12qhfyh">Administração</a></li></ul></div> <div class="coluna svelte-12qhfyh"><h3 class="svelte-12qhfyh">Ajuda</h3> <ul class="svelte-12qhfyh"><li><a href="/ajuda#faq" class="svelte-12qhfyh">Perguntas frequentes</a></li> <li><a href="/ajuda#pagamento" class="svelte-12qhfyh">Formas de pagamento</a></li> <li><a href="/ajuda#entrega" class="svelte-12qhfyh">Prazos de entrega</a></li> <li><a href="/ajuda#privacidade" class="svelte-12qhfyh">Privacidade</a></li></ul></div></div> <div class="container base svelte-12qhfyh"><p>© ${escape_html(ano)} ${escape_html(NOME_LOJA)}. Todos os direitos reservados.</p> <p class="base-meio svelte-12qhfyh">Feito em pequenos lotes · Brasil</p> <div class="pagamentos svelte-12qhfyh" aria-label="Formas de pagamento aceitas"><span class="svelte-12qhfyh">Pix</span> <span class="svelte-12qhfyh">Visa</span> <span class="svelte-12qhfyh">Mastercard</span> <span class="svelte-12qhfyh">Elo</span></div></div></footer> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _layout as default
};

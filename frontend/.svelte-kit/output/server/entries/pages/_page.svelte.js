import { h as head, e as escape_html, b as attr, s as stringify, c as ensure_array_like, d as derived } from "../../chunks/index.js";
import { b as brl, F as FRETE_GRATIS, N as NOME_LOJA } from "../../chunks/formato.js";
import { P as ProdutoCartao } from "../../chunks/ProdutoCartao.js";
import { I as Icone } from "../../chunks/Icone.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const destaque = derived(() => data.produtos.find((p) => p.imagem_url) ?? data.produtos[0] ?? null);
    function link(pagina) {
      const params = new URLSearchParams();
      if (data.q) params.set("q", data.q);
      if (pagina > 1) params.set("pagina", pagina);
      const s = params.toString();
      return s ? `/?${s}` : "/";
    }
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<meta name="description" content="Peças em fibras naturais, feitas em pequenos lotes. Conheça a coleção de essenciais da Shina."/>`);
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(NOME_LOJA)} — Essenciais atemporais</title>`);
      });
    });
    $$renderer2.push(`<section class="hero svelte-1uha8ag"><div class="hero-texto svelte-1uha8ag"><p class="rotulo">Coleção 20XX · Essenciais</p> <h1 class="svelte-1uha8ag">Peças que <em class="svelte-1uha8ag">duram</em> mais do que uma estação.</h1> <p class="hero-sub svelte-1uha8ag">Algodão, linho e caimentos que atravessam o tempo. Produção em pequenos lotes,
      pensada para vestir o cotidiano — não a próxima tendência.</p> <div class="hero-acoes svelte-1uha8ag"><a class="btn" href="#destaques">Explorar coleção</a> <a class="btn-texto" href="#sobre">Nossa história `);
    Icone($$renderer2, { nome: "seta", tamanho: 16 });
    $$renderer2.push(`<!----></a></div> <p class="hero-nota svelte-1uha8ag">Frete grátis acima de ${escape_html(brl(FRETE_GRATIS))} · Trocas em até 30 dias</p></div> <div class="hero-visual svelte-1uha8ag"><div class="moldura svelte-1uha8ag">`);
    if (destaque()?.imagem_url) {
      $$renderer2.push(`<!--[0--><img${attr("src", destaque().imagem_url)}${attr("alt", destaque().nome)} class="svelte-1uha8ag"/>`);
    } else {
      $$renderer2.push(`<!--[-1--><div class="hero-monograma svelte-1uha8ag" aria-hidden="true"><span class="svelte-1uha8ag">S</span> <small class="svelte-1uha8ag">${escape_html(NOME_LOJA)}</small></div>`);
    }
    $$renderer2.push(`<!--]--> <span class="hero-legenda svelte-1uha8ag">Outono · Inverno 25</span></div> `);
    if (destaque()) {
      $$renderer2.push(`<!--[0--><a class="etiqueta-flutuante svelte-1uha8ag"${attr("href", `/produto/${stringify(destaque().slug)}`)}><span class="rotulo">Em destaque</span> <strong class="svelte-1uha8ag">${escape_html(destaque().nome)}</strong> <span class="etiqueta-preco svelte-1uha8ag">${escape_html(brl(destaque().preco_centavos))}</span></a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></section> <ul class="beneficios svelte-1uha8ag"><li class="svelte-1uha8ag">`);
    Icone($$renderer2, { nome: "caminhao", tamanho: 22 });
    $$renderer2.push(`<!----> <div class="svelte-1uha8ag"><strong class="svelte-1uha8ag">Frete grátis</strong><span class="svelte-1uha8ag">acima de ${escape_html(brl(FRETE_GRATIS))}</span></div></li> <li class="svelte-1uha8ag">`);
    Icone($$renderer2, { nome: "troca", tamanho: 22 });
    $$renderer2.push(`<!----> <div class="svelte-1uha8ag"><strong class="svelte-1uha8ag">Trocas fáceis</strong><span class="svelte-1uha8ag">em até 30 dias</span></div></li> <li class="svelte-1uha8ag">`);
    Icone($$renderer2, { nome: "escudo", tamanho: 22 });
    $$renderer2.push(`<!----> <div class="svelte-1uha8ag"><strong class="svelte-1uha8ag">Pagamento seguro</strong><span class="svelte-1uha8ag">Pix e cartão</span></div></li> <li class="svelte-1uha8ag">`);
    Icone($$renderer2, { nome: "coracao", tamanho: 22 });
    $$renderer2.push(`<!----> <div class="svelte-1uha8ag"><strong class="svelte-1uha8ag">Feito com cuidado</strong><span class="svelte-1uha8ag">pequenos lotes</span></div></li></ul> <section id="destaques" class="secao svelte-1uha8ag"><div class="secao-topo svelte-1uha8ag"><div><p class="rotulo">Catálogo</p> <h2 class="svelte-1uha8ag">Novidades</h2></div> <form class="busca svelte-1uha8ag" method="GET" action="/" role="search">`);
    Icone($$renderer2, { nome: "busca", tamanho: 17 });
    $$renderer2.push(`<!----> <label class="sr" for="busca-catalogo">Buscar no catálogo</label> <input id="busca-catalogo" name="q"${attr("value", data.q)} placeholder="Buscar por peça" class="svelte-1uha8ag"/> <button class="busca-enviar svelte-1uha8ag" type="submit">Buscar</button></form></div> `);
    if (data.q) {
      $$renderer2.push(`<!--[0--><p class="resultado svelte-1uha8ag">${escape_html(data.produtos.length)}
      ${escape_html(data.produtos.length === 1 ? "peça encontrada" : "peças encontradas")} para <strong>“${escape_html(data.q)}”</strong> · <a class="link" href="/">limpar busca</a></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.produtos.length === 0) {
      $$renderer2.push(`<!--[0--><div class="vazio-caixa">`);
      Icone($$renderer2, { nome: "busca", tamanho: 26 });
      $$renderer2.push(`<!----> <h3>Nada encontrado por aqui</h3> <p>Não temos peças com esse termo`);
      if (data.q) {
        $$renderer2.push(`<!--[0-->— tente outra palavra ou veja o catálogo
        completo`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->.</p> <a class="btn btn-secundario" href="/">Ver todo o catálogo</a></div>`);
    } else {
      $$renderer2.push(`<!--[-1--><ul class="grade svelte-1uha8ag"><!--[-->`);
      const each_array = ensure_array_like(data.produtos);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let p = each_array[i];
        ProdutoCartao($$renderer2, { produto: p, indice: i });
      }
      $$renderer2.push(`<!--]--></ul> `);
      if (data.pagina > 1 || data.temMais) {
        $$renderer2.push(`<!--[0--><nav class="paginacao svelte-1uha8ag" aria-label="Paginação">`);
        if (data.pagina > 1) {
          $$renderer2.push(`<!--[0--><a class="pagina svelte-1uha8ag"${attr("href", link(data.pagina - 1))}>`);
          Icone($$renderer2, { nome: "seta-esquerda", tamanho: 16 });
          $$renderer2.push(`<!----> Anterior</a>`);
        } else {
          $$renderer2.push(`<!--[-1--><span></span>`);
        }
        $$renderer2.push(`<!--]--> <span class="pagina-atual svelte-1uha8ag">Página ${escape_html(data.pagina)}</span> `);
        if (data.temMais) {
          $$renderer2.push(`<!--[0--><a class="pagina svelte-1uha8ag"${attr("href", link(data.pagina + 1))}>Próxima `);
          Icone($$renderer2, { nome: "seta", tamanho: 16 });
          $$renderer2.push(`<!----></a>`);
        } else {
          $$renderer2.push(`<!--[-1--><span></span>`);
        }
        $$renderer2.push(`<!--]--></nav>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></section> <section id="sobre" class="sobre svelte-1uha8ag"><div class="sobre-citacao svelte-1uha8ag"><span class="aspa svelte-1uha8ag" aria-hidden="true">“</span> <p class="svelte-1uha8ag">Menos peças,<br/>mais uso.</p> <span class="rotulo sobre-rotulo svelte-1uha8ag">Filosofia Shina</span></div> <div class="sobre-texto svelte-1uha8ag"><p class="rotulo svelte-1uha8ag">A Shina</p> <h2 class="svelte-1uha8ag">Feito para vestir o cotidiano, não a próxima tendência.</h2> <p class="sobre-desc svelte-1uha8ag">Nascemos de uma ideia simples: roupas que você usa muitas vezes, combina de
      muitos jeitos e continua querendo vestir. Escolhemos fibras naturais, caimentos
      confortáveis e uma paleta que não cansa.</p> <ul class="lista-check svelte-1uha8ag"><li class="svelte-1uha8ag">`);
    Icone($$renderer2, { nome: "check", tamanho: 16 });
    $$renderer2.push(`<!----> Fibras naturais e fornecedores próximos</li> <li class="svelte-1uha8ag">`);
    Icone($$renderer2, { nome: "check", tamanho: 16 });
    $$renderer2.push(`<!----> Pequenos lotes, sem desperdício</li> <li class="svelte-1uha8ag">`);
    Icone($$renderer2, { nome: "check", tamanho: 16 });
    $$renderer2.push(`<!----> Peças pensadas para durar anos</li></ul> <a class="btn-texto sobre-link svelte-1uha8ag" href="mailto:ola@shina.com.br">Falar com a gente `);
    Icone($$renderer2, { nome: "seta", tamanho: 16 });
    $$renderer2.push(`<!----></a></div></section>`);
  });
}
export {
  _page as default
};

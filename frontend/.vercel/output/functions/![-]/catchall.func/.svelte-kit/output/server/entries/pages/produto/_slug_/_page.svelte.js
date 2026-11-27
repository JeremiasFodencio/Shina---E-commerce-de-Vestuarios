import { h as head, e as escape_html, b as attr, c as ensure_array_like, a as attr_class, f as attr_style, s as stringify, d as derived } from "../../../../chunks/index.js";
import { b as brl, p as parcela, c as corCss, N as NOME_LOJA, F as FRETE_GRATIS, o as ordenarTamanhos, P as PARCELAS } from "../../../../chunks/formato.js";
import { f as favoritos } from "../../../../chunks/favoritos.svelte.js";
import { P as ProdutoCartao } from "../../../../chunks/ProdutoCartao.js";
import { I as Icone } from "../../../../chunks/Icone.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const p = derived(() => data.p);
    const variantes = derived(() => p().variantes ?? []);
    const cores = derived(() => [...new Set(variantes().map((v) => v.cor))]);
    const tamanhos = derived(() => ordenarTamanhos([...new Set(variantes().map((v) => v.tamanho))]));
    let corEscolhida = null;
    let tamanho = null;
    let quantidade = 1;
    const cor = derived(() => cores().includes(corEscolhida) ? corEscolhida : cores()[0]);
    const variante = derived(() => variantes().find((v) => v.cor === cor() && v.tamanho === tamanho));
    const preco = derived(() => variante()?.preco_centavos ?? p().preco_centavos);
    const esgotado = derived(() => variantes().length > 0 && variantes().every((v) => v.estoque <= 0));
    const maxQuantidade = derived(() => Math.min(variante()?.estoque ?? 1, 20));
    const favoritado = derived(() => favoritos.tem(p().id));
    const estoqueDe = (t) => variantes().find((v) => v.cor === cor() && v.tamanho === t)?.estoque ?? 0;
    head("1ls10ps", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<meta name="description"${attr("content", p().descricao ?? `${p().nome} — essenciais ${NOME_LOJA}.`)}/>`);
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(p().nome)} — ${escape_html(NOME_LOJA)}</title>`);
      });
    });
    $$renderer2.push(`<nav class="migalhas svelte-1ls10ps" aria-label="Você está aqui"><a href="/" class="svelte-1ls10ps">Novidades</a> <span aria-hidden="true">/</span> <span aria-current="page" class="svelte-1ls10ps">${escape_html(p().nome)}</span></nav> <article class="detalhe svelte-1ls10ps"><div class="midia svelte-1ls10ps"><figure class="quadro svelte-1ls10ps">`);
    if (p().imagem_url) {
      $$renderer2.push(`<!--[0--><img${attr("src", p().imagem_url)}${attr("alt", p().nome)} class="svelte-1ls10ps"/>`);
    } else {
      $$renderer2.push(`<!--[-1--><div class="monograma svelte-1ls10ps" aria-hidden="true"><span class="svelte-1ls10ps">${escape_html(p().nome[0])}</span> <small class="svelte-1ls10ps">${escape_html(NOME_LOJA)}</small></div>`);
    }
    $$renderer2.push(`<!--]--> <figcaption class="selo svelte-1ls10ps">Pequenos lotes</figcaption></figure> <p class="nota-foto svelte-1ls10ps">Peça da coleção Essenciais · foto ilustrativa</p></div> <div class="info svelte-1ls10ps"><p class="rotulo">Shina · Essenciais</p> <h1 class="svelte-1ls10ps">${escape_html(p().nome)}</h1> <div class="preco-linha svelte-1ls10ps"><p class="preco svelte-1ls10ps">${escape_html(brl(preco()))}</p> `);
    if (preco() >= 100) {
      $$renderer2.push(`<!--[0--><span class="parcelas svelte-1ls10ps">ou ${escape_html(PARCELAS)}× de ${escape_html(brl(parcela(preco())))} sem juros</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (p().descricao) {
      $$renderer2.push(`<!--[0--><p class="descricao svelte-1ls10ps">${escape_html(p().descricao)}</p>`);
    } else {
      $$renderer2.push(`<!--[-1--><p class="descricao svelte-1ls10ps">Uma peça pensada para o dia a dia: caimento confortável, tecido natural e
        acabamento cuidadoso.</p>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (cores().length > 0) {
      $$renderer2.push(`<!--[0--><fieldset class="grupo svelte-1ls10ps"><legend class="svelte-1ls10ps"><span class="rotulo">Cor</span> <strong class="escolha svelte-1ls10ps">${escape_html(cor())}</strong></legend> <div class="cores svelte-1ls10ps"><!--[-->`);
      const each_array = ensure_array_like(cores());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let c = each_array[$$index];
        $$renderer2.push(`<button type="button"${attr_class("cor svelte-1ls10ps", void 0, { "ativo": c === cor() })}${attr_style(`--amostra: ${stringify(corCss(c))}`)}${attr("aria-pressed", c === cor())}${attr("aria-label", `Cor ${stringify(c)}`)}${attr("title", c)}><span class="svelte-1ls10ps"></span></button>`);
      }
      $$renderer2.push(`<!--]--></div></fieldset>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (tamanhos().length > 0) {
      $$renderer2.push(`<!--[0--><fieldset class="grupo svelte-1ls10ps"><legend class="svelte-1ls10ps"><span class="rotulo">Tamanho</span> <a class="guia svelte-1ls10ps" href="/ajuda#tamanhos">Guia de tamanhos</a></legend> <div class="tamanhos svelte-1ls10ps"><!--[-->`);
      const each_array_1 = ensure_array_like(tamanhos());
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let t = each_array_1[$$index_1];
        const est = estoqueDe(t);
        $$renderer2.push(`<button type="button"${attr_class("tam svelte-1ls10ps", void 0, { "ativo": tamanho === t, "sem": est <= 0 })}${attr("disabled", est <= 0, true)}${attr("aria-pressed", tamanho === t)}${attr("aria-label", est <= 0 ? `${t}, indisponível` : `Tamanho ${t}`)}>${escape_html(t)}</button>`);
      }
      $$renderer2.push(`<!--]--></div></fieldset>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <p class="dica-estoque svelte-1ls10ps">`);
    if (esgotado()) {
      $$renderer2.push(`<!--[0-->Esta peça está esgotada no momento.`);
    } else if (variante()) {
      $$renderer2.push(`<!--[1-->${escape_html(variante().estoque <= 5 ? `Últimas ${variante().estoque} unidades neste tamanho` : "Disponível para envio imediato")} <span class="sku svelte-1ls10ps">· cód. ${escape_html(variante().sku)}</span>`);
    } else {
      $$renderer2.push(`<!--[-1-->Selecione um tamanho para continuar.`);
    }
    $$renderer2.push(`<!--]--></p> <div class="compra svelte-1ls10ps"><div class="stepper svelte-1ls10ps" aria-label="Quantidade"><button type="button" aria-label="Diminuir quantidade"${attr("disabled", !variante() || quantidade <= 1, true)} class="svelte-1ls10ps">−</button> <span aria-live="polite" class="svelte-1ls10ps">${escape_html(quantidade)}</span> <button type="button" aria-label="Aumentar quantidade"${attr("disabled", !variante() || quantidade >= maxQuantidade(), true)} class="svelte-1ls10ps">+</button></div> <button type="button" class="btn btn-primario comprar svelte-1ls10ps"${attr("disabled", !variante() || variante().estoque <= 0, true)}>${escape_html(esgotado() ? "Esgotado" : !variante() ? "Selecione um tamanho" : "Adicionar à sacola")}</button></div> <button type="button"${attr_class("favoritar svelte-1ls10ps", void 0, { "favoritado": favoritado() })}>`);
    Icone($$renderer2, { nome: "coracao", tamanho: 17, cheio: favoritado() });
    $$renderer2.push(`<!----> ${escape_html(favoritado() ? "Salvo na lista de desejos" : "Salvar na lista de desejos")}</button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <ul class="selos svelte-1ls10ps"><li class="svelte-1ls10ps">`);
    Icone($$renderer2, { nome: "caminhao", tamanho: 18 });
    $$renderer2.push(`<!----> Frete grátis acima de ${escape_html(brl(FRETE_GRATIS))}</li> <li class="svelte-1ls10ps">`);
    Icone($$renderer2, { nome: "troca", tamanho: 18 });
    $$renderer2.push(`<!----> Trocas em até 30 dias</li> <li class="svelte-1ls10ps">`);
    Icone($$renderer2, { nome: "escudo", tamanho: 18 });
    $$renderer2.push(`<!----> Pagamento seguro · Pix e cartão</li></ul> <div class="acordeoes svelte-1ls10ps"><details open="" class="svelte-1ls10ps"><summary class="svelte-1ls10ps">Detalhes da peça `);
    Icone($$renderer2, { nome: "chevron", tamanho: 16 });
    $$renderer2.push(`<!----></summary> <div class="acordeao-corpo svelte-1ls10ps"><p class="svelte-1ls10ps">${escape_html(p().descricao ?? "Modelagem confortável, pensada para acompanhar o corpo sem apertar. Peça versátil, fácil de combinar em diferentes ocasiões.")}</p> <p class="svelte-1ls10ps">Produzida em pequenos lotes para reduzir desperdício.</p></div></details> <details class="svelte-1ls10ps"><summary class="svelte-1ls10ps">Composição e cuidados `);
    Icone($$renderer2, { nome: "chevron", tamanho: 16 });
    $$renderer2.push(`<!----></summary> <div class="acordeao-corpo svelte-1ls10ps"><p class="svelte-1ls10ps">Fibras naturais selecionadas. Lavar à mão ou à máquina em ciclo delicado, com água fria.</p> <p class="svelte-1ls10ps">Não usar alvejante. Secar à sombra. Passar em temperatura média.</p></div></details> <details class="svelte-1ls10ps"><summary class="svelte-1ls10ps">Entrega e trocas `);
    Icone($$renderer2, { nome: "chevron", tamanho: 16 });
    $$renderer2.push(`<!----></summary> <div class="acordeao-corpo svelte-1ls10ps"><p class="svelte-1ls10ps">Enviamos para todo o Brasil. Frete grátis em pedidos acima de ${escape_html(brl(FRETE_GRATIS))}.</p> <p class="svelte-1ls10ps">Trocas e devoluções em até 30 dias após o recebimento, sem complicação.</p></div></details></div></div></article> `);
    if (data.relacionados.length > 0) {
      $$renderer2.push(`<!--[0--><section class="relacionados svelte-1ls10ps"><div class="relacionados-topo svelte-1ls10ps"><div><p class="rotulo">Combina com</p> <h2 class="svelte-1ls10ps">Você também pode gostar</h2></div> <a class="btn-texto" href="/">Ver tudo `);
      Icone($$renderer2, { nome: "seta", tamanho: 16 });
      $$renderer2.push(`<!----></a></div> <ul class="grade-relacionados svelte-1ls10ps"><!--[-->`);
      const each_array_2 = ensure_array_like(data.relacionados);
      for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
        let item = each_array_2[i];
        ProdutoCartao($$renderer2, { produto: item, indice: i });
      }
      $$renderer2.push(`<!--]--></ul></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};

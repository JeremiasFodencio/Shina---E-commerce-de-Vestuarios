import { h as head, e as escape_html, b as attr, f as attr_style, s as stringify, c as ensure_array_like, a as attr_class, d as derived } from "../../../chunks/index.js";
import { b as brl, p as parcela, F as FRETE_GRATIS, P as PARCELAS } from "../../../chunks/formato.js";
import { c as carrinho } from "../../../chunks/carrinho.svelte.js";
import { I as Icone } from "../../../chunks/Icone.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const vazio = derived(() => carrinho.itens.length === 0);
    const total = derived(() => carrinho.total);
    const restante = derived(() => Math.max(0, FRETE_GRATIS - total()));
    const temFreteGratis = derived(() => total() >= FRETE_GRATIS);
    const progresso = derived(() => Math.min(100, Math.round(total() / FRETE_GRATIS * 100)));
    const limiteDe = (item) => Math.min(item.estoque, 20);
    head("18gxmuv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Sacola — Shina</title>`);
      });
    });
    $$renderer2.push(`<section class="pagina svelte-18gxmuv"><header class="topo-pagina svelte-18gxmuv"><div><p class="rotulo">Sacola</p> <h1 class="svelte-18gxmuv">Seu carrinho</h1></div> `);
    if (!vazio()) {
      $$renderer2.push(`<!--[0--><p class="contagem svelte-18gxmuv">${escape_html(carrinho.quantidade)}
        ${escape_html(carrinho.quantidade === 1 ? "peça" : "peças")}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></header> `);
    if (vazio()) {
      $$renderer2.push(`<!--[0--><div class="vazio-caixa">`);
      Icone($$renderer2, { nome: "sacola", tamanho: 30 });
      $$renderer2.push(`<!----> <h2>Sua sacola está vazia</h2> <p>Explore a coleção e escolha as peças que vão acompanhar o seu dia a dia.</p> <div class="vazio-acoes svelte-18gxmuv"><a class="btn" href="/">Explorar a coleção</a> <a class="btn-texto" href="/favoritos">Ver lista de desejos</a></div></div>`);
    } else {
      $$renderer2.push(`<!--[-1--><div class="layout svelte-18gxmuv"><div class="itens">`);
      if (temFreteGratis()) {
        $$renderer2.push(`<!--[0--><div class="barra-frete conquistado svelte-18gxmuv">`);
        Icone($$renderer2, { nome: "caminhao", tamanho: 18 });
        $$renderer2.push(`<!----> <span>Frete grátis garantido para este pedido.</span></div>`);
      } else {
        $$renderer2.push(`<!--[-1--><div class="barra-frete svelte-18gxmuv"><div class="barra-texto svelte-18gxmuv">`);
        Icone($$renderer2, { nome: "caminhao", tamanho: 18 });
        $$renderer2.push(`<!----> <span>Faltam <strong class="svelte-18gxmuv">${escape_html(brl(restante()))}</strong> para o frete grátis.</span></div> <div class="trilho svelte-18gxmuv" role="progressbar" aria-valuemin="0" aria-valuemax="100"${attr("aria-valuenow", progresso())} aria-label="Progresso para frete grátis"><div class="preenchido svelte-18gxmuv"${attr_style(`width: ${stringify(progresso())}%`)}></div></div></div>`);
      }
      $$renderer2.push(`<!--]--> <ul class="linhas svelte-18gxmuv"><!--[-->`);
      const each_array = ensure_array_like(carrinho.itens);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<li class="linha svelte-18gxmuv"><a class="miniatura svelte-18gxmuv"${attr("href", `/produto/${stringify(item.slug)}`)} tabindex="-1" aria-hidden="true">`);
        if (item.imagem_url) {
          $$renderer2.push(`<!--[0--><img${attr("src", item.imagem_url)} alt="" class="svelte-18gxmuv"/>`);
        } else {
          $$renderer2.push(`<!--[-1--><span class="svelte-18gxmuv">${escape_html(item.produto[0])}</span>`);
        }
        $$renderer2.push(`<!--]--></a> <div class="dados svelte-18gxmuv"><div class="dados-topo svelte-18gxmuv"><a class="nome svelte-18gxmuv"${attr("href", `/produto/${stringify(item.slug)}`)}>${escape_html(item.produto)}</a> <p class="preco-unit svelte-18gxmuv">${escape_html(brl(item.preco_centavos))}</p></div> <p class="variacao svelte-18gxmuv">${escape_html(item.cor)} <span aria-hidden="true">·</span> Tam. ${escape_html(item.tamanho)}</p> <div class="dados-base svelte-18gxmuv"><div class="stepper svelte-18gxmuv"><button type="button"${attr("aria-label", `Diminuir quantidade de ${stringify(item.produto)}`)}${attr("disabled", item.quantidade <= 1, true)} class="svelte-18gxmuv">−</button> <span aria-live="polite" class="svelte-18gxmuv">${escape_html(item.quantidade)}</span> <button type="button"${attr("aria-label", `Aumentar quantidade de ${stringify(item.produto)}`)}${attr("disabled", item.quantidade >= limiteDe(item), true)} class="svelte-18gxmuv">+</button></div> <button type="button" class="acao svelte-18gxmuv">`);
        Icone($$renderer2, { nome: "lixeira", tamanho: 15 });
        $$renderer2.push(`<!----> Remover</button> `);
        if (item.id) {
          $$renderer2.push(`<!--[0--><button type="button" class="acao svelte-18gxmuv">`);
          Icone($$renderer2, { nome: "coracao", tamanho: 15 });
          $$renderer2.push(`<!----> Salvar para depois</button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <p class="subtotal svelte-18gxmuv">${escape_html(brl(item.preco_centavos * item.quantidade))}</p></li>`);
      }
      $$renderer2.push(`<!--]--></ul> <div class="itens-acoes svelte-18gxmuv"><a class="btn-texto" href="/">`);
      Icone($$renderer2, { nome: "seta-esquerda", tamanho: 15 });
      $$renderer2.push(`<!----> Continuar comprando</a> <button type="button" class="limpar svelte-18gxmuv">Esvaziar sacola</button></div></div> <aside class="resumo svelte-18gxmuv" aria-label="Resumo do pedido"><h2 class="svelte-18gxmuv">Resumo</h2> <dl class="linhas-resumo svelte-18gxmuv"><div class="svelte-18gxmuv"><dt class="svelte-18gxmuv">Subtotal</dt> <dd class="svelte-18gxmuv">${escape_html(brl(total()))}</dd></div> <div class="svelte-18gxmuv"><dt class="svelte-18gxmuv">Frete</dt> <dd${attr_class("svelte-18gxmuv", void 0, { "verde": temFreteGratis() })}>${escape_html(temFreteGratis() ? "Grátis" : "Calculado no checkout")}</dd></div> <div class="total-linha svelte-18gxmuv"><dt class="svelte-18gxmuv">Total</dt> <dd class="svelte-18gxmuv">${escape_html(brl(total()))}</dd></div></dl> `);
      if (total() > 0) {
        $$renderer2.push(`<!--[0--><p class="parcelas svelte-18gxmuv">ou ${escape_html(PARCELAS)}× de ${escape_html(brl(parcela(total())))} sem juros</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <a class="btn btn-primario btn-bloco" href="/checkout">Finalizar compra</a> <p class="seguro svelte-18gxmuv">`);
      Icone($$renderer2, { nome: "escudo", tamanho: 15 });
      $$renderer2.push(`<!----> Ambiente seguro · Pix e cartão</p> <ul class="mini-selos svelte-18gxmuv"><li class="svelte-18gxmuv">`);
      Icone($$renderer2, { nome: "troca", tamanho: 15 });
      $$renderer2.push(`<!----> Trocas em até 30 dias</li> <li class="svelte-18gxmuv">`);
      Icone($$renderer2, { nome: "caminhao", tamanho: 15 });
      $$renderer2.push(`<!----> Envio para todo o Brasil</li></ul></aside></div>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  _page as default
};

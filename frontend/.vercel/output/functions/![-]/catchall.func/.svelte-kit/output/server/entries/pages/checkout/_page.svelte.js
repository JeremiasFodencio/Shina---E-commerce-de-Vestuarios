import { h as head, b as attr, e as escape_html, c as ensure_array_like, a as attr_class, d as derived } from "../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { b as brl, p as parcela, F as FRETE_GRATIS, P as PARCELAS } from "../../../chunks/formato.js";
import { c as carrinho } from "../../../chunks/carrinho.svelte.js";
import "../../../chunks/api.js";
import { I as Icone } from "../../../chunks/Icone.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let nome = "";
    let email = "";
    let endereco = "";
    let enviando = false;
    const total = derived(() => carrinho.total);
    const temFreteGratis = derived(() => total() >= FRETE_GRATIS);
    head("jbcej5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Finalizar compra — Shina</title>`);
      });
    });
    $$renderer2.push(`<section class="pagina svelte-jbcej5"><header class="topo-pagina svelte-jbcej5"><div><p class="rotulo">Checkout</p> <h1 class="svelte-jbcej5">Finalizar compra</h1></div> <a class="btn-texto voltar svelte-jbcej5" href="/carrinho">`);
    Icone($$renderer2, { nome: "seta-esquerda", tamanho: 15 });
    $$renderer2.push(`<!----> Editar sacola</a></header> `);
    if (carrinho.itens.length === 0) {
      $$renderer2.push(`<!--[0--><div class="vazio-caixa">`);
      Icone($$renderer2, { nome: "sacola", tamanho: 30 });
      $$renderer2.push(`<!----> <h2>Sua sacola está vazia</h2> <p>Adicione peças à sacola para finalizar a compra.</p> <a class="btn" href="/">Explorar a coleção</a></div>`);
    } else {
      $$renderer2.push(`<!--[-1--><div class="layout svelte-jbcej5"><form class="form svelte-jbcej5"${attr("novalidate", false, true)}><fieldset class="bloco svelte-jbcej5"><legend class="svelte-jbcej5"><span class="numero svelte-jbcej5">01</span> Contato</legend> <div class="campos svelte-jbcej5"><label class="campo"><span>Nome completo</span> <input${attr("value", nome)} required="" autocomplete="name" placeholder="Como podemos te chamar?"/></label> <label class="campo"><span>E-mail</span> <input type="email"${attr("value", email)} required="" autocomplete="email" placeholder="voce@email.com"/></label></div> <p class="ajuda svelte-jbcej5">Usaremos o e-mail para enviar a confirmação e o rastreio.</p></fieldset> <fieldset class="bloco svelte-jbcej5"><legend class="svelte-jbcej5"><span class="numero svelte-jbcej5">02</span> Entrega</legend> <div class="campos svelte-jbcej5"><label class="campo svelte-jbcej5"><span>Endereço completo</span> <textarea required="" rows="3" autocomplete="street-address" placeholder="Rua, número, complemento, bairro, cidade — CEP" class="svelte-jbcej5">`);
      const $$body = escape_html(endereco);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></label></div> <p class="ajuda svelte-jbcej5">Enviamos para todo o Brasil. O prazo é confirmado após a postagem.</p></fieldset> <fieldset class="bloco svelte-jbcej5"><legend class="svelte-jbcej5"><span class="numero svelte-jbcej5">03</span> Pagamento</legend> <p class="pagamento svelte-jbcej5">Pix ou cartão de crédito em até ${escape_html(PARCELAS)}× sem juros. Após confirmar o pedido,
            enviaremos as instruções de pagamento por e-mail.</p> <div class="pagamento-selos svelte-jbcej5"><span class="svelte-jbcej5">Pix</span> <span class="svelte-jbcej5">Visa</span> <span class="svelte-jbcej5">Mastercard</span> <span class="svelte-jbcej5">Elo</span></div></fieldset> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button type="submit" class="btn btn-primario btn-bloco concluir svelte-jbcej5"${attr("disabled", enviando, true)}>${escape_html("Concluir pedido")}</button> <p class="seguro svelte-jbcej5">`);
      Icone($$renderer2, { nome: "escudo", tamanho: 15 });
      $$renderer2.push(`<!----> Seus dados são usados apenas para processar o
          pedido.</p></form> <aside class="resumo svelte-jbcej5" aria-label="Resumo do pedido"><div class="resumo-topo svelte-jbcej5"><h2 class="svelte-jbcej5">Seu pedido</h2> <a class="link" href="/carrinho">Editar</a></div> <ul class="itens-resumo svelte-jbcej5"><!--[-->`);
      const each_array = ensure_array_like(carrinho.itens);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<li class="svelte-jbcej5"><div class="mini svelte-jbcej5">`);
        if (item.imagem_url) {
          $$renderer2.push(`<!--[0--><img${attr("src", item.imagem_url)} alt="" class="svelte-jbcej5"/>`);
        } else {
          $$renderer2.push(`<!--[-1--><span class="svelte-jbcej5">${escape_html(item.produto[0])}</span>`);
        }
        $$renderer2.push(`<!--]--> <span class="qtd svelte-jbcej5">${escape_html(item.quantidade)}</span></div> <div class="item-info svelte-jbcej5"><p class="item-nome svelte-jbcej5">${escape_html(item.produto)}</p> <p class="item-var svelte-jbcej5">${escape_html(item.cor)} · ${escape_html(item.tamanho)}</p></div> <p class="item-preco svelte-jbcej5">${escape_html(brl(item.preco_centavos * item.quantidade))}</p></li>`);
      }
      $$renderer2.push(`<!--]--></ul> <dl class="totais svelte-jbcej5"><div class="svelte-jbcej5"><dt class="svelte-jbcej5">Subtotal</dt> <dd class="svelte-jbcej5">${escape_html(brl(total()))}</dd></div> <div class="svelte-jbcej5"><dt class="svelte-jbcej5">Frete</dt> <dd${attr_class("svelte-jbcej5", void 0, { "verde": temFreteGratis() })}>${escape_html(temFreteGratis() ? "Grátis" : "A calcular")}</dd></div> <div class="total-linha svelte-jbcej5"><dt class="svelte-jbcej5">Total</dt> <dd class="svelte-jbcej5">${escape_html(brl(total()))}</dd></div></dl> <p class="parcelas svelte-jbcej5">ou ${escape_html(PARCELAS)}× de ${escape_html(brl(parcela(total())))} sem juros</p> <ul class="selos svelte-jbcej5"><li class="svelte-jbcej5">`);
      Icone($$renderer2, { nome: "troca", tamanho: 15 });
      $$renderer2.push(`<!----> Trocas em até 30 dias</li> <li class="svelte-jbcej5">`);
      Icone($$renderer2, { nome: "caminhao", tamanho: 15 });
      $$renderer2.push(`<!----> Frete grátis acima de ${escape_html(brl(FRETE_GRATIS))}</li></ul></aside></div>`);
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  _page as default
};

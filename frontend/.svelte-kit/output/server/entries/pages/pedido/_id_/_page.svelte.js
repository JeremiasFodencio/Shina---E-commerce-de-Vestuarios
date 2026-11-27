import { h as head, e as escape_html, b as attr, c as ensure_array_like, a as attr_class, s as stringify, d as derived } from "../../../../chunks/index.js";
import { b as brl, p as parcela, E as EMAIL_CONTATO, N as NOME_LOJA, P as PARCELAS } from "../../../../chunks/formato.js";
import { I as Icone } from "../../../../chunks/Icone.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const p = derived(() => data.pedido);
    const primeiroNome = derived(() => p().nome.split(" ")[0]);
    const pecas = derived(() => p().itens.reduce((soma, i) => soma + i.quantidade, 0));
    const rotulos = {
      pendente: "Aguardando pagamento",
      pago: "Pagamento confirmado",
      enviado: "Enviado",
      cancelado: "Cancelado"
    };
    const etapas = derived(() => [
      { rotulo: "Pedido registrado", feito: true },
      {
        rotulo: "Pagamento",
        feito: p().status === "pago" || p().status === "enviado"
      },
      { rotulo: "Enviado", feito: p().status === "enviado" }
    ]);
    const dataPedido = derived(() => new Date(p().criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }));
    head("5v2q46", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Pedido registrado — ${escape_html(NOME_LOJA)}</title>`);
      });
    });
    $$renderer2.push(`<section class="pagina svelte-5v2q46"><header class="confirmacao svelte-5v2q46"><span class="selo-check svelte-5v2q46" aria-hidden="true">`);
    Icone($$renderer2, { nome: "check", tamanho: 26 });
    $$renderer2.push(`<!----></span> <p class="rotulo">Pedido registrado</p> <h1 class="svelte-5v2q46">Obrigado, ${escape_html(primeiroNome())}.</h1> <p class="confirmacao-sub svelte-5v2q46">Recebemos seu pedido em ${escape_html(dataPedido())}. Enviamos os próximos passos para <strong class="svelte-5v2q46">${escape_html(p().email)}</strong>.</p></header> `);
    if (p().status === "cancelado") {
      $$renderer2.push(`<!--[0--><div class="aviso-cancelado svelte-5v2q46" role="alert">`);
      Icone($$renderer2, { nome: "relogio", tamanho: 18 });
      $$renderer2.push(`<!----> <p>Este pedido foi cancelado. Se precisar de ajuda, fale com a gente em <a class="link"${attr("href", `mailto:${stringify(EMAIL_CONTATO)}`)}>${escape_html(EMAIL_CONTATO)}</a>.</p></div>`);
    } else {
      $$renderer2.push(`<!--[-1--><ol class="etapas svelte-5v2q46" aria-label="Andamento do pedido"><!--[-->`);
      const each_array = ensure_array_like(etapas());
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let etapa = each_array[i];
        $$renderer2.push(`<li${attr_class("svelte-5v2q46", void 0, {
          "feito": etapa.feito,
          "atual": etapa.feito && !etapas()[i + 1]?.feito
        })}><span class="ponto svelte-5v2q46" aria-hidden="true"></span> <span class="etapa-rotulo">${escape_html(etapa.rotulo)}</span></li>`);
      }
      $$renderer2.push(`<!--]--></ol>`);
    }
    $$renderer2.push(`<!--]--> <div class="layout svelte-5v2q46"><div class="principal"><div class="bloco-topo svelte-5v2q46"><h2 class="svelte-5v2q46">Itens do pedido</h2> <span class="contagem svelte-5v2q46">${escape_html(pecas())} ${escape_html(pecas() === 1 ? "peça" : "peças")}</span></div> <ul class="itens svelte-5v2q46"><!--[-->`);
    const each_array_1 = ensure_array_like(p().itens);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array_1[$$index_1];
      $$renderer2.push(`<li class="item svelte-5v2q46"><div class="mini svelte-5v2q46" aria-hidden="true"><span>${escape_html(item.produto[0])}</span></div> <div class="item-info"><p class="item-nome svelte-5v2q46">${escape_html(item.produto)}</p> <p class="item-var svelte-5v2q46">${escape_html(item.cor)} · Tam. ${escape_html(item.tamanho)} · ${escape_html(item.quantidade)} ×
                ${escape_html(brl(item.preco_unit_centavos))}</p></div> <p class="item-total svelte-5v2q46">${escape_html(brl(item.preco_unit_centavos * item.quantidade))}</p></li>`);
    }
    $$renderer2.push(`<!--]--></ul> <div class="totais svelte-5v2q46"><div class="total-linha svelte-5v2q46"><span class="svelte-5v2q46">Total</span> <strong class="svelte-5v2q46">${escape_html(brl(p().total_centavos))}</strong></div> <p class="parcelas svelte-5v2q46">ou ${escape_html(PARCELAS)}× de ${escape_html(brl(parcela(p().total_centavos)))} sem juros</p></div> <div class="pagamento svelte-5v2q46"><h3 class="svelte-5v2q46">`);
    Icone($$renderer2, { nome: "escudo", tamanho: 17 });
    $$renderer2.push(`<!----> Pagamento</h3> <p class="svelte-5v2q46">`);
    if (p().status === "pendente") {
      $$renderer2.push(`<!--[0-->Enviamos as instruções de pagamento para <strong class="svelte-5v2q46">${escape_html(p().email)}</strong>. O pedido
            é separado assim que o pagamento é confirmado.`);
    } else if (p().status === "pago") {
      $$renderer2.push(`<!--[1-->Pagamento confirmado. Estamos preparando sua peça com cuidado.`);
    } else {
      $$renderer2.push(`<!--[-1-->Seu pedido já foi enviado. O código de rastreio chega por e-mail.`);
    }
    $$renderer2.push(`<!--]--></p></div></div> <aside class="detalhes svelte-5v2q46" aria-label="Detalhes do pedido"><div class="codigo svelte-5v2q46"><span class="rotulo">Código do pedido</span> <div class="codigo-linha svelte-5v2q46"><code class="svelte-5v2q46">${escape_html(p().id)}</code> <button type="button" class="copiar svelte-5v2q46" aria-label="Copiar código do pedido">`);
    Icone($$renderer2, { nome: "copiar", tamanho: 15 });
    $$renderer2.push(`<!----> ${escape_html("Copiar")}</button></div></div> <dl class="dados svelte-5v2q46"><div><dt class="svelte-5v2q46">Situação</dt> <dd class="svelte-5v2q46"><span${attr_class(`status status-${stringify(p().status)}`, "svelte-5v2q46")}>${escape_html(rotulos[p().status] ?? p().status)}</span></dd></div> <div><dt class="svelte-5v2q46">Entrega</dt> <dd class="svelte-5v2q46">${escape_html(p().nome)}<br/>${escape_html(p().endereco)}</dd></div> <div><dt class="svelte-5v2q46">Contato</dt> <dd class="svelte-5v2q46">${escape_html(p().email)}</dd></div></dl> <div class="acoes svelte-5v2q46"><a class="btn btn-primario btn-bloco" href="/">Continuar comprando</a> <a class="btn-texto ajuda-link svelte-5v2q46" href="/ajuda">Dúvidas? Central de ajuda `);
    Icone($$renderer2, { nome: "seta", tamanho: 15 });
    $$renderer2.push(`<!----></a></div></aside></div></section>`);
  });
}
export {
  _page as default
};

import { h as head, c as ensure_array_like, b as attr, e as escape_html, s as stringify } from "../../../chunks/index.js";
import { E as EMAIL_CONTATO, P as PARCELAS, b as brl, F as FRETE_GRATIS, N as NOME_LOJA, I as INSTAGRAM } from "../../../chunks/formato.js";
import { I as Icone } from "../../../chunks/Icone.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const perguntas = [
      {
        q: "Como acompanho o meu pedido?",
        r: "Assim que o pedido é registrado, você recebe um e-mail com o código. Guarde esse código: ele abre a página de acompanhamento com a situação atualizada do pedido."
      },
      {
        q: "Posso trocar ou devolver uma peça?",
        r: `Sim. Você tem até 30 dias após o recebimento para solicitar troca ou devolução, desde que a peça esteja sem uso e com a etiqueta. Fale com a gente em ${EMAIL_CONTATO} e combinamos o envio.`
      },
      {
        q: "Quais são as formas de pagamento?",
        r: `Aceitamos Pix e cartão de crédito em até ${PARCELAS}× sem juros. Após confirmar o pedido, enviamos as instruções de pagamento por e-mail.`
      },
      {
        q: "Como escolho o tamanho certo?",
        r: "Cada peça foi pensada com caimento confortável. Se estiver em dúvida entre dois tamanhos, envie suas medidas por e-mail e ajudamos a escolher — é melhor do que arriscar."
      },
      {
        q: "Vocês entregam para todo o Brasil?",
        r: `Sim. Enviamos para todo o território nacional. O frete é grátis em pedidos acima de ${brl(FRETE_GRATIS)}; abaixo disso, o valor é calculado no momento do envio.`
      },
      {
        q: "Preciso criar uma conta para comprar?",
        r: "Não. A compra é feita como visitante: só pedimos nome, e-mail e endereço para entregar o pedido. Sua lista de desejos e sacola ficam salvas neste navegador."
      }
    ];
    head("1fm7pb2", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<meta name="description" content="Dúvidas sobre entrega, trocas, pagamento e tamanhos. Fale com a equipe Shina."/>`);
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Ajuda — ${escape_html(NOME_LOJA)}</title>`);
      });
    });
    $$renderer2.push(`<section class="pagina svelte-1fm7pb2"><header class="cabecalho svelte-1fm7pb2"><p class="rotulo">Ajuda</p> <h1 class="svelte-1fm7pb2">Estamos por aqui.</h1> <p class="cabecalho-sub svelte-1fm7pb2">Tudo o que você precisa saber sobre pedidos, entrega, trocas e cuidados com as peças.
      Se não encontrar sua resposta, fale com a gente.</p> <nav class="atalhos svelte-1fm7pb2" aria-label="Atalhos de ajuda"><a href="#faq" class="svelte-1fm7pb2">Perguntas frequentes</a> <a href="#trocas" class="svelte-1fm7pb2">Trocas</a> <a href="#entrega" class="svelte-1fm7pb2">Entrega</a> <a href="#pagamento" class="svelte-1fm7pb2">Pagamento</a> <a href="#tamanhos" class="svelte-1fm7pb2">Tamanhos</a></nav></header> <div class="layout svelte-1fm7pb2"><nav class="indice svelte-1fm7pb2" aria-label="Nesta página"><p class="rotulo">Nesta página</p> <ul class="svelte-1fm7pb2"><li><a href="#faq" class="svelte-1fm7pb2">Perguntas frequentes</a></li> <li><a href="#trocas" class="svelte-1fm7pb2">Trocas e devoluções</a></li> <li><a href="#entrega" class="svelte-1fm7pb2">Entrega e prazos</a></li> <li><a href="#pagamento" class="svelte-1fm7pb2">Pagamento</a></li> <li><a href="#tamanhos" class="svelte-1fm7pb2">Guia de tamanhos</a></li> <li><a href="#privacidade" class="svelte-1fm7pb2">Privacidade</a></li></ul></nav> <div class="conteudo svelte-1fm7pb2"><section id="faq" class="secao svelte-1fm7pb2"><h2 class="svelte-1fm7pb2">Perguntas frequentes</h2> <div class="faq svelte-1fm7pb2"><!--[-->`);
    const each_array = ensure_array_like(perguntas);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let item = each_array[i];
      $$renderer2.push(`<details${attr("open", i === 0, true)} class="svelte-1fm7pb2"><summary class="svelte-1fm7pb2">${escape_html(item.q)} `);
      Icone($$renderer2, { nome: "chevron", tamanho: 16 });
      $$renderer2.push(`<!----></summary> <p class="svelte-1fm7pb2">${escape_html(item.r)}</p></details>`);
    }
    $$renderer2.push(`<!--]--></div></section> <section id="trocas" class="secao svelte-1fm7pb2"><h2 class="svelte-1fm7pb2">Trocas e devoluções</h2> <p class="texto svelte-1fm7pb2">Você tem até <strong class="svelte-1fm7pb2">30 dias</strong> após receber a peça para solicitar uma troca
          de tamanho, cor ou modelo, ou a devolução com reembolso.</p> <ul class="lista svelte-1fm7pb2"><li class="svelte-1fm7pb2">A peça deve estar sem uso, sem lavagem e com a etiqueta original.</li> <li class="svelte-1fm7pb2">Escreva para <a class="link"${attr("href", `mailto:${stringify(EMAIL_CONTATO)}`)}>${escape_html(EMAIL_CONTATO)}</a> com o código do pedido.</li> <li class="svelte-1fm7pb2">Enviamos as instruções de postagem e acompanhamos a troca até o fim.</li> <li class="svelte-1fm7pb2">A primeira troca tem frete por nossa conta.</li></ul></section> <section id="entrega" class="secao svelte-1fm7pb2"><h2 class="svelte-1fm7pb2">Entrega e prazos</h2> <p class="texto svelte-1fm7pb2">Enviamos para todo o Brasil pelos Correios e transportadoras parceiras. O prazo
          varia conforme a região e é confirmado após a postagem.</p> <ul class="lista svelte-1fm7pb2"><li class="svelte-1fm7pb2">Pedidos acima de <strong class="svelte-1fm7pb2">${escape_html(brl(FRETE_GRATIS))}</strong> têm frete grátis.</li> <li class="svelte-1fm7pb2">O código de rastreio chega por e-mail assim que a peça é postada.</li> <li class="svelte-1fm7pb2">Em períodos de lançamento, a separação pode levar um dia útil extra.</li></ul></section> <section id="pagamento" class="secao svelte-1fm7pb2"><h2 class="svelte-1fm7pb2">Pagamento</h2> <p class="texto svelte-1fm7pb2">Aceitamos Pix e cartão de crédito em até ${escape_html(PARCELAS)}× sem juros. Os dados de
          pagamento e entrega são usados apenas para processar o seu pedido.</p> <div class="selos-pagamento svelte-1fm7pb2"><span class="svelte-1fm7pb2">Pix</span> <span class="svelte-1fm7pb2">Visa</span> <span class="svelte-1fm7pb2">Mastercard</span> <span class="svelte-1fm7pb2">Elo</span></div></section> <section id="tamanhos" class="secao svelte-1fm7pb2"><h2 class="svelte-1fm7pb2">Guia de tamanhos</h2> <p class="texto svelte-1fm7pb2">Nossas peças têm modelagem confortável. Como referência geral, usamos:</p> <ul class="lista svelte-1fm7pb2"><li class="svelte-1fm7pb2"><strong class="svelte-1fm7pb2">P</strong> — veste 36/38</li> <li class="svelte-1fm7pb2"><strong class="svelte-1fm7pb2">M</strong> — veste 40/42</li> <li class="svelte-1fm7pb2"><strong class="svelte-1fm7pb2">G</strong> — veste 44/46</li> <li class="svelte-1fm7pb2"><strong class="svelte-1fm7pb2">GG</strong> — veste 48/50</li></ul> <p class="texto svelte-1fm7pb2">Na dúvida entre dois tamanhos, escreva para a gente com suas medidas (busto,
          cintura e quadril). Ajudamos a escolher.</p></section> <section id="privacidade" class="secao svelte-1fm7pb2"><h2 class="svelte-1fm7pb2">Privacidade</h2> <p class="texto svelte-1fm7pb2">Usamos seus dados apenas para registrar, pagar e entregar o pedido, além de enviar
          comunicações sobre ele. Sua sacola e lista de desejos ficam salvas no seu navegador,
          não em nossos servidores.</p> <p class="texto svelte-1fm7pb2">Para solicitar a exclusão dos seus dados, escreva para <a class="link"${attr("href", `mailto:${stringify(EMAIL_CONTATO)}`)}>${escape_html(EMAIL_CONTATO)}</a>.</p></section> <div class="contato svelte-1fm7pb2"><div><p class="rotulo svelte-1fm7pb2">Ainda com dúvidas?</p> <h2 class="svelte-1fm7pb2">Fale com a gente.</h2> <p class="svelte-1fm7pb2">Respondemos de segunda a sexta, em até um dia útil.</p></div> <div class="contato-links svelte-1fm7pb2"><a class="btn svelte-1fm7pb2"${attr("href", `mailto:${stringify(EMAIL_CONTATO)}`)}>Enviar e-mail</a> <a class="contato-instagram svelte-1fm7pb2"${attr("href", `mailto:${stringify(EMAIL_CONTATO)}?subject=Instagram`)}>`);
    Icone($$renderer2, { nome: "instagram", tamanho: 16 });
    $$renderer2.push(`<!----> ${escape_html(INSTAGRAM)}</a></div></div></div></div></section>`);
  });
}
export {
  _page as default
};

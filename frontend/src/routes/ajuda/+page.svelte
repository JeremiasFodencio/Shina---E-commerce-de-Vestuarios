<script>
  import { brl } from '$lib/formato.js';
  import { NOME_LOJA, EMAIL_CONTATO, INSTAGRAM, FRETE_GRATIS, PARCELAS } from '$lib/config.js';
  import Icone from '$lib/Icone.svelte';

  const perguntas = [
    {
      q: 'Como acompanho o meu pedido?',
      r: 'Assim que o pedido é registrado, você recebe um e-mail com o código. Guarde esse código: ele abre a página de acompanhamento com a situação atualizada do pedido.'
    },
    {
      q: 'Posso trocar ou devolver uma peça?',
      r: `Sim. Você tem até 30 dias após o recebimento para solicitar troca ou devolução, desde que a peça esteja sem uso e com a etiqueta. Fale com a gente em ${EMAIL_CONTATO} e combinamos o envio.`
    },
    {
      q: 'Quais são as formas de pagamento?',
      r: `Aceitamos Pix e cartão de crédito em até ${PARCELAS}× sem juros. Após confirmar o pedido, enviamos as instruções de pagamento por e-mail.`
    },
    {
      q: 'Como escolho o tamanho certo?',
      r: 'Cada peça foi pensada com caimento confortável. Se estiver em dúvida entre dois tamanhos, envie suas medidas por e-mail e ajudamos a escolher — é melhor do que arriscar.'
    },
    {
      q: 'Vocês entregam para todo o Brasil?',
      r: `Sim. Enviamos para todo o território nacional. O frete é grátis em pedidos acima de ${brl(FRETE_GRATIS)}; abaixo disso, o valor é calculado no momento do envio.`
    },
    {
      q: 'Preciso criar uma conta para comprar?',
      r: 'Não. A compra é feita como visitante: só pedimos nome, e-mail e endereço para entregar o pedido. Sua lista de desejos e sacola ficam salvas neste navegador.'
    }
  ];
</script>

<svelte:head>
  <title>Ajuda — {NOME_LOJA}</title>
  <meta
    name="description"
    content="Dúvidas sobre entrega, trocas, pagamento e tamanhos. Fale com a equipe Shina."
  />
</svelte:head>

<section class="pagina">
  <header class="cabecalho">
    <p class="rotulo">Ajuda</p>
    <h1>Estamos por aqui.</h1>
    <p class="cabecalho-sub">
      Tudo o que você precisa saber sobre pedidos, entrega, trocas e cuidados com as peças.
      Se não encontrar sua resposta, fale com a gente.
    </p>

    <nav class="atalhos" aria-label="Atalhos de ajuda">
      <a href="#faq">Perguntas frequentes</a>
      <a href="#trocas">Trocas</a>
      <a href="#entrega">Entrega</a>
      <a href="#pagamento">Pagamento</a>
      <a href="#tamanhos">Tamanhos</a>
    </nav>
  </header>

  <div class="layout">
    <nav class="indice" aria-label="Nesta página">
      <p class="rotulo">Nesta página</p>
      <ul>
        <li><a href="#faq">Perguntas frequentes</a></li>
        <li><a href="#trocas">Trocas e devoluções</a></li>
        <li><a href="#entrega">Entrega e prazos</a></li>
        <li><a href="#pagamento">Pagamento</a></li>
        <li><a href="#tamanhos">Guia de tamanhos</a></li>
        <li><a href="#privacidade">Privacidade</a></li>
      </ul>
    </nav>

    <div class="conteudo">
      <section id="faq" class="secao">
        <h2>Perguntas frequentes</h2>

        <div class="faq">
          {#each perguntas as item, i (item.q)}
            <details open={i === 0}>
              <summary>{item.q} <Icone nome="chevron" tamanho={16} /></summary>
              <p>{item.r}</p>
            </details>
          {/each}
        </div>
      </section>

      <section id="trocas" class="secao">
        <h2>Trocas e devoluções</h2>
        <p class="texto">
          Você tem até <strong>30 dias</strong> após receber a peça para solicitar uma troca
          de tamanho, cor ou modelo, ou a devolução com reembolso.
        </p>
        <ul class="lista">
          <li>A peça deve estar sem uso, sem lavagem e com a etiqueta original.</li>
          <li>Escreva para <a class="link" href="mailto:{EMAIL_CONTATO}">{EMAIL_CONTATO}</a> com o código do pedido.</li>
          <li>Enviamos as instruções de postagem e acompanhamos a troca até o fim.</li>
          <li>A primeira troca tem frete por nossa conta.</li>
        </ul>
      </section>

      <section id="entrega" class="secao">
        <h2>Entrega e prazos</h2>
        <p class="texto">
          Enviamos para todo o Brasil pelos Correios e transportadoras parceiras. O prazo
          varia conforme a região e é confirmado após a postagem.
        </p>
        <ul class="lista">
          <li>Pedidos acima de <strong>{brl(FRETE_GRATIS)}</strong> têm frete grátis.</li>
          <li>O código de rastreio chega por e-mail assim que a peça é postada.</li>
          <li>Em períodos de lançamento, a separação pode levar um dia útil extra.</li>
        </ul>
      </section>

      <section id="pagamento" class="secao">
        <h2>Pagamento</h2>
        <p class="texto">
          Aceitamos Pix e cartão de crédito em até {PARCELAS}× sem juros. Os dados de
          pagamento e entrega são usados apenas para processar o seu pedido.
        </p>
        <div class="selos-pagamento">
          <span>Pix</span>
          <span>Visa</span>
          <span>Mastercard</span>
          <span>Elo</span>
        </div>
      </section>

      <section id="tamanhos" class="secao">
        <h2>Guia de tamanhos</h2>
        <p class="texto">
          Nossas peças têm modelagem confortável. Como referência geral, usamos:
        </p>
        <ul class="lista">
          <li><strong>P</strong> — veste 36/38</li>
          <li><strong>M</strong> — veste 40/42</li>
          <li><strong>G</strong> — veste 44/46</li>
          <li><strong>GG</strong> — veste 48/50</li>
        </ul>
        <p class="texto">
          Na dúvida entre dois tamanhos, escreva para a gente com suas medidas (busto,
          cintura e quadril). Ajudamos a escolher.
        </p>
      </section>

      <section id="privacidade" class="secao">
        <h2>Privacidade</h2>
        <p class="texto">
          Usamos seus dados apenas para registrar, pagar e entregar o pedido, além de enviar
          comunicações sobre ele. Sua sacola e lista de desejos ficam salvas no seu navegador,
          não em nossos servidores.
        </p>
        <p class="texto">
          Para solicitar a exclusão dos seus dados, escreva para
          <a class="link" href="mailto:{EMAIL_CONTATO}">{EMAIL_CONTATO}</a>.
        </p>
      </section>

      <div class="contato">
        <div>
          <p class="rotulo">Ainda com dúvidas?</p>
          <h2>Fale com a gente.</h2>
          <p>Respondemos de segunda a sexta, em até um dia útil.</p>
        </div>
        <div class="contato-links">
          <a class="btn" href="mailto:{EMAIL_CONTATO}">Enviar e-mail</a>
          <a class="contato-instagram" href="mailto:{EMAIL_CONTATO}?subject=Instagram">
            <Icone nome="instagram" tamanho={16} /> {INSTAGRAM}
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .pagina {
    padding-block: 3rem 0;
  }

  .cabecalho {
    padding-bottom: 2.25rem;
    border-bottom: 1px solid var(--linha);
  }

  .cabecalho h1 {
    margin: 0.6rem 0 1rem;
    font-size: clamp(2.5rem, 4.5vw, 3.6rem);
    line-height: 0.98;
    letter-spacing: -0.02em;
  }

  .cabecalho-sub {
    max-width: 52ch;
    color: var(--suave);
    font-size: 0.95rem;
    line-height: 1.85;
  }

  .atalhos {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-top: 1.75rem;
  }

  .atalhos a {
    padding: 0.5rem 0.95rem;
    border: 1px solid var(--linha-forte);
    border-radius: 999px;
    color: var(--tinta-suave);
    font-size: 0.76rem;
    transition:
      background var(--transicao),
      border-color var(--transicao),
      color var(--transicao);
  }

  .atalhos a:hover {
    background: var(--tinta);
    border-color: var(--tinta);
    color: var(--papel);
  }

  .layout {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    align-items: start;
    gap: clamp(2rem, 5vw, 5rem);
    padding-top: 2.5rem;
  }

  .indice {
    position: sticky;
    top: 104px;
    padding-top: 0.35rem;
  }

  .indice ul {
    display: grid;
    gap: 0.65rem;
    margin: 1rem 0 0;
    padding: 0;
    list-style: none;
  }

  .indice a {
    color: var(--suave);
    font-size: 0.8rem;
    transition: color var(--transicao);
  }

  .indice a:hover {
    color: var(--tinta);
  }

  .conteudo {
    max-width: 720px;
  }

  .secao {
    padding-bottom: 2.75rem;
    margin-bottom: 2.75rem;
    border-bottom: 1px solid var(--linha);
    scroll-margin-top: 100px;
  }

  .secao h2 {
    margin-bottom: 1.1rem;
    font-size: clamp(1.6rem, 2.6vw, 2.1rem);
    line-height: 1.1;
  }

  .texto {
    color: var(--suave);
    font-size: 0.92rem;
    line-height: 1.85;
  }

  .texto + .texto {
    margin-top: 0.9rem;
  }

  .texto strong {
    font-weight: 500;
    color: var(--tinta-suave);
  }

  .lista {
    display: grid;
    gap: 0.6rem;
    margin: 1.1rem 0 0;
    padding: 0;
    list-style: none;
    color: var(--suave);
    font-size: 0.9rem;
    line-height: 1.7;
  }

  .lista li {
    position: relative;
    padding-left: 1.1rem;
  }

  .lista li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.7em;
    width: 5px;
    height: 1px;
    background: var(--acento);
  }

  .lista strong {
    font-weight: 500;
    color: var(--tinta-suave);
  }

  .selos-pagamento {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 1.1rem;
  }

  .selos-pagamento span {
    padding: 0.35rem 0.65rem;
    border: 1px solid var(--linha-forte);
    color: var(--tinta-suave);
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* FAQ */
  .faq {
    border-top: 1px solid var(--linha);
  }

  .faq details {
    border-bottom: 1px solid var(--linha);
  }

  .faq summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.1rem 0;
    list-style: none;
    cursor: pointer;
    font-size: 0.94rem;
    color: var(--tinta);
  }

  .faq summary::-webkit-details-marker {
    display: none;
  }

  .faq summary :global(svg) {
    flex: none;
    color: var(--suave);
    transition: transform 260ms ease;
  }

  .faq details[open] summary :global(svg) {
    transform: rotate(180deg);
  }

  .faq details p {
    padding-bottom: 1.2rem;
    color: var(--suave);
    font-size: 0.89rem;
    line-height: 1.8;
    max-width: 60ch;
  }

  /* Contato */
  .contato {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;
    padding: 2.5rem;
    background: var(--tinta);
    color: #f4efe6;
  }

  .contato h2 {
    margin: 0.5rem 0 0.6rem;
    font-size: clamp(1.7rem, 2.6vw, 2.2rem);
  }

  .contato p:not(.rotulo) {
    color: rgb(244 239 230 / 0.7);
    font-size: 0.86rem;
  }

  .contato .rotulo {
    color: rgb(244 239 230 / 0.55);
  }

  .contato-links {
    display: grid;
    justify-items: start;
    gap: 1rem;
  }

  .contato .btn {
    background: #f4efe6;
    border-color: #f4efe6;
    color: var(--tinta);
  }

  .contato .btn:hover {
    background: transparent;
    color: #f4efe6;
  }

  .contato-instagram {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: rgb(244 239 230 / 0.75);
    font-size: 0.8rem;
  }

  .contato-instagram:hover {
    color: #f4efe6;
  }

  @media (max-width: 900px) {
    .pagina {
      padding-top: 2.25rem;
    }

    .layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .indice {
      display: none;
    }

    .contato {
      padding: 1.75rem;
    }
  }
</style>

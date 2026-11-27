<script>
  import { brl, parcela } from '$lib/formato.js';
  import { NOME_LOJA, EMAIL_CONTATO, PARCELAS } from '$lib/config.js';
  import Icone from '$lib/Icone.svelte';

  let { data } = $props();

  const p = $derived(data.pedido);
  const primeiroNome = $derived(p.nome.split(' ')[0]);
  const pecas = $derived(p.itens.reduce((soma, i) => soma + i.quantidade, 0));

  let copiado = $state(false);

  const rotulos = {
    pendente: 'Aguardando pagamento',
    pago: 'Pagamento confirmado',
    enviado: 'Enviado',
    cancelado: 'Cancelado'
  };

  const etapas = $derived([
    { rotulo: 'Pedido registrado', feito: true },
    { rotulo: 'Pagamento', feito: p.status === 'pago' || p.status === 'enviado' },
    { rotulo: 'Enviado', feito: p.status === 'enviado' }
  ]);

  const dataPedido = $derived(
    new Date(p.criado_em).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  );

  async function copiar() {
    try {
      await navigator.clipboard.writeText(p.id);
      copiado = true;
      setTimeout(() => (copiado = false), 2200);
    } catch {
      copiado = false;
    }
  }
</script>

<svelte:head><title>Pedido registrado — {NOME_LOJA}</title></svelte:head>

<section class="pagina">
  <header class="confirmacao">
    <span class="selo-check" aria-hidden="true"><Icone nome="check" tamanho={26} /></span>
    <p class="rotulo">Pedido registrado</p>
    <h1>Obrigado, {primeiroNome}.</h1>
    <p class="confirmacao-sub">
      Recebemos seu pedido em {dataPedido}. Enviamos os próximos passos para
      <strong>{p.email}</strong>.
    </p>
  </header>

  {#if p.status === 'cancelado'}
    <div class="aviso-cancelado" role="alert">
      <Icone nome="relogio" tamanho={18} />
      <p>
        Este pedido foi cancelado. Se precisar de ajuda, fale com a gente em
        <a class="link" href="mailto:{EMAIL_CONTATO}">{EMAIL_CONTATO}</a>.
      </p>
    </div>
  {:else}
    <ol class="etapas" aria-label="Andamento do pedido">
      {#each etapas as etapa, i (etapa.rotulo)}
        <li class:feito={etapa.feito} class:atual={etapa.feito && !etapas[i + 1]?.feito}>
          <span class="ponto" aria-hidden="true"></span>
          <span class="etapa-rotulo">{etapa.rotulo}</span>
        </li>
      {/each}
    </ol>
  {/if}

  <div class="layout">
    <div class="principal">
      <div class="bloco-topo">
        <h2>Itens do pedido</h2>
        <span class="contagem">{pecas} {pecas === 1 ? 'peça' : 'peças'}</span>
      </div>

      <ul class="itens">
        {#each p.itens as item (item.sku)}
          <li class="item">
            <div class="mini" aria-hidden="true">
              <span>{item.produto[0]}</span>
            </div>
            <div class="item-info">
              <p class="item-nome">{item.produto}</p>
              <p class="item-var">
                {item.cor} · Tam. {item.tamanho} · {item.quantidade} ×
                {brl(item.preco_unit_centavos)}
              </p>
            </div>
            <p class="item-total">{brl(item.preco_unit_centavos * item.quantidade)}</p>
          </li>
        {/each}
      </ul>

      <div class="totais">
        <div class="total-linha">
          <span>Total</span>
          <strong>{brl(p.total_centavos)}</strong>
        </div>
        <p class="parcelas">ou {PARCELAS}× de {brl(parcela(p.total_centavos))} sem juros</p>
      </div>

      <div class="pagamento">
        <h3><Icone nome="escudo" tamanho={17} /> Pagamento</h3>
        <p>
          {#if p.status === 'pendente'}
            Enviamos as instruções de pagamento para <strong>{p.email}</strong>. O pedido
            é separado assim que o pagamento é confirmado.
          {:else if p.status === 'pago'}
            Pagamento confirmado. Estamos preparando sua peça com cuidado.
          {:else}
            Seu pedido já foi enviado. O código de rastreio chega por e-mail.
          {/if}
        </p>
      </div>
    </div>

    <aside class="detalhes" aria-label="Detalhes do pedido">
      <div class="codigo">
        <span class="rotulo">Código do pedido</span>
        <div class="codigo-linha">
          <code>{p.id}</code>
          <button type="button" class="copiar" onclick={copiar} aria-label="Copiar código do pedido">
            <Icone nome="copiar" tamanho={15} />
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      <dl class="dados">
        <div>
          <dt>Situação</dt>
          <dd><span class="status status-{p.status}">{rotulos[p.status] ?? p.status}</span></dd>
        </div>
        <div>
          <dt>Entrega</dt>
          <dd>{p.nome}<br />{p.endereco}</dd>
        </div>
        <div>
          <dt>Contato</dt>
          <dd>{p.email}</dd>
        </div>
      </dl>

      <div class="acoes">
        <a class="btn btn-primario btn-bloco" href="/">Continuar comprando</a>
        <a class="btn-texto ajuda-link" href="/ajuda">
          Dúvidas? Central de ajuda <Icone nome="seta" tamanho={15} />
        </a>
      </div>
    </aside>
  </div>
</section>

<style>
  .pagina {
    padding-block: 4rem 0;
  }

  /* Confirmação */
  .confirmacao {
    display: grid;
    justify-items: center;
    max-width: 620px;
    margin-inline: auto;
    text-align: center;
  }

  .selo-check {
    display: grid;
    place-items: center;
    width: 60px;
    height: 60px;
    margin-bottom: 1.6rem;
    border: 1px solid var(--linha-forte);
    border-radius: 50%;
    color: #4f6b47;
    background: var(--papel-2);
    animation: aparecer 500ms ease both;
  }

  .confirmacao h1 {
    margin: 0.7rem 0 0.9rem;
    font-size: clamp(2.3rem, 4.2vw, 3.3rem);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .confirmacao-sub {
    max-width: 46ch;
    color: var(--suave);
    font-size: 0.92rem;
    line-height: 1.8;
  }

  .confirmacao-sub strong {
    font-weight: 500;
    color: var(--tinta-suave);
  }

  /* Etapas */
  .etapas {
    display: flex;
    justify-content: center;
    gap: clamp(1.5rem, 5vw, 4rem);
    margin: 2.75rem 0 3.25rem;
    padding: 0;
    list-style: none;
  }

  .etapas li {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: #b0a89d;
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .etapas li + li::before {
    content: '';
    position: absolute;
    right: calc(100% + 0.9rem);
    top: 50%;
    width: clamp(1.2rem, 4vw, 3rem);
    height: 1px;
    background: var(--linha-forte);
  }

  .ponto {
    width: 9px;
    height: 9px;
    border: 1px solid #c3bbaf;
    border-radius: 50%;
    background: var(--papel);
  }

  .etapas li.feito {
    color: var(--tinta-suave);
  }

  .etapas li.feito .ponto {
    background: var(--tinta);
    border-color: var(--tinta);
  }

  .etapas li.atual .ponto {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--tinta) 14%, transparent);
  }

  .aviso-cancelado {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    max-width: 640px;
    margin: 2.5rem auto;
    padding: 1rem 1.25rem;
    background: #f6ece7;
    border-left: 2px solid var(--acento);
    color: var(--tinta-suave);
    font-size: 0.85rem;
  }

  /* Layout */
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    align-items: start;
    gap: clamp(2rem, 5vw, 4.5rem);
    max-width: 1060px;
    margin-inline: auto;
  }

  .bloco-topo {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--linha);
  }

  .bloco-topo h2 {
    font: 500 0.66rem/1 var(--texto);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .contagem {
    color: var(--suave);
    font-size: 0.72rem;
  }

  .itens {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .item {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) auto;
    align-items: center;
    gap: 1.15rem;
    padding-block: 1.25rem;
    border-bottom: 1px solid var(--linha);
  }

  .mini {
    display: grid;
    place-items: center;
    aspect-ratio: 3 / 4;
    background: linear-gradient(155deg, #efe9df, #ded2c1);
    font-family: var(--titulo);
    font-size: 1.6rem;
    color: #a08e78;
  }

  .item-nome {
    font-family: var(--titulo);
    font-size: 1.1rem;
    line-height: 1.2;
  }

  .item-var {
    margin-top: 0.25rem;
    color: var(--suave);
    font-size: 0.74rem;
  }

  .item-total {
    font-size: 0.86rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .totais {
    padding-top: 1.25rem;
  }

  .total-linha {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  .total-linha span {
    font-size: 0.74rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--tinta-suave);
  }

  .total-linha strong {
    font-family: var(--titulo);
    font-size: 1.65rem;
    font-weight: 500;
  }

  .parcelas {
    margin-top: 0.25rem;
    text-align: right;
    color: var(--suave);
    font-size: 0.74rem;
  }

  .pagamento {
    margin-top: 2.25rem;
    padding: 1.35rem 1.5rem;
    background: var(--papel-2);
    border: 1px solid var(--linha);
  }

  .pagamento h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font: 500 0.64rem/1 var(--texto);
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .pagamento p {
    margin-top: 0.7rem;
    color: var(--suave);
    font-size: 0.84rem;
    line-height: 1.75;
  }

  .pagamento p strong {
    font-weight: 500;
    color: var(--tinta-suave);
  }

  /* Detalhes */
  .detalhes {
    position: sticky;
    top: 104px;
    padding: 1.75rem;
    border: 1px solid var(--linha);
  }

  .codigo {
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--linha);
  }

  .codigo-linha {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .codigo code {
    font-family: var(--texto);
    font-size: 0.86rem;
    letter-spacing: 0.02em;
    word-break: break-all;
  }

  .copiar {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    flex: none;
    border: 0;
    background: none;
    padding: 0;
    color: var(--suave);
    font-size: 0.7rem;
    border-bottom: 1px solid var(--linha-forte);
  }

  .copiar:hover {
    color: var(--tinta);
  }

  .dados {
    display: grid;
    gap: 1.15rem;
    margin: 1.35rem 0;
  }

  .dados dt {
    color: var(--suave);
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .dados dd {
    margin: 0.3rem 0 0;
    font-size: 0.85rem;
    line-height: 1.55;
  }

  .status {
    display: inline-block;
    padding: 0.3rem 0.6rem;
    font-size: 0.66rem;
    letter-spacing: 0.05em;
    background: var(--papel-2);
    border: 1px solid var(--linha-forte);
  }

  .status-pago {
    background: #edf2e9;
    border-color: #c3d0bb;
    color: #45603d;
  }

  .status-enviado {
    background: #e9eef1;
    border-color: #c2ccd3;
    color: #3c515c;
  }

  .status-cancelado {
    background: #f6ece7;
    border-color: #ddc6b8;
    color: #84503a;
  }

  .acoes {
    padding-top: 1.25rem;
    border-top: 1px solid var(--linha);
  }

  .ajuda-link {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  @media (max-width: 900px) {
    .pagina {
      padding-top: 2.75rem;
    }

    .layout {
      grid-template-columns: 1fr;
    }

    .detalhes {
      position: static;
    }

    .etapas {
      flex-wrap: wrap;
      gap: 1rem 1.5rem;
      justify-content: flex-start;
    }

    .etapas li + li::before {
      display: none;
    }
  }

  @media (max-width: 520px) {
    .item {
      grid-template-columns: 52px minmax(0, 1fr) auto;
      gap: 0.85rem;
    }
  }
</style>

<script>
  import { goto } from '$app/navigation';
  import { brl, parcela } from '$lib/formato.js';
  import { carrinho } from '$lib/carrinho.svelte.js';
  import { criarPedido } from '$lib/api';
  import { FRETE_GRATIS, PARCELAS } from '$lib/config.js';
  import Icone from '$lib/Icone.svelte';

  let nome = $state('');
  let email = $state('');
  let endereco = $state('');
  let enviando = $state(false);
  let erro = $state('');

  const total = $derived(carrinho.total);
  const temFreteGratis = $derived(total >= FRETE_GRATIS);

  async function enviar(ev) {
    ev.preventDefault();
    erro = '';
    enviando = true;
    try {
      const pedido = await criarPedido(fetch, {
        nome,
        email,
        endereco,
        itens: carrinho.itens.map((i) => ({ sku: i.sku, quantidade: i.quantidade }))
      });
      carrinho.limpar();
      await goto(`/pedido/${pedido.id}`);
    } catch (e) {
      erro = e.message;
    } finally {
      enviando = false;
    }
  }
</script>

<svelte:head><title>Finalizar compra — Shina</title></svelte:head>

<section class="pagina">
  <header class="topo-pagina">
    <div>
      <p class="rotulo">Checkout</p>
      <h1>Finalizar compra</h1>
    </div>
    <a class="btn-texto voltar" href="/carrinho">
      <Icone nome="seta-esquerda" tamanho={15} /> Editar sacola
    </a>
  </header>

  {#if carrinho.itens.length === 0}
    <div class="vazio-caixa">
      <Icone nome="sacola" tamanho={30} />
      <h2>Sua sacola está vazia</h2>
      <p>Adicione peças à sacola para finalizar a compra.</p>
      <a class="btn" href="/">Explorar a coleção</a>
    </div>
  {:else}
    <div class="layout">
      <form class="form" onsubmit={enviar} novalidate={false}>
        <fieldset class="bloco">
          <legend><span class="numero">01</span> Contato</legend>
          <div class="campos">
            <label class="campo">
              <span>Nome completo</span>
              <input
                bind:value={nome}
                required
                autocomplete="name"
                placeholder="Como podemos te chamar?"
              />
            </label>

            <label class="campo">
              <span>E-mail</span>
              <input
                type="email"
                bind:value={email}
                required
                autocomplete="email"
                placeholder="voce@email.com"
              />
            </label>
          </div>
          <p class="ajuda">Usaremos o e-mail para enviar a confirmação e o rastreio.</p>
        </fieldset>

        <fieldset class="bloco">
          <legend><span class="numero">02</span> Entrega</legend>
          <div class="campos">
            <label class="campo">
              <span>Endereço completo</span>
              <textarea
                bind:value={endereco}
                required
                rows="3"
                autocomplete="street-address"
                placeholder="Rua, número, complemento, bairro, cidade — CEP"
              ></textarea>
            </label>
          </div>
          <p class="ajuda">
            Enviamos para todo o Brasil. O prazo é confirmado após a postagem.
          </p>
        </fieldset>

        <fieldset class="bloco">
          <legend><span class="numero">03</span> Pagamento</legend>
          <p class="pagamento">
            Pix ou cartão de crédito em até {PARCELAS}× sem juros. Após confirmar o pedido,
            enviaremos as instruções de pagamento por e-mail.
          </p>
          <div class="pagamento-selos">
            <span>Pix</span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Elo</span>
          </div>
        </fieldset>

        {#if erro}
          <p class="erro-msg" role="alert">{erro}</p>
        {/if}

        <button type="submit" class="btn btn-primario btn-bloco concluir" disabled={enviando}>
          {enviando ? 'Registrando pedido…' : 'Concluir pedido'}
        </button>

        <p class="seguro">
          <Icone nome="escudo" tamanho={15} /> Seus dados são usados apenas para processar o
          pedido.
        </p>
      </form>

      <aside class="resumo" aria-label="Resumo do pedido">
        <div class="resumo-topo">
          <h2>Seu pedido</h2>
          <a class="link" href="/carrinho">Editar</a>
        </div>

        <ul class="itens-resumo">
          {#each carrinho.itens as item (item.sku)}
            <li>
              <div class="mini">
                {#if item.imagem_url}
                  <img src={item.imagem_url} alt="" />
                {:else}
                  <span>{item.produto[0]}</span>
                {/if}
                <span class="qtd">{item.quantidade}</span>
              </div>
              <div class="item-info">
                <p class="item-nome">{item.produto}</p>
                <p class="item-var">{item.cor} · {item.tamanho}</p>
              </div>
              <p class="item-preco">{brl(item.preco_centavos * item.quantidade)}</p>
            </li>
          {/each}
        </ul>

        <dl class="totais">
          <div>
            <dt>Subtotal</dt>
            <dd>{brl(total)}</dd>
          </div>
          <div>
            <dt>Frete</dt>
            <dd class:verde={temFreteGratis}>
              {temFreteGratis ? 'Grátis' : 'A calcular'}
            </dd>
          </div>
          <div class="total-linha">
            <dt>Total</dt>
            <dd>{brl(total)}</dd>
          </div>
        </dl>

        <p class="parcelas">ou {PARCELAS}× de {brl(parcela(total))} sem juros</p>

        <ul class="selos">
          <li><Icone nome="troca" tamanho={15} /> Trocas em até 30 dias</li>
          <li><Icone nome="caminhao" tamanho={15} /> Frete grátis acima de {brl(FRETE_GRATIS)}</li>
        </ul>
      </aside>
    </div>
  {/if}
</section>

<style>
  .pagina {
    padding-block: 3rem 0;
  }

  .topo-pagina {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
    padding-bottom: 1.5rem;
    margin-bottom: 2.25rem;
    border-bottom: 1px solid var(--linha);
  }

  .topo-pagina h1 {
    margin-top: 0.45rem;
    font-size: clamp(2.3rem, 3.8vw, 3.1rem);
  }

  .voltar {
    margin-bottom: 0.35rem;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    align-items: start;
    gap: clamp(2rem, 5vw, 4.5rem);
  }

  /* Formulário */
  .form {
    min-width: 0;
  }

  .bloco {
    margin: 0;
    padding: 0 0 2.25rem;
    border: 0;
    border-bottom: 1px solid var(--linha);
  }

  .bloco + .bloco {
    padding-top: 2.25rem;
  }

  .bloco legend {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0;
    margin-bottom: 1.1rem;
    font-family: var(--titulo);
    font-size: 1.45rem;
    font-weight: 500;
  }

  .numero {
    font-family: var(--texto);
    font-size: 0.6rem;
    letter-spacing: 0.16em;
    color: var(--suave);
  }

  .campos {
    display: grid;
    gap: 1.1rem;
  }

  .ajuda {
    margin-top: 0.85rem;
    color: var(--suave);
    font-size: 0.74rem;
    line-height: 1.6;
  }

  .campo textarea {
    resize: vertical;
    min-height: 96px;
    font-family: var(--texto);
    line-height: 1.6;
  }

  .pagamento {
    max-width: 52ch;
    color: var(--suave);
    font-size: 0.88rem;
    line-height: 1.8;
  }

  .pagamento-selos {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 1rem;
  }

  .pagamento-selos span {
    padding: 0.35rem 0.65rem;
    border: 1px solid var(--linha-forte);
    color: var(--tinta-suave);
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .concluir {
    margin-top: 2rem;
    height: 56px;
  }

  .seguro {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    margin-top: 1rem;
    color: var(--suave);
    font-size: 0.7rem;
    text-align: center;
  }

  /* Resumo */
  .resumo {
    position: sticky;
    top: 104px;
    padding: 1.75rem;
    border: 1px solid var(--linha);
    background: var(--papel-2);
  }

  .resumo-topo {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .resumo-topo h2 {
    font: 500 0.64rem/1 var(--texto);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .itens-resumo {
    display: grid;
    gap: 1rem;
    margin: 0;
    padding: 0 0 1.25rem;
    border-bottom: 1px solid var(--linha);
    list-style: none;
  }

  .itens-resumo li {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.85rem;
  }

  .mini {
    position: relative;
    aspect-ratio: 3 / 4;
    background: linear-gradient(155deg, #efe9df, #ded2c1);
  }

  .mini img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .mini > span:not(.qtd) {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    font-family: var(--titulo);
    font-size: 1.4rem;
    color: #a08e78;
  }

  .mini .qtd {
    position: absolute;
    top: -6px;
    right: -6px;
    display: grid;
    place-items: center;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: 50%;
    background: var(--tinta);
    color: var(--papel);
    font-size: 0.6rem;
  }

  .item-info {
    min-width: 0;
  }

  .item-nome {
    font-size: 0.82rem;
    line-height: 1.35;
  }

  .item-var {
    margin-top: 0.15rem;
    color: var(--suave);
    font-size: 0.7rem;
  }

  .item-preco {
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
  }

  .totais {
    margin: 0;
    padding-top: 1.1rem;
  }

  .totais > div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 0.42rem;
  }

  .totais dt {
    color: var(--suave);
    font-size: 0.82rem;
  }

  .totais dd {
    margin: 0;
    font-size: 0.86rem;
    font-variant-numeric: tabular-nums;
  }

  .totais dd.verde {
    color: #4b6344;
  }

  .totais .total-linha {
    margin-top: 0.6rem;
    padding-top: 0.9rem;
    border-top: 1px solid var(--linha-forte);
  }

  .total-linha dt {
    color: var(--tinta);
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .total-linha dd {
    font-family: var(--titulo);
    font-size: 1.45rem;
  }

  .parcelas {
    margin-top: 0.3rem;
    color: var(--suave);
    font-size: 0.74rem;
  }

  .selos {
    display: grid;
    gap: 0.5rem;
    margin: 1.25rem 0 0;
    padding-top: 1.1rem;
    border-top: 1px solid var(--linha);
    list-style: none;
    color: var(--suave);
    font-size: 0.72rem;
  }

  .selos li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (max-width: 980px) {
    .layout {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }

    .resumo {
      position: static;
      order: -1;
    }
  }

  @media (max-width: 600px) {
    .pagina {
      padding-top: 2rem;
    }

    .topo-pagina {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.5rem;
    }

    .bloco legend {
      font-size: 1.3rem;
    }
  }
</style>

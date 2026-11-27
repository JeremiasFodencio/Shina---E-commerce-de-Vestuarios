<script>
  import { brl, parcela } from '$lib/formato.js';
  import { carrinho } from '$lib/carrinho.svelte.js';
  import { favoritos } from '$lib/favoritos.svelte.js';
  import { FRETE_GRATIS, PARCELAS } from '$lib/config.js';
  import Icone from '$lib/Icone.svelte';

  const vazio = $derived(carrinho.itens.length === 0);
  const total = $derived(carrinho.total);
  const restante = $derived(Math.max(0, FRETE_GRATIS - total));
  const temFreteGratis = $derived(total >= FRETE_GRATIS);
  const progresso = $derived(Math.min(100, Math.round((total / FRETE_GRATIS) * 100)));
  const limiteDe = (item) => Math.min(item.estoque, 20);

  function salvarParaDepois(item) {
    favoritos.alternar({
      id: item.id,
      nome: item.produto,
      slug: item.slug,
      imagem_url: item.imagem_url,
      preco_centavos: item.preco_centavos
    });
    carrinho.remover(item.sku);
  }

  function limpar() {
    if (confirm('Esvaziar a sacola?')) carrinho.limpar();
  }
</script>

<svelte:head><title>Sacola — Shina</title></svelte:head>

<section class="pagina">
  <header class="topo-pagina">
    <div>
      <p class="rotulo">Sacola</p>
      <h1>Seu carrinho</h1>
    </div>
    {#if !vazio}
      <p class="contagem">
        {carrinho.quantidade}
        {carrinho.quantidade === 1 ? 'peça' : 'peças'}
      </p>
    {/if}
  </header>

  {#if vazio}
    <div class="vazio-caixa">
      <Icone nome="sacola" tamanho={30} />
      <h2>Sua sacola está vazia</h2>
      <p>Explore a coleção e escolha as peças que vão acompanhar o seu dia a dia.</p>
      <div class="vazio-acoes">
        <a class="btn" href="/">Explorar a coleção</a>
        <a class="btn-texto" href="/favoritos">Ver lista de desejos</a>
      </div>
    </div>
  {:else}
    <div class="layout">
      <div class="itens">
        {#if temFreteGratis}
          <div class="barra-frete conquistado">
            <Icone nome="caminhao" tamanho={18} />
            <span>Frete grátis garantido para este pedido.</span>
          </div>
        {:else}
          <div class="barra-frete">
            <div class="barra-texto">
              <Icone nome="caminhao" tamanho={18} />
              <span>
                Faltam <strong>{brl(restante)}</strong> para o frete grátis.
              </span>
            </div>
            <div
              class="trilho"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={progresso}
              aria-label="Progresso para frete grátis"
            >
              <div class="preenchido" style="width: {progresso}%"></div>
            </div>
          </div>
        {/if}

        <ul class="linhas">
          {#each carrinho.itens as item (item.sku)}
            <li class="linha">
              <a class="miniatura" href="/produto/{item.slug}" tabindex="-1" aria-hidden="true">
                {#if item.imagem_url}
                  <img src={item.imagem_url} alt="" />
                {:else}
                  <span>{item.produto[0]}</span>
                {/if}
              </a>

              <div class="dados">
                <div class="dados-topo">
                  <a class="nome" href="/produto/{item.slug}">{item.produto}</a>
                  <p class="preco-unit">{brl(item.preco_centavos)}</p>
                </div>

                <p class="variacao">
                  {item.cor} <span aria-hidden="true">·</span> Tam. {item.tamanho}
                </p>

                <div class="dados-base">
                  <div class="stepper">
                    <button
                      type="button"
                      aria-label="Diminuir quantidade de {item.produto}"
                      disabled={item.quantidade <= 1}
                      onclick={() => carrinho.alterar(item.sku, item.quantidade - 1)}>−</button
                    >
                    <span aria-live="polite">{item.quantidade}</span>
                    <button
                      type="button"
                      aria-label="Aumentar quantidade de {item.produto}"
                      disabled={item.quantidade >= limiteDe(item)}
                      onclick={() => carrinho.alterar(item.sku, item.quantidade + 1)}>+</button
                    >
                  </div>

                  <button
                    type="button"
                    class="acao"
                    onclick={() => carrinho.remover(item.sku)}
                  >
                    <Icone nome="lixeira" tamanho={15} /> Remover
                  </button>

                  {#if item.id}
                    <button type="button" class="acao" onclick={() => salvarParaDepois(item)}>
                      <Icone nome="coracao" tamanho={15} /> Salvar para depois
                    </button>
                  {/if}
                </div>
              </div>

              <p class="subtotal">{brl(item.preco_centavos * item.quantidade)}</p>
            </li>
          {/each}
        </ul>

        <div class="itens-acoes">
          <a class="btn-texto" href="/">
            <Icone nome="seta-esquerda" tamanho={15} /> Continuar comprando
          </a>
          <button type="button" class="limpar" onclick={limpar}>Esvaziar sacola</button>
        </div>
      </div>

      <aside class="resumo" aria-label="Resumo do pedido">
        <h2>Resumo</h2>

        <dl class="linhas-resumo">
          <div>
            <dt>Subtotal</dt>
            <dd>{brl(total)}</dd>
          </div>
          <div>
            <dt>Frete</dt>
            <dd class:verde={temFreteGratis}>
              {temFreteGratis ? 'Grátis' : 'Calculado no checkout'}
            </dd>
          </div>
          <div class="total-linha">
            <dt>Total</dt>
            <dd>{brl(total)}</dd>
          </div>
        </dl>

        {#if total > 0}
          <p class="parcelas">ou {PARCELAS}× de {brl(parcela(total))} sem juros</p>
        {/if}

        <a class="btn btn-primario btn-bloco" href="/checkout">Finalizar compra</a>

        <p class="seguro">
          <Icone nome="escudo" tamanho={15} /> Ambiente seguro · Pix e cartão
        </p>

        <ul class="mini-selos">
          <li><Icone nome="troca" tamanho={15} /> Trocas em até 30 dias</li>
          <li><Icone nome="caminhao" tamanho={15} /> Envio para todo o Brasil</li>
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

  .contagem {
    padding-bottom: 0.35rem;
    color: var(--suave);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    align-items: start;
    gap: clamp(2rem, 5vw, 4.5rem);
  }

  /* Frete */
  .barra-frete {
    padding: 1rem 1.25rem;
    margin-bottom: 0.5rem;
    background: var(--papel-2);
    border: 1px solid var(--linha);
    color: var(--tinta-suave);
    font-size: 0.82rem;
  }

  .barra-frete.conquistado {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: #4b6344;
    border-left: 2px solid #6b7f63;
  }

  .barra-texto {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .barra-texto strong {
    font-weight: 500;
    color: var(--tinta);
  }

  .trilho {
    height: 3px;
    margin-top: 0.85rem;
    background: var(--linha-forte);
    overflow: hidden;
  }

  .preenchido {
    height: 100%;
    background: var(--tinta);
    transition: width 500ms cubic-bezier(0.2, 0.6, 0.2, 1);
  }

  /* Itens */
  .linhas {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .linha {
    display: grid;
    grid-template-columns: 92px minmax(0, 1fr) auto;
    gap: 1.35rem;
    padding-block: 1.6rem;
    border-bottom: 1px solid var(--linha);
  }

  .miniatura {
    display: block;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: linear-gradient(155deg, #efe9df, #ded2c1);
  }

  .miniatura img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .miniatura span {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    font-family: var(--titulo);
    font-size: 2.4rem;
    color: #a08e78;
  }

  .dados {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .dados-topo {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  .nome {
    font-family: var(--titulo);
    font-size: 1.22rem;
    line-height: 1.2;
  }

  .nome:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .preco-unit {
    display: none;
    color: var(--suave);
    font-size: 0.78rem;
  }

  .variacao {
    margin-top: 0.35rem;
    color: var(--suave);
    font-size: 0.78rem;
  }

  .dados-base {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem 1.1rem;
    margin-top: auto;
    padding-top: 1rem;
  }

  .stepper {
    display: flex;
    align-items: center;
    height: 38px;
    border: 1px solid var(--linha-forte);
  }

  .stepper button {
    width: 34px;
    height: 100%;
    border: 0;
    background: none;
    color: var(--tinta);
    font-size: 1rem;
    line-height: 1;
  }

  .stepper button:hover:not(:disabled) {
    background: var(--papel-2);
  }

  .stepper button:disabled {
    color: #c4bcb0;
  }

  .stepper span {
    min-width: 2.4ch;
    text-align: center;
    font-size: 0.82rem;
    font-variant-numeric: tabular-nums;
  }

  .acao {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border: 0;
    background: none;
    padding: 0;
    color: var(--suave);
    font-size: 0.72rem;
    border-bottom: 1px solid transparent;
    transition:
      color var(--transicao),
      border-color var(--transicao);
  }

  .acao:hover {
    color: var(--tinta);
    border-bottom-color: var(--linha-forte);
  }

  .subtotal {
    align-self: end;
    padding-top: 1.4rem;
    font-size: 0.92rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .itens-acoes {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 1.6rem;
  }

  .limpar {
    border: 0;
    background: none;
    padding: 0;
    color: var(--suave);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    border-bottom: 1px solid transparent;
  }

  .limpar:hover {
    color: var(--tinta);
    border-bottom-color: var(--linha-forte);
  }

  /* Resumo */
  .resumo {
    position: sticky;
    top: 104px;
    padding: 1.75rem;
    border: 1px solid var(--linha);
    background: var(--papel-2);
  }

  .resumo h2 {
    margin-bottom: 1.35rem;
    font: 500 0.64rem/1 var(--texto);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .linhas-resumo {
    margin: 0;
  }

  .linhas-resumo > div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 0.5rem;
  }

  .linhas-resumo dt {
    color: var(--suave);
    font-size: 0.84rem;
  }

  .linhas-resumo dd {
    margin: 0;
    font-size: 0.88rem;
    font-variant-numeric: tabular-nums;
  }

  .linhas-resumo dd.verde {
    color: #4b6344;
  }

  .linhas-resumo .total-linha {
    margin-top: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid var(--linha-forte);
  }

  .total-linha dt {
    color: var(--tinta);
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .total-linha dd {
    font-family: var(--titulo);
    font-size: 1.5rem;
  }

  .parcelas {
    margin: 0.35rem 0 1.35rem;
    color: var(--suave);
    font-size: 0.76rem;
  }

  .seguro {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin-top: 1rem;
    color: var(--suave);
    font-size: 0.7rem;
  }

  .mini-selos {
    display: grid;
    gap: 0.55rem;
    margin: 1.35rem 0 0;
    padding-top: 1.15rem;
    border-top: 1px solid var(--linha);
    list-style: none;
    color: var(--suave);
    font-size: 0.74rem;
  }

  .mini-selos li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Vazio */
  .vazio-acoes {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 1.6rem;
  }

  @media (max-width: 980px) {
    .layout {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }

    .resumo {
      position: static;
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

    .linha {
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 1rem;
      padding-block: 1.3rem;
    }

    .subtotal {
      grid-column: 2;
      padding-top: 0.65rem;
    }


    .itens-acoes {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.9rem;
    }
  }
</style>

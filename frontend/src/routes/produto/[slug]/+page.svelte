<script>
  import { brl, parcela, ordenarTamanhos, corCss } from '$lib/formato.js';
  import { carrinho } from '$lib/carrinho.svelte.js';
  import { favoritos } from '$lib/favoritos.svelte.js';
  import { NOME_LOJA, FRETE_GRATIS, PARCELAS } from '$lib/config.js';
  import ProdutoCartao from '$lib/ProdutoCartao.svelte';
  import Icone from '$lib/Icone.svelte';

  let { data } = $props();

  const p = $derived(data.p);
  const variantes = $derived(p.variantes ?? []);
  const cores = $derived([...new Set(variantes.map((v) => v.cor))]);
  const tamanhos = $derived(ordenarTamanhos([...new Set(variantes.map((v) => v.tamanho))]));

  let corEscolhida = $state(null);
  let tamanho = $state(null);
  let quantidade = $state(1);
  let adicionado = $state(false);

  const cor = $derived(cores.includes(corEscolhida) ? corEscolhida : cores[0]);
  const variante = $derived(variantes.find((v) => v.cor === cor && v.tamanho === tamanho));
  const preco = $derived(variante?.preco_centavos ?? p.preco_centavos);
  const esgotado = $derived(variantes.length > 0 && variantes.every((v) => v.estoque <= 0));
  const maxQuantidade = $derived(Math.min(variante?.estoque ?? 1, 20));
  const favoritado = $derived(favoritos.tem(p.id));

  const estoqueDe = (t) =>
    variantes.find((v) => v.cor === cor && v.tamanho === t)?.estoque ?? 0;

  function escolherCor(c) {
    corEscolhida = c;
    tamanho = null;
    quantidade = 1;
    adicionado = false;
  }

  function escolherTamanho(t) {
    tamanho = t;
    quantidade = 1;
    adicionado = false;
  }

  function mudarQuantidade(delta) {
    quantidade = Math.max(1, Math.min(quantidade + delta, maxQuantidade));
  }

  function adicionar() {
    if (!variante || variante.estoque <= 0) return;
    carrinho.adicionar(
      {
        id: p.id,
        sku: variante.sku,
        produto: p.nome,
        slug: p.slug,
        imagem_url: p.imagem_url,
        tamanho: variante.tamanho,
        cor: variante.cor,
        preco_centavos: variante.preco_centavos,
        estoque: variante.estoque
      },
      quantidade
    );
    adicionado = true;
  }

  function alternarFavorito() {
    favoritos.alternar({
      id: p.id,
      nome: p.nome,
      slug: p.slug,
      imagem_url: p.imagem_url,
      preco_centavos: p.preco_centavos
    });
  }
</script>

<svelte:head>
  <title>{p.nome} — {NOME_LOJA}</title>
  <meta name="description" content={p.descricao ?? `${p.nome} — essenciais ${NOME_LOJA}.`} />
</svelte:head>

<nav class="migalhas" aria-label="Você está aqui">
  <a href="/">Novidades</a>
  <span aria-hidden="true">/</span>
  <span aria-current="page">{p.nome}</span>
</nav>

<article class="detalhe">
  <div class="midia">
    <figure class="quadro">
      {#if p.imagem_url}
        <img src={p.imagem_url} alt={p.nome} />
      {:else}
        <div class="monograma" aria-hidden="true">
          <span>{p.nome[0]}</span>
          <small>{NOME_LOJA}</small>
        </div>
      {/if}
      <figcaption class="selo">Pequenos lotes</figcaption>
    </figure>

    <p class="nota-foto">Peça da coleção Essenciais · foto ilustrativa</p>
  </div>

  <div class="info">
    <p class="rotulo">Shina · Essenciais</p>
    <h1>{p.nome}</h1>

    <div class="preco-linha">
      <p class="preco">{brl(preco)}</p>
      {#if preco >= 100}
        <span class="parcelas">ou {PARCELAS}× de {brl(parcela(preco))} sem juros</span>
      {/if}
    </div>

    {#if p.descricao}
      <p class="descricao">{p.descricao}</p>
    {:else}
      <p class="descricao">
        Uma peça pensada para o dia a dia: caimento confortável, tecido natural e
        acabamento cuidadoso.
      </p>
    {/if}

    {#if cores.length > 0}
      <fieldset class="grupo">
        <legend>
          <span class="rotulo">Cor</span>
          <strong class="escolha">{cor}</strong>
        </legend>
        <div class="cores">
          {#each cores as c (c)}
            <button
              type="button"
              class="cor"
              class:ativo={c === cor}
              style="--amostra: {corCss(c)}"
              aria-pressed={c === cor}
              aria-label="Cor {c}"
              title={c}
              onclick={() => escolherCor(c)}
            >
              <span></span>
            </button>
          {/each}
        </div>
      </fieldset>
    {/if}

    {#if tamanhos.length > 0}
      <fieldset class="grupo">
        <legend>
          <span class="rotulo">Tamanho</span>
          <a class="guia" href="/ajuda#tamanhos">Guia de tamanhos</a>
        </legend>
        <div class="tamanhos">
          {#each tamanhos as t (t)}
            {@const est = estoqueDe(t)}
            <button
              type="button"
              class="tam"
              class:ativo={tamanho === t}
              class:sem={est <= 0}
              disabled={est <= 0}
              aria-pressed={tamanho === t}
              aria-label={est <= 0 ? `${t}, indisponível` : `Tamanho ${t}`}
              onclick={() => escolherTamanho(t)}
            >
              {t}
            </button>
          {/each}
        </div>
      </fieldset>
    {/if}

    <p class="dica-estoque">
      {#if esgotado}
        Esta peça está esgotada no momento.
      {:else if variante}
        {variante.estoque <= 5
          ? `Últimas ${variante.estoque} unidades neste tamanho`
          : 'Disponível para envio imediato'}
        <span class="sku">· cód. {variante.sku}</span>
      {:else}
        Selecione um tamanho para continuar.
      {/if}
    </p>

    <div class="compra">
      <div class="stepper" aria-label="Quantidade">
        <button
          type="button"
          aria-label="Diminuir quantidade"
          disabled={!variante || quantidade <= 1}
          onclick={() => mudarQuantidade(-1)}>−</button
        >
        <span aria-live="polite">{quantidade}</span>
        <button
          type="button"
          aria-label="Aumentar quantidade"
          disabled={!variante || quantidade >= maxQuantidade}
          onclick={() => mudarQuantidade(1)}>+</button
        >
      </div>

      <button
        type="button"
        class="btn btn-primario comprar"
        disabled={!variante || variante.estoque <= 0}
        onclick={adicionar}
      >
        {esgotado ? 'Esgotado' : !variante ? 'Selecione um tamanho' : 'Adicionar à sacola'}
      </button>
    </div>

    <button type="button" class="favoritar" class:favoritado onclick={alternarFavorito}>
      <Icone nome="coracao" tamanho={17} cheio={favoritado} />
      {favoritado ? 'Salvo na lista de desejos' : 'Salvar na lista de desejos'}
    </button>

    {#if adicionado}
      <p class="adicionado" role="status">
        <Icone nome="check" tamanho={17} />
        Adicionado à sacola.
        <a class="link" href="/carrinho">Ver sacola ({carrinho.quantidade})</a>
      </p>
    {/if}

    <ul class="selos">
      <li><Icone nome="caminhao" tamanho={18} /> Frete grátis acima de {brl(FRETE_GRATIS)}</li>
      <li><Icone nome="troca" tamanho={18} /> Trocas em até 30 dias</li>
      <li><Icone nome="escudo" tamanho={18} /> Pagamento seguro · Pix e cartão</li>
    </ul>

    <div class="acordeoes">
      <details open>
        <summary>Detalhes da peça <Icone nome="chevron" tamanho={16} /></summary>
        <div class="acordeao-corpo">
          <p>
            {p.descricao ??
              'Modelagem confortável, pensada para acompanhar o corpo sem apertar. Peça versátil, fácil de combinar em diferentes ocasiões.'}
          </p>
          <p>Produzida em pequenos lotes para reduzir desperdício.</p>
        </div>
      </details>

      <details>
        <summary>Composição e cuidados <Icone nome="chevron" tamanho={16} /></summary>
        <div class="acordeao-corpo">
          <p>Fibras naturais selecionadas. Lavar à mão ou à máquina em ciclo delicado, com água fria.</p>
          <p>Não usar alvejante. Secar à sombra. Passar em temperatura média.</p>
        </div>
      </details>

      <details>
        <summary>Entrega e trocas <Icone nome="chevron" tamanho={16} /></summary>
        <div class="acordeao-corpo">
          <p>
            Enviamos para todo o Brasil. Frete grátis em pedidos acima de {brl(FRETE_GRATIS)}.
          </p>
          <p>Trocas e devoluções em até 30 dias após o recebimento, sem complicação.</p>
        </div>
      </details>
    </div>
  </div>
</article>

{#if data.relacionados.length > 0}
  <section class="relacionados">
    <div class="relacionados-topo">
      <div>
        <p class="rotulo">Combina com</p>
        <h2>Você também pode gostar</h2>
      </div>
      <a class="btn-texto" href="/">Ver tudo <Icone nome="seta" tamanho={16} /></a>
    </div>

    <ul class="grade-relacionados">
      {#each data.relacionados as item, i (item.id)}
        <ProdutoCartao produto={item} indice={i} />
      {/each}
    </ul>
  </section>
{/if}

<style>
  .migalhas {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1.75rem 0 0;
    color: var(--suave);
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .migalhas a {
    color: var(--suave);
  }

  .migalhas a:hover {
    color: var(--tinta);
  }

  .migalhas span[aria-current] {
    color: var(--tinta-suave);
    text-transform: none;
    letter-spacing: 0.02em;
    font-size: 0.78rem;
  }

  .detalhe {
    display: grid;
    grid-template-columns: 1.02fr 0.98fr;
    align-items: start;
    gap: clamp(2rem, 5vw, 5rem);
    padding-block: 2rem 0;
  }

  .midia {
    position: sticky;
    top: 104px;
  }

  .quadro {
    position: relative;
    aspect-ratio: 4 / 5;
    margin: 0;
    overflow: hidden;
    background: linear-gradient(155deg, #efe9df, #ded2c1);
  }

  .quadro img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 900ms cubic-bezier(0.2, 0.6, 0.2, 1);
  }

  .quadro:hover img {
    transform: scale(1.035);
  }

  .monograma {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 0.7rem;
    color: #a08e78;
  }

  .monograma span {
    font-family: var(--titulo);
    font-size: clamp(8rem, 18vw, 14rem);
    line-height: 0.8;
  }

  .monograma small {
    font-size: 0.58rem;
    letter-spacing: 0.5em;
    text-indent: 0.5em;
    text-transform: uppercase;
  }

  .selo {
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 0.8rem;
    background: color-mix(in srgb, var(--papel) 88%, transparent);
    color: var(--tinta-suave);
    font-size: 0.56rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    backdrop-filter: blur(6px);
  }

  .nota-foto {
    margin-top: 0.9rem;
    color: var(--suave);
    font-size: 0.68rem;
    letter-spacing: 0.05em;
  }

  .info {
    padding-top: 0.25rem;
  }

  .info h1 {
    margin: 0.7rem 0 0.9rem;
    font-size: clamp(2.3rem, 3.8vw, 3.2rem);
    line-height: 0.98;
    letter-spacing: -0.02em;
    max-width: 20ch;
  }

  .preco-linha {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.35rem 1rem;
  }

  .preco {
    font-family: var(--titulo);
    font-size: 1.85rem;
    letter-spacing: 0.01em;
  }

  .parcelas {
    color: var(--suave);
    font-size: 0.8rem;
  }

  .descricao {
    max-width: 46ch;
    margin-top: 1.5rem;
    color: var(--suave);
    font-size: 0.95rem;
    line-height: 1.85;
  }

  .grupo {
    margin: 2rem 0 0;
    padding: 0;
    border: 0;
  }

  .grupo legend {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    margin-bottom: 0.85rem;
    padding: 0;
  }

  .escolha {
    font-family: var(--titulo);
    font-style: italic;
    font-size: 1.02rem;
    font-weight: 400;
    color: var(--tinta-suave);
  }

  .cores {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .cor {
    width: 36px;
    height: 36px;
    padding: 4px;
    border: 1px solid transparent;
    border-radius: 50%;
    background: none;
    transition: border-color var(--transicao);
  }

  .cor span {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--amostra);
    box-shadow: inset 0 0 0 1px rgb(26 24 21 / 0.14);
  }

  .cor:hover {
    border-color: var(--linha-forte);
  }

  .cor.ativo {
    border-color: var(--tinta);
  }

  .guia {
    font-size: 0.7rem;
    color: var(--suave);
    border-bottom: 1px solid var(--linha-forte);
    padding-bottom: 1px;
  }

  .guia:hover {
    color: var(--tinta);
    border-color: var(--tinta);
  }

  .tamanhos {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tam {
    min-width: 54px;
    height: 46px;
    padding: 0 0.9rem;
    border: 1px solid var(--linha-forte);
    background: none;
    color: var(--tinta);
    font: 500 0.74rem/1 var(--texto);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition:
      border-color var(--transicao),
      background var(--transicao),
      color var(--transicao);
  }

  .tam:hover:not(:disabled) {
    border-color: var(--tinta);
  }

  .tam.ativo {
    background: var(--tinta);
    border-color: var(--tinta);
    color: var(--papel);
  }

  .tam.sem {
    color: #b4aca1;
    text-decoration: line-through;
    border-color: var(--linha);
    cursor: not-allowed;
  }

  .dica-estoque {
    margin-top: 1.1rem;
    color: var(--suave);
    font-size: 0.76rem;
  }

  .sku {
    color: #a79f94;
  }

  .compra {
    display: flex;
    gap: 0.65rem;
    margin-top: 1.75rem;
  }

  .stepper {
    display: flex;
    align-items: center;
    flex: none;
    border: 1px solid var(--linha-forte);
    height: 52px;
  }

  .stepper button {
    width: 42px;
    height: 100%;
    border: 0;
    background: none;
    color: var(--tinta);
    font-size: 1.05rem;
    line-height: 1;
    transition:
      background var(--transicao),
      color var(--transicao);
  }

  .stepper button:hover:not(:disabled) {
    background: var(--papel-2);
  }

  .stepper button:disabled {
    color: #c4bcb0;
  }

  .stepper span {
    min-width: 2.2ch;
    text-align: center;
    font-size: 0.86rem;
    font-variant-numeric: tabular-nums;
  }

  .comprar {
    flex: 1;
    height: 52px;
  }

  .favoritar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    width: 100%;
    height: 48px;
    margin-top: 0.6rem;
    border: 1px solid var(--linha);
    background: none;
    color: var(--tinta-suave);
    font: 500 0.63rem/1 var(--texto);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    transition:
      border-color var(--transicao),
      color var(--transicao);
  }

  .favoritar:hover {
    border-color: var(--tinta);
    color: var(--tinta);
  }

  .favoritar.favoritado {
    color: var(--acento);
    border-color: color-mix(in srgb, var(--acento) 45%, transparent);
  }

  .adicionado {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.9rem 1rem;
    background: var(--papel-2);
    border-left: 2px solid #6b7f63;
    font-size: 0.84rem;
    animation: aparecer 240ms ease;
  }

  .adicionado :global(svg) {
    color: #4f6b47;
  }

  .selos {
    display: grid;
    gap: 0.65rem;
    margin: 2rem 0 0;
    padding: 0;
    list-style: none;
    color: var(--suave);
    font-size: 0.8rem;
  }

  .selos li {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .selos li :global(svg) {
    color: var(--tinta-suave);
    flex: none;
  }

  .acordeoes {
    margin-top: 2.25rem;
    border-top: 1px solid var(--linha);
  }

  .acordeoes details {
    border-bottom: 1px solid var(--linha);
  }

  .acordeoes summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.15rem 0;
    cursor: pointer;
    list-style: none;
    font: 500 0.66rem/1 var(--texto);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--tinta);
  }

  .acordeoes summary::-webkit-details-marker {
    display: none;
  }

  .acordeoes summary :global(svg) {
    color: var(--suave);
    transition: transform 260ms ease;
  }

  .acordeoes details[open] summary :global(svg) {
    transform: rotate(180deg);
  }

  .acordeao-corpo {
    padding-bottom: 1.2rem;
    color: var(--suave);
    font-size: 0.88rem;
    line-height: 1.85;
  }

  .acordeao-corpo p + p {
    margin-top: 0.6rem;
  }

  /* Relacionados */
  .relacionados {
    margin-top: 6rem;
  }

  .relacionados-topo {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
    padding-bottom: 1.25rem;
    margin-bottom: 2.25rem;
    border-bottom: 1px solid var(--linha);
  }

  .relacionados-topo h2 {
    margin-top: 0.4rem;
    font-size: clamp(1.8rem, 2.8vw, 2.3rem);
  }

  .grade-relacionados {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  @media (max-width: 1000px) {
    .detalhe {
      gap: 2.5rem;
    }

    .grade-relacionados {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 840px) {
    .detalhe {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding-top: 1.25rem;
    }

    .midia {
      position: static;
    }

    .info {
      padding-top: 0;
    }

    .compra {
      flex-wrap: wrap;
    }

    .comprar {
      min-width: 100%;
    }

    .relacionados {
      margin-top: 4rem;
    }
  }

  @media (max-width: 520px) {
    .migalhas {
      padding-top: 1.1rem;
    }

    .selos {
      font-size: 0.76rem;
    }

    .relacionados-topo {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }
</style>

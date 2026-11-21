<script>
  import { brl, ordenarTamanhos } from '$lib/formato.js';
  import { carrinho } from '$lib/carrinho.svelte.js';
  import { NOME_LOJA } from '$lib/config.js';

  let { data } = $props();

  const p = $derived(data.p);
  const cores = $derived([...new Set(p.variantes.map((v) => v.cor))]);
  const tamanhos = $derived(ordenarTamanhos([...new Set(p.variantes.map((v) => v.tamanho))]));

  let corEscolhida = $state(null);
  let tamanho = $state(null);
  let adicionado = $state(false);

  const cor = $derived(cores.includes(corEscolhida) ? corEscolhida : cores[0]);
  const variante = $derived(p.variantes.find((v) => v.cor === cor && v.tamanho === tamanho));
  const preco = $derived(variante?.preco_centavos ?? p.preco_centavos);

  const estoqueDe = (t) =>
    p.variantes.find((v) => v.cor === cor && v.tamanho === t)?.estoque ?? 0;

  function escolherCor(c) {
    corEscolhida = c;
    tamanho = null;
    adicionado = false;
  }

  function escolherTamanho(t) {
    tamanho = t;
    adicionado = false;
  }

  function adicionar() {
    if (!variante || variante.estoque <= 0) return;
    carrinho.adicionar({
      sku: variante.sku,
      produto: p.nome,
      slug: p.slug,
      tamanho: variante.tamanho,
      cor: variante.cor,
      preco_centavos: variante.preco_centavos,
      estoque: variante.estoque
    });
    adicionado = true;
  }
</script>

<svelte:head><title>{p.nome} — {NOME_LOJA}</title></svelte:head>

<article class="detalhe">
  <div class="foto">
    {#if p.imagem_url}
      <img src={p.imagem_url} alt={p.nome} />
    {:else}
      <span aria-hidden="true">{p.nome[0]}</span>
    {/if}
  </div>

  <div class="info">
    <h1>{p.nome}</h1>
    <p class="preco grande">{brl(preco)}</p>
    {#if p.descricao}<p class="descricao">{p.descricao}</p>{/if}

    <fieldset class="grupo">
      <legend>Cor: <strong>{cor}</strong></legend>
      <div class="cores">
        {#each cores as c (c)}
          <button
            type="button"
            class="cor"
            class:ativo={c === cor}
            aria-pressed={c === cor}
            onclick={() => escolherCor(c)}>{c}</button
          >
        {/each}
      </div>
    </fieldset>

    <fieldset class="grupo">
      <legend>Tamanho</legend>
      <div class="fita">
        {#each tamanhos as t (t)}
          {@const est = estoqueDe(t)}
          <button
            type="button"
            class="seg"
            class:ativo={tamanho === t}
            class:sem={est <= 0}
            disabled={est <= 0}
            aria-pressed={tamanho === t}
            aria-label={est <= 0 ? `${t}, indisponível` : t}
            onclick={() => escolherTamanho(t)}>{t}</button
          >
        {/each}
      </div>
    </fieldset>

    {#if variante}
      <p class="dica">
        {variante.estoque <= 5 ? `Restam ${variante.estoque} unidades` : 'Em estoque'} · Código {variante.sku}
      </p>
    {:else}
      <p class="dica">Escolha um tamanho para continuar.</p>
    {/if}

    <div>
      <button type="button" class="btn btn-primario" disabled={!variante} onclick={adicionar}>
        Adicionar ao carrinho
      </button>
    </div>

    {#if adicionado}
      <p class="ok" role="status">Adicionado ao carrinho. <a href="/carrinho">Ver carrinho</a></p>
    {/if}
  </div>
</article>

<script>
  import { brl } from '$lib/formato.js';
  import { NOME_LOJA } from '$lib/config.js';

  let { data } = $props();

  function link(pagina) {
    const params = new URLSearchParams();
    if (data.q) params.set('q', data.q);
    if (pagina > 1) params.set('pagina', pagina);
    const s = params.toString();
    return s ? `/?${s}` : '/';
  }
</script>

<svelte:head><title>{NOME_LOJA} — Moda e vestuário</title></svelte:head>

<form class="busca" method="GET" action="/" role="search">
  <input name="q" value={data.q} placeholder="Buscar peças" aria-label="Buscar produtos" />
  <button class="btn btn-primario">Buscar</button>
</form>

{#if data.produtos.length === 0}
  <p class="vazio">
    Nenhuma peça encontrada{#if data.q} para “{data.q}”{/if}.
    {#if data.q}<a href="/">Ver todo o catálogo</a>{/if}
  </p>
{:else}
  <ul class="grade-produtos">
    {#each data.produtos as p (p.id)}
      <li>
        <a href="/produto/{p.slug}" class="cartao">
          <div class="foto">
            {#if p.imagem_url}
              <img src={p.imagem_url} alt={p.nome} loading="lazy" />
            {:else}
              <span aria-hidden="true">{p.nome[0]}</span>
            {/if}
          </div>
          <h2>{p.nome}</h2>
          <p class="preco">{brl(p.preco_centavos)}</p>
          {#if p.estoque_total <= 0}<p class="esgotado">Esgotado</p>{/if}
        </a>
      </li>
    {/each}
  </ul>

  {#if data.pagina > 1 || data.temMais}
    <nav class="paginacao" aria-label="Paginação">
      {#if data.pagina > 1}<a href={link(data.pagina - 1)}>Página anterior</a>{/if}
      {#if data.temMais}<a href={link(data.pagina + 1)}>Próxima página</a>{/if}
    </nav>
  {/if}
{/if}

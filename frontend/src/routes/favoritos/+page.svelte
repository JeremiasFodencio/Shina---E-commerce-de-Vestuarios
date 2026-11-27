<script>
  import { favoritos } from '$lib/favoritos.svelte.js';
  import ProdutoCartao from '$lib/ProdutoCartao.svelte';
  import Icone from '$lib/Icone.svelte';

  const vazio = $derived(favoritos.itens.length === 0);

  function limpar() {
    if (confirm('Remover todas as peças da lista de desejos?')) favoritos.limpar();
  }
</script>

<svelte:head><title>Lista de desejos — Shina</title></svelte:head>

<section class="pagina">
  <header class="topo-pagina">
    <div>
      <p class="rotulo">Lista de desejos</p>
      <h1>Peças que você guardou</h1>
    </div>
    {#if !vazio}
      <div class="topo-acoes">
        <p class="contagem">
          {favoritos.quantidade}
          {favoritos.quantidade === 1 ? 'peça' : 'peças'}
        </p>
        <button type="button" class="limpar" onclick={limpar}>Limpar lista</button>
      </div>
    {/if}
  </header>

  {#if vazio}
    <div class="vazio-caixa">
      <Icone nome="coracao" tamanho={30} />
      <h2>Sua lista ainda está vazia</h2>
      <p>
        Toque no coração das peças que você gosta para guardá-las aqui. A lista fica salva
        neste navegador.
      </p>
      <div class="vazio-acoes">
        <a class="btn" href="/">Explorar a coleção</a>
        <a class="btn-texto" href="/carrinho">Ver sacola</a>
      </div>
    </div>
  {:else}
    <ul class="grade">
      {#each favoritos.itens as item, i (item.id)}
        <ProdutoCartao produto={item} indice={i} />
      {/each}
    </ul>

    <p class="nota">
      <Icone nome="coracao" tamanho={15} /> Sua lista é salva localmente, sem necessidade de
      cadastro.
    </p>
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
    margin-bottom: 2.5rem;
    border-bottom: 1px solid var(--linha);
  }

  .topo-pagina h1 {
    margin-top: 0.45rem;
    font-size: clamp(2.3rem, 3.8vw, 3.1rem);
  }

  .topo-acoes {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding-bottom: 0.35rem;
  }

  .contagem {
    color: var(--suave);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .limpar {
    border: 0;
    background: none;
    padding: 0;
    color: var(--suave);
    font-size: 0.72rem;
    border-bottom: 1px solid transparent;
  }

  .limpar:hover {
    color: var(--tinta);
    border-bottom-color: var(--linha-forte);
  }

  .grade {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2.75rem 1.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .nota {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--linha);
    color: var(--suave);
    font-size: 0.76rem;
  }

  .vazio-acoes {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 1.6rem;
  }

  @media (max-width: 1000px) {
    .grade {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 900px) {
    .grade {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.25rem 1rem;
    }
  }

  @media (max-width: 600px) {
    .pagina {
      padding-top: 2rem;
    }

    .topo-pagina {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }
</style>

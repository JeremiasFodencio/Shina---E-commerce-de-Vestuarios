<script>
  import { brl } from '$lib/formato.js';
  import { carrinho } from '$lib/carrinho.svelte.js';
</script>

<svelte:head><title>Carrinho</title></svelte:head>

<h1>Carrinho</h1>

{#if carrinho.itens.length === 0}
  <p class="vazio">Seu carrinho está vazio. <a href="/">Ver o catálogo</a></p>
{:else}
  <ul class="linhas">
    {#each carrinho.itens as i (i.sku)}
      <li class="linha">
        <div>
          <p><a href="/produto/{i.slug}">{i.produto}</a></p>
          <p class="sub">{i.cor} · {i.tamanho} · {brl(i.preco_centavos)}</p>
          <button type="button" class="remover" onclick={() => carrinho.remover(i.sku)}>Remover</button>
        </div>
        <div class="qtd">
          <button type="button" aria-label="Diminuir quantidade" onclick={() => carrinho.alterar(i.sku, i.quantidade - 1)}>−</button>
          <span>{i.quantidade}</span>
          <button type="button" aria-label="Aumentar quantidade" onclick={() => carrinho.alterar(i.sku, i.quantidade + 1)}>+</button>
        </div>
        <p><strong>{brl(i.preco_centavos * i.quantidade)}</strong></p>
      </li>
    {/each}
  </ul>

  <div class="resumo">
    <p class="total">Total: {brl(carrinho.total)}</p>
    <a href="/checkout" class="btn btn-primario">Finalizar compra</a>
  </div>
{/if}

<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { carrinho } from '$lib/carrinho.svelte.js';
  import { NOME_LOJA } from '$lib/config.js';

  let { children } = $props();

  onMount(() => carrinho.carregar());
</script>

<header class="topo">
  <div class="container barra">
    <a href="/" class="marca">{NOME_LOJA}</a>
    <nav>
      <a href="/carrinho">
        Carrinho{#if carrinho.quantidade > 0}<span class="contador">{carrinho.quantidade}</span>{/if}
      </a>
    </nav>
  </div>
</header>

<main class="container">
  {@render children()}
</main>

<footer class="container">© {new Date().getFullYear()} {NOME_LOJA}</footer>

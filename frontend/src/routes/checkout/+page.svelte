<script>
  import { goto } from '$app/navigation';
  import { brl } from '$lib/formato.js';
  import { carrinho } from '$lib/carrinho.svelte.js';
  import { criarPedido } from '$lib/api';

  let nome = $state('');
  let email = $state('');
  let endereco = $state('');
  let enviando = $state(false);
  let erro = $state('');

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

<svelte:head><title>Finalizar compra</title></svelte:head>

<h1>Finalizar compra</h1>

{#if carrinho.itens.length === 0}
  <p class="vazio">Seu carrinho está vazio. <a href="/">Ver o catálogo</a></p>
{:else}
  <p>{carrinho.quantidade} {carrinho.quantidade === 1 ? 'item' : 'itens'} · <strong>{brl(carrinho.total)}</strong> · <a href="/carrinho">Editar carrinho</a></p>

  <form class="form-checkout" onsubmit={enviar}>
    <label class="campo">Nome completo
      <input bind:value={nome} required autocomplete="name" />
    </label>
    <label class="campo">E-mail
      <input type="email" bind:value={email} required autocomplete="email" />
    </label>
    <label class="campo">Endereço de entrega
      <input bind:value={endereco} required autocomplete="street-address" />
    </label>

    {#if erro}<p class="erro-msg" role="alert">{erro}</p>{/if}

    <button class="btn btn-primario" disabled={enviando}>
      {enviando ? 'Enviando pedido…' : 'Fazer pedido'}
    </button>
  </form>
{/if}

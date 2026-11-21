<script>
  import { brl } from '$lib/formato.js';

  let { data } = $props();
  const p = $derived(data.pedido);

  const rotulos = {
    pendente: 'Aguardando pagamento',
    pago: 'Pago',
    enviado: 'Enviado',
    cancelado: 'Cancelado'
  };
</script>

<svelte:head><title>Pedido registrado</title></svelte:head>

<h1>Pedido registrado</h1>

<div class="dados-pedido">
  <p>Código: <strong>{p.id}</strong></p>
  <p>Situação: <strong>{rotulos[p.status] ?? p.status}</strong></p>
  <p>Entrega para {p.nome} — {p.endereco}</p>
</div>

<ul class="linhas">
  {#each p.itens as i (i.sku)}
    <li class="linha">
      <div>
        <p>{i.produto}</p>
        <p class="sub">{i.cor} · {i.tamanho} · {i.quantidade} × {brl(i.preco_unit_centavos)}</p>
      </div>
      <span></span>
      <p><strong>{brl(i.preco_unit_centavos * i.quantidade)}</strong></p>
    </li>
  {/each}
</ul>

<p class="total">Total: {brl(p.total_centavos)}</p>
<p><a href="/">Continuar comprando</a></p>

<script>
  import { page } from '$app/state';
</script>

<svelte:head><title>Erro {page.status}</title></svelte:head>

<h1>{page.status === 404 ? 'Página não encontrada' : 'Algo deu errado'}</h1>
<p>{page.error?.message}</p>
<p><a href="/">Voltar ao catálogo</a></p>

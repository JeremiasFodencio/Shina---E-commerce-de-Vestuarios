<script>
  import { page } from '$app/state';
  import Icone from '$lib/Icone.svelte';

  const naoEncontrada = $derived(page.status === 404);
  const titulo = $derived(naoEncontrada ? 'Página não encontrada' : 'Algo deu errado');
  // Mensagens genéricas do SvelteKit ("Not Found") repetem o título e vêm em inglês
  const GENERICAS = ['Not Found', 'Internal Error', 'Internal Server Error'];
  const mensagem = $derived.by(() => {
    const msg = page.error?.message;
    if (!msg || GENERICAS.includes(msg)) {
      return naoEncontrada
        ? 'O endereço que você abriu não existe ou a peça saiu do catálogo.'
        : 'Não conseguimos carregar esta página agora. Tente novamente em instantes.';
    }
    return msg;
  });
</script>

<svelte:head><title>{page.status} — {titulo}</title></svelte:head>

<section class="erro">
  <p class="codigo" aria-hidden="true">{page.status}</p>
  <p class="rotulo">{naoEncontrada ? 'Caminho perdido' : 'Erro inesperado'}</p>
  <h1>{titulo}</h1>
  <p class="mensagem">{mensagem}</p>

  <div class="acoes">
    <a class="btn" href="/">Voltar ao início</a>
    <a class="btn-texto" href="/ajuda">Central de ajuda <Icone nome="seta" tamanho={16} /></a>
  </div>

  <div class="sugestoes">
    <p class="rotulo">Talvez você procure</p>
    <div class="chips">
      <a href="/">Novidades</a>
      <a href="/favoritos">Lista de desejos</a>
      <a href="/carrinho">Sacola</a>
    </div>
  </div>
</section>

<style>
  .erro {
    display: grid;
    justify-items: center;
    max-width: 560px;
    min-height: 58vh;
    margin-inline: auto;
    padding-block: 5rem 2rem;
    text-align: center;
    align-content: center;
  }

  .codigo {
    font-family: var(--titulo);
    font-style: italic;
    font-size: clamp(5rem, 14vw, 9rem);
    line-height: 0.95;
    padding-bottom: 0.4rem;
    color: var(--areia-2);
    letter-spacing: -0.03em;
  }

  .erro h1 {
    margin: 0.7rem 0 0.9rem;
    font-size: clamp(1.9rem, 3.6vw, 2.6rem);
    line-height: 1.05;
  }

  .mensagem {
    max-width: 42ch;
    color: var(--suave);
    font-size: 0.92rem;
    line-height: 1.8;
  }

  .acoes {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .sugestoes {
    margin-top: 3.5rem;
    padding-top: 1.75rem;
    border-top: 1px solid var(--linha);
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.45rem;
    margin-top: 0.9rem;
  }

  .chips a {
    padding: 0.5rem 0.95rem;
    border: 1px solid var(--linha-forte);
    border-radius: 999px;
    color: var(--tinta-suave);
    font-size: 0.76rem;
    transition:
      background var(--transicao),
      border-color var(--transicao),
      color var(--transicao);
  }

  .chips a:hover {
    background: var(--tinta);
    border-color: var(--tinta);
    color: var(--papel);
  }
</style>

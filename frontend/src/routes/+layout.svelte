<script>
  import '../app.css';
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { carrinho } from '$lib/carrinho.svelte.js';
  import { favoritos } from '$lib/favoritos.svelte.js';
  import {
    NOME_LOJA,
    ASSINATURA,
    DESCRICAO_LOJA,
    EMAIL_CONTATO,
    INSTAGRAM,
    FRETE_GRATIS
  } from '$lib/config.js';
  import { brl } from '$lib/formato.js';
  import Icone from '$lib/Icone.svelte';

  let { children } = $props();

  let menuAberto = $state(false);
  let buscaAberta = $state(false);
  let termo = $state('');
  let rolado = $state(false);
  let campoBusca = $state(null);
  let emailNews = $state('');
  let inscrito = $state(false);

  const caminho = $derived(page.url.pathname);
  const ano = new Date().getFullYear();

  onMount(() => {
    carrinho.carregar();
    favoritos.carregar();
  });

  // Fecha as camadas ao trocar de página
  $effect(() => {
    caminho;
    menuAberto = false;
    buscaAberta = false;
  });

  // Foco no campo assim que a busca abre
  $effect(() => {
    if (!buscaAberta) return;
    tick().then(() => campoBusca?.focus());
  });

  // Trava a rolagem do fundo enquanto uma camada está aberta
  $effect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuAberto || buscaAberta ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });

  function aoTeclar(ev) {
    if (ev.key === 'Escape') {
      menuAberto = false;
      buscaAberta = false;
    }
  }

  function aoRolar() {
    rolado = window.scrollY > 8;
  }

  function abrirBusca() {
    menuAberto = false;
    buscaAberta = true;
  }

  function fecharBusca() {
    buscaAberta = false;
  }

  function buscar(ev) {
    ev.preventDefault();
    const texto = termo.trim();
    buscaAberta = false;
    goto(texto ? `/?q=${encodeURIComponent(texto)}` : '/');
  }

  function irParaBusca(texto) {
    buscaAberta = false;
    goto(`/?q=${encodeURIComponent(texto)}`);
  }

  function assinar(ev) {
    ev.preventDefault();
    if (!emailNews.trim()) return;
    inscrito = true;
    emailNews = '';
  }
</script>

<svelte:window onkeydown={aoTeclar} onscroll={aoRolar} />

<a class="pular" href="#conteudo">Pular para o conteúdo</a>

<div class="aviso">
  <span>Frete grátis acima de {brl(FRETE_GRATIS)}</span>
  <span class="aviso-sep" aria-hidden="true">·</span>
  <span>Trocas em até 30 dias</span>
  <span class="aviso-sep" aria-hidden="true">·</span>
  <span>Até 3× sem juros</span>
</div>

<header class="topo" class:compacto={rolado}>
  <div class="container barra">
    <button
      type="button"
      class="icone menu-btn"
      aria-label="Abrir menu"
      aria-expanded={menuAberto}
      onclick={() => (menuAberto = true)}
    >
      <Icone nome="menu" />
    </button>

    <nav class="nav so-desktop" aria-label="Navegação principal">
      <a href="/" class:ativo={caminho === '/'}>Novidades</a>
      <a href="/#destaques">Essenciais</a>
      <a href="/#sobre">Sobre</a>
      <a href="/ajuda" class:ativo={caminho.startsWith('/ajuda')}>Ajuda</a>
    </nav>

    <a class="marca" href="/" aria-label="{NOME_LOJA} — página inicial">
      {NOME_LOJA}
      <small>{ASSINATURA}</small>
    </a>

    <div class="acoes">
      <button type="button" class="icone" aria-label="Buscar" onclick={abrirBusca}>
        <Icone nome="busca" />
      </button>
      <a class="icone so-desktop" href="/favoritos" aria-label="Lista de desejos">
        <Icone nome="coracao" cheio={favoritos.quantidade > 0} />
        {#if favoritos.quantidade > 0}
          <span class="contador">{favoritos.quantidade}</span>
        {/if}
      </a>
      <a class="icone" href="/carrinho" aria-label="Sacola">
        <Icone nome="sacola" />
        {#if carrinho.quantidade > 0}
          <span class="contador">{carrinho.quantidade}</span>
        {/if}
      </a>
    </div>
  </div>
</header>

<main id="conteudo" class="principal">
  <div class="container">
    {@render children()}
  </div>
</main>

<footer class="rodape">
  <section class="container newsletter">
    <div class="news-texto">
      <p class="rotulo">Newsletter</p>
      <h2>Novidades em primeira mão.</h2>
      <p>Lançamentos, reposições e histórias da coleção. Sem excesso de e-mails.</p>
    </div>
    <div class="news-acao">
      {#if inscrito}
        <p class="ok news-ok" role="status">
          <Icone nome="check" tamanho={18} /> Inscrição registrada. Até breve.
        </p>
      {:else}
        <form class="news-form" onsubmit={assinar}>
          <label class="sr" for="email-news">Seu e-mail</label>
          <input
            id="email-news"
            type="email"
            bind:value={emailNews}
            placeholder="seu@email.com"
            autocomplete="email"
            required
          />
          <button class="btn" type="submit">Assinar</button>
        </form>
        <p class="news-nota">Ao assinar, você concorda em receber nossos e-mails.</p>
      {/if}
    </div>
  </section>

  <div class="container colunas">
    <div class="marca-coluna">
      <p class="marca-rodape">{NOME_LOJA}</p>
      <p class="marca-texto">{DESCRICAO_LOJA}</p>
      <div class="sociais">
        <span><Icone nome="instagram" tamanho={16} /> {INSTAGRAM}</span>
        <a href="mailto:{EMAIL_CONTATO}"
          ><Icone nome="email" tamanho={16} /> {EMAIL_CONTATO}</a
        >
      </div>
    </div>

    <div class="coluna">
      <h3>Atendimento</h3>
      <ul>
        <li><a href="/ajuda">Central de ajuda</a></li>
        <li><a href="/ajuda#trocas">Trocas e devoluções</a></li>
        <li><a href="/ajuda#tamanhos">Guia de tamanhos</a></li>
        <li><a href="mailto:{EMAIL_CONTATO}">Fale conosco</a></li>
      </ul>
    </div>

    <div class="coluna">
      <h3>A Shina</h3>
      <ul>
        <li><a href="/#sobre">Nossa história</a></li>
        <li><a href="/#destaques">Essenciais</a></li>
        <li><a href="/favoritos">Lista de desejos</a></li>
        <li><a href="/admin">Administração</a></li>
      </ul>
    </div>

    <div class="coluna">
      <h3>Ajuda</h3>
      <ul>
        <li><a href="/ajuda#faq">Perguntas frequentes</a></li>
        <li><a href="/ajuda#pagamento">Formas de pagamento</a></li>
        <li><a href="/ajuda#entrega">Prazos de entrega</a></li>
        <li><a href="/ajuda#privacidade">Privacidade</a></li>
      </ul>
    </div>
  </div>

  <div class="container base">
    <p>© {ano} {NOME_LOJA}. Todos os direitos reservados.</p>
    <p class="base-meio">Feito em pequenos lotes · Brasil</p>
    <div class="pagamentos" aria-label="Formas de pagamento aceitas">
      <span>Pix</span>
      <span>Visa</span>
      <span>Mastercard</span>
      <span>Elo</span>
    </div>
  </div>
</footer>

{#if buscaAberta}
  <button type="button" class="veu-fundo" aria-label="Fechar busca" onclick={fecharBusca}></button>
  <div class="painel-busca" role="dialog" aria-modal="true" aria-label="Buscar na loja">
    <div class="container">
      <div class="painel-topo">
        <span class="rotulo">Buscar</span>
        <button type="button" class="icone" aria-label="Fechar busca" onclick={fecharBusca}>
          <Icone nome="fechar" />
        </button>
      </div>

      <form onsubmit={buscar}>
        <Icone nome="busca" tamanho={22} />
        <input
          bind:this={campoBusca}
          bind:value={termo}
          type="search"
          placeholder="O que você procura?"
          aria-label="Termo de busca"
        />
        <button class="btn" type="submit">Buscar</button>
      </form>

      <div class="sugestoes">
        <span class="rotulo">Buscas populares</span>
        <div class="chips">
          {#each ['Camiseta', 'Algodão', 'Preto', 'Básico'] as sugestao (sugestao)}
            <button type="button" class="chip" onclick={() => irParaBusca(sugestao)}>
              {sugestao}
            </button>
          {/each}
        </div>
      </div>

      <p class="busca-dica">Busque por peça, cor ou tecido. <kbd>Esc</kbd> fecha a busca.</p>
    </div>
  </div>
{/if}

{#if menuAberto}
  <button
    type="button"
    class="veu-fundo"
    aria-label="Fechar menu"
    onclick={() => (menuAberto = false)}
  ></button>
  <div class="painel-menu" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="menu-topo">
      <span class="menu-marca">{NOME_LOJA}</span>
      <button
        type="button"
        class="icone"
        aria-label="Fechar menu"
        onclick={() => (menuAberto = false)}
      >
        <Icone nome="fechar" />
      </button>
    </div>

    <nav class="menu-nav" aria-label="Menu móvel">
      <a href="/">Novidades</a>
      <a href="/#destaques">Essenciais</a>
      <a href="/favoritos">Favoritos <span>{favoritos.quantidade}</span></a>
      <a href="/carrinho">Sacola <span>{carrinho.quantidade}</span></a>
      <a href="/ajuda">Ajuda</a>
      <a href="/#sobre">Sobre</a>
    </nav>

    <div class="menu-rodape">
      <p class="rotulo">Fale com a gente</p>
      <a href="mailto:{EMAIL_CONTATO}">{EMAIL_CONTATO}</a>
      <span>{INSTAGRAM}</span>
    </div>
  </div>
{/if}

<style>
  /* ---------- Faixa superior ---------- */
  .aviso {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem 0.9rem;
    padding: 0.7rem 1rem;
    background: var(--tinta);
    color: var(--papel-2);
    font: 400 0.6rem/1.4 var(--texto);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-align: center;
  }

  .aviso-sep {
    opacity: 0.45;
  }

  /* ---------- Cabeçalho ---------- */
  .topo {
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in srgb, var(--papel) 97%, transparent);
    border-bottom: 1px solid transparent;
    backdrop-filter: blur(14px);
    transition:
      border-color 300ms ease,
      background 300ms ease;
  }

  .topo.compacto {
    border-bottom-color: var(--linha);
  }

  .barra {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas: 'nav marca acoes';
    align-items: center;
    gap: 1rem;
    height: 88px;
    transition: height 300ms ease;
  }

  .nav {
    grid-area: nav;
    justify-self: start;
  }

  .barra .menu-btn {
    grid-area: menu;
    display: none;
  }

  .topo.compacto .barra {
    height: 68px;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .nav a {
    position: relative;
    padding-block: 0.4rem;
    color: var(--tinta-suave);
    font: 400 0.65rem/1 var(--texto);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    transition: color var(--transicao);
  }

  .nav a::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: var(--tinta);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 320ms cubic-bezier(0.2, 0.6, 0.2, 1);
  }

  .nav a:hover,
  .nav a.ativo {
    color: var(--tinta);
  }

  .nav a:hover::after,
  .nav a.ativo::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  .marca {
    grid-area: marca;
    justify-self: center;
    display: grid;
    justify-items: center;
    font-family: var(--titulo);
    font-size: 1.95rem;
    font-weight: 500;
    letter-spacing: 0.32em;
    text-indent: 0.32em;
    line-height: 1;
    color: var(--tinta);
  }

  .marca small {
    margin-top: 0.4rem;
    color: var(--suave);
    font: 400 0.47rem/1 var(--texto);
    letter-spacing: 0.46em;
    text-indent: 0.46em;
    text-transform: uppercase;
  }

  .acoes {
    grid-area: acoes;
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 0.15rem;
  }

  .icone {
    position: relative;
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 50%;
    background: none;
    color: var(--tinta);
    transition: background var(--transicao);
  }

  .icone:hover {
    background: var(--papel-2);
  }

  .contador {
    position: absolute;
    top: 3px;
    right: 2px;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    border-radius: 99px;
    background: var(--acento);
    color: var(--branco);
    font: 500 0.58rem/17px var(--texto);
    letter-spacing: 0;
    text-align: center;
  }

  /* ---------- Camadas (busca e menu) ---------- */
  .veu-fundo {
    position: fixed;
    inset: 0;
    z-index: 60;
    border: 0;
    padding: 0;
    background: rgb(26 24 21 / 0.55);
    backdrop-filter: blur(6px);
    animation: aparecer 200ms ease;
  }

  .painel-busca {
    position: fixed;
    inset: 0 0 auto;
    z-index: 70;
    min-height: 56vh;
    padding-block: 2rem 2.25rem;
    background: var(--papel);
    border-bottom: 1px solid var(--linha);
    box-shadow: var(--sombra);
    animation: descer 260ms cubic-bezier(0.2, 0.6, 0.2, 1);
  }

  .painel-busca .container {
    display: flex;
    flex-direction: column;
    min-height: calc(56vh - 4.25rem);
  }

  .busca-dica {
    margin-top: auto;
    padding-top: 2.5rem;
    color: var(--suave);
    font-size: 0.75rem;
    letter-spacing: 0.02em;
  }

  .busca-dica kbd {
    padding: 0.15rem 0.4rem;
    border: 1px solid var(--linha-forte);
    font: inherit;
    font-size: 0.68rem;
    letter-spacing: 0.06em;
  }

  .painel-topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .painel-busca form {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1.1rem;
    border-bottom: 1px solid var(--linha-forte);
  }

  .painel-busca form input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: none;
    outline: none;
    font-family: var(--titulo);
    font-size: clamp(1.5rem, 3.4vw, 2.4rem);
    letter-spacing: -0.01em;
    color: var(--tinta);
  }

  .painel-busca form input::placeholder {
    color: #b3aa9e;
  }

  .painel-busca form input::-webkit-search-cancel-button {
    cursor: pointer;
  }

  .sugestoes {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.9rem;
    margin-top: 1.5rem;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .chip {
    padding: 0.5rem 0.95rem;
    border: 1px solid var(--linha-forte);
    border-radius: 999px;
    background: transparent;
    color: var(--tinta-suave);
    font-size: 0.78rem;
    transition:
      background var(--transicao),
      border-color var(--transicao),
      color var(--transicao);
  }

  .chip:hover {
    background: var(--tinta);
    border-color: var(--tinta);
    color: var(--branco);
  }

  .painel-menu {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 70;
    display: flex;
    flex-direction: column;
    width: min(88vw, 390px);
    padding: 1.4rem 1.6rem 2rem;
    background: var(--papel);
    animation: deslizar 300ms cubic-bezier(0.2, 0.6, 0.2, 1);
    overflow-y: auto;
  }

  .menu-topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1.4rem;
    border-bottom: 1px solid var(--linha);
  }

  .menu-marca {
    font-family: var(--titulo);
    font-size: 1.4rem;
    letter-spacing: 0.28em;
    text-indent: 0.28em;
    text-transform: uppercase;
  }

  .menu-nav {
    display: grid;
    margin-block: 1.5rem;
  }

  .menu-nav a {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 0.95rem;
    border-bottom: 1px solid var(--linha);
    font-family: var(--titulo);
    font-size: 1.65rem;
    line-height: 1.1;
  }

  .menu-nav a span {
    font-family: var(--texto);
    font-size: 0.75rem;
    color: var(--suave);
  }

  .menu-rodape {
    display: grid;
    gap: 0.4rem;
    margin-top: auto;
    padding-top: 1.5rem;
    font-size: 0.85rem;
  }

  .menu-rodape a {
    border-bottom: 1px solid var(--linha-forte);
    justify-self: start;
    padding-bottom: 1px;
  }

  .menu-rodape span {
    color: var(--suave);
  }

  /* ---------- Rodapé ---------- */
  .rodape {
    margin-top: 6rem;
    background: var(--papel-2);
    border-top: 1px solid var(--linha);
  }

  .newsletter {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    align-items: center;
    gap: 3rem;
    padding-block: 3.75rem;
    border-bottom: 1px solid var(--linha);
  }

  .news-texto h2 {
    margin: 0.6rem 0 0.7rem;
    font-size: clamp(1.9rem, 3vw, 2.5rem);
  }

  .news-texto p:last-child {
    max-width: 46ch;
    color: var(--suave);
    font-size: 0.9rem;
  }

  .news-form {
    display: flex;
    gap: 0.6rem;
  }

  .news-form input {
    flex: 1;
    min-width: 0;
    padding: 1rem 1.1rem;
    border: 1px solid var(--linha-forte);
    background: var(--branco);
    font-size: 0.9rem;
  }

  .news-form input:focus {
    outline: none;
    border-color: var(--tinta);
  }

  .news-form .btn {
    padding-inline: 1.6rem;
  }

  .news-nota {
    margin-top: 0.7rem;
    color: var(--suave);
    font-size: 0.72rem;
  }

  .news-ok {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .colunas {
    display: grid;
    grid-template-columns: 1.6fr repeat(3, 1fr);
    gap: 2.5rem;
    padding-block: 3.25rem;
  }

  .marca-rodape {
    font-family: var(--titulo);
    font-size: 1.5rem;
    letter-spacing: 0.34em;
    text-indent: 0.34em;
    text-transform: uppercase;
  }

  .marca-texto {
    max-width: 34ch;
    margin-top: 0.8rem;
    color: var(--suave);
    font-size: 0.84rem;
    line-height: 1.75;
  }

  .sociais {
    display: grid;
    gap: 0.5rem;
    margin-top: 1.4rem;
    color: var(--tinta-suave);
    font-size: 0.8rem;
  }

  .sociais span,
  .sociais a {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
  }

  .coluna h3 {
    margin-bottom: 1rem;
    font: 500 0.64rem/1 var(--texto);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tinta);
  }

  .coluna ul {
    display: grid;
    gap: 0.6rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .coluna a {
    color: var(--suave);
    font-size: 0.84rem;
    transition: color var(--transicao);
  }

  .coluna a:hover {
    color: var(--tinta);
  }

  .base {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem 1.5rem;
    padding-block: 1.5rem 2rem;
    border-top: 1px solid var(--linha);
    color: var(--suave);
    font-size: 0.7rem;
  }

  .pagamentos {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .pagamentos span {
    padding: 0.35rem 0.6rem;
    border: 1px solid var(--linha-forte);
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  @media (max-width: 900px) {
    .nav {
      display: none;
    }

    .barra {
      grid-template-columns: auto 1fr auto;
      grid-template-areas: 'menu marca acoes';
      height: 70px;
    }

    .barra .menu-btn {
      display: grid;
    }

    .topo.compacto .barra {
      height: 62px;
    }

    .marca {
      font-size: 1.55rem;
      letter-spacing: 0.26em;
      text-indent: 0.26em;
    }

    .marca small {
      display: none;
    }

    .newsletter {
      grid-template-columns: 1fr;
      gap: 1.75rem;
      padding-block: 2.75rem;
    }

    .colunas {
      grid-template-columns: 1fr 1fr;
      gap: 2.25rem 1.5rem;
      padding-block: 2.5rem;
    }

    .marca-coluna {
      grid-column: 1 / -1;
    }

    .base {
      flex-direction: column;
      align-items: flex-start;
    }

    .base-meio {
      display: none;
    }
  }

  @media (max-width: 520px) {
    .aviso span:nth-child(n + 3) {
      display: none;
    }

    .news-form {
      flex-direction: column;
    }

    .colunas {
      grid-template-columns: 1fr;
    }
  }
</style>

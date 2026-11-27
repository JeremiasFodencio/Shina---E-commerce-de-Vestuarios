<script>
  import { brl, parcela } from '$lib/formato.js';
  import { NOME_LOJA, FRETE_GRATIS, PARCELAS } from '$lib/config.js';
  import ProdutoCartao from '$lib/ProdutoCartao.svelte';
  import Icone from '$lib/Icone.svelte';

  let { data } = $props();

  const destaque = $derived(
    data.produtos.find((p) => p.imagem_url) ?? data.produtos[0] ?? null
  );

  function link(pagina) {
    const params = new URLSearchParams();
    if (data.q) params.set('q', data.q);
    if (pagina > 1) params.set('pagina', pagina);
    const s = params.toString();
    return s ? `/?${s}` : '/';
  }
</script>

<svelte:head>
  <title>{NOME_LOJA} — Essenciais atemporais</title>
  <meta
    name="description"
    content="Peças em fibras naturais, feitas em pequenos lotes. Conheça a coleção de essenciais da Shina."
  />
</svelte:head>

<section class="hero">
  <div class="hero-texto">
    <p class="rotulo">Coleção 20XX · Essenciais</p>
    <h1>Peças que <em>duram</em> mais do que uma estação.</h1>
    <p class="hero-sub">
      Algodão, linho e caimentos que atravessam o tempo. Produção em pequenos lotes,
      pensada para vestir o cotidiano — não a próxima tendência.
    </p>
    <div class="hero-acoes">
      <a class="btn" href="#destaques">Explorar coleção</a>
      <a class="btn-texto" href="#sobre">Nossa história <Icone nome="seta" tamanho={16} /></a>
    </div>
    <p class="hero-nota">
      Frete grátis acima de {brl(FRETE_GRATIS)} · Trocas em até 30 dias
    </p>
  </div>

  <div class="hero-visual">
    <div class="moldura">
      {#if destaque?.imagem_url}
        <img src={destaque.imagem_url} alt={destaque.nome} />
      {:else}
        <div class="hero-monograma" aria-hidden="true">
          <span>S</span>
          <small>{NOME_LOJA}</small>
        </div>
      {/if}
      <span class="hero-legenda">Outono · Inverno 25</span>
    </div>

    {#if destaque}
      <a class="etiqueta-flutuante" href="/produto/{destaque.slug}">
        <span class="rotulo">Em destaque</span>
        <strong>{destaque.nome}</strong>
        <span class="etiqueta-preco">{brl(destaque.preco_centavos)}</span>
      </a>
    {/if}
  </div>
</section>

<ul class="beneficios">
  <li>
    <Icone nome="caminhao" tamanho={22} />
    <div><strong>Frete grátis</strong><span>acima de {brl(FRETE_GRATIS)}</span></div>
  </li>
  <li>
    <Icone nome="troca" tamanho={22} />
    <div><strong>Trocas fáceis</strong><span>em até 30 dias</span></div>
  </li>
  <li>
    <Icone nome="escudo" tamanho={22} />
    <div><strong>Pagamento seguro</strong><span>Pix e cartão</span></div>
  </li>
  <li>
    <Icone nome="coracao" tamanho={22} />
    <div><strong>Feito com cuidado</strong><span>pequenos lotes</span></div>
  </li>
</ul>

<section id="destaques" class="secao">
  <div class="secao-topo">
    <div>
      <p class="rotulo">Catálogo</p>
      <h2>Novidades</h2>
    </div>

    <form class="busca" method="GET" action="/" role="search">
      <Icone nome="busca" tamanho={17} />
      <label class="sr" for="busca-catalogo">Buscar no catálogo</label>
      <input id="busca-catalogo" name="q" value={data.q} placeholder="Buscar por peça" />
      <button class="busca-enviar" type="submit">Buscar</button>
    </form>
  </div>

  {#if data.q}
    <p class="resultado">
      {data.produtos.length}
      {data.produtos.length === 1 ? 'peça encontrada' : 'peças encontradas'} para
      <strong>“{data.q}”</strong> · <a class="link" href="/">limpar busca</a>
    </p>
  {/if}

  {#if data.produtos.length === 0}
    <div class="vazio-caixa">
      <Icone nome="busca" tamanho={26} />
      <h3>Nada encontrado por aqui</h3>
      <p>
        Não temos peças com esse termo{#if data.q} — tente outra palavra ou veja o catálogo
        completo{/if}.
      </p>
      <a class="btn btn-secundario" href="/">Ver todo o catálogo</a>
    </div>
  {:else}
    <ul class="grade">
      {#each data.produtos as p, i (p.id)}
        <ProdutoCartao produto={p} indice={i} />
      {/each}
    </ul>

    {#if data.pagina > 1 || data.temMais}
      <nav class="paginacao" aria-label="Paginação">
        {#if data.pagina > 1}
          <a class="pagina" href={link(data.pagina - 1)}>
            <Icone nome="seta-esquerda" tamanho={16} /> Anterior
          </a>
        {:else}
          <span></span>
        {/if}

        <span class="pagina-atual">Página {data.pagina}</span>

        {#if data.temMais}
          <a class="pagina" href={link(data.pagina + 1)}>
            Próxima <Icone nome="seta" tamanho={16} />
          </a>
        {:else}
          <span></span>
        {/if}
      </nav>
    {/if}
  {/if}
</section>

<section id="sobre" class="sobre">
  <div class="sobre-citacao">
    <span class="aspa" aria-hidden="true">“</span>
    <p>Menos peças,<br />mais uso.</p>
    <span class="rotulo sobre-rotulo">Filosofia Shina</span>
  </div>

  <div class="sobre-texto">
    <p class="rotulo">A Shina</p>
    <h2>Feito para vestir o cotidiano, não a próxima tendência.</h2>
    <p class="sobre-desc">
      Nascemos de uma ideia simples: roupas que você usa muitas vezes, combina de
      muitos jeitos e continua querendo vestir. Escolhemos fibras naturais, caimentos
      confortáveis e uma paleta que não cansa.
    </p>

    <ul class="lista-check">
      <li><Icone nome="check" tamanho={16} /> Fibras naturais e fornecedores próximos</li>
      <li><Icone nome="check" tamanho={16} /> Pequenos lotes, sem desperdício</li>
      <li><Icone nome="check" tamanho={16} /> Peças pensadas para durar anos</li>
    </ul>

    <a class="btn-texto sobre-link" href="mailto:ola@shina.com.br">
      Falar com a gente <Icone nome="seta" tamanho={16} />
    </a>
  </div>
</section>

<style>
  /* ---------- Hero ---------- */
  .hero {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    gap: 4.5rem;
    padding-block: 4.5rem 3.75rem;
  }

  .hero-texto {
    animation: surgir 700ms cubic-bezier(0.2, 0.6, 0.2, 1) both;
  }

  .hero h1 {
    margin: 1.1rem 0 1.4rem;
    font-size: clamp(2.7rem, 5.4vw, 4.4rem);
    line-height: 0.98;
    letter-spacing: -0.02em;
    max-width: 15ch;
  }

  .hero h1 em {
    font-style: italic;
    font-weight: 400;
  }

  .hero-sub {
    max-width: 43ch;
    color: var(--suave);
    font-size: 0.98rem;
    line-height: 1.8;
  }

  .hero-acoes {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 2.1rem;
  }

  .hero-nota {
    margin-top: 1.6rem;
    color: var(--suave);
    font-size: 0.72rem;
    letter-spacing: 0.06em;
  }

  .hero-visual {
    position: relative;
    padding: 0 1.5rem 2.5rem 0;
    animation: surgir 900ms 120ms cubic-bezier(0.2, 0.6, 0.2, 1) both;
  }

  .hero-visual::before {
    content: '';
    position: absolute;
    inset: 2.5rem -0.5rem 0 2.5rem;
    border: 1px solid var(--linha-forte);
    pointer-events: none;
  }

  .moldura {
    position: relative;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    background: linear-gradient(155deg, #efe9df, #ddd1bf);
    box-shadow: var(--sombra);
  }

  .moldura img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-monograma {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 0.6rem;
    color: #a3927c;
  }

  .hero-monograma::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      112deg,
      rgb(255 255 255 / 0.18) 0 1px,
      transparent 1px 11px
    );
    mix-blend-mode: soft-light;
  }

  .hero-monograma span {
    font-family: var(--titulo);
    font-size: clamp(7rem, 16vw, 12rem);
    line-height: 0.8;
  }

  .hero-monograma small {
    font-size: 0.58rem;
    letter-spacing: 0.5em;
    text-indent: 0.5em;
    text-transform: uppercase;
  }

  .hero-legenda {
    position: absolute;
    right: 1.1rem;
    bottom: 1.1rem;
    color: rgb(251 250 247 / 0.92);
    font-size: 0.58rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    writing-mode: vertical-rl;
  }

  .etiqueta-flutuante {
    position: absolute;
    left: -1.75rem;
    bottom: 1.5rem;
    display: grid;
    gap: 0.25rem;
    max-width: 15rem;
    padding: 1.1rem 1.35rem;
    background: var(--papel);
    border: 1px solid var(--linha);
    box-shadow: var(--sombra);
    transition: transform var(--transicao);
  }

  .etiqueta-flutuante:hover {
    transform: translateY(-3px);
  }

  .etiqueta-flutuante strong {
    font-family: var(--titulo);
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.15;
  }

  .etiqueta-preco {
    color: var(--suave);
    font-size: 0.8rem;
  }

  /* ---------- Benefícios ---------- */
  .beneficios {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin: 1rem 0 0;
    padding: 1.6rem 0;
    border-block: 1px solid var(--linha);
    list-style: none;
  }

  .beneficios li {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    color: var(--tinta-suave);
  }

  .beneficios li + li {
    padding-left: 1.5rem;
    border-left: 1px solid var(--linha);
  }

  .beneficios div {
    display: grid;
  }

  .beneficios strong {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .beneficios span {
    color: var(--suave);
    font-size: 0.74rem;
  }

  /* ---------- Catálogo ---------- */
  .secao {
    padding-top: 4.5rem;
  }

  .secao-topo {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
    padding-bottom: 1.35rem;
    margin-bottom: 2.25rem;
    border-bottom: 1px solid var(--linha);
  }

  .secao-topo h2 {
    margin-top: 0.4rem;
    font-size: clamp(2rem, 3.4vw, 2.8rem);
  }

  .busca {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-width: 260px;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid var(--linha-forte);
    color: var(--suave);
  }

  .busca input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: none;
    padding: 0.2rem 0;
    font-size: 0.88rem;
    color: var(--tinta);
  }

  .busca input:focus {
    outline: none;
  }

  .busca input::placeholder {
    color: #a49c91;
  }

  .busca-enviar {
    border: 0;
    background: none;
    padding: 0;
    color: var(--tinta);
    font: 500 0.62rem/1 var(--texto);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--tinta);
  }

  .resultado {
    margin: -1rem 0 2rem;
    color: var(--suave);
    font-size: 0.85rem;
  }

  .grade {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2.75rem 1.5rem;
  }

  .paginacao {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 3.25rem;
    padding-top: 1.75rem;
    border-top: 1px solid var(--linha);
  }

  .pagina {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    font: 500 0.64rem/1 var(--texto);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    border-bottom: 1px solid transparent;
    padding-bottom: 3px;
    transition: border-color var(--transicao);
  }

  .pagina:hover {
    border-bottom-color: var(--tinta);
  }

  .pagina-atual {
    color: var(--suave);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  /* ---------- Sobre ---------- */
  .sobre {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 3.5rem;
    margin-top: 6rem;
    padding: 3.75rem;
    background: var(--tinta);
    color: #f4efe6;
  }

  .sobre-citacao {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
    padding-right: 2rem;
    border-right: 1px solid rgb(244 239 230 / 0.18);
  }

  .aspa {
    font-family: var(--titulo);
    font-size: 5rem;
    line-height: 0.5;
    color: var(--areia-2);
    opacity: 0.6;
  }

  .sobre-citacao p {
    font-family: var(--titulo);
    font-size: clamp(2.2rem, 4vw, 3.4rem);
    line-height: 1.05;
    letter-spacing: -0.015em;
  }

  .sobre-rotulo {
    color: rgb(244 239 230 / 0.55);
  }

  .sobre-texto .rotulo {
    color: rgb(244 239 230 / 0.6);
  }

  .sobre-texto h2 {
    margin: 0.9rem 0 1.3rem;
    max-width: 20ch;
    font-size: clamp(1.8rem, 2.7vw, 2.4rem);
  }

  .sobre-desc {
    max-width: 48ch;
    color: rgb(244 239 230 / 0.72);
    font-size: 0.92rem;
    line-height: 1.85;
  }

  .lista-check {
    display: grid;
    gap: 0.7rem;
    margin: 1.75rem 0;
    padding: 0;
    list-style: none;
    font-size: 0.86rem;
    color: rgb(244 239 230 / 0.88);
  }

  .lista-check li {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .lista-check li :global(svg) {
    color: var(--areia-2);
    flex: none;
  }

  .sobre-link {
    color: #f4efe6;
    border-color: rgb(244 239 230 / 0.5);
  }

  .sobre-link:hover {
    border-color: #f4efe6;
  }

  /* ---------- Responsivo ---------- */
  @media (max-width: 1000px) {
    .hero {
      gap: 2.5rem;
    }

    .grade {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 900px) {
    .hero {
      grid-template-columns: 1fr;
      gap: 3rem;
      padding-block: 2.5rem;
    }

    .hero h1 {
      max-width: 18ch;
    }

    .hero-visual {
      max-width: 440px;
      margin-inline: auto;
      width: 100%;
    }

    .beneficios {
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }

    .beneficios li:nth-child(odd) {
      padding-left: 0;
      border-left: 0;
    }

    .sobre {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding: 2.5rem 1.75rem;
    }

    .sobre-citacao {
      padding: 0 0 2rem;
      border-right: 0;
      border-bottom: 1px solid rgb(244 239 230 / 0.18);
    }

    .grade {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.25rem 1rem;
    }
  }

  @media (max-width: 640px) {
    .secao-topo {
      flex-direction: column;
      align-items: stretch;
      gap: 1.25rem;
    }

    .busca {
      min-width: 0;
    }

    .beneficios {
      grid-template-columns: 1fr;
    }

    .beneficios li + li {
      padding-left: 0;
      padding-top: 1.1rem;
      border-left: 0;
      border-top: 1px solid var(--linha);
    }

    .etiqueta-flutuante {
      left: 0.75rem;
      bottom: 1rem;
      padding: 0.9rem 1.1rem;
    }

    .hero-visual {
      padding-right: 0.75rem;
    }

    .hero-visual::before {
      display: none;
    }
  }
</style>

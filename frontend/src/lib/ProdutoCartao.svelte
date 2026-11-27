<script>
  import { brl, parcela } from '$lib/formato.js';
  import { PARCELAS } from '$lib/config.js';
  import { favoritos } from '$lib/favoritos.svelte.js';
  import Icone from '$lib/Icone.svelte';

  let { produto, indice = 0 } = $props();

  const PALETAS = [
    ['#f0eae0', '#dfd4c3'],
    ['#e9e2d7', '#d6cab8'],
    ['#f2ede5', '#e4dbcd'],
    ['#e6ddd0', '#d2c5b1']
  ];

  const paleta = $derived(
    PALETAS[(produto.nome.charCodeAt(0) + indice) % PALETAS.length] ?? PALETAS[0]
  );
  const favorito = $derived(favoritos.tem(produto.id));
</script>

<li class="cartao">
  <div class="midia">
    <a class="midia-link" href="/produto/{produto.slug}" aria-label="Ver {produto.nome}">
      {#if produto.imagem_url}
        <img
          src={produto.imagem_url}
          alt={produto.nome}
          loading="lazy"
          decoding="async"
        />
      {:else}
        <span class="monograma" style={`--a:${paleta[0]};--b:${paleta[1]}`}>
          <span aria-hidden="true">{produto.nome[0]}</span>
        </span>
      {/if}
      <span class="veu" aria-hidden="true">Ver peça</span>
    </a>

    <button
      type="button"
      class="coracao"
      class:ativo={favorito}
      aria-pressed={favorito}
      aria-label={favorito ? `Remover ${produto.nome} dos favoritos` : `Favoritar ${produto.nome}`}
      onclick={() => favoritos.alternar(produto)}
    >
      <Icone nome="coracao" tamanho={17} cheio={favorito} />
    </button>

    {#if produto.estoque_total === 0}
      <span class="selo escuro">Esgotado</span>
    {/if}
  </div>

  <a class="info" href="/produto/{produto.slug}">
    <h3>{produto.nome}</h3>
    <p class="preco">{brl(produto.preco_centavos)}</p>
    <p class="parcelas">
      ou {PARCELAS}× de {brl(parcela(produto.preco_centavos))} sem juros
    </p>
  </a>
</li>

<style>
  .cartao {
    position: relative;
    display: grid;
    gap: 0.95rem;
  }

  .midia {
    position: relative;
    overflow: hidden;
    aspect-ratio: 3 / 4;
    background: var(--papel-2);
  }

  .midia-link {
    display: block;
    height: 100%;
  }

  .midia img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 900ms cubic-bezier(0.2, 0.6, 0.2, 1);
  }

  .cartao:hover .midia img {
    transform: scale(1.045);
  }

  .monograma {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: linear-gradient(155deg, var(--a), var(--b));
    color: #a99b87;
  }

  .monograma::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      115deg,
      rgb(255 255 255 / 0.14) 0 1px,
      transparent 1px 9px
    );
    mix-blend-mode: soft-light;
  }

  .monograma span {
    font-family: var(--titulo);
    font-size: clamp(3.4rem, 8vw, 5.4rem);
    line-height: 1;
    position: relative;
    z-index: 1;
  }

  .veu {
    position: absolute;
    inset: auto 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.4rem 1rem 1.1rem;
    background: linear-gradient(to top, rgb(26 24 21 / 0.6), transparent);
    color: var(--branco);
    font: 500 0.62rem/1 var(--texto);
    letter-spacing: 0.24em;
    text-transform: uppercase;
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 260ms ease,
      transform 260ms ease;
  }

  .cartao:hover .veu,
  .cartao:focus-within .veu {
    opacity: 1;
    transform: none;
  }

  .coracao {
    position: absolute;
    top: 0.7rem;
    right: 0.7rem;
    display: grid;
    place-items: center;
    width: 2.35rem;
    height: 2.35rem;
    border: 0;
    border-radius: 50%;
    background: rgb(251 250 247 / 0.92);
    color: var(--tinta);
    opacity: 0;
    transform: translateY(-4px);
    transition:
      opacity 220ms ease,
      transform 220ms ease,
      color 220ms ease;
  }

  .cartao:hover .coracao,
  .cartao:focus-within .coracao,
  .coracao.ativo {
    opacity: 1;
    transform: none;
  }

  .coracao.ativo {
    color: var(--acento);
  }

  .selo {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.4rem 0.6rem;
    background: var(--papel);
    color: var(--tinta);
    font: 500 0.58rem/1 var(--texto);
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .selo.escuro {
    background: var(--tinta);
    color: var(--branco);
  }

  .info {
    display: grid;
    gap: 0.28rem;
  }

  .info h3 {
    font-size: 0.92rem;
    font-weight: 400;
    letter-spacing: 0.01em;
    color: var(--tinta);
  }

  .info:hover h3 {
    text-decoration: underline;
    text-underline-offset: 5px;
    text-decoration-color: var(--linha-forte);
  }

  .preco {
    font-size: 0.88rem;
    color: var(--tinta-suave);
    font-variant-numeric: tabular-nums;
  }

  .parcelas {
    font-size: 0.74rem;
    color: var(--suave);
  }

  @media (hover: none) {
    .coracao {
      opacity: 1;
      transform: none;
    }
  }
</style>

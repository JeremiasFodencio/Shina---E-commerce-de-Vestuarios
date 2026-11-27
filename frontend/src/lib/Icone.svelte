<script>
  let { nome, tamanho = 20, cheio = false, ...resto } = $props();
</script>

<svg
  width={tamanho}
  height={tamanho}
  viewBox="0 0 24 24"
  fill={cheio ? 'currentColor' : 'none'}
  stroke="currentColor"
  stroke-width="1.4"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
  {...resto}
>
  {#if nome === 'busca'}
    <circle cx="11" cy="11" r="7" />
    <path d="m16.5 16.5 4.5 4.5" />
  {:else if nome === 'sacola'}
    <path d="M5.5 8h13l1 12.5h-15L5.5 8Z" />
    <path d="M9 8V5.8a3 3 0 0 1 6 0V8" />
  {:else if nome === 'coracao'}
    <path
      d="M12 20.5S3.5 15.3 3.5 9.6A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.5 3c0 5.7-8.5 10.9-8.5 10.9Z"
    />
  {:else if nome === 'menu'}
    <path d="M3 7h18M3 12h18M3 17h13" />
  {:else if nome === 'fechar'}
    <path d="m5 5 14 14M19 5 5 19" />
  {:else if nome === 'seta'}
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  {:else if nome === 'seta-esquerda'}
    <path d="M20 12H5" />
    <path d="m11 6-6 6 6 6" />
  {:else if nome === 'chevron'}
    <path d="m6 9 6 6 6-6" />
  {:else if nome === 'mais'}
    <path d="M12 5v14M5 12h14" />
  {:else if nome === 'menos'}
    <path d="M5 12h14" />
  {:else if nome === 'lixeira'}
    <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6" />
  {:else if nome === 'check'}
    <path d="m20 6-11 11-5-5" />
  {:else if nome === 'caminhao'}
    <path d="M2 6.5h12.5v10H2z" />
    <path d="M14.5 10h4l3 3v3.5h-7z" />
    <circle cx="6" cy="18.5" r="1.8" />
    <circle cx="17.5" cy="18.5" r="1.8" />
  {:else if nome === 'troca'}
    <path d="M4 8h13l-3-3M20 16H7l3 3" />
  {:else if nome === 'escudo'}
    <path d="M12 3.5 19 6v6.2c0 4.3-2.9 7.3-7 8.3-4.1-1-7-4-7-8.3V6l7-2.5Z" />
    <path d="m9.2 12 2 2 3.6-4" />
  {:else if nome === 'instagram'}
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  {:else if nome === 'email'}
    <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
    <path d="m3 6 9 7 9-7" />
  {:else if nome === 'copiar'}
    <rect x="9" y="9" width="11" height="11" rx="1.5" />
    <path d="M15 9V5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15H9" />
  {:else if nome === 'relogio'}
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  {:else if nome === 'local'}
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  {:else if nome === 'sino'}
    <path d="M18 9a6 6 0 1 0-12 0c0 6-3 7-3 7h18s-3-1-3-7Z" />
    <path d="M10 20a2.2 2.2 0 0 0 4 0" />
  {/if}
</svg>

<script>
  import { onMount } from 'svelte';
  import { admin, lerChave, salvarChave, sairAdmin } from '$lib/admin.js';
  import { brl } from '$lib/formato.js';
  import { env } from '$env/dynamic/public';
  import Icone from '$lib/Icone.svelte';

  // Modo demonstração: se esta variável existir, a chave aparece na tela de login
  const chaveDemo = env.PUBLIC_ADMIN_DEMO_KEY ?? '';

  const STATUS = [
    ['pendente', 'Aguardando pagamento'],
    ['pago', 'Pago'],
    ['enviado', 'Enviado'],
    ['cancelado', 'Cancelado']
  ];
  const TIPOS_IMAGEM = 'image/jpeg,image/png,image/webp';
  const MAX_IMAGEM = 5 * 1024 * 1024;

  let autenticado = $state(false);
  let chaveInput = $state('');
  let aba = $state('produtos');
  let produtos = $state([]);
  let pedidos = $state([]);
  let enviando = $state(false);
  let msg = $state({ tipo: '', texto: '' });

  const avisar = (tipo, texto) => (msg = { tipo, texto });
  const reaisParaCentavos = (v) => Math.round(parseFloat(String(v).replace(',', '.')) * 100);

  const semAcento = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const slugify = (s) =>
    semAcento(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  const codigo = (s) =>
    semAcento(s)
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '');

  function prepararProdutos(lista) {
    return lista.map((p) => ({
      ...p,
      precoReais: (p.preco_centavos / 100).toFixed(2).replace('.', ','),
      novaVar: { sku: '', tamanho: '', cor: '', estoque: 0 }
    }));
  }

  async function carregar() {
    try {
      const [ps, pd] = await Promise.all([admin.produtos(), admin.pedidos()]);
      produtos = prepararProdutos(ps);
      pedidos = pd;
      autenticado = true;
    } catch (e) {
      if (e.status === 401) {
        sairAdmin();
        autenticado = false;
        avisar('erro', 'Chave de administração incorreta.');
      } else {
        avisar('erro', e.message);
      }
    }
  }

  onMount(() => {
    if (lerChave()) carregar();
  });

  async function entrar(ev) {
    ev.preventDefault();
    salvarChave(chaveInput.trim());
    msg = { tipo: '', texto: '' };
    await carregar();
  }

  function sair() {
    sairAdmin();
    autenticado = false;
    chaveInput = '';
    produtos = [];
    pedidos = [];
    msg = { tipo: '', texto: '' };
  }

  async function executar(fn, sucesso) {
    try {
      await fn();
      avisar('ok', sucesso);
    } catch (e) {
      avisar('erro', e.message);
    }
    await carregar();
  }

  function salvarProduto(p) {
    const preco = reaisParaCentavos(p.precoReais);
    if (!(preco > 0)) return avisar('erro', 'Informe um preço válido.');
    return executar(
      () => admin.editarProduto(p.id, { nome: p.nome, preco_centavos: preco, ativo: p.ativo }),
      `“${p.nome}” salvo.`
    );
  }

  const salvarEstoque = (v) =>
    executar(
      () => admin.estoque(v.sku, Number(v.estoque) || 0),
      `Estoque de ${v.sku} atualizado.`
    );

  function adicionarVariante(p) {
    const n = p.novaVar;
    return executar(
      () =>
        admin.criarVariante(p.id, {
          sku: n.sku.trim(),
          tamanho: n.tamanho.trim(),
          cor: n.cor.trim(),
          estoque: Number(n.estoque) || 0
        }),
      'Variante adicionada.'
    );
  }

  async function mudarStatus(ped, novo) {
    if (
      novo === 'cancelado' &&
      !confirm('Cancelar o pedido devolve os itens ao estoque e não pode ser desfeito. Continuar?')
    ) {
      return carregar();
    }
    return executar(() => admin.status(ped.id, novo), 'Situação do pedido atualizada.');
  }

  // ----- Imagens -----
  async function subir(arquivo) {
    if (arquivo.size > MAX_IMAGEM) {
      avisar('erro', 'A imagem deve ter até 5 MB.');
      return null;
    }
    enviando = true;
    try {
      const r = await admin.enviarImagem(arquivo);
      avisar('ok', 'Imagem enviada.');
      return r.url;
    } catch (e) {
      avisar('erro', e.message);
      return null;
    } finally {
      enviando = false;
    }
  }

  async function imagemNovo(ev) {
    const arquivo = ev.currentTarget.files?.[0];
    if (!arquivo) return;
    const url = await subir(arquivo);
    if (url) novo.imagem_url = url;
  }

  async function trocarImagem(p, ev) {
    const arquivo = ev.currentTarget.files?.[0];
    if (!arquivo) return;
    const url = await subir(arquivo);
    if (url) {
      await executar(
        () => admin.editarProduto(p.id, { imagem_url: url }),
        'Imagem do produto atualizada.'
      );
    }
  }

  // ----- Novo produto -----
  const vazio = () => ({
    nome: '',
    slug: '',
    preco: '',
    descricao: '',
    imagem_url: '',
    prefixo: '',
    tamanhos: 'P, M, G',
    cores: '',
    estoquePadrao: 5,
    variantes: []
  });
  let novo = $state(vazio());
  const slugFinal = $derived(novo.slug.trim() || slugify(novo.nome));

  function gerarGrade() {
    const lista = (s) =>
      s
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);
    const tams = lista(novo.tamanhos);
    const cores = lista(novo.cores);
    if (!tams.length || !cores.length)
      return avisar('erro', 'Informe ao menos um tamanho e uma cor.');
    const base = codigo(novo.prefixo || novo.nome).slice(0, 12) || 'PRD';
    novo.variantes = cores.flatMap((c) =>
      tams.map((t) => ({
        sku: `${base}-${codigo(c)}-${codigo(t)}`,
        tamanho: t,
        cor: c,
        estoque: Number(novo.estoquePadrao) || 0
      }))
    );
  }

  async function criarProduto(ev) {
    ev.preventDefault();
    const preco = reaisParaCentavos(novo.preco);
    if (!(preco > 0)) return avisar('erro', 'Informe um preço válido.');
    if (novo.variantes.length === 0)
      return avisar('erro', 'Gere a grade ou adicione ao menos uma variante.');
    try {
      await admin.criarProduto({
        nome: novo.nome.trim(),
        slug: slugFinal,
        descricao: novo.descricao.trim() || null,
        imagem_url: novo.imagem_url.trim() || null,
        preco_centavos: preco,
        variantes: novo.variantes.map((v) => ({
          sku: v.sku.trim(),
          tamanho: v.tamanho.trim(),
          cor: v.cor.trim(),
          estoque: Number(v.estoque) || 0
        }))
      });
      novo = vazio();
      avisar('ok', 'Produto criado.');
      await carregar();
    } catch (e) {
      avisar('erro', e.message);
    }
  }
</script>

<svelte:head>
  <title>Administração — Shina</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="painel">
  <header class="topo-painel">
    <div>
      <p class="rotulo">Administração</p>
      <h1>Painel da loja</h1>
    </div>
    {#if autenticado}
      <button type="button" class="btn btn-secundario sair" onclick={sair}>Sair</button>
    {/if}
  </header>

  {#if msg.texto}
    <p
      class={msg.tipo === 'erro' ? 'erro-msg aviso' : 'ok aviso'}
      role={msg.tipo === 'erro' ? 'alert' : 'status'}
    >
      {msg.texto}
    </p>
  {/if}

  {#if !autenticado}
    <div class="login">
      <h2>Acesso restrito</h2>
      <p class="login-sub">
        Informe a chave de administração para gerenciar produtos, estoque e pedidos.
      </p>

      <form onsubmit={entrar}>
        <label class="campo">
          <span>Chave de administração</span>
          <input type="password" bind:value={chaveInput} required autocomplete="off" />
        </label>

        {#if chaveDemo}
          <p class="demo">
            Modo demonstração: a chave é <code>{chaveDemo}</code>
            <button type="button" class="link preencher" onclick={() => (chaveInput = chaveDemo)}>
              Preencher
            </button>
          </p>
        {/if}

        <button class="btn btn-primario btn-bloco">Entrar</button>
      </form>
    </div>
  {:else}
    <nav class="abas" aria-label="Seções do painel">
      <button
        type="button"
        class="aba"
        class:ativa={aba === 'produtos'}
        aria-current={aba === 'produtos'}
        onclick={() => (aba = 'produtos')}
      >
        Produtos <span>{produtos.length}</span>
      </button>
      <button
        type="button"
        class="aba"
        class:ativa={aba === 'pedidos'}
        aria-current={aba === 'pedidos'}
        onclick={() => (aba = 'pedidos')}
      >
        Pedidos <span>{pedidos.length}</span>
      </button>
    </nav>

    {#if aba === 'produtos'}
      <details class="cartao-bloco">
        <summary>
          <span class="resumo-titulo">Cadastrar novo produto</span>
          <Icone nome="mais" tamanho={16} />
        </summary>

        <form class="novo-produto" onsubmit={criarProduto}>
          <div class="campos dois">
            <label class="campo">
              <span>Nome</span>
              <input bind:value={novo.nome} required />
            </label>
            <label class="campo">
              <span>Endereço da página (slug)</span>
              <input bind:value={novo.slug} placeholder={slugify(novo.nome)} />
            </label>
            <label class="campo">
              <span>Preço (R$)</span>
              <input bind:value={novo.preco} inputmode="decimal" placeholder="59,90" required />
            </label>
            <label class="campo">
              <span>Descrição</span>
              <input bind:value={novo.descricao} />
            </label>
          </div>

          <div class="imagem-produto">
            <label class="campo">
              <span>Imagem do produto (JPG, PNG ou WebP, até 5 MB)</span>
              <input type="file" accept={TIPOS_IMAGEM} onchange={imagemNovo} disabled={enviando} />
            </label>
            {#if enviando}<p class="dica">Enviando imagem…</p>{/if}
            {#if novo.imagem_url}
              <img class="mini" src={novo.imagem_url} alt="Pré-visualização da imagem enviada" />
            {/if}
            <label class="campo">
              <span>Ou cole o endereço de uma imagem</span>
              <input bind:value={novo.imagem_url} type="url" placeholder="https://…" />
            </label>
          </div>

          <fieldset class="grade">
            <legend>Grade de variações</legend>
            <div class="campos dois">
              <label class="campo">
                <span>Tamanhos (separados por vírgula)</span>
                <input bind:value={novo.tamanhos} />
              </label>
              <label class="campo">
                <span>Cores (separadas por vírgula)</span>
                <input bind:value={novo.cores} placeholder="Preto, Branco" />
              </label>
              <label class="campo">
                <span>Prefixo do código SKU (opcional)</span>
                <input bind:value={novo.prefixo} placeholder="CAMBAS" />
              </label>
              <label class="campo">
                <span>Estoque inicial de cada variante</span>
                <input type="number" min="0" bind:value={novo.estoquePadrao} />
              </label>
            </div>

            <button type="button" class="btn btn-secundario gerar" onclick={gerarGrade}>
              Gerar variantes
            </button>

            {#if novo.variantes.length > 0}
              <div class="tabela-rolagem">
                <table>
                  <thead>
                    <tr>
                      <th>SKU</th><th>Tamanho</th><th>Cor</th><th>Estoque</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each novo.variantes as v, idx (idx)}
                      <tr>
                        <td><input bind:value={v.sku} aria-label="SKU" /></td>
                        <td><input bind:value={v.tamanho} aria-label="Tamanho" /></td>
                        <td><input bind:value={v.cor} aria-label="Cor" /></td>
                        <td>
                          <input type="number" min="0" bind:value={v.estoque} aria-label="Estoque" />
                        </td>
                        <td>
                          <button
                            type="button"
                            class="acao-perigo"
                            onclick={() =>
                              (novo.variantes = novo.variantes.filter((_, i) => i !== idx))}
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}
          </fieldset>

          <button class="btn btn-primario criar" disabled={enviando}>Criar produto</button>
        </form>
      </details>

      {#if produtos.length === 0}
        <div class="vazio-caixa compacto">
          <p>Nenhum produto cadastrado ainda.</p>
        </div>
      {/if}

      {#each produtos as p (p.id)}
        <details class="cartao-bloco">
          <summary>
            <span class="resumo-titulo">
              {p.nome}
              <span class="resumo-preco">{brl(p.preco_centavos)}</span>
              {#if !p.ativo}<span class="etiqueta">Oculto na loja</span>{/if}
            </span>
            <Icone nome="chevron" tamanho={16} />
          </summary>

          <div class="imagem-produto">
            {#if p.imagem_url}
              <img class="mini" src={p.imagem_url} alt={p.nome} />
            {:else}
              <p class="dica">Este produto ainda não tem imagem.</p>
            {/if}
            <label class="campo">
              <span>{p.imagem_url ? 'Trocar imagem' : 'Enviar imagem'}</span>
              <input
                type="file"
                accept={TIPOS_IMAGEM}
                onchange={(ev) => trocarImagem(p, ev)}
                disabled={enviando}
              />
            </label>
          </div>

          <div class="edicao">
            <label class="campo"><span>Nome</span><input bind:value={p.nome} /></label>
            <label class="campo">
              <span>Preço (R$)</span><input bind:value={p.precoReais} inputmode="decimal" />
            </label>
            <label class="check">
              <input type="checkbox" bind:checked={p.ativo} /> Visível na loja
            </label>
            <button class="btn btn-primario" onclick={() => salvarProduto(p)}>
              Salvar produto
            </button>
          </div>

          <div class="tabela-rolagem">
            <table>
              <thead>
                <tr>
                  <th>SKU</th><th>Cor</th><th>Tamanho</th><th>Estoque</th><th></th>
                </tr>
              </thead>
              <tbody>
                {#each p.variantes as v (v.id)}
                  <tr>
                    <td class="mono">{v.sku}</td>
                    <td>{v.cor}</td>
                    <td>{v.tamanho}</td>
                    <td class="curto">
                      <input
                        type="number"
                        min="0"
                        bind:value={v.estoque}
                        aria-label="Estoque de {v.sku}"
                      />
                    </td>
                    <td><button class="acao" onclick={() => salvarEstoque(v)}>Salvar</button></td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>

          <div class="nova-variante">
            <label class="campo"><span>SKU</span>
              <input bind:value={p.novaVar.sku} aria-label="SKU da nova variante" />
            </label>
            <label class="campo"><span>Cor</span>
              <input bind:value={p.novaVar.cor} aria-label="Cor da nova variante" />
            </label>
            <label class="campo"><span>Tamanho</span>
              <input bind:value={p.novaVar.tamanho} aria-label="Tamanho da nova variante" />
            </label>
            <label class="campo"><span>Estoque</span>
              <input
                type="number"
                min="0"
                bind:value={p.novaVar.estoque}
                aria-label="Estoque da nova variante"
              />
            </label>
            <button class="btn btn-secundario" onclick={() => adicionarVariante(p)}>
              Adicionar variante
            </button>
          </div>
        </details>
      {/each}
    {:else}
      {#if pedidos.length === 0}
        <div class="vazio-caixa compacto">
          <p>Nenhum pedido ainda.</p>
        </div>
      {/if}

      {#each pedidos as ped (ped.id)}
        <article class="cartao-bloco pedido">
          <div class="cabeca">
            <div>
              <p class="pedido-nome">{ped.nome} <span class="pedido-email">· {ped.email}</span></p>
              <p class="sub">
                {new Date(ped.criado_em).toLocaleString('pt-BR')} · {ped.endereco}
              </p>
            </div>
            <div class="acoes">
              <strong class="pedido-total">{brl(ped.total_centavos)}</strong>
              <select
                value={ped.status}
                aria-label="Situação do pedido"
                disabled={ped.status === 'cancelado'}
                onchange={(ev) => mudarStatus(ped, ev.currentTarget.value)}
              >
                {#each STATUS as [valor, rotulo] (valor)}
                  <option value={valor}>{rotulo}</option>
                {/each}
              </select>
            </div>
          </div>
          <ul class="pedido-itens">
            {#each ped.itens as i (i.sku)}
              <li>{i.quantidade} × {i.produto} — {i.cor}, {i.tamanho} ({i.sku})</li>
            {/each}
          </ul>
        </article>
      {/each}
    {/if}
  {/if}
</section>

<style>
  .painel {
    padding-block: 3rem 0;
  }

  .topo-painel {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--linha);
  }

  .topo-painel h1 {
    margin-top: 0.45rem;
    font-size: clamp(2.1rem, 3.4vw, 2.8rem);
  }

  .sair {
    margin-bottom: 0.35rem;
  }

  .aviso {
    margin-bottom: 1.5rem;
  }

  /* Login */
  .login {
    max-width: 440px;
    margin: 2rem auto 0;
    padding: 2.25rem;
    border: 1px solid var(--linha);
    background: var(--papel-2);
  }

  .login h2 {
    font-size: 1.7rem;
  }

  .login-sub {
    margin: 0.6rem 0 1.6rem;
    color: var(--suave);
    font-size: 0.86rem;
    line-height: 1.7;
  }

  .login form {
    display: grid;
    gap: 1.1rem;
  }

  .demo {
    margin: 0;
    padding: 0.75rem 0.9rem;
    background: var(--areia);
    color: var(--tinta-suave);
    font-size: 0.78rem;
    line-height: 1.6;
  }

  .demo code {
    padding: 0.1rem 0.25rem;
    background: rgb(255 255 255 / 0.6);
    font-weight: 600;
    user-select: all;
    overflow-wrap: anywhere;
  }

  .preencher {
    margin-left: 0.35rem;
    padding: 0;
    border: 0;
    border-bottom: 1px solid var(--linha-forte);
    background: none;
    color: var(--tinta);
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
    transition: border-color var(--transicao);
  }

  .preencher:hover {
    border-color: var(--tinta);
  }

  /* Abas */
  .abas {
    display: flex;
    gap: 1.75rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--linha);
  }

  .aba {
    position: relative;
    padding: 0 0 0.85rem;
    border: 0;
    background: none;
    color: var(--suave);
    font: 500 0.68rem/1 var(--texto);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    transition: color var(--transicao);
  }

  .aba span {
    margin-left: 0.35rem;
    color: #a79f94;
    font-size: 0.7rem;
  }

  .aba::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background: var(--tinta);
    transform: scaleX(0);
    transition: transform 260ms ease;
  }

  .aba:hover {
    color: var(--tinta);
  }

  .aba.ativa {
    color: var(--tinta);
  }

  .aba.ativa::after {
    transform: scaleX(1);
  }

  /* Blocos */
  .cartao-bloco {
    margin-bottom: 1rem;
    padding: 1.25rem 1.5rem;
    border: 1px solid var(--linha);
    background: var(--branco);
  }

  .cartao-bloco > summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    list-style: none;
    cursor: pointer;
  }

  .cartao-bloco > summary::-webkit-details-marker {
    display: none;
  }

  .cartao-bloco > summary :global(svg) {
    flex: none;
    color: var(--suave);
    transition: transform 260ms ease;
  }

  .cartao-bloco[open] > summary :global(svg) {
    transform: rotate(180deg);
  }

  .resumo-titulo {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-family: var(--titulo);
    font-size: 1.3rem;
    line-height: 1.2;
  }

  .resumo-preco {
    font-family: var(--texto);
    font-size: 0.8rem;
    color: var(--suave);
  }

  .etiqueta {
    padding: 0.2rem 0.5rem;
    background: var(--areia);
    color: var(--tinta-suave);
    font: 500 0.58rem/1.4 var(--texto);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  /* Form de novo produto */
  .novo-produto {
    margin-top: 1.5rem;
  }

  .campos {
    display: grid;
    gap: 1rem;
  }

  .campos.dois {
    grid-template-columns: 1fr 1fr;
  }

  .imagem-produto {
    display: grid;
    gap: 0.85rem;
    align-content: start;
    margin: 1.5rem 0;
    max-width: 420px;
  }

  .mini {
    width: 110px;
    height: 146px;
    object-fit: cover;
    border: 1px solid var(--linha);
  }

  .dica {
    color: var(--suave);
    font-size: 0.78rem;
  }

  .grade {
    margin: 1.5rem 0;
    padding: 1.25rem;
    border: 1px solid var(--linha);
  }

  .grade legend {
    padding: 0 0.5rem;
    font: 500 0.64rem/1 var(--texto);
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .gerar {
    margin-top: 1rem;
  }

  .criar {
    height: 50px;
    padding-inline: 2rem;
  }

  /* Tabelas */
  .tabela-rolagem {
    overflow-x: auto;
    margin: 1.25rem 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 0.5rem 0.6rem;
    border-bottom: 1px solid var(--linha-forte);
    color: var(--suave);
    font: 500 0.6rem/1.4 var(--texto);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: left;
    white-space: nowrap;
  }

  td {
    padding: 0.45rem 0.6rem;
    border-bottom: 1px solid var(--linha);
    font-size: 0.84rem;
    vertical-align: middle;
  }

  td.mono {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  td input,
  .nova-variante input,
  select {
    width: 100%;
    min-width: 4rem;
    padding: 0.4rem 0.5rem;
    border: 1px solid var(--linha-forte);
    background: var(--branco);
    color: var(--tinta);
    font: inherit;
    font-size: 0.82rem;
  }

  td input:focus,
  .nova-variante input:focus,
  select:focus {
    outline: none;
    border-color: var(--tinta);
  }

  td.curto input {
    max-width: 7rem;
  }

  /* Edição */
  .edicao {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: end;
    max-width: 560px;
  }

  .edicao .check {
    grid-column: 1;
  }

  .edicao .btn {
    grid-column: 1 / -1;
    justify-self: start;
    padding-inline: 1.5rem;
  }

  .check {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 0.84rem;
    color: var(--tinta-suave);
  }

  .check input {
    accent-color: var(--tinta);
    width: 15px;
    height: 15px;
  }

  .acao {
    padding: 0.35rem 0.7rem;
    border: 1px solid var(--linha-forte);
    background: none;
    color: var(--tinta-suave);
    font: 500 0.6rem/1 var(--texto);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
    transition:
      border-color var(--transicao),
      color var(--transicao);
  }

  .acao:hover {
    border-color: var(--tinta);
    color: var(--tinta);
  }

  .acao-perigo {
    border: 0;
    background: none;
    padding: 0;
    color: var(--suave);
    font-size: 0.72rem;
    border-bottom: 1px solid transparent;
    white-space: nowrap;
  }

  .acao-perigo:hover {
    color: var(--acento);
    border-bottom-color: var(--acento);
  }

  /* Nova variante */
  .nova-variante {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
    align-items: end;
    gap: 0.75rem;
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--linha);
  }

  .nova-variante .btn {
    height: 36px;
    padding-inline: 1rem;
  }

  /* Pedidos */
  .pedido {
    padding: 1.35rem 1.5rem;
  }

  .cabeca {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .pedido-nome {
    font-family: var(--titulo);
    font-size: 1.2rem;
  }

  .pedido-email {
    font-family: var(--texto);
    font-size: 0.8rem;
    color: var(--suave);
  }

  .sub {
    margin-top: 0.3rem;
    color: var(--suave);
    font-size: 0.78rem;
    line-height: 1.5;
  }

  .acoes {
    display: flex;
    align-items: center;
    gap: 0.9rem;
  }

  .pedido-total {
    font-family: var(--titulo);
    font-size: 1.2rem;
    font-weight: 500;
  }

  .acoes select {
    width: auto;
    min-width: 11rem;
  }

  .pedido-itens {
    display: grid;
    gap: 0.3rem;
    margin: 1rem 0 0;
    padding-top: 0.9rem;
    border-top: 1px solid var(--linha);
    list-style: none;
    color: var(--suave);
    font-size: 0.82rem;
  }

  .vazio-caixa.compacto {
    padding: 2.5rem 1.5rem;
  }

  @media (max-width: 760px) {
    .painel {
      padding-top: 2.25rem;
    }

    .campos.dois,
    .edicao {
      grid-template-columns: 1fr;
    }

    .nova-variante {
      grid-template-columns: 1fr 1fr;
    }

    .nova-variante .btn {
      grid-column: 1 / -1;
    }

    .login {
      padding: 1.5rem;
    }
  }
</style>

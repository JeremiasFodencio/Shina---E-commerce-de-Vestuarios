<script>
  import { onMount } from 'svelte';
  import { admin, lerChave, salvarChave, sairAdmin } from '$lib/admin.js';
  import { brl } from '$lib/formato.js';

  const STATUS = [
    ['pendente', 'Aguardando pagamento'],
    ['pago', 'Pago'],
    ['enviado', 'Enviado'],
    ['cancelado', 'Cancelado']
  ];

  let autenticado = $state(false);
  let chaveInput = $state('');
  let aba = $state('produtos');
  let produtos = $state([]);
  let pedidos = $state([]);
  let msg = $state({ tipo: '', texto: '' });

  const avisar = (tipo, texto) => (msg = { tipo, texto });
  const reaisParaCentavos = (v) => Math.round(parseFloat(String(v).replace(',', '.')) * 100);

  const semAcento = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const slugify = (s) => semAcento(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const codigo = (s) => semAcento(s).toUpperCase().replace(/[^A-Z0-9]+/g, '');

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
    executar(() => admin.estoque(v.sku, Number(v.estoque) || 0), `Estoque de ${v.sku} atualizado.`);

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

  // ----- Novo produto -----
  const vazio = () => ({
    nome: '', slug: '', preco: '', descricao: '', imagem_url: '',
    prefixo: '', tamanhos: 'P, M, G', cores: '', estoquePadrao: 5, variantes: []
  });
  let novo = $state(vazio());
  const slugFinal = $derived(novo.slug.trim() || slugify(novo.nome));

  function gerarGrade() {
    const lista = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);
    const tams = lista(novo.tamanhos);
    const cores = lista(novo.cores);
    if (!tams.length || !cores.length) return avisar('erro', 'Informe ao menos um tamanho e uma cor.');
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
    if (novo.variantes.length === 0) return avisar('erro', 'Gere a grade ou adicione ao menos uma variante.');
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
  <title>Administração</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<h1>Administração</h1>

{#if msg.texto}
  <p class={msg.tipo === 'erro' ? 'erro-msg' : 'ok'} role={msg.tipo === 'erro' ? 'alert' : 'status'}>{msg.texto}</p>
{/if}

{#if !autenticado}
  <form class="form-checkout" onsubmit={entrar}>
    <label class="campo">Chave de administração
      <input type="password" bind:value={chaveInput} required autocomplete="off" />
    </label>
    <button class="btn btn-primario">Entrar</button>
  </form>
{:else}
  <div class="abas">
    <button class="btn" class:btn-primario={aba === 'produtos'} onclick={() => (aba = 'produtos')}>Produtos</button>
    <button class="btn" class:btn-primario={aba === 'pedidos'} onclick={() => (aba = 'pedidos')}>
      Pedidos ({pedidos.length})
    </button>
    <button class="remover" onclick={sair}>Sair</button>
  </div>

  {#if aba === 'produtos'}
    <details class="bloco">
      <summary>Cadastrar novo produto</summary>
      <form onsubmit={criarProduto}>
        <label class="campo">Nome
          <input bind:value={novo.nome} required />
        </label>
        <label class="campo">Endereço da página (slug)
          <input bind:value={novo.slug} placeholder={slugify(novo.nome)} />
        </label>
        <label class="campo">Preço (R$)
          <input bind:value={novo.preco} inputmode="decimal" placeholder="59,90" required />
        </label>
        <label class="campo">Descrição
          <input bind:value={novo.descricao} />
        </label>
        <label class="campo">URL da imagem
          <input bind:value={novo.imagem_url} type="url" placeholder="https://…" />
        </label>

        <fieldset class="grade">
          <legend>Grade de variações</legend>
          <label class="campo">Tamanhos (separados por vírgula)
            <input bind:value={novo.tamanhos} />
          </label>
          <label class="campo">Cores (separadas por vírgula)
            <input bind:value={novo.cores} placeholder="Preto, Branco" />
          </label>
          <label class="campo">Prefixo do código SKU (opcional)
            <input bind:value={novo.prefixo} placeholder="CAMBAS" />
          </label>
          <label class="campo">Estoque inicial de cada variante
            <input type="number" min="0" bind:value={novo.estoquePadrao} />
          </label>
          <button type="button" class="btn" onclick={gerarGrade}>Gerar variantes</button>

          {#if novo.variantes.length > 0}
            <table>
              <thead><tr><th>SKU</th><th>Tamanho</th><th>Cor</th><th>Estoque</th><th></th></tr></thead>
              <tbody>
                {#each novo.variantes as v, idx (idx)}
                  <tr>
                    <td><input bind:value={v.sku} aria-label="SKU" /></td>
                    <td><input bind:value={v.tamanho} aria-label="Tamanho" /></td>
                    <td><input bind:value={v.cor} aria-label="Cor" /></td>
                    <td><input type="number" min="0" bind:value={v.estoque} aria-label="Estoque" /></td>
                    <td>
                      <button type="button" class="remover"
                        onclick={() => (novo.variantes = novo.variantes.filter((_, i) => i !== idx))}>Remover</button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
        </fieldset>

        <button class="btn btn-primario">Criar produto</button>
      </form>
    </details>

    {#if produtos.length === 0}
      <p class="vazio">Nenhum produto cadastrado.</p>
    {/if}

    {#each produtos as p (p.id)}
      <details class="bloco">
        <summary>
          {p.nome} — {brl(p.preco_centavos)}
          {#if !p.ativo}<span class="etiqueta">Oculto na loja</span>{/if}
        </summary>

        <div class="edicao">
          <label class="campo">Nome <input bind:value={p.nome} /></label>
          <label class="campo">Preço (R$) <input bind:value={p.precoReais} inputmode="decimal" /></label>
          <label class="check"><input type="checkbox" bind:checked={p.ativo} /> Visível na loja</label>
          <button class="btn btn-primario" onclick={() => salvarProduto(p)}>Salvar produto</button>
        </div>

        <table>
          <thead><tr><th>SKU</th><th>Cor</th><th>Tamanho</th><th>Estoque</th><th></th></tr></thead>
          <tbody>
            {#each p.variantes as v (v.id)}
              <tr>
                <td>{v.sku}</td>
                <td>{v.cor}</td>
                <td>{v.tamanho}</td>
                <td><input type="number" min="0" bind:value={v.estoque} aria-label="Estoque de {v.sku}" /></td>
                <td><button class="btn" onclick={() => salvarEstoque(v)}>Salvar</button></td>
              </tr>
            {/each}
          </tbody>
        </table>

        <div class="nova-variante">
          <input bind:value={p.novaVar.sku} placeholder="SKU" aria-label="SKU da nova variante" />
          <input bind:value={p.novaVar.cor} placeholder="Cor" aria-label="Cor da nova variante" />
          <input bind:value={p.novaVar.tamanho} placeholder="Tamanho" aria-label="Tamanho da nova variante" />
          <input type="number" min="0" bind:value={p.novaVar.estoque} aria-label="Estoque da nova variante" />
          <button class="btn" onclick={() => adicionarVariante(p)}>Adicionar variante</button>
        </div>
      </details>
    {/each}
  {:else}
    {#if pedidos.length === 0}
      <p class="vazio">Nenhum pedido ainda.</p>
    {/if}

    {#each pedidos as ped (ped.id)}
      <article class="bloco pedido">
        <div class="cabeca">
          <div>
            <strong>{ped.nome}</strong> · {ped.email}<br />
            <span class="sub">{new Date(ped.criado_em).toLocaleString('pt-BR')} · {ped.endereco}</span>
          </div>
          <div class="acoes">
            <strong>{brl(ped.total_centavos)}</strong>
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
        <ul>
          {#each ped.itens as i (i.sku)}
            <li>{i.quantidade} × {i.produto} — {i.cor}, {i.tamanho} ({i.sku})</li>
          {/each}
        </ul>
      </article>
    {/each}
  {/if}
{/if}

<style>
  .abas { display: flex; gap: 0.5rem; align-items: center; margin: 1.5rem 0; flex-wrap: wrap; }
  .bloco { background: var(--branco); border: 2px solid var(--linha); padding: 1rem 1.25rem; margin-bottom: 1rem; }
  summary { cursor: pointer; font-weight: 600; }
  .etiqueta { background: var(--fita); color: var(--tinta); padding: 0 0.5rem; margin-left: 0.5rem; font-size: 0.85rem; font-weight: 500; }
  .edicao { display: grid; gap: 0.5rem; max-width: 420px; margin: 1rem 0; }
  .check { display: flex; gap: 0.5rem; align-items: center; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.4rem 0.5rem; border-bottom: 1px solid var(--linha); }
  td input, .nova-variante input, select { font: inherit; padding: 0.4rem; border: 2px solid var(--linha); background: var(--branco); color: var(--tinta); width: 100%; min-width: 4rem; }
  .nova-variante { display: grid; gap: 0.5rem; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); align-items: center; }
  .grade { border: 2px solid var(--linha); margin: 1rem 0; padding: 1rem; }
  .pedido .cabeca { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  .acoes { display: flex; gap: 0.75rem; align-items: center; }
  .acoes select { width: auto; }
  .pedido ul { margin: 0.75rem 0 0; padding-left: 1.2rem; }
  .sub { color: var(--suave); font-size: 0.9rem; }
</style>

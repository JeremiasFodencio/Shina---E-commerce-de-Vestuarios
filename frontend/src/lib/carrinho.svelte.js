import { browser } from '$app/environment';

const CHAVE = 'carrinho-v1';
const MAX_POR_ITEM = 20;

class Carrinho {
  itens = $state([]);

  // Chamado no navegador após a hidratação (evita divergência com o HTML do servidor)
  carregar() {
    if (!browser) return;
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? '[]');
      if (Array.isArray(salvo)) this.itens = salvo;
    } catch {
      this.itens = [];
    }
  }

  salvar() {
    if (browser) localStorage.setItem(CHAVE, JSON.stringify(this.itens));
  }

  get quantidade() {
    return this.itens.reduce((soma, i) => soma + i.quantidade, 0);
  }

  get total() {
    return this.itens.reduce((soma, i) => soma + i.quantidade * i.preco_centavos, 0);
  }

  adicionar(item) {
    const limite = Math.min(item.estoque, MAX_POR_ITEM);
    const existente = this.itens.find((i) => i.sku === item.sku);
    if (existente) {
      existente.estoque = item.estoque;
      existente.quantidade = Math.min(existente.quantidade + 1, limite);
    } else {
      this.itens.push({ ...item, quantidade: 1 });
    }
    this.salvar();
  }

  alterar(sku, quantidade) {
    const item = this.itens.find((i) => i.sku === sku);
    if (!item) return;
    const limite = Math.min(item.estoque, MAX_POR_ITEM);
    if (quantidade < 1) return this.remover(sku);
    item.quantidade = Math.min(quantidade, limite);
    this.salvar();
  }

  remover(sku) {
    this.itens = this.itens.filter((i) => i.sku !== sku);
    this.salvar();
  }

  limpar() {
    this.itens = [];
    this.salvar();
  }
}

export const carrinho = new Carrinho();

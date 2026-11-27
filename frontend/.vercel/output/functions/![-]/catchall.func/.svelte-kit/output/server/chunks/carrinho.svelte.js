import "clsx";
const MAX_POR_ITEM = 20;
class Carrinho {
  itens = [];
  // Chamado no navegador após a hidratação (evita divergência com o HTML do servidor)
  carregar() {
    return;
  }
  salvar() {
  }
  get quantidade() {
    return this.itens.reduce((soma, i) => soma + i.quantidade, 0);
  }
  get total() {
    return this.itens.reduce((soma, i) => soma + i.quantidade * i.preco_centavos, 0);
  }
  adicionar(item, quantidade = 1) {
    const limite = Math.min(item.estoque, MAX_POR_ITEM);
    const existente = this.itens.find((i) => i.sku === item.sku);
    if (existente) {
      existente.estoque = item.estoque;
      existente.quantidade = Math.min(existente.quantidade + quantidade, limite);
    } else {
      this.itens.push({ ...item, quantidade: Math.min(quantidade, limite) });
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
const carrinho = new Carrinho();
export {
  carrinho as c
};

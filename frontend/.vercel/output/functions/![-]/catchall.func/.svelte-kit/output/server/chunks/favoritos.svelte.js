import "clsx";
class Favoritos {
  itens = [];
  carregar() {
    return;
  }
  salvar() {
  }
  get quantidade() {
    return this.itens.length;
  }
  tem(id) {
    return this.itens.some((i) => i.id === id);
  }
  alternar(produto) {
    if (this.tem(produto.id)) {
      this.remover(produto.id);
      return false;
    }
    this.itens = [
      ...this.itens,
      {
        id: produto.id,
        nome: produto.nome,
        slug: produto.slug,
        imagem_url: produto.imagem_url ?? null,
        preco_centavos: produto.preco_centavos,
        estoque_total: produto.estoque_total ?? null
      }
    ];
    this.salvar();
    return true;
  }
  remover(id) {
    this.itens = this.itens.filter((i) => i.id !== id);
    this.salvar();
  }
  limpar() {
    this.itens = [];
    this.salvar();
  }
}
const favoritos = new Favoritos();
export {
  favoritos as f
};

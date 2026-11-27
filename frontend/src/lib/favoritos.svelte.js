import { browser } from '$app/environment';

const CHAVE = 'shina-favoritos-v1';

// Lista de desejos — guardada no navegador, com o mínimo para desenhar o cartão
class Favoritos {
  itens = $state([]);

  carregar() {
    if (!browser) return;
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? '[]');
      if (Array.isArray(salvo)) {
        this.itens = salvo.filter((i) => i && i.id && i.slug);
      }
    } catch {
      this.itens = [];
    }
  }

  salvar() {
    if (browser) localStorage.setItem(CHAVE, JSON.stringify(this.itens));
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

export const favoritos = new Favoritos();

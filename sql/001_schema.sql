-- Cole no Supabase: SQL Editor > New Query > Run

CREATE TABLE public.produtos (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  descricao      TEXT,
  imagem_url     TEXT,
  preco_centavos BIGINT NOT NULL CHECK (preco_centavos > 0),
  ativo          BOOLEAN DEFAULT TRUE NOT NULL,
  criado_em      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Cada linha = um SKU (combinação de produto + tamanho + cor) com seu próprio estoque
CREATE TABLE public.variantes (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id     UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  sku            TEXT NOT NULL UNIQUE,
  tamanho        TEXT NOT NULL,
  cor            TEXT NOT NULL,
  estoque        INTEGER DEFAULT 0 NOT NULL CHECK (estoque >= 0),
  preco_centavos BIGINT CHECK (preco_centavos > 0),  -- NULL = usa o preço do produto
  ativo          BOOLEAN DEFAULT TRUE NOT NULL,
  UNIQUE (produto_id, tamanho, cor)
);
CREATE INDEX idx_variantes_produto_id ON public.variantes(produto_id);

CREATE TABLE public.pedidos (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome           TEXT NOT NULL,
  email          TEXT NOT NULL,
  endereco       TEXT NOT NULL,
  total_centavos BIGINT NOT NULL,
  status         TEXT DEFAULT 'pendente' NOT NULL
                 CHECK (status IN ('pendente','pago','enviado','cancelado')),
  criado_em      TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.itens_pedido (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id           UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  variante_id         UUID NOT NULL REFERENCES public.variantes(id) ON DELETE RESTRICT,
  quantidade          INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unit_centavos BIGINT NOT NULL
);
CREATE INDEX idx_itens_pedido_pedido_id ON public.itens_pedido(pedido_id);

-- RLS obrigatório em todas as tabelas do schema public (guia, seção 04)
ALTER TABLE public.produtos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variantes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_pedido ENABLE ROW LEVEL SECURITY;

-- Catálogo: leitura pública apenas de itens ativos
CREATE POLICY "Catalogo publico: produtos ativos"
  ON public.produtos FOR SELECT TO anon, authenticated USING (ativo);
CREATE POLICY "Catalogo publico: variantes ativas"
  ON public.variantes FOR SELECT TO anon, authenticated USING (ativo);

-- pedidos e itens_pedido: SEM políticas = inacessíveis pela API pública (anon key).
-- O backend Rust conecta como role postgres via DATABASE_URL e não é afetado pelo RLS.

-- Dados de exemplo
WITH p AS (
  INSERT INTO public.produtos (nome, slug, descricao, preco_centavos)
  VALUES ('Camiseta Básica Algodão', 'camiseta-basica', 'Camiseta 100% algodão.', 5990)
  RETURNING id
)
INSERT INTO public.variantes (produto_id, sku, tamanho, cor, estoque)
SELECT p.id, v.sku, v.tamanho, v.cor, v.estoque FROM p, (VALUES
  ('CAM-BAS-PRETO-P', 'P', 'Preto', 10),
  ('CAM-BAS-PRETO-M', 'M', 'Preto', 15),
  ('CAM-BAS-PRETO-G', 'G', 'Preto', 5),
  ('CAM-BAS-BRANCO-P', 'P', 'Branco', 8),
  ('CAM-BAS-BRANCO-M', 'M', 'Branco', 0)
) AS v(sku, tamanho, cor, estoque);

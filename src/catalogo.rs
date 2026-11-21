use crate::{erro::{Erro, Resultado}, Estado};
use axum::{extract::{Path, Query, State}, Json};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct Filtro {
    q: Option<String>,
    pagina: Option<i64>,
    por_pagina: Option<i64>,
}

#[derive(Serialize, FromRow)]
pub struct ProdutoResumo {
    id: Uuid,
    nome: String,
    slug: String,
    descricao: Option<String>,
    imagem_url: Option<String>,
    preco_centavos: i64,
    estoque_total: i64,
}

#[derive(Serialize, FromRow)]
pub struct ProdutoBase {
    id: Uuid,
    nome: String,
    slug: String,
    descricao: Option<String>,
    imagem_url: Option<String>,
    preco_centavos: i64,
}

#[derive(Serialize, FromRow)]
pub struct Variante {
    id: Uuid,
    sku: String,
    tamanho: String,
    cor: String,
    estoque: i32,
    preco_centavos: i64,
}

#[derive(Serialize)]
pub struct ProdutoDetalhe {
    #[serde(flatten)]
    produto: ProdutoBase,
    variantes: Vec<Variante>,
}

pub async fn listar(
    State(e): State<Estado>,
    Query(f): Query<Filtro>,
) -> Resultado<Json<Vec<ProdutoResumo>>> {
    let por_pagina = f.por_pagina.unwrap_or(20).clamp(1, 100);
    let pagina = f.pagina.unwrap_or(1).max(1);
    let q = f.q.map(|s| s.trim().to_string()).filter(|s| !s.is_empty());

    let lista = sqlx::query_as::<_, ProdutoResumo>(
        "SELECT p.id, p.nome, p.slug, p.descricao, p.imagem_url, p.preco_centavos,
                COALESCE(SUM(v.estoque), 0)::BIGINT AS estoque_total
           FROM produtos p
           LEFT JOIN variantes v ON v.produto_id = p.id AND v.ativo
          WHERE p.ativo AND ($1::text IS NULL OR p.nome ILIKE '%' || $1 || '%')
          GROUP BY p.id
          ORDER BY p.criado_em DESC
          LIMIT $2 OFFSET $3",
    )
    .bind(q)
    .bind(por_pagina)
    .bind((pagina - 1) * por_pagina)
    .fetch_all(&e.db)
    .await?;

    Ok(Json(lista))
}

pub async fn detalhe(
    State(e): State<Estado>,
    Path(slug): Path<String>,
) -> Resultado<Json<ProdutoDetalhe>> {
    let produto = sqlx::query_as::<_, ProdutoBase>(
        "SELECT id, nome, slug, descricao, imagem_url, preco_centavos
           FROM produtos WHERE slug = $1 AND ativo",
    )
    .bind(&slug)
    .fetch_optional(&e.db)
    .await?
    .ok_or(Erro::NaoEncontrado)?;

    let variantes = sqlx::query_as::<_, Variante>(
        "SELECT id, sku, tamanho, cor, estoque, COALESCE(preco_centavos, $2) AS preco_centavos
           FROM variantes WHERE produto_id = $1 AND ativo
          ORDER BY cor, tamanho",
    )
    .bind(produto.id)
    .bind(produto.preco_centavos)
    .fetch_all(&e.db)
    .await?;

    Ok(Json(ProdutoDetalhe { produto, variantes }))
}

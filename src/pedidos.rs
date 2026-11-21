use crate::{erro::{Erro, Resultado}, Estado};
use axum::{extract::{Path, State}, http::StatusCode, Json};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use std::collections::BTreeMap;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct NovoPedido {
    nome: String,
    email: String,
    endereco: String,
    itens: Vec<ItemPedido>,
}

#[derive(Deserialize)]
pub struct ItemPedido {
    sku: String,
    quantidade: i32,
}

#[derive(Serialize)]
pub struct PedidoCriado {
    id: Uuid,
    total_centavos: i64,
    status: &'static str,
}

pub async fn criar(
    State(e): State<Estado>,
    Json(p): Json<NovoPedido>,
) -> Resultado<(StatusCode, Json<PedidoCriado>)> {
    if p.nome.trim().is_empty() || p.endereco.trim().is_empty() || !p.email.contains('@') {
        return Err(Erro::Invalido("nome, e-mail e endereço são obrigatórios".into()));
    }
    if p.itens.is_empty() {
        return Err(Erro::Invalido("o pedido precisa de ao menos um item".into()));
    }

    // Soma quantidades de SKUs repetidos; BTreeMap garante ordem fixa de travamento (evita deadlock)
    let mut agregados: BTreeMap<String, i32> = BTreeMap::new();
    for i in &p.itens {
        if i.quantidade < 1 || i.quantidade > 20 {
            return Err(Erro::Invalido("quantidade deve estar entre 1 e 20".into()));
        }
        *agregados.entry(i.sku.clone()).or_insert(0) += i.quantidade;
    }

    let mut tx = e.db.begin().await?;
    let mut total: i64 = 0;
    let mut linhas: Vec<(Uuid, i32, i64)> = Vec::new();

    for (sku, qtd) in &agregados {
        // Baixa de estoque atômica: só atualiza se houver saldo suficiente
        let r: Option<(Uuid, i64)> = sqlx::query_as(
            "UPDATE variantes v
                SET estoque = v.estoque - $2
               FROM produtos p
              WHERE v.sku = $1 AND v.produto_id = p.id
                AND v.ativo AND p.ativo AND v.estoque >= $2
          RETURNING v.id, COALESCE(v.preco_centavos, p.preco_centavos)",
        )
        .bind(sku)
        .bind(*qtd)
        .fetch_optional(&mut *tx)
        .await?;

        // Em caso de erro, `tx` é descartada e todo o rollback acontece
        let (variante_id, preco) = r.ok_or_else(|| {
            Erro::Conflito(format!("SKU {sku} indisponível ou sem estoque suficiente"))
        })?;
        total += preco * (*qtd as i64);
        linhas.push((variante_id, *qtd, preco));
    }

    let pedido_id: Uuid = sqlx::query_scalar(
        "INSERT INTO pedidos (nome, email, endereco, total_centavos)
         VALUES ($1, $2, $3, $4) RETURNING id",
    )
    .bind(p.nome.trim())
    .bind(p.email.trim())
    .bind(p.endereco.trim())
    .bind(total)
    .fetch_one(&mut *tx)
    .await?;

    for (variante_id, qtd, preco) in linhas {
        sqlx::query(
            "INSERT INTO itens_pedido (pedido_id, variante_id, quantidade, preco_unit_centavos)
             VALUES ($1, $2, $3, $4)",
        )
        .bind(pedido_id)
        .bind(variante_id)
        .bind(qtd)
        .bind(preco)
        .execute(&mut *tx)
        .await?;
    }

    tx.commit().await?;
    Ok((
        StatusCode::CREATED,
        Json(PedidoCriado { id: pedido_id, total_centavos: total, status: "pendente" }),
    ))
}

#[derive(Serialize, FromRow)]
struct PedidoBase {
    id: Uuid,
    nome: String,
    email: String,
    endereco: String,
    total_centavos: i64,
    status: String,
    criado_em: DateTime<Utc>,
}

#[derive(Serialize, FromRow)]
struct ItemDetalhe {
    produto: String,
    sku: String,
    tamanho: String,
    cor: String,
    quantidade: i32,
    preco_unit_centavos: i64,
}

#[derive(Serialize)]
pub struct PedidoDetalhe {
    #[serde(flatten)]
    pedido: PedidoBase,
    itens: Vec<ItemDetalhe>,
}

pub async fn buscar(
    State(e): State<Estado>,
    Path(id): Path<Uuid>,
) -> Resultado<Json<PedidoDetalhe>> {
    let pedido = sqlx::query_as::<_, PedidoBase>(
        "SELECT id, nome, email, endereco, total_centavos, status, criado_em
           FROM pedidos WHERE id = $1",
    )
    .bind(id)
    .fetch_optional(&e.db)
    .await?
    .ok_or(Erro::NaoEncontrado)?;

    let itens = sqlx::query_as::<_, ItemDetalhe>(
        "SELECT pr.nome AS produto, v.sku, v.tamanho, v.cor, i.quantidade, i.preco_unit_centavos
           FROM itens_pedido i
           JOIN variantes v ON v.id = i.variante_id
           JOIN produtos pr ON pr.id = v.produto_id
          WHERE i.pedido_id = $1",
    )
    .bind(id)
    .fetch_all(&e.db)
    .await?;

    Ok(Json(PedidoDetalhe { pedido, itens }))
}

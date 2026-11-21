use crate::{erro::{Erro, Resultado}, Estado};
use axum::{extract::{Path, State}, http::{HeaderMap, StatusCode}, Json};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::FromRow;
use std::collections::HashMap;
use uuid::Uuid;

fn autorizar(h: &HeaderMap, e: &Estado) -> Resultado<()> {
    match h.get("x-admin-key").and_then(|v| v.to_str().ok()) {
        Some(k) if k == e.admin_key.as_str() => Ok(()),
        _ => Err(Erro::NaoAutorizado),
    }
}

fn ok() -> Json<Value> {
    Json(json!({ "ok": true }))
}

// ---------- Produtos: leitura ----------

#[derive(Serialize, FromRow)]
pub struct ProdutoAdmin {
    id: Uuid,
    nome: String,
    slug: String,
    descricao: Option<String>,
    imagem_url: Option<String>,
    preco_centavos: i64,
    ativo: bool,
}

#[derive(Serialize, FromRow)]
pub struct VarianteAdmin {
    id: Uuid,
    produto_id: Uuid,
    sku: String,
    tamanho: String,
    cor: String,
    estoque: i32,
    preco_centavos: Option<i64>,
    ativo: bool,
}

#[derive(Serialize)]
pub struct ProdutoComVariantes {
    #[serde(flatten)]
    produto: ProdutoAdmin,
    variantes: Vec<VarianteAdmin>,
}

pub async fn listar_produtos(
    State(e): State<Estado>,
    headers: HeaderMap,
) -> Resultado<Json<Vec<ProdutoComVariantes>>> {
    autorizar(&headers, &e)?;
    let produtos = sqlx::query_as::<_, ProdutoAdmin>(
        "SELECT id, nome, slug, descricao, imagem_url, preco_centavos, ativo
           FROM produtos ORDER BY criado_em DESC",
    )
    .fetch_all(&e.db)
    .await?;
    let variantes = sqlx::query_as::<_, VarianteAdmin>(
        "SELECT id, produto_id, sku, tamanho, cor, estoque, preco_centavos, ativo
           FROM variantes ORDER BY cor, tamanho",
    )
    .fetch_all(&e.db)
    .await?;

    let mut por_produto: HashMap<Uuid, Vec<VarianteAdmin>> = HashMap::new();
    for v in variantes {
        por_produto.entry(v.produto_id).or_default().push(v);
    }
    let lista = produtos
        .into_iter()
        .map(|p| {
            let variantes = por_produto.remove(&p.id).unwrap_or_default();
            ProdutoComVariantes { produto: p, variantes }
        })
        .collect();
    Ok(Json(lista))
}

// ---------- Produtos: criação ----------

#[derive(Deserialize)]
pub struct NovoProduto {
    nome: String,
    slug: String,
    descricao: Option<String>,
    imagem_url: Option<String>,
    preco_centavos: i64,
    variantes: Vec<NovaVariante>,
}

#[derive(Deserialize)]
pub struct NovaVariante {
    sku: String,
    tamanho: String,
    cor: String,
    estoque: i32,
    preco_centavos: Option<i64>,
}

fn validar_variante(v: &NovaVariante) -> Resultado<()> {
    if v.sku.trim().is_empty() || v.tamanho.trim().is_empty() || v.cor.trim().is_empty() {
        return Err(Erro::Invalido("variante precisa de sku, tamanho e cor".into()));
    }
    if v.estoque < 0 || v.preco_centavos.is_some_and(|x| x <= 0) {
        return Err(Erro::Invalido("estoque deve ser >= 0 e preço > 0".into()));
    }
    Ok(())
}

async fn inserir_variante(
    tx: &mut sqlx::PgConnection,
    produto_id: Uuid,
    v: &NovaVariante,
) -> Resultado<()> {
    sqlx::query(
        "INSERT INTO variantes (produto_id, sku, tamanho, cor, estoque, preco_centavos)
         VALUES ($1, $2, $3, $4, $5, $6)",
    )
    .bind(produto_id)
    .bind(v.sku.trim())
    .bind(v.tamanho.trim())
    .bind(v.cor.trim())
    .bind(v.estoque)
    .bind(v.preco_centavos)
    .execute(tx)
    .await?;
    Ok(())
}

#[derive(Serialize)]
pub struct ProdutoCriado {
    id: Uuid,
}

pub async fn criar_produto(
    State(e): State<Estado>,
    headers: HeaderMap,
    Json(p): Json<NovoProduto>,
) -> Resultado<(StatusCode, Json<ProdutoCriado>)> {
    autorizar(&headers, &e)?;
    if p.nome.trim().is_empty() || p.slug.trim().is_empty() || p.preco_centavos <= 0 {
        return Err(Erro::Invalido("nome, slug e preço (> 0) são obrigatórios".into()));
    }
    if p.variantes.is_empty() {
        return Err(Erro::Invalido("informe ao menos uma variante".into()));
    }
    for v in &p.variantes {
        validar_variante(v)?;
    }

    let mut tx = e.db.begin().await?;
    let id: Uuid = sqlx::query_scalar(
        "INSERT INTO produtos (nome, slug, descricao, imagem_url, preco_centavos)
         VALUES ($1, $2, $3, $4, $5) RETURNING id",
    )
    .bind(p.nome.trim())
    .bind(p.slug.trim())
    .bind(&p.descricao)
    .bind(&p.imagem_url)
    .bind(p.preco_centavos)
    .fetch_one(&mut *tx)
    .await?;

    for v in &p.variantes {
        inserir_variante(&mut *tx, id, v).await?;
    }
    tx.commit().await?;
    Ok((StatusCode::CREATED, Json(ProdutoCriado { id })))
}

// ---------- Produtos: edição ----------

#[derive(Deserialize)]
pub struct EditarProduto {
    nome: Option<String>,
    descricao: Option<String>,
    imagem_url: Option<String>,
    preco_centavos: Option<i64>,
    ativo: Option<bool>,
}

pub async fn editar_produto(
    State(e): State<Estado>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
    Json(d): Json<EditarProduto>,
) -> Resultado<Json<Value>> {
    autorizar(&headers, &e)?;
    if d.nome.as_deref().is_some_and(|n| n.trim().is_empty()) {
        return Err(Erro::Invalido("o nome não pode ficar vazio".into()));
    }
    if d.preco_centavos.is_some_and(|p| p <= 0) {
        return Err(Erro::Invalido("o preço deve ser maior que zero".into()));
    }
    // Campos ausentes (null) mantêm o valor atual
    let atualizado: Option<Uuid> = sqlx::query_scalar(
        "UPDATE produtos SET
            nome = COALESCE($2, nome),
            descricao = COALESCE($3, descricao),
            imagem_url = COALESCE($4, imagem_url),
            preco_centavos = COALESCE($5, preco_centavos),
            ativo = COALESCE($6, ativo)
          WHERE id = $1 RETURNING id",
    )
    .bind(id)
    .bind(d.nome.as_deref().map(str::trim))
    .bind(&d.descricao)
    .bind(&d.imagem_url)
    .bind(d.preco_centavos)
    .bind(d.ativo)
    .fetch_optional(&e.db)
    .await?;
    atualizado.ok_or(Erro::NaoEncontrado)?;
    Ok(ok())
}

// ---------- Variantes ----------

pub async fn criar_variante(
    State(e): State<Estado>,
    headers: HeaderMap,
    Path(produto_id): Path<Uuid>,
    Json(v): Json<NovaVariante>,
) -> Resultado<(StatusCode, Json<Value>)> {
    autorizar(&headers, &e)?;
    validar_variante(&v)?;
    let existe: Option<Uuid> = sqlx::query_scalar("SELECT id FROM produtos WHERE id = $1")
        .bind(produto_id)
        .fetch_optional(&e.db)
        .await?;
    existe.ok_or(Erro::NaoEncontrado)?;

    let mut conn = e.db.acquire().await?;
    inserir_variante(&mut conn, produto_id, &v).await?;
    Ok((StatusCode::CREATED, ok()))
}

#[derive(Deserialize)]
pub struct AjusteEstoque {
    estoque: i32,
}

#[derive(Serialize)]
pub struct EstoqueAtual {
    sku: String,
    estoque: i32,
}

pub async fn ajustar_estoque(
    State(e): State<Estado>,
    headers: HeaderMap,
    Path(sku): Path<String>,
    Json(a): Json<AjusteEstoque>,
) -> Resultado<Json<EstoqueAtual>> {
    autorizar(&headers, &e)?;
    if a.estoque < 0 {
        return Err(Erro::Invalido("estoque não pode ser negativo".into()));
    }
    let estoque: i32 = sqlx::query_scalar(
        "UPDATE variantes SET estoque = $2 WHERE sku = $1 RETURNING estoque",
    )
    .bind(&sku)
    .bind(a.estoque)
    .fetch_optional(&e.db)
    .await?
    .ok_or(Erro::NaoEncontrado)?;
    Ok(Json(EstoqueAtual { sku, estoque }))
}

// ---------- Pedidos ----------

#[derive(Serialize, FromRow)]
pub struct PedidoAdmin {
    id: Uuid,
    nome: String,
    email: String,
    endereco: String,
    total_centavos: i64,
    status: String,
    criado_em: DateTime<Utc>,
}

#[derive(Serialize, FromRow)]
pub struct ItemAdmin {
    #[serde(skip)]
    pedido_id: Uuid,
    produto: String,
    sku: String,
    tamanho: String,
    cor: String,
    quantidade: i32,
    preco_unit_centavos: i64,
}

#[derive(Serialize)]
pub struct PedidoComItens {
    #[serde(flatten)]
    pedido: PedidoAdmin,
    itens: Vec<ItemAdmin>,
}

pub async fn listar_pedidos(
    State(e): State<Estado>,
    headers: HeaderMap,
) -> Resultado<Json<Vec<PedidoComItens>>> {
    autorizar(&headers, &e)?;
    let pedidos = sqlx::query_as::<_, PedidoAdmin>(
        "SELECT id, nome, email, endereco, total_centavos, status, criado_em
           FROM pedidos ORDER BY criado_em DESC LIMIT 100",
    )
    .fetch_all(&e.db)
    .await?;

    let ids: Vec<Uuid> = pedidos.iter().map(|p| p.id).collect();
    let itens = sqlx::query_as::<_, ItemAdmin>(
        "SELECT i.pedido_id, pr.nome AS produto, v.sku, v.tamanho, v.cor,
                i.quantidade, i.preco_unit_centavos
           FROM itens_pedido i
           JOIN variantes v ON v.id = i.variante_id
           JOIN produtos pr ON pr.id = v.produto_id
          WHERE i.pedido_id = ANY($1)",
    )
    .bind(&ids)
    .fetch_all(&e.db)
    .await?;

    let mut por_pedido: HashMap<Uuid, Vec<ItemAdmin>> = HashMap::new();
    for i in itens {
        por_pedido.entry(i.pedido_id).or_default().push(i);
    }
    let lista = pedidos
        .into_iter()
        .map(|p| {
            let itens = por_pedido.remove(&p.id).unwrap_or_default();
            PedidoComItens { pedido: p, itens }
        })
        .collect();
    Ok(Json(lista))
}

#[derive(Deserialize)]
pub struct MudarStatus {
    status: String,
}

const STATUS_VALIDOS: [&str; 4] = ["pendente", "pago", "enviado", "cancelado"];

pub async fn mudar_status(
    State(e): State<Estado>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
    Json(m): Json<MudarStatus>,
) -> Resultado<Json<Value>> {
    autorizar(&headers, &e)?;
    if !STATUS_VALIDOS.contains(&m.status.as_str()) {
        return Err(Erro::Invalido("status inválido".into()));
    }

    let mut tx = e.db.begin().await?;
    let anterior: String = sqlx::query_scalar("SELECT status FROM pedidos WHERE id = $1 FOR UPDATE")
        .bind(id)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or(Erro::NaoEncontrado)?;

    if anterior == m.status {
        return Ok(ok());
    }
    if anterior == "cancelado" {
        return Err(Erro::Conflito(
            "pedido cancelado não pode ser reaberto (o estoque já foi devolvido)".into(),
        ));
    }

    // Cancelar devolve os itens ao estoque, dentro da mesma transação
    if m.status == "cancelado" {
        sqlx::query(
            "UPDATE variantes v SET estoque = v.estoque + i.quantidade
               FROM itens_pedido i
              WHERE i.variante_id = v.id AND i.pedido_id = $1",
        )
        .bind(id)
        .execute(&mut *tx)
        .await?;
    }

    sqlx::query("UPDATE pedidos SET status = $2 WHERE id = $1")
        .bind(id)
        .bind(&m.status)
        .execute(&mut *tx)
        .await?;
    tx.commit().await?;
    Ok(ok())
}

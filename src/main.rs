mod admin;
mod catalogo;
mod erro;
mod pedidos;

use axum::{
    http::{HeaderValue, Method},
    routing::{get, patch, post},
    Router,
};
use sqlx::{postgres::{PgConnectOptions, PgPoolOptions}, PgPool};
use std::{env, error::Error, str::FromStr, sync::Arc};
use tower_http::{cors::{Any, CorsLayer}, trace::TraceLayer};

#[derive(Clone)]
pub struct Estado {
    pub db: PgPool,
    pub admin_key: Arc<String>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    let database_url = env::var("DATABASE_URL")?;
    let admin_key = env::var("ADMIN_API_KEY")?;
    if admin_key.len() < 16 {
        return Err("ADMIN_API_KEY deve ter pelo menos 16 caracteres".into());
    }

    // Sem cache de prepared statements: seguro tanto no Session quanto no Transaction Pooler.
    let opts = PgConnectOptions::from_str(&database_url)?.statement_cache_capacity(0);
    let db = PgPoolOptions::new().max_connections(5).connect_with(opts).await?;

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PATCH])
        .allow_headers(Any);
    let cors = match env::var("CORS_ORIGIN").ok().as_deref() {
        Some("*") | None => cors.allow_origin(Any),
        Some(o) => cors.allow_origin(o.parse::<HeaderValue>()?),
    };

    let estado = Estado { db, admin_key: Arc::new(admin_key) };

    let app = Router::new()
        .route("/health", get(|| async { "ok" }))
        // público
        .route("/api/produtos", get(catalogo::listar))
        .route("/api/produtos/:slug", get(catalogo::detalhe))
        .route("/api/pedidos", post(pedidos::criar))
        .route("/api/pedidos/:id", get(pedidos::buscar))
        // admin (header x-admin-key)
        .route("/api/admin/produtos", get(admin::listar_produtos).post(admin::criar_produto))
        .route("/api/admin/produtos/:id", patch(admin::editar_produto))
        .route("/api/admin/produtos/:id/variantes", post(admin::criar_variante))
        .route("/api/admin/variantes/:sku/estoque", patch(admin::ajustar_estoque))
        .route("/api/admin/pedidos", get(admin::listar_pedidos))
        .route("/api/admin/pedidos/:id/status", patch(admin::mudar_status))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(estado);

    let porta = env::var("PORT").unwrap_or_else(|_| "8080".into());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{porta}")).await?;
    tracing::info!("servidor em http://0.0.0.0:{porta}");
    axum::serve(listener, app).await?;
    Ok(())
}

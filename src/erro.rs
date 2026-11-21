use axum::{http::StatusCode, response::{IntoResponse, Response}, Json};
use serde_json::json;

#[derive(Debug, thiserror::Error)]
pub enum Erro {
    #[error("não encontrado")]
    NaoEncontrado,
    #[error("{0}")]
    Invalido(String),
    #[error("{0}")]
    Conflito(String),
    #[error("não autorizado")]
    NaoAutorizado,
    #[error("erro de banco: {0}")]
    Banco(sqlx::Error),
}

pub type Resultado<T> = Result<T, Erro>;

impl From<sqlx::Error> for Erro {
    fn from(e: sqlx::Error) -> Self {
        if let sqlx::Error::Database(d) = &e {
            if d.code().as_deref() == Some("23505") {
                return Erro::Conflito(
                    "já existe um registro com esse valor (slug, SKU ou combinação tamanho/cor)".into(),
                );
            }
        }
        Erro::Banco(e)
    }
}

impl IntoResponse for Erro {
    fn into_response(self) -> Response {
        let (status, msg) = match &self {
            Erro::NaoEncontrado => (StatusCode::NOT_FOUND, self.to_string()),
            Erro::Invalido(m) => (StatusCode::BAD_REQUEST, m.clone()),
            Erro::Conflito(m) => (StatusCode::CONFLICT, m.clone()),
            Erro::NaoAutorizado => (StatusCode::UNAUTHORIZED, self.to_string()),
            Erro::Banco(e) => {
                tracing::error!("{e}");
                (StatusCode::INTERNAL_SERVER_ERROR, "erro interno".to_string())
            }
        };
        (status, Json(json!({ "erro": msg }))).into_response()
    }
}

use crate::{admin::autorizar, erro::{Erro, Resultado}, Estado};
use axum::{extract::{Multipart, State}, http::HeaderMap, Json};
use serde_json::{json, Value};
use uuid::Uuid;

const MAX_BYTES: usize = 5 * 1024 * 1024;

/// Identifica o formato pelos bytes iniciais (não confia no nome nem no tipo enviado pelo cliente)
fn detectar(b: &[u8]) -> Option<(&'static str, &'static str)> {
    if b.starts_with(&[0xFF, 0xD8, 0xFF]) {
        Some(("image/jpeg", "jpg"))
    } else if b.starts_with(&[0x89, b'P', b'N', b'G', 0x0D, 0x0A, 0x1A, 0x0A]) {
        Some(("image/png", "png"))
    } else if b.len() > 12 && &b[0..4] == b"RIFF" && &b[8..12] == b"WEBP" {
        Some(("image/webp", "webp"))
    } else {
        None
    }
}

pub async fn enviar(
    State(e): State<Estado>,
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Resultado<Json<Value>> {
    autorizar(&headers, &e)?;
    let st = e.storage.as_ref().ok_or_else(|| {
        Erro::Externo("o envio de imagens não está configurado no servidor".into())
    })?;

    let mut arquivo = None;
    while let Some(campo) = multipart
        .next_field()
        .await
        .map_err(|_| Erro::Invalido("envio inválido".into()))?
    {
        if campo.name() == Some("arquivo") {
            let bytes = campo
                .bytes()
                .await
                .map_err(|_| Erro::Invalido("arquivo inválido ou acima do limite".into()))?;
            arquivo = Some(bytes);
            break;
        }
    }

    let bytes = arquivo.ok_or_else(|| Erro::Invalido("envie o arquivo no campo 'arquivo'".into()))?;
    if bytes.is_empty() || bytes.len() > MAX_BYTES {
        return Err(Erro::Invalido("a imagem deve ter até 5 MB".into()));
    }
    let (mime, ext) = detectar(&bytes)
        .ok_or_else(|| Erro::Invalido("formato não suportado: use JPG, PNG ou WebP".into()))?;

    let nome = format!("{}.{}", Uuid::new_v4(), ext);
    let url = format!("{}/storage/v1/object/{}/{}", st.url, st.bucket, nome);

    let mut req = st
        .http
        .post(&url)
        .header("apikey", st.chave.as_str())
        .header("content-type", mime)
        .header("x-upsert", "false")
        .body(bytes.to_vec());
    // Chaves novas (sb_secret_...) não são JWT: vão só em `apikey`.
    // Chaves legadas (service_role, JWT) também usam Authorization: Bearer.
    if !st.chave.starts_with("sb_") {
        req = req.bearer_auth(&st.chave);
    }

    let resp = req.send().await.map_err(|err| {
        tracing::error!("falha ao contatar o Storage: {err}");
        Erro::Externo("não foi possível enviar a imagem".into())
    })?;

    if !resp.status().is_success() {
        let status = resp.status();
        let corpo = resp.text().await.unwrap_or_default();
        tracing::error!("Storage respondeu {status}: {corpo}");
        return Err(Erro::Externo("o armazenamento recusou a imagem".into()));
    }

    Ok(Json(json!({
        "url": format!("{}/storage/v1/object/public/{}/{}", st.url, st.bucket, nome)
    })))
}

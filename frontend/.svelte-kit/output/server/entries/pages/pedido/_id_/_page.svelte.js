import { h as head, e as ensure_array_like, a5 as derived } from "../../../../chunks/index.js";
import { b as brl } from "../../../../chunks/formato.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const p = derived(() => data.pedido);
    const rotulos = {
      pendente: "Aguardando pagamento",
      pago: "Pago",
      enviado: "Enviado",
      cancelado: "Cancelado"
    };
    head("5v2q46", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Pedido registrado</title>`);
      });
    });
    $$renderer2.push(`<h1>Pedido registrado</h1> <div class="dados-pedido"><p>Código: <strong>${escape_html(p().id)}</strong></p> <p>Situação: <strong>${escape_html(rotulos[p().status] ?? p().status)}</strong></p> <p>Entrega para ${escape_html(p().nome)} — ${escape_html(p().endereco)}</p></div> <ul class="linhas"><!--[-->`);
    const each_array = ensure_array_like(p().itens);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let i = each_array[$$index];
      $$renderer2.push(`<li class="linha"><div><p>${escape_html(i.produto)}</p> <p class="sub">${escape_html(i.cor)} · ${escape_html(i.tamanho)} · ${escape_html(i.quantidade)} × ${escape_html(brl(i.preco_unit_centavos))}</p></div> <span></span> <p><strong>${escape_html(brl(i.preco_unit_centavos * i.quantidade))}</strong></p></li>`);
    }
    $$renderer2.push(`<!--]--></ul> <p class="total">Total: ${escape_html(brl(p().total_centavos))}</p> <p><a href="/">Continuar comprando</a></p>`);
  });
}
export {
  _page as default
};

const brl = (centavos) => (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const ORDEM = ["PP", "P", "M", "G", "GG", "XG", "XGG", "G1", "G2", "G3"];
function ordenarTamanhos(lista) {
  return [...lista].sort((a, b) => {
    const ia = ORDEM.indexOf(a.toUpperCase());
    const ib = ORDEM.indexOf(b.toUpperCase());
    if (ia >= 0 && ib >= 0) return ia - ib;
    if (ia >= 0) return -1;
    if (ib >= 0) return 1;
    return a.localeCompare(b, "pt-BR", { numeric: true });
  });
}
export {
  brl as b,
  ordenarTamanhos as o
};

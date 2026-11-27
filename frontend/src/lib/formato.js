import { PARCELAS } from '$lib/config.js';

export const brl = (centavos) =>
  (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Valor de cada parcela (arredondado para cima, em centavos)
export const parcela = (centavos) => Math.ceil(centavos / PARCELAS);

const ORDEM = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XGG', 'G1', 'G2', 'G3'];

// Ordena tamanhos de roupa (PP, P, M, G...) e números (36, 38, 40...) de forma natural
export function ordenarTamanhos(lista) {
  return [...lista].sort((a, b) => {
    const ia = ORDEM.indexOf(a.toUpperCase());
    const ib = ORDEM.indexOf(b.toUpperCase());
    if (ia >= 0 && ib >= 0) return ia - ib;
    if (ia >= 0) return -1;
    if (ib >= 0) return 1;
    return a.localeCompare(b, 'pt-BR', { numeric: true });
  });
}

const CORES = {
  preto: '#1b1917',
  branco: '#f8f5ef',
  off: '#efe9de',
  cru: '#e6d9c4',
  natural: '#ddcdb4',
  bege: '#d5c3a7',
  areia: '#c9b393',
  marrom: '#6c4a34',
  caramelo: '#a9713f',
  tabaco: '#8a5a34',
  cinza: '#9b9791',
  grafite: '#4b4a47',
  azul: '#3d5a7a',
  jeans: '#5b7496',
  verde: '#4c6350',
  oliva: '#6d6d4d',
  vermelho: '#9e3b32',
  vinho: '#5f2b33',
  rosa: '#d8a7a7',
  amarelo: '#d9b74a',
  laranja: '#c47a3a',
  roxo: '#5e4a6b'
};

// Converte o nome da cor (texto vindo do banco) em um tom aproximado para o seletor
export function corCss(nome = '') {
  const n = nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  if (CORES[n]) return CORES[n];
  const achado = Object.keys(CORES).find((chave) => n.includes(chave));
  return achado ? CORES[achado] : '#cec5b6';
}

// Deixa a primeira letra do nome em maiúscula para legendas curtas
export const capitalizar = (texto = '') =>
  texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : '';

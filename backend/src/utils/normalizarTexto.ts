// tira acentos, espaços das pontas e letras maiúsculas, para comparar nomes
export function normalizarTexto(texto: string): string {
  return texto
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

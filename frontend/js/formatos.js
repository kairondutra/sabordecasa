// funções para formatar e converter valores

const IMAGEM_PADRAO = '../assets/images/upload_image.jpeg';
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatarPreco(valor) {
    return moeda.format(valor);
}

// transforma o texto digitado ("R$ 1.234,50") em número (1234.5)
export function converterPreco(texto) {
    let limpo = texto.replace(/[^\d,.-]/g, '');
    if (limpo.includes(',')) {
        limpo = limpo.replace(/\./g, '').replace(',', '.');
    }
    return limpo ? Number(limpo) : NaN;
}

// ignora acentos e letras maiúsculas na busca
export function normalizarTexto(texto) {
    return texto.trim().toLocaleLowerCase('pt-BR')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
}

// impede que um texto digitado pelo usuário seja lido como código HTML
export function escaparHtml(texto) {
    const caracteres = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(texto ?? '').replace(/[&<>"']/g, (caractere) => caracteres[caractere]);
}

export function imagemOuPadrao(endereco) {
    return endereco || IMAGEM_PADRAO;
}

export function nomeDoStatus(disponivel) {
    return disponivel ? 'Disponível' : 'Esgotado';
}

// lê um parâmetro do endereço da página, como ?categoria=2
export function lerParametro(nome) {
    return new URLSearchParams(window.location.search).get(nome);
}

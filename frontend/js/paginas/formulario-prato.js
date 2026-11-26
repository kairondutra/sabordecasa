// cadastro e edição de prato (as duas telas usam este arquivo)
import { servicoCategorias, servicoPratos } from '../api.js';
import { converterPreco, formatarPreco, lerParametro } from '../formatos.js';
import { aoEnviar, criarCampoImagem, marcarCampo, redirecionarComAviso } from '../interface.js';

const formulario = document.querySelector('#form-prato');
const editando = formulario.dataset.modo === 'edicao';
const pratoId = Number(lerParametro('id'));
const categoriaDeOrigem = Number(lerParametro('categoria')) || null;
const campoImagem = criarCampoImagem();
const barraDeErro = document.querySelector('.toast-erro');

const campos = {
    nome: document.querySelector('#nome-prato'),
    descricao: document.querySelector('#descricao-prato'),
    preco: document.querySelector('#preco-prato'),
    categoria: document.querySelector('#categoria-prato'),
    quantidade: document.querySelector('#quantidade-prato'),
    disponivel: document.querySelector('#disponivel-prato'),
    imagem: document.querySelector('#imagem-prato')
};

// tela para onde voltamos depois de salvar ou cancelar
const listaDaCategoria = categoriaDeOrigem && `pratos_categoria.html?categoria=${categoriaDeOrigem}`;
const destinoDeVolta = listaDaCategoria || (editando ? 'pratos_categoria.html' : 'index.html');

function lerDados() {
    return {
        nome: campos.nome.value.trim(),
        descricao: campos.descricao.value.trim(),
        preco: converterPreco(campos.preco.value),
        categoria_id: Number(campos.categoria.value),
        quantidade: campos.quantidade.value === '' ? -1 : Number(campos.quantidade.value),
        disponivel: campos.disponivel.checked,
        imagem_url: campoImagem.obter()
    };
}

// confere os campos antes de enviar (o back-end confere tudo de novo)
function validar(dados) {
    const erros = [
        [campos.nome, dados.nome ? '' : 'Informe o nome do prato.'],
        [campos.preco, dados.preco > 0 ? '' : 'O preço deve ser maior que zero.'],
        [campos.categoria, dados.categoria_id ? '' : 'Escolha uma categoria.'],
        [campos.quantidade, Number.isInteger(dados.quantidade) && dados.quantidade >= 0 ? '' : 'Informe uma quantidade de zero para cima.'],
        // a foto é obrigatória somente no cadastro
        [campos.imagem, editando || dados.imagem_url ? '' : 'Escolha uma foto para o prato.']
    ];
    erros.forEach(([campo, mensagem]) => marcarCampo(campo, mensagem));
    return erros.every(([, mensagem]) => !mensagem);
}

// atualiza o cartão "Regras desta tela" conforme o preenchimento
function mostrarRegras() {
    const dados = lerDados();
    const cumpridas = [
        Boolean(dados.nome && campos.preco.value.trim() && dados.categoria_id),
        dados.preco > 0,
        Boolean(dados.categoria_id)
    ];
    document.querySelectorAll('.regra-item').forEach((regra, i) => {
        regra.className = `regra-item ${cumpridas[i] ? 'valido' : 'invalido'}`;
        regra.querySelector('.regra-icone').textContent = cumpridas[i] ? '✓' : '✕';
    });
}

function mostrarBarraDeErro(mensagem) {
    barraDeErro.querySelector('p').textContent = mensagem;
    barraDeErro.hidden = false;
    barraDeErro.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function salvar() {
    const dados = lerDados();
    barraDeErro.hidden = true;
    if (!validar(dados)) {
        mostrarBarraDeErro('Revise os campos destacados e tente novamente.');
        return;
    }

    try {
        await (editando ? servicoPratos.atualizar(pratoId, dados) : servicoPratos.criar(dados));
        redirecionarComAviso(destinoDeVolta, `"${dados.nome}" foi salvo com sucesso.`);
    } catch (erro) {
        mostrarBarraDeErro(erro.message);
    }
}

async function carregarCategorias() {
    const categorias = await servicoCategorias.listar();
    const opcoes = categorias.map((categoria) => new Option(categoria.nome, categoria.id));
    campos.categoria.replaceChildren(new Option('Selecione uma categoria', ''), ...opcoes);
    campos.categoria.value = categoriaDeOrigem || '';
}

async function preencherPrato() {
    const prato = await servicoPratos.buscar(pratoId);
    campos.nome.value = prato.nome;
    campos.descricao.value = prato.descricao || '';
    campos.preco.value = formatarPreco(prato.preco);
    campos.categoria.value = prato.categoria_id;
    campos.quantidade.value = prato.quantidade;
    campos.disponivel.checked = Boolean(prato.disponivel);
    campoImagem.definir(prato.imagem_url, 'Foto atual do prato.');
}

async function iniciar() {
    // a tela de edição precisa saber qual prato abrir
    if (editando && !pratoId) {
        window.location.replace('pratos_categoria.html');
        return;
    }
    document.querySelector('.link-voltar').href = destinoDeVolta;
    document.querySelector('.btn-cancelar').addEventListener('click', () => {
        window.location.href = destinoDeVolta;
    });
    formulario.addEventListener('input', mostrarRegras);

    try {
        await carregarCategorias();
        if (editando) {
            await preencherPrato();
        }
        aoEnviar(formulario, salvar);
        mostrarRegras();
    } catch (erro) {
        mostrarBarraDeErro(erro.message);
        formulario.querySelector('.btn-salvar').disabled = true;
    }
}

// evita recarregar a página caso o botão seja usado antes de os dados chegarem
formulario.addEventListener('submit', (evento) => evento.preventDefault());
iniciar();

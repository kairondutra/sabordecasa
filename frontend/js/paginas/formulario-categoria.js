// cadastro, edição, listagem e exclusão de categorias (usado nas duas telas de categoria)
import { servicoCategorias, servicoPratos } from '../api.js';
import { escaparHtml } from '../formatos.js';
import {
    aoEnviar, criarCampoImagem, excluirComConfirmacao, executarComAviso,
    marcarCampo, mostrarAvisoPendente, notificar, redirecionarComAviso
} from '../interface.js';

const formulario = document.querySelector('#form-categoria');
// a lista só existe na tela "Editar categorias"
const lista = document.querySelector('#lista-categorias');
const campoImagem = criarCampoImagem();

const campos = {
    nome: document.querySelector('#nome-categoria'),
    descricao: document.querySelector('#descricao-categoria'),
    ordem: document.querySelector('#ordem-cardapio'),
    visivel: document.querySelector('#visivel-categoria')
};

let categorias = [];
let emEdicao = null;

function lerDados() {
    return {
        nome: campos.nome.value.trim(),
        descricao: campos.descricao.value.trim(),
        ordem: Number(campos.ordem.value),
        visivel: campos.visivel.checked,
        imagem_url: campoImagem.obter()
    };
}

function validar(dados) {
    const erros = [
        [campos.nome, dados.nome ? '' : 'Informe o nome da categoria.'],
        [campos.ordem, Number.isInteger(dados.ordem) && dados.ordem >= 0 ? '' : 'A ordem deve ser um número inteiro, de zero para cima.']
    ];
    erros.forEach(([campo, mensagem]) => marcarCampo(campo, mensagem));
    return erros.every(([, mensagem]) => !mensagem);
}

// preenche o formulário com uma categoria, ou limpa quando for uma nova
function preencherFormulario(categoria = null) {
    emEdicao = categoria;
    campos.nome.value = categoria?.nome || '';
    campos.descricao.value = categoria?.descricao || '';
    campos.ordem.value = categoria ? categoria.ordem : categorias.length + 1;
    campos.visivel.checked = categoria ? Boolean(categoria.visivel) : true;
    campoImagem.definir(categoria?.imagem_url, categoria?.imagem_url ? 'Imagem atual.' : undefined);
    Object.values(campos).forEach((campo) => marcarCampo(campo));
    document.querySelector('#titulo-formulario').textContent = categoria
        ? `Editando: ${categoria.nome}`
        : 'Informações da categoria';
}

function montarItem(categoria, total) {
    const resumo = total === 0 ? 'Sem pratos vinculados' : `${total} prato(s) vinculado(s)`;
    return `
        <li data-id="${categoria.id}">
            <div class="categoria-lista-dados"><strong>${escaparHtml(categoria.nome)}</strong><small>${resumo}</small></div>
            <span class="acoes-categoria">
                <a href="pratos_categoria.html?categoria=${categoria.id}">Ver pratos</a>
                <button type="button" data-acao="editar">Editar</button>
                <button type="button" data-acao="excluir">Excluir</button>
            </span>
        </li>`;
}

async function carregarCategorias() {
    const [todas, pratos] = await Promise.all([servicoCategorias.listar(), servicoPratos.listar()]);
    categorias = todas;
    if (!lista) {
        return;
    }
    const contar = (id) => pratos.filter((prato) => prato.categoria_id === id).length;
    lista.innerHTML = categorias.length
        ? categorias.map((categoria) => montarItem(categoria, contar(categoria.id))).join('')
        : '<li class="estado-vazio">Nenhuma categoria cadastrada.</li>';
}

async function salvar() {
    const dados = lerDados();
    if (!validar(dados)) {
        notificar('Revise os campos destacados.', 'erro');
        return;
    }

    await executarComAviso(async () => {
        await (emEdicao ? servicoCategorias.atualizar(emEdicao.id, dados) : servicoCategorias.criar(dados));
        if (!lista) {
            redirecionarComAviso('editar_categoria.html', 'Categoria criada com sucesso.');
            return;
        }
        notificar('Categoria salva com sucesso.');
        await carregarCategorias();
        preencherFormulario();
    });
}

function excluir(categoria) {
    excluirComConfirmacao({
        servico: servicoCategorias,
        item: categoria,
        mensagem: 'Categoria excluída com sucesso.',
        aoExcluir: async () => {
            await carregarCategorias();
            preencherFormulario();
        }
    });
}

function configurarLista() {
    lista?.addEventListener('click', (evento) => {
        const botao = evento.target.closest('button[data-acao]');
        if (!botao) {
            return;
        }
        const id = Number(botao.closest('li').dataset.id);
        const categoria = categorias.find((item) => item.id === id);
        if (botao.dataset.acao === 'excluir') {
            excluir(categoria);
            return;
        }
        preencherFormulario(categoria);
        campos.nome.focus();
    });
}

function configurarCancelar() {
    document.querySelector('.btn-cancelar').addEventListener('click', () => {
        if (lista) {
            preencherFormulario();
            return;
        }
        window.location.href = 'editar_categoria.html';
    });
}

aoEnviar(formulario, salvar);
configurarLista();
configurarCancelar();
mostrarAvisoPendente();
executarComAviso(async () => {
    await carregarCategorias();
    preencherFormulario();
});

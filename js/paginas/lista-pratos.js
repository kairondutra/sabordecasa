// lista de pratos: todos, ou somente os de uma categoria (?categoria=ID)
import { servicoCategorias, servicoPratos } from '../api.js';
import { escaparHtml, formatarPreco, imagemOuPadrao, lerParametro, nomeDoStatus, normalizarTexto } from '../formatos.js';
import { excluirComConfirmacao, executarComAviso, retirarAvisoPendente } from '../interface.js';

const categoriaId = Number(lerParametro('categoria')) || null;
const lista = document.querySelector('#lista-completa-pratos');
const abas = document.querySelectorAll('.filtro-tab');
const campoBusca = document.querySelector('.input-busca-prato');

let pratos = [];
let categorias = [];
let filtroStatus = 'todos';

function nomeDaCategoria(id) {
    return categorias.find((categoria) => categoria.id === id)?.nome || '';
}

function montarLinha(prato) {
    const nome = escaparHtml(prato.nome);
    const status = prato.disponivel ? 'disponivel' : 'esgotado';
    const origem = categoriaId ? `&categoria=${categoriaId}` : '';
    return `
        <div class="prato-item" data-id="${prato.id}">
            <div class="col-prato prato-info">
                <img src="${escaparHtml(imagemOuPadrao(prato.imagem_url))}" alt="${nome}" class="prato-foto">
                <div class="prato-textos"><h4>${nome}</h4><p>${escaparHtml(nomeDaCategoria(prato.categoria_id))}</p></div>
            </div>
            <div class="col-preco">${formatarPreco(prato.preco)}</div>
            <div class="col-status">
                <span class="status-badge ${status}"><span class="status-dot"></span> ${nomeDoStatus(prato.disponivel)}</span>
            </div>
            <div class="col-acoes">
                <a href="editar_prato.html?id=${prato.id}${origem}" class="btn-acao btn-editar" title="Editar">
                    <img src="assets/icon/icon_edit_pencil.png" alt="Editar">
                </a>
                <button type="button" class="btn-acao btn-excluir" title="Excluir">
                    <img src="assets/icon/icon_trash.png" alt="Excluir">
                </button>
            </div>
        </div>`;
}

function mostrarLinhas() {
    const termo = normalizarTexto(campoBusca.value);
    const visiveis = pratos.filter((prato) => {
        const combinaStatus = filtroStatus === 'todos'
            || (filtroStatus === 'disponiveis') === Boolean(prato.disponivel);
        return combinaStatus && normalizarTexto(prato.nome).includes(termo);
    });
    lista.innerHTML = visiveis.length
        ? visiveis.map(montarLinha).join('')
        : '<p class="estado-vazio">Nenhum prato encontrado.</p>';
}

function mostrarContadores() {
    const disponiveis = pratos.filter((prato) => prato.disponivel).length;
    abas[0].textContent = `Todos (${pratos.length})`;
    abas[1].textContent = `Disponíveis (${disponiveis})`;
    abas[2].textContent = `Esgotados (${pratos.length - disponiveis})`;
}

// ajusta título, caminho e botão quando a lista é de uma categoria só
function mostrarCabecalho() {
    if (!categoriaId) {
        return;
    }
    const nome = nomeDaCategoria(categoriaId);
    document.querySelector('#titulo-lista').textContent = nome;
    document.querySelector('.breadcrumb_item_ativo').textContent = `Pratos de ${nome}`;
    document.querySelector('#botao-novo-prato').href = `novo_prato.html?categoria=${categoriaId}`;
    const voltar = document.querySelector('.link-voltar');
    voltar.href = 'editar_categoria.html';
    voltar.textContent = '← Voltar para categorias';
}

async function carregarLista() {
    [categorias, pratos] = await Promise.all([
        servicoCategorias.listar(),
        categoriaId ? servicoCategorias.listarPratos(categoriaId) : servicoPratos.listar()
    ]);
    mostrarCabecalho();
    mostrarContadores();
    mostrarLinhas();
}

// barra verde mostrada depois de salvar um prato
function mostrarBarraDeSucesso() {
    const mensagem = retirarAvisoPendente();
    const barra = document.querySelector('#toastSucesso');
    if (mensagem) {
        barra.querySelector('.toast-mensagem').textContent = mensagem;
        barra.hidden = false;
    }
    document.querySelector('#fecharToast').addEventListener('click', () => barra.hidden = true);
}

function configurarFiltros() {
    const filtros = ['todos', 'disponiveis', 'esgotados'];
    abas.forEach((aba, indice) => {
        aba.addEventListener('click', () => {
            abas.forEach((item) => item.classList.toggle('ativo', item === aba));
            filtroStatus = filtros[indice];
            mostrarLinhas();
        });
    });
    campoBusca.addEventListener('input', mostrarLinhas);
}

function configurarExclusao() {
    lista.addEventListener('click', (evento) => {
        const botao = evento.target.closest('.btn-excluir');
        if (!botao) {
            return;
        }
        const id = Number(botao.closest('.prato-item').dataset.id);
        excluirComConfirmacao({
            servico: servicoPratos,
            item: pratos.find((prato) => prato.id === id),
            mensagem: 'Prato excluído com sucesso.',
            aoExcluir: carregarLista
        });
    });
}

configurarFiltros();
configurarExclusao();
mostrarBarraDeSucesso();
executarComAviso(carregarLista);

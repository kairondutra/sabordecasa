// tela inicial: resumo e cartões do cardápio
import { servicoCategorias, servicoPratos } from '../api.js';
import { escaparHtml, formatarPreco, imagemOuPadrao, nomeDoStatus, normalizarTexto } from '../formatos.js';
import { excluirComConfirmacao, executarComAviso, mostrarAvisoPendente, notificar } from '../interface.js';

const grade = document.querySelector('.pratos-admin');
const abas = document.querySelectorAll('.aba-status');
const campoBusca = document.querySelector('.busca-painel input');
const filtroCategoria = document.querySelector('.filtro-categoria');

let pratos = [];
let categorias = [];
let filtroStatus = 'todos';

function nomeDaCategoria(id) {
    return categorias.find((categoria) => categoria.id === id)?.nome || '';
}

function montarCartao(prato) {
    const nome = escaparHtml(prato.nome);
    const status = prato.disponivel ? 'disponivel' : 'esgotado';
    return `
        <article class="prato-admin-card" data-prato-id="${prato.id}">
            <div class="prato-admin-imagem"><img src="${escaparHtml(imagemOuPadrao(prato.imagem_url))}" alt="${nome}"></div>
            <div class="prato-admin-info">
                <div><span class="tag-categoria">${escaparHtml(nomeDaCategoria(prato.categoria_id))}</span><h3>${nome}</h3></div>
                <strong>${formatarPreco(prato.preco)}</strong>
            </div>
            <div class="prato-admin-rodape">
                <span class="status ${status}"><i></i> ${nomeDoStatus(prato.disponivel)}</span>
                <label class="alternador"><input type="checkbox" aria-label="Disponibilidade de ${nome}" ${prato.disponivel ? 'checked' : ''}><span></span></label>
                <a class="botao-editar-prato" href="editar_prato.html?id=${prato.id}">Editar</a>
                <button class="botao-excluir-prato" type="button" aria-label="Excluir ${nome}">Excluir</button>
            </div>
        </article>`;
}

function filtrarPratos() {
    const termo = normalizarTexto(campoBusca.value);
    const categoriaId = Number(filtroCategoria.value);
    return pratos.filter((prato) => {
        const combinaStatus = filtroStatus === 'todos'
            || (filtroStatus === 'disponiveis') === Boolean(prato.disponivel);
        const combinaCategoria = !categoriaId || prato.categoria_id === categoriaId;
        return combinaStatus && combinaCategoria && normalizarTexto(prato.nome).includes(termo);
    });
}

function mostrarCartoes() {
    const visiveis = filtrarPratos();
    grade.innerHTML = visiveis.length
        ? visiveis.map(montarCartao).join('')
        : '<p class="estado-vazio">Nenhum prato encontrado.</p>';
}

function mostrarIndicadores() {
    const disponiveis = pratos.filter((prato) => prato.disponivel).length;
    const totais = [pratos.length, disponiveis, pratos.length - disponiveis];
    document.querySelectorAll('.indicador-painel strong').forEach((campo, i) => campo.textContent = totais[i]);
    document.querySelectorAll('.aba-status b').forEach((campo, i) => campo.textContent = totais[i]);

    const porcentagem = pratos.length ? Math.round((disponiveis / pratos.length) * 100) : 0;
    document.querySelector('#resumo-total').textContent = `${categorias.length} categorias`;
    document.querySelector('#resumo-disponiveis').textContent = `${porcentagem}% do cardápio`;
}

function mostrarOpcoesDeCategoria() {
    const opcoes = categorias.map((categoria) => new Option(categoria.nome, categoria.id));
    filtroCategoria.replaceChildren(new Option('Todos os tipos', ''), ...opcoes);
}

async function carregarPainel() {
    [categorias, pratos] = await Promise.all([servicoCategorias.listar(), servicoPratos.listar()]);
    mostrarIndicadores();
    mostrarCartoes();
}

function buscarPratoDoElemento(elemento) {
    const id = Number(elemento.closest('.prato-admin-card').dataset.pratoId);
    return pratos.find((prato) => prato.id === id);
}

async function alterarDisponibilidade(prato, disponivel) {
    await executarComAviso(async () => {
        await servicoPratos.atualizar(prato.id, { ...prato, disponivel });
        notificar(`${prato.nome}: ${nomeDoStatus(disponivel)}.`);
    });
    // recarrega para a tela mostrar exatamente o que está salvo
    await executarComAviso(carregarPainel);
}

function configurarCartoes() {
    grade.addEventListener('change', (evento) => {
        alterarDisponibilidade(buscarPratoDoElemento(evento.target), evento.target.checked);
    });
    grade.addEventListener('click', (evento) => {
        const botao = evento.target.closest('.botao-excluir-prato');
        if (botao) {
            excluirComConfirmacao({
                servico: servicoPratos,
                item: buscarPratoDoElemento(botao),
                mensagem: 'Prato excluído com sucesso.',
                aoExcluir: carregarPainel
            });
        }
    });
}

function configurarFiltros() {
    abas.forEach((aba) => {
        aba.addEventListener('click', (evento) => {
            evento.preventDefault();
            abas.forEach((item) => item.classList.toggle('ativa', item === aba));
            filtroStatus = aba.getAttribute('href').replace('#', '');
            mostrarCartoes();
        });
    });
    campoBusca.addEventListener('input', mostrarCartoes);
    filtroCategoria.addEventListener('change', mostrarCartoes);
}

function configurarMenuPerfil() {
    const botao = document.querySelector('.perfil-menu');
    const menu = document.querySelector('#menu-perfil');
    const alternar = (aberto) => {
        menu.hidden = !aberto;
        botao.setAttribute('aria-expanded', String(aberto));
    };
    botao.addEventListener('click', (evento) => {
        evento.stopPropagation();
        alternar(menu.hidden);
    });
    document.addEventListener('click', () => alternar(false));
}

configurarFiltros();
configurarCartoes();
configurarMenuPerfil();
mostrarAvisoPendente();
executarComAviso(async () => {
    await carregarPainel();
    mostrarOpcoesDeCategoria();
});

(function () {
    'use strict';

    const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
    const paginasDeCategorias = ['index.html', 'nova_categoria.html', 'editar_categoria.html'];

    function configurarNavegacao() {
        const categoriaAtiva = paginasDeCategorias.includes(paginaAtual);
        document.querySelectorAll('.header_navegacao .menu-item').forEach((item) => {
            const destino = item.getAttribute('href');
            const deveAtivar = categoriaAtiva
                ? destino === 'index.html'
                : destino === 'pratos_categoria.html';

            item.classList.toggle('ativo', deveAtivar);
            item.setAttribute('aria-current', deveAtivar ? 'page' : 'false');
        });
    }

    function configurarBuscaDeCategorias() {
        const campo = document.querySelector('.input_busca');
        const grade = document.querySelector('.categorias_container');
        if (!campo || !grade) {
            return;
        }

        const cards = [...grade.querySelectorAll('.card-categoria')];
        const estadoVazio = document.createElement('p');
        estadoVazio.className = 'estado-vazio';
        estadoVazio.textContent = 'Nenhuma categoria encontrada.';
        estadoVazio.hidden = true;
        grade.after(estadoVazio);

        const atualizar = () => {
            const termo = campo.value.trim().toLocaleLowerCase('pt-BR');
            let visiveis = 0;

            cards.forEach((card) => {
                const corresponde = card.textContent.toLocaleLowerCase('pt-BR').includes(termo);
                card.hidden = !corresponde;
                if (corresponde) {
                    visiveis += 1;
                }
            });

            estadoVazio.hidden = visiveis > 0;
        };

        campo.addEventListener('input', atualizar);
    }

    function configurarOrdenacao() {
        const seletor = document.querySelector('.select_filtro');
        const grade = document.querySelector('.categorias_container');
        if (!seletor || !grade) {
            return;
        }

        seletor.addEventListener('change', () => {
            const cards = [...grade.querySelectorAll('.card-categoria')];
            cards.sort((a, b) => {
                if (seletor.value === 'alfabetica') {
                    return a.querySelector('h3').textContent.localeCompare(
                        b.querySelector('h3').textContent,
                        'pt-BR'
                    );
                }
                return 0;
            });
            cards.forEach((card) => grade.append(card));
        });
    }

    function configurarFiltrosDePratos() {
        const abas = document.querySelectorAll('.filtro-tab');
        const linhas = document.querySelectorAll('.prato-item');
        if (!abas.length || !linhas.length) {
            return;
        }

        abas.forEach((aba) => {
            aba.addEventListener('click', () => {
                abas.forEach((item) => item.classList.remove('ativo'));
                aba.classList.add('ativo');
                const filtro = aba.textContent.toLocaleLowerCase('pt-BR');

                linhas.forEach((linha) => {
                    const status = linha.querySelector('.status-badge')?.textContent
                        .trim()
                        .toLocaleLowerCase('pt-BR');
                    linha.hidden = filtro.startsWith('todos')
                        || (filtro.startsWith('disponíveis') && status === 'disponível')
                        || (filtro.startsWith('esgotados') && status === 'esgotado')
                        ? false
                        : true;
                });
            });
        });
    }

    function fecharModal(modal) {
        modal?.remove();
        document.body.classList.remove('modal-aberto');
    }

    window.abrirModalExclusao = function (id) {
        const modalExistente = document.querySelector('.modal-exclusao');
        if (modalExistente) {
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-exclusao';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="modal-cartao">
                <span class="modal-icone">!</span>
                <h2>Excluir item?</h2>
                <p>Essa ação não pode ser desfeita. Deseja continuar?</p>
                <div class="modal-acoes">
                    <button type="button" class="btn-cancelar modal-cancelar">Cancelar</button>
                    <button type="button" class="btn-excluir-confirmar">Excluir</button>
                </div>
            </div>
        `;

        modal.querySelector('.modal-cancelar').addEventListener('click', () => fecharModal(modal));
        modal.querySelector('.btn-excluir-confirmar').addEventListener('click', () => {
            const linha = document.querySelector(`.prato-item[data-id="${id}"]`);
            linha?.remove();
            fecharModal(modal);
            mostrarNotificacao('Item excluído com sucesso.', 'sucesso');
        });
        modal.addEventListener('click', (evento) => {
            if (evento.target === modal) {
                fecharModal(modal);
            }
        });
        document.body.append(modal);
        document.body.classList.add('modal-aberto');
        modal.querySelector('.modal-cancelar').focus();
    };

    function mostrarNotificacao(mensagem, tipo) {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        notificacao.textContent = mensagem;
        document.body.append(notificacao);
        window.setTimeout(() => notificacao.remove(), 3200);
    }

    function configurarFormularios() {
        document.querySelectorAll('form').forEach((formulario) => {
            formulario.addEventListener('submit', (evento) => {
                evento.preventDefault();
                mostrarNotificacao('Alterações salvas com sucesso.', 'sucesso');
            });
        });
    }

    function configurarToasts() {
        document.querySelectorAll('.toast-fechar').forEach((botao) => {
            botao.addEventListener('click', () => botao.closest('[class*="toast-"]')?.remove());
        });
    }

    configurarNavegacao();
    configurarBuscaDeCategorias();
    configurarOrdenacao();
    configurarFiltrosDePratos();
    configurarFormularios();
    configurarToasts();
})();

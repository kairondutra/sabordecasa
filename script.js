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
            if (formulario.id === 'novo-prato-form') {
                return;
            }
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

    function configurarMenuPerfil() {
        const botao = document.querySelector('.perfil-menu');
        const menu = document.querySelector('#menu-perfil');
        if (!botao || !menu) {
            return;
        }

        botao.addEventListener('click', (evento) => {
            evento.stopPropagation();
            const aberto = !menu.hidden;
            menu.hidden = aberto;
            botao.setAttribute('aria-expanded', String(!aberto));
        });

        document.addEventListener('click', () => {
            menu.hidden = true;
            botao.setAttribute('aria-expanded', 'false');
        });
    }

    function atualizarStatusCartao(cartao, disponivel) {
        const status = cartao.querySelector('.status');
        if (!status) {
            return;
        }

        status.classList.toggle('disponivel', disponivel);
        status.classList.toggle('esgotado', !disponivel);
        status.innerHTML = `<i></i> ${disponivel ? 'Disponível' : 'Esgotado'}`;
    }

    function configurarDisponibilidade() {
        document.querySelectorAll('.prato-admin-card .alternador input').forEach((controle) => {
            controle.addEventListener('change', () => {
                atualizarStatusCartao(controle.closest('.prato-admin-card'), controle.checked);
            });
        });
    }

    function lerImagem(input) {
        return new Promise((resolve, reject) => {
            const arquivo = input.files[0];
            if (!arquivo) {
                resolve('');
                return;
            }
            const leitor = new FileReader();
            leitor.addEventListener('load', () => resolve(leitor.result));
            leitor.addEventListener('error', () => reject(new Error('Não foi possível ler a imagem.')));
            leitor.readAsDataURL(arquivo);
        });
    }

    function configurarPreviewImagem() {
        const input = document.querySelector('#imagem-prato');
        const preview = document.querySelector('#preview-prato');
        const nomeArquivo = document.querySelector('#arquivo-selecionado');
        if (!input || !preview || !nomeArquivo) {
            return;
        }

        input.addEventListener('change', () => {
            const arquivo = input.files[0];
            if (!arquivo) {
                return;
            }
            if (!['image/jpeg', 'image/png'].includes(arquivo.type) || arquivo.size > 2 * 1024 * 1024) {
                input.value = '';
                nomeArquivo.textContent = 'Escolha uma imagem JPG ou PNG de até 2 MB.';
                return;
            }
            preview.src = URL.createObjectURL(arquivo);
            nomeArquivo.textContent = arquivo.name;
        });
    }

    function configurarNovoPrato() {
        const formulario = document.querySelector('#novo-prato-form');
        if (!formulario) {
            return;
        }

        formulario.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            const nomeInput = document.querySelector('#nome-prato');
            const precoInput = document.querySelector('#preco-prato');
            const categoriaInput = document.querySelector('#categoria-prato');
            const quantidadeInput = document.querySelector('#quantidade-prato');
            const imagem = document.querySelector('#imagem-prato');
            const toast = document.querySelector('.toast-erro');
            const nome = nomeInput.value.trim();
            const preco = precoInput.value.trim();
            const categoria = categoriaInput.value;
            const quantidade = Number(quantidadeInput.value);
            const precoNumerico = Number(preco.replace(/[^\d,.-]/g, '').replace(',', '.'));
            const erros = [
                [nomeInput, !nome],
                [precoInput, !preco || !Number.isFinite(precoNumerico) || precoNumerico <= 0],
                [categoriaInput, !categoria],
                [quantidadeInput, !Number.isInteger(quantidade) || quantidade < 0],
                [imagem, !imagem.files.length]
            ];

            formulario.querySelectorAll('.input-erro-wrapper').forEach((wrapper) => {
                wrapper.classList.remove('erro');
            });
            formulario.querySelectorAll('.mensagem-erro').forEach((mensagem) => {
                mensagem.hidden = true;
            });

            erros.forEach(([campo, invalido]) => {
                campo.setAttribute('aria-invalid', String(invalido));
                const wrapper = campo.closest('.input-erro-wrapper');
                const mensagem = campo.closest('.form-grupo')?.querySelector('.mensagem-erro');
                wrapper?.classList.toggle('erro', invalido);
                mensagem?.toggleAttribute('hidden', !invalido);
            });

            if (erros.some(([, invalido]) => invalido)) {
                toast?.classList.add('visivel');
                toast?.querySelector('p')?.replaceChildren(
                    document.createTextNode('Revise os campos destacados e tente novamente.')
                );
                formulario.querySelector('[aria-invalid="true"]')?.focus();
                return;
            }
            toast?.classList.remove('visivel');

            try {
                const imagemBase64 = await lerImagem(imagem);
                const pratos = JSON.parse(localStorage.getItem('sabor-de-casa-pratos') || '[]');
                pratos.push({
                    nome,
                    preco,
                    categoria,
                    quantidade,
                    imagem: imagemBase64,
                    disponivel: document.querySelector('#disponivel-prato').checked
                });
                localStorage.setItem('sabor-de-casa-pratos', JSON.stringify(pratos));
                window.location.href = 'index.html';
            } catch (erro) {
                mostrarNotificacao(erro.message, 'erro');
            }
        });

        document.querySelector('.btn-cancelar')?.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    function carregarPratosNovos() {
        const grade = document.querySelector('.pratos-admin');
        if (!grade) {
            return;
        }
        const pratos = JSON.parse(localStorage.getItem('sabor-de-casa-pratos') || '[]');
        pratos.forEach((prato) => {
            const cartao = document.createElement('article');
            cartao.className = 'prato-admin-card';
            cartao.innerHTML = `
                <div class="prato-admin-imagem"><img src="${prato.imagem}" alt="${prato.nome}"></div>
                <div class="prato-admin-info"><div><span class="tag-categoria">${prato.categoria}</span><h3>${prato.nome}</h3></div><strong>${prato.preco}</strong></div>
                <div class="prato-admin-rodape"><span class="status ${prato.disponivel ? 'disponivel' : 'esgotado'}"><i></i> ${prato.disponivel ? 'Disponível' : 'Esgotado'}</span><label class="alternador"><input type="checkbox" ${prato.disponivel ? 'checked' : ''}><span></span></label></div>
            `;
            grade.append(cartao);
        });
    }

    configurarNavegacao();
    configurarBuscaDeCategorias();
    configurarOrdenacao();
    configurarFiltrosDePratos();
    configurarFormularios();
    configurarToasts();
    configurarMenuPerfil();
    configurarPreviewImagem();
    configurarNovoPrato();
    carregarPratosNovos();
    configurarDisponibilidade();
})();

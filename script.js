(function () {
    'use strict';

    const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
    const paginasDeCategorias = ['index.html', 'nova_categoria.html', 'editar_categoria.html'];
    const chavePratos = 'sabor-de-casa-pratos';
    const chaveRemovidos = 'sabor-de-casa-pratos-removidos';
    const chaveDisponibilidade = 'sabor-de-casa-disponibilidade';
    const chaveCategorias = 'sabor-de-casa-categorias';
    const chaveMapeamentoCategorias = 'sabor-de-casa-mapeamento-categorias';
    const categoriasComPratosBase = ['pratos executivos', 'carnes grelhadas', 'frangos'];
    const nomesPratosBase = [
        'Bife grelhado', 'Bife acebolado', 'Tiras de carne', 'Carne com legumes',
        'Frango especial', 'Frango crocante', 'Frango ao molho', 'Executivo de carne',
        'Executivo completo', 'Arroz com vegetais', 'Frango crocante da casa'
    ];

    function lerArmazenamento(chave, valorPadrao) {
        try {
            return JSON.parse(localStorage.getItem(chave) || JSON.stringify(valorPadrao));
        } catch {
            return valorPadrao;
        }
    }

    function criarIdPrato(nome) {
        return nome.toLocaleLowerCase('pt-BR')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function normalizarTexto(texto) {
        return texto.trim().toLocaleLowerCase('pt-BR')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function aplicarNomesDeCategorias() {
        const mapeamentos = lerArmazenamento(chaveMapeamentoCategorias, {});
        document.querySelectorAll('.tag-categoria').forEach((tag) => {
            const nomeAtual = normalizarTexto(tag.textContent);
            if (mapeamentos[nomeAtual]) {
                tag.textContent = mapeamentos[nomeAtual];
            }
        });
    }

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

    window.abrirModalExclusao = function (id, tipo = 'legado') {
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
            const seletor = tipo === 'painel' ? '.prato-admin-card' : '.prato-item';
            const atributo = tipo === 'painel' ? 'data-prato-id' : 'data-id';
            const linha = [...document.querySelectorAll(seletor)]
                .find((item) => item.getAttribute(atributo) === id);
            linha?.remove();
            if (tipo === 'painel' && linha) {
                const pratos = lerArmazenamento(chavePratos, [])
                    .filter((prato) => prato.id !== id);
                localStorage.setItem(chavePratos, JSON.stringify(pratos));
                const removidos = lerArmazenamento(chaveRemovidos, []);
                if (!removidos.includes(id)) {
                    removidos.push(id);
                    localStorage.setItem(chaveRemovidos, JSON.stringify(removidos));
                }
                const disponibilidade = lerArmazenamento(chaveDisponibilidade, {});
                delete disponibilidade[id];
                localStorage.setItem(chaveDisponibilidade, JSON.stringify(disponibilidade));
                atualizarIndicadores();
            }
            fecharModal(modal);
            mostrarNotificacao('Prato excluído com sucesso.', 'sucesso');
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
            if (formulario.id === 'novo-prato-form' || formulario.id === 'form-categoria') {
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

    function atualizarIndicadores() {
        const cartoes = [...document.querySelectorAll('.prato-admin-card')];
        const disponiveis = cartoes.filter((cartao) => cartao.querySelector('.alternador input')?.checked).length;
        const total = cartoes.length;
        const indicadores = document.querySelectorAll('.indicador-painel strong');
        if (indicadores[0]) indicadores[0].textContent = total;
        if (indicadores[1]) indicadores[1].textContent = disponiveis;
        if (indicadores[2]) indicadores[2].textContent = total - disponiveis;
        document.querySelectorAll('.aba-status b').forEach((contador, indice) => {
            contador.textContent = indice === 0 ? total : indice === 1 ? disponiveis : total - disponiveis;
        });
    }

    function configurarDisponibilidade() {
        document.querySelectorAll('.prato-admin-card .alternador input').forEach((controle) => {
            const cartao = controle.closest('.prato-admin-card');
            const id = cartao.dataset.pratoId;
            const disponibilidade = lerArmazenamento(chaveDisponibilidade, {});
            if (Object.prototype.hasOwnProperty.call(disponibilidade, id)) {
                controle.checked = disponibilidade[id];
                atualizarStatusCartao(cartao, controle.checked);
            }
            controle.addEventListener('change', () => {
                atualizarStatusCartao(cartao, controle.checked);
                const estados = lerArmazenamento(chaveDisponibilidade, {});
                estados[id] = controle.checked;
                localStorage.setItem(chaveDisponibilidade, JSON.stringify(estados));
                atualizarIndicadores();
            });
        });
        atualizarIndicadores();
    }

    function configurarExclusao() {
        const grade = document.querySelector('.pratos-admin');
        if (!grade) {
            return;
        }
        grade.addEventListener('click', (evento) => {
            const botao = evento.target.closest('.botao-excluir-prato');
            if (!botao) {
                return;
            }
            const cartao = botao.closest('.prato-admin-card');
            if (cartao?.dataset.pratoId) {
                window.abrirModalExclusao(cartao.dataset.pratoId, 'painel');
            }
        });
    }

    function removerPratosExcluidos() {
        const removidos = lerArmazenamento(chaveRemovidos, []);
        document.querySelectorAll('.prato-admin-card').forEach((cartao) => {
            if (removidos.includes(cartao.dataset.pratoId)) {
                cartao.remove();
            }
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
        const categoriaInput = document.querySelector('#categoria-prato');
        const categoriasBase = ['Pratos executivos', 'Carnes grelhadas', 'Frangos'];
        const categoriasSalvas = lerArmazenamento(chaveCategorias, []);
        const mapeamentos = lerArmazenamento(chaveMapeamentoCategorias, {});
        const categoriasDisponiveis = [...new Set([...categoriasBase, ...categoriasSalvas])]
            .map((categoria) => mapeamentos[normalizarTexto(categoria)] || categoria);
        if (categoriaInput) {
            categoriaInput.replaceChildren(
                new Option('Selecione uma categoria', '', true, true),
                ...categoriasDisponiveis.map((categoria) => new Option(categoria, categoria))
            );
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
            const nomesExistentes = [
                ...nomesPratosBase,
                ...[...document.querySelectorAll('.prato-admin-card h3')].map((titulo) => titulo.textContent),
                ...lerArmazenamento(chavePratos, []).map((prato) => prato.nome)
            ];
            const nomeDuplicado = nomesExistentes.some((nomeExistente) =>
                normalizarTexto(nomeExistente) === normalizarTexto(nome)
            );
            const erros = [
                [nomeInput, !nome],
                [nomeInput, nomeDuplicado],
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
                    document.createTextNode(nomeDuplicado
                        ? 'Já existe um prato com esse nome. Escolha outro nome.'
                        : 'Revise os campos destacados e tente novamente.')
                );
                formulario.querySelector('[aria-invalid="true"]')?.focus();
                return;
            }
            toast?.classList.remove('visivel');

            try {
                const imagemBase64 = await lerImagem(imagem);
                const pratos = lerArmazenamento(chavePratos, []);
                pratos.push({
                    id: `${criarIdPrato(nome)}-${Date.now()}`,
                    nome,
                    preco,
                    categoria,
                    quantidade,
                    imagem: imagemBase64,
                    disponivel: document.querySelector('#disponivel-prato').checked
                });
                localStorage.setItem(chavePratos, JSON.stringify(pratos));
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
        const pratos = lerArmazenamento(chavePratos, []);
        pratos.forEach((prato, indice) => {
            prato.id = prato.id || `${criarIdPrato(prato.nome)}-${indice}`;
            const cartao = document.createElement('article');
            cartao.className = 'prato-admin-card';
            cartao.dataset.pratoId = prato.id;
            cartao.innerHTML = `
                <div class="prato-admin-imagem"><img src="${prato.imagem}" alt="${prato.nome}"></div>
                <div class="prato-admin-info"><div><span class="tag-categoria">${prato.categoria}</span><h3>${prato.nome}</h3></div><strong>${prato.preco}</strong></div>
                <div class="prato-admin-rodape"><span class="status ${prato.disponivel ? 'disponivel' : 'esgotado'}"><i></i> ${prato.disponivel ? 'Disponível' : 'Esgotado'}</span><label class="alternador"><input type="checkbox" ${prato.disponivel ? 'checked' : ''}><span></span></label><button class="botao-excluir-prato" type="button" aria-label="Excluir ${prato.nome}">Excluir</button></div>
            `;
            grade.append(cartao);
        });
        localStorage.setItem(chavePratos, JSON.stringify(pratos));
    }

    function configurarCategorias() {
        const formulario = document.querySelector('#form-categoria');
        const campoNome = document.querySelector('#nome-categoria');
        const lista = document.querySelector('#lista-categorias');
        if (!formulario || !campoNome || !lista) {
            return;
        }

        const categoriasBase = ['Pratos executivos', 'Carnes grelhadas', 'Frangos'];
        const categoriasSalvas = lerArmazenamento(chaveCategorias, []);
        const mapeamentos = lerArmazenamento(chaveMapeamentoCategorias, {});
        const categorias = [...new Set([...categoriasBase, ...categoriasSalvas])];
        const renderizar = () => {
            lista.replaceChildren();
            categorias.forEach((categoria) => {
                const item = document.createElement('li');
                const nomeExibido = mapeamentos[normalizarTexto(categoria)] || categoria;
                const possuiPratos = [...document.querySelectorAll('.prato-admin-card .tag-categoria')]
                    .some((tag) => normalizarTexto(tag.textContent) === normalizarTexto(nomeExibido))
                    || lerArmazenamento(chavePratos, []).some((prato) =>
                        normalizarTexto(prato.categoria) === normalizarTexto(categoria)
                    )
                    || categoriasComPratosBase.includes(normalizarTexto(categoria));
                item.innerHTML = `<div class="categoria-lista-dados"><strong>${nomeExibido}</strong><small>${possuiPratos ? 'Possui pratos vinculados' : 'Sem pratos vinculados'}</small></div><span class="acoes-categoria"></span>`;
                const acoes = item.querySelector('.acoes-categoria');
                const editar = document.createElement('button');
                editar.type = 'button';
                editar.textContent = 'Editar';
                editar.addEventListener('click', () => {
                    campoNome.value = nomeExibido;
                    campoNome.dataset.categoriaOriginal = categoria;
                    document.querySelector('#descricao-categoria').value = '';
                    campoNome.focus();
                });
                acoes.append(editar);
                const excluir = document.createElement('button');
                excluir.type = 'button';
                excluir.textContent = 'Excluir';
                excluir.disabled = possuiPratos;
                excluir.title = possuiPratos
                    ? 'Não é possível excluir uma categoria que possui pratos.'
                    : 'Excluir categoria';
                excluir.addEventListener('click', () => {
                    const indice = categorias.findIndex((item) => item === categoria);
                    categorias.splice(indice, 1);
                    const categoriasPersonalizadas = categorias.filter((item) => !categoriasBase.includes(item));
                    localStorage.setItem(chaveCategorias, JSON.stringify(categoriasPersonalizadas));
                    renderizar();
                    mostrarNotificacao('Categoria excluída com sucesso.', 'sucesso');
                });
                acoes.append(excluir);
                lista.append(item);
            });
        };

        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nome = campoNome.value.trim();
            const original = campoNome.dataset.categoriaOriginal;
            if (!nome) {
                mostrarNotificacao('Informe o nome da categoria.', 'erro');
                return;
            }
            const duplicada = categorias.some((categoria) =>
                normalizarTexto(categoria) === normalizarTexto(nome)
                && normalizarTexto(categoria) !== normalizarTexto(original || '')
            );
            if (duplicada) {
                mostrarNotificacao('Já existe uma categoria com esse nome.', 'erro');
                return;
            }
            if (original) {
                const indice = categorias.indexOf(original);
                categorias[indice] = nome;
                mapeamentos[normalizarTexto(original)] = nome;
                localStorage.setItem(chaveMapeamentoCategorias, JSON.stringify(mapeamentos));
                const pratos = lerArmazenamento(chavePratos, []);
                pratos.forEach((prato) => {
                    if (normalizarTexto(prato.categoria) === normalizarTexto(original)) {
                        prato.categoria = nome;
                    }
                });
                localStorage.setItem(chavePratos, JSON.stringify(pratos));
            } else {
                categorias.push(nome);
            }
            localStorage.setItem(chaveCategorias, JSON.stringify(categorias));
            campoNome.value = '';
            delete campoNome.dataset.categoriaOriginal;
            renderizar();
            mostrarNotificacao('Categoria salva com sucesso.', 'sucesso');
        });
        renderizar();
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
    aplicarNomesDeCategorias();
    removerPratosExcluidos();
    configurarDisponibilidade();
    configurarExclusao();
    configurarCategorias();
})();

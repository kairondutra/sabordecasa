// partes da interface usadas em mais de uma tela

const CHAVE_AVISO = 'sabor-de-casa-aviso';
const TAMANHO_MAXIMO_IMAGEM = 2 * 1024 * 1024;

export function notificar(mensagem, tipo = 'sucesso') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');
    notificacao.textContent = mensagem;
    document.body.append(notificacao);
    window.setTimeout(() => notificacao.remove(), 4000);
}

// executa uma ação e mostra a mensagem caso dê erro
export async function executarComAviso(acao) {
    try {
        await acao();
    } catch (erro) {
        notificar(erro.message, 'erro');
    }
}

// guarda a mensagem para ser mostrada depois de trocar de página
export function redirecionarComAviso(destino, mensagem) {
    sessionStorage.setItem(CHAVE_AVISO, mensagem);
    window.location.href = destino;
}

export function retirarAvisoPendente() {
    const mensagem = sessionStorage.getItem(CHAVE_AVISO);
    sessionStorage.removeItem(CHAVE_AVISO);
    return mensagem;
}

export function mostrarAvisoPendente() {
    const mensagem = retirarAvisoPendente();
    if (mensagem) {
        notificar(mensagem);
    }
}

// abre a janela de confirmação e responde true se a pessoa clicar em Excluir
export function confirmarExclusao(nome) {
    const modal = document.createElement('div');
    modal.className = 'modal-exclusao';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
        <div class="modal-cartao">
            <span class="modal-icone">!</span>
            <h2>Excluir item?</h2>
            <p></p>
            <div class="modal-acoes">
                <button type="button" class="btn-cancelar modal-cancelar">Cancelar</button>
                <button type="button" class="btn-excluir-confirmar">Excluir</button>
            </div>
        </div>
    `;
    modal.querySelector('p').textContent = `"${nome}" será excluído. Essa ação não pode ser desfeita.`;
    document.body.append(modal);
    document.body.classList.add('modal-aberto');
    modal.querySelector('.modal-cancelar').focus();

    return new Promise((responder) => {
        modal.addEventListener('click', (evento) => {
            const confirmou = Boolean(evento.target.closest('.btn-excluir-confirmar'));
            const cancelou = evento.target === modal || Boolean(evento.target.closest('.modal-cancelar'));
            if (confirmou || cancelou) {
                modal.remove();
                document.body.classList.remove('modal-aberto');
                responder(confirmou);
            }
        });
    });
}

// confirma, exclui pelo serviço e atualiza a tela
export async function excluirComConfirmacao({ servico, item, mensagem, aoExcluir }) {
    if (!(await confirmarExclusao(item.nome))) {
        return;
    }
    await executarComAviso(async () => {
        await servico.excluir(item.id);
        notificar(mensagem);
        await aoExcluir();
    });
}

// destaca o campo e mostra a mensagem embaixo dele (mensagem vazia limpa o erro)
export function marcarCampo(campo, mensagem = '') {
    const grupo = campo.closest('.form-grupo');
    const aviso = grupo.querySelector('.mensagem-erro');
    campo.setAttribute('aria-invalid', String(Boolean(mensagem)));
    grupo.querySelector('.input-erro-wrapper')?.classList.toggle('erro', Boolean(mensagem));
    if (aviso) {
        aviso.textContent = mensagem;
        aviso.hidden = !mensagem;
    }
}

// bloqueia o botão enquanto salva, para não cadastrar duas vezes
export function aoEnviar(formulario, acao) {
    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const botao = formulario.querySelector('[type="submit"]');
        botao.disabled = true;
        await acao();
        botao.disabled = false;
    });
}

function lerArquivo(arquivo) {
    return new Promise((resolver, rejeitar) => {
        const leitor = new FileReader();
        leitor.addEventListener('load', () => resolver(leitor.result));
        leitor.addEventListener('error', () => rejeitar(new Error('Não foi possível ler a imagem.')));
        leitor.readAsDataURL(arquivo);
    });
}

// campo de foto: valida o arquivo, mostra a prévia e guarda a imagem escolhida
export function criarCampoImagem() {
    const entrada = document.querySelector('.entrada-imagem');
    const previa = document.querySelector('.foto-prato-img');
    const legenda = document.querySelector('.arquivo-selecionado');
    const imagemPadrao = previa.getAttribute('src');
    let imagemAtual = null;

    function definir(imagem, texto = 'Nenhuma imagem selecionada.') {
        imagemAtual = imagem || null;
        previa.src = imagem || imagemPadrao;
        legenda.textContent = texto;
        entrada.value = '';
    }

    entrada.addEventListener('change', () => executarComAviso(async () => {
        const arquivo = entrada.files[0];
        if (!arquivo) {
            return;
        }
        if (!['image/jpeg', 'image/png'].includes(arquivo.type) || arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
            entrada.value = '';
            legenda.textContent = 'Escolha uma imagem JPG ou PNG de até 2 MB.';
            return;
        }
        definir(await lerArquivo(arquivo), arquivo.name);
    }));

    return { definir, obter: () => imagemAtual };
}

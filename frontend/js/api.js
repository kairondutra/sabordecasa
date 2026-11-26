// camada de serviço: toda a conversa com o back-end passa por aqui

async function enviarRequisicao(endereco, opcoes) {
    try {
        return await fetch(endereco, opcoes);
    } catch {
        throw new Error('Não foi possível conectar ao servidor. Tente novamente.');
    }
}

async function requisitar(endereco, metodo = 'GET', dados) {
    const opcoes = { method: metodo };
    if (dados) {
        opcoes.headers = { 'Content-Type': 'application/json' };
        opcoes.body = JSON.stringify(dados);
    }

    const resposta = await enviarRequisicao(endereco, opcoes);
    // 204: deu certo e não há conteúdo (usado na exclusão)
    if (resposta.status === 204) {
        return null;
    }

    const corpo = await resposta.json().catch(() => null);
    if (!resposta.ok || corpo === null) {
        throw new Error(corpo?.erro || 'Não foi possível concluir a operação.');
    }
    return corpo;
}

// as quatro operações são iguais para categorias e pratos
function criarServico(endereco) {
    return {
        listar: () => requisitar(endereco),
        buscar: (id) => requisitar(`${endereco}/${id}`),
        criar: (dados) => requisitar(endereco, 'POST', dados),
        atualizar: (id, dados) => requisitar(`${endereco}/${id}`, 'PUT', dados),
        excluir: (id) => requisitar(`${endereco}/${id}`, 'DELETE')
    };
}

export const servicoCategorias = {
    ...criarServico('/categorias'),
    listarPratos: (id) => requisitar(`/categorias/${id}/pratos`)
};

export const servicoPratos = criarServico('/pratos');

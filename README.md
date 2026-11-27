# Sabor de Casa

Sistema web para manter o cardápio de uma marmitaria organizado por categorias.

Trabalho da disciplina N695 - Desenvolvimento de Plataformas Web (Cenário 3: marmitaria com cardápio digital).

**Acesse a aplicação:** [Sabor de Casa](https://sabor-de-casa-zr7w.onrender.com)

## Sobre o projeto

A **Sabor de Casa** enviava o cardápio como foto de um quadro escrito à mão. Quando um prato acabava ou mudava de preço, a foto antiga continuava circulando e gerava pedidos errados. Com o sistema, a proprietária mantém categorias e pratos sempre atualizados em um painel.

## Funcionalidades

- Cadastrar, listar, editar e excluir categorias
- Cadastrar, listar, editar e excluir pratos, com foto
- Ver os pratos de uma categoria
- Marcar um prato como disponível ou esgotado
- Buscar e filtrar pratos

## Regras de validação

- Nome, preço e categoria do prato são obrigatórios
- O preço precisa ser maior que zero
- Não é permitido repetir nome de categoria nem de prato
- Uma categoria com pratos não pode ser excluída
- Fotos em JPG ou PNG, com até 2 MB

## Tecnologias

- **Interface:** HTML5, CSS3 e JavaScript
- **Serviço Web:** Node.js, TypeScript e Express
- **Banco de dados:** SQLite (módulo `node:sqlite`)

## Como executar

É preciso ter o Node.js 22.13 ou mais novo.

```bash
git clone https://github.com/kairondutra/sabordecasa.git
cd sabordecasa/backend
npm install
npm run dev
```

Depois, acesse **http://localhost:3000**. O mesmo servidor entrega as telas e a API, por isso não abra os arquivos HTML direto no navegador.

Na primeira execução, o banco `marmitaria.db` é criado com um cardápio de exemplo.

## API

| Método | Endereço | O que faz |
|---|---|---|
| GET | `/categorias` | Lista as categorias |
| GET | `/categorias/:id` | Busca uma categoria |
| GET | `/categorias/:id/pratos` | Lista os pratos de uma categoria |
| POST | `/categorias` | Cria uma categoria |
| PUT | `/categorias/:id` | Atualiza uma categoria |
| DELETE | `/categorias/:id` | Exclui uma categoria |
| GET | `/pratos` | Lista os pratos |
| GET | `/pratos/:id` | Busca um prato |
| POST | `/pratos` | Cria um prato |
| PUT | `/pratos/:id` | Atualiza um prato |
| DELETE | `/pratos/:id` | Exclui um prato |

Exemplo de criação de prato:

```json
{
  "nome": "Peixe grelhado",
  "descricao": "Acompanha arroz e legumes",
  "preco": 29.9,
  "quantidade": 15,
  "disponivel": true,
  "categoria_id": 1
}
```

Os erros voltam no formato `{ "erro": "mensagem" }`.

## Organização do código

```
├── *.html                 telas
├── css/                   estilos
├── js/
│   ├── api.js             comunicação com o serviço
│   ├── formatos.js        formatação de valores
│   ├── interface.js       avisos, confirmação e campo de foto
│   └── paginas/           comportamento de cada tela
└── backend/src/
    ├── routes/            endereços
    ├── controllers/       recebem a requisição e respondem
    ├── services/          regras de negócio e validações
    ├── repositories/      acesso aos dados
    └── database/          conexão, tabelas e dados iniciais
```

## Publicação

O arquivo `render.yaml` deixa o projeto pronto para o [Render](https://render.com): crie um **Blueprint** apontando para este repositório.

No plano gratuito, o disco é temporário: ao reiniciar o servidor, o banco volta ao cardápio de exemplo.

## Equipe

 - Isabelle Martins de Moraes Ramalho - Matrícula: 2524835
 - Janailson Alves Santos - Matrícula: 2524944 
 - Kairon Lucas Ferreira Dutra  - Matrícula: 2524909 
 - Marcos Aurélio Ribeiro de Sousa  - Matrícula: 2524906
 - Nícolas Marques Lima - Matrícula: 2524025
 - Raylan da Rocha Araújo - Matrícula: 2526723

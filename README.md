# Sabor de Casa

Sistema web para manter o cardápio de uma marmitaria organizado por categorias.

Trabalho da disciplina N695 - Desenvolvimento de Plataformas Web (Cenário 3: marmitaria com cardápio digital).

**Acesse a aplicação:** [Sabor de Casa](https://sabor-de-casa-zr7w.onrender.com)

## Sobre o projeto

O **Sabor de Casa** nasceu de um problema comum em pequenos negócios do ramo alimentício: o cardápio é enviado como foto de um quadro escrito à mão e, quando um prato acaba ou muda de preço, a foto antiga continua circulando e gera pedidos errados.

A solução permite que a proprietária cadastre categorias e pratos, gerencie preços, quantidades e disponibilidade, mantendo as informações atualizadas em um único lugar.

O projeto foi desenvolvido como trabalho acadêmico da disciplina **N695 - Desenvolvimento de Plataformas Web**, da **Universidade de Fortaleza (UNIFOR)**, com base no **Cenário 3: Marmitaria com cardápio digital**.

## Objetivo

Desenvolver um MVP (Produto Mínimo Viável) voltado à organização do cardápio de marmitas e ao gerenciamento de informações, auxiliando pequenos empreendedores do ramo alimentício.

O projeto busca contribuir com o **Objetivo de Desenvolvimento Sustentável (ODS) 8 – Trabalho Decente e Crescimento Econômico**, por meio da digitalização e da melhoria dos processos de pequenos negócios.

## Entidades

- **Categoria:** agrupa os pratos do cardápio (ex.: Marmitas, Bebidas e Sobremesas).
- **Prato:** representa um item do cardápio, contendo informações como nome, descrição, preço, quantidade e disponibilidade.

### Relacionamento

As entidades possuem um relacionamento de um para muitos (1:N):

- Uma categoria pode possuir vários pratos.
- Cada prato pertence a exatamente uma categoria.

## Funcionalidades do MVP

- Cadastro, listagem, edição e exclusão de categorias.
- Cadastro, listagem, edição e exclusão de pratos.
- Listagem de pratos por categoria.
- Pesquisa de pratos por nome.
- Filtros por disponibilidade.
- Controle de quantidade e disponibilidade dos pratos.
- Upload de imagens de categorias e pratos.
- Indicadores no painel administrativo.
- Navegação entre telas e formulários.
- Validação de entrada e tratamento de erros.
- Persistência dos dados em banco de dados SQLite.

### Regras de validação

- Preenchimento dos campos obrigatórios.
- Preço do prato maior que zero.
- Nome de categoria sem repetição.
- Impedimento do cadastro de pratos com nomes duplicados.
- Validação do formato e tamanho das imagens enviadas (JPG ou PNG, até 2 MB).
- Normalização de nomes para comparação.
- Quantidades e ordens representadas por números inteiros não negativos.
- Associação de pratos a categorias existentes.
- Impedimento da exclusão de categorias que ainda possuem pratos cadastrados.

## Tecnologias

## Tecnologias Utilizadas

  ### Frontend
  - HTML5
  - CSS3
  - JavaScript
  
  ### Backend
  - Node.js (versão 22.13.0 ou superior)
  - TypeScript
  - Express 5
  
  ### Banco de Dados
  - SQLite (módulo nativo `node:sqlite`)
  
  ### Versionamento
    - Git
    - GitHub
  
  ### Hospedagem
    - Render
    
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

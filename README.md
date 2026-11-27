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
    
## Estrutura do Projeto

```
sabordecasa/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── errors/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   └── pages/
├── .gitignore
├── README.md
└── render.yaml
```

### Arquitetura

O projeto adota uma arquitetura em camadas, promovendo a separação de responsabilidades, a reutilização de código e a facilidade de manutenção.

| Camada          | Responsabilidade                                        |
|-----------------|---------------------------------------------------------|
| Frontend        | Interface, interação com o usuário e consumo da API     |
| Routes          | Definição das rotas e endpoints da aplicação            |
| Controllers     | Recebimento de requisições e envio de respostas HTTP    |
| Services        | Regras de negócio e validações                          |
| Repositories    | Consultas e operações no banco de dados                 |
| Database        | Conexão, estrutura e inicialização do banco de dados    |
| Middlewares     | Processamento intermediário e tratamento de erros       |
| Errors          | Padronização dos erros da aplicação                     |
| Utils           | Funções auxiliares reutilizáveis                        |

### Clean Code

Durante o desenvolvimento, foram aplicadas práticas de clean code, como:

- Utilização de nomes significativos para variáveis, funções e arquivos.
- Separação de responsabilidades entre funções e módulos.
- Organização da aplicação em camadas.
- Centralização de validações e funções reutilizáveis.
- Redução da duplicação de código.
- Padronização do tratamento de erros.

## Como Executar o Projeto

### Pré-requisitos

- Node.js 22.13.0 ou superior.
- Git.
- Navegador atualizado.

### 1. Clonar o repositório

```bash
git clone https://github.com/kairondutra/sabordecasa.git
cd sabordecasa
```

### 2. Instalar as dependências

```bash
cd backend
npm ci
```

### 3. Iniciar o servidor

```bash
npm run dev
```

### 4. Acessar a aplicação

Abra o seguinte endereço no navegador:

```text
http://localhost:3000
```

O Express é responsável por disponibilizar tanto a interface web quanto a API REST. Portanto, não é necessário executar o frontend separadamente ou utilizar a extensão Live Server.

O banco de dados SQLite (`marmitaria.db`) é inicializado automaticamente durante a execução da aplicação.

Para utilizar outro caminho de armazenamento, defina a variável de ambiente `DB_PATH`.


### Executar em modo de produção

A partir da pasta `backend`, execute:

```bash
npm run build
npm start
```

## API REST

A comunicação entre o frontend e o backend é realizada por meio de uma API REST, utilizando o protocolo HTTP e o formato JSON.

**URL base:**

```text
http://localhost:3000
```

**URL base em produção:** `https://sabor-de-casa-zr7w.onrender.com`

### Categorias

| Método | Rota | Descrição |
|---|---|---|
| GET | `/categorias` | Lista todas as categorias |
| GET | `/categorias/:id` | Busca uma categoria pelo ID |
| GET | `/categorias/:id/pratos` | Lista os pratos de uma categoria |
| POST | `/categorias` | Cria uma categoria |
| PUT | `/categorias/:id` | Atualiza uma categoria |
| DELETE | `/categorias/:id` | Exclui uma categoria |

#### Exemplo de corpo da requisição

```json
{
  "nome": "Marmitas",
  "descricao": "Pratos do dia"
}
```

### Pratos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/pratos` | Lista todos os pratos |
| GET | `/pratos/:id` | Busca um prato pelo ID |
| POST | `/pratos` | Cria um prato |
| PUT | `/pratos/:id` | Atualiza um prato |
| DELETE | `/pratos/:id` | Exclui um prato |

#### Exemplo de corpo da requisição

```json
{
  "nome": "Frango grelhado",
  "descricao": "Acompanha arroz e legumes",
  "preco": 22.90,
  "quantidade": 15,
  "disponivel": true,
  "categoria_id": 1
}
```

O campo `categoria_id` deve corresponder ao ID de uma categoria existente.

O método `PUT` realiza a atualização dos dados editáveis do registro. Recomenda-se enviar todos os campos para preservar os valores existentes.

### Respostas de erro

Os erros da API são padronizados e retornados no formato JSON:

```json
{
  "erro": "Mensagem explicando o problema"
}
```

| Código HTTP | Descrição |
|---|---|
| 400 | Dados inválidos ou campos obrigatórios ausentes |
| 404 | Recurso não encontrado |
| 409 | Conflito com uma regra de negócio |
| 413 | Requisição acima do tamanho permitido |
| 500 | Erro interno do servidor |

## Persistência dos Dados

A aplicação utiliza o SQLite como sistema de gerenciamento de banco de dados relacional, por meio do módulo nativo `node:sqlite` do Node.js.

Os dados são armazenados em um arquivo local, preservando o relacionamento entre categorias e pratos.

O acesso ao banco de dados é realizado pela camada de repositories, utilizando consultas SQL parametrizadas e mecanismos de integridade referencial.

Essa abordagem permite manter as informações armazenadas entre execuções locais da aplicação, sem a necessidade de instalar ou configurar um servidor de banco de dados externo.

## Fluxo de Trabalho da Equipe

O desenvolvimento colaborativo do projeto utiliza Git e GitHub para versionamento e organização das funcionalidades.

- Desenvolvimento de funcionalidades em branches específicas.
- Organização do desenvolvimento nas branches `front-end` e `back-end`.
- Integração das funcionalidades na branch `pré-main`.
- Realização de testes e revisão do código na `pré-main`.
- Integração da versão final à branch `main` por meio do Pull Request #7.
- Publicação da aplicação no Render a partir da branch `main`.
- Utilização de mensagens de commit descritivas e padronizadas.

### Exemplos de commits

```text
feat: adiciona CRUD de categorias
fix: corrige validação de preços
refactor: centraliza funções de validação
docs: atualiza documentação do projeto
style: ajusta layout do formulário
```

## Testes Realizados

A aplicação foi submetida a testes manuais em ambientes local e de produção, com o objetivo de verificar o funcionamento das funcionalidades implementadas.

- Testes dos endpoints da API REST utilizando o Postman.
- Testes de cadastro, listagem, edição e exclusão.
- Testes de validação das regras de negócio.
- Testes de integração entre frontend e backend.
- Testes de interface e navegação.
- Testes de compilação e execução do servidor.

Foram organizadas 27 capturas de tela como evidências dos testes locais: 15 do Postman, 7 do frontend e 5 de validação.

O deploy da aplicação no Render foi concluído com sucesso. Após a publicação, foram realizados testes funcionais em ambiente de produção para verificar o funcionamento da aplicação hospedada.

## Aplicação Publicada

A aplicação está hospedada no Render, utilizando a configuração definida no arquivo `render.yaml`.

- **Aplicação:** [Sabor de Casa](https://sabor-de-casa-zr7w.onrender.com)
- **Repositório:** [GitHub](https://github.com/kairondutra/sabordecasa)
- **Branch de publicação:** `main`
- **Plano de hospedagem:** Free

### Limitações da hospedagem

- O servidor pode entrar em suspensão após períodos de inatividade.
- O primeiro acesso após a suspensão poderá demorar 50 segundos ou mais.
- O armazenamento do SQLite é temporário no plano gratuito. Os dados podem ser perdidos durante reinicializações ou novas implantações.

### Limitações do MVP

- O painel administrativo não possui autenticação e destina-se exclusivamente à demonstração acadêmica, com dados fictícios.

## Uso de IA Generativa

O ChatGPT foi utilizado como ferramenta de apoio na revisão do código, identificação de possíveis problemas, esclarecimento de dúvidas técnicas e aprimoramento da documentação. O Copilot foi utilizado integralmente para esclarecer dúvidas sobre o uso do GitHub de modo geral. A maior parte das alterações atribuídas a ele foi, na verdade, realizada pelos integrantes da equipe. Provavelmente, ao realizar o commit, o Copilot registrou a autoria como sua. Também foi utilizada para correções de textos e frases, visando uma maior compreensão e adequação às normas do português.
A equipe é responsável pela compreensão, implementação e validação das soluções adotadas no projeto.

## Equipe
Projeto desenvolvido pelos acadêmicos da Universidade de Fortaleza:

 - Isabelle Martins de Moraes Ramalho - Matrícula: 2524835
 - Janailson Alves Santos - Matrícula: 2524944 
 - Kairon Lucas Ferreira Dutra  - Matrícula: 2524909 
 - Marcos Aurélio Ribeiro de Sousa  - Matrícula: 2524906
 - Nícolas Marques Lima - Matrícula: 2524025
 - Raylan da Rocha Araújo - Matrícula: 2526723

---

Projeto acadêmico desenvolvido para a disciplina **N695 - Desenvolvimento de Plataformas Web**.

**Universidade de Fortaleza (UNIFOR) — 2026.2**

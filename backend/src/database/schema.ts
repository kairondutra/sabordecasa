import { db } from "./connection";
import { inserirDadosIniciais } from "./dadosIniciais";

//função para criar as tabelas do banco de dados

function criarTabelas() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT NOT NULL UNIQUE COLLATE NOCASE,
      descricao  TEXT,
      ordem      INTEGER NOT NULL DEFAULT 0,
      visivel    INTEGER NOT NULL DEFAULT 1,
      imagem_url TEXT,
      criado_em  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pratos (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      nome          TEXT    NOT NULL,
      descricao     TEXT,
      preco         REAL    NOT NULL,
      quantidade    INTEGER NOT NULL DEFAULT 0,
      disponivel    INTEGER NOT NULL DEFAULT 1,
      imagem_url    TEXT,
      categoria_id  INTEGER NOT NULL,
      criado_em     TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
    );
  `)

}

// quem já tinha o banco criado recebe as colunas novas sem perder os dados
function adicionarColunaSeFaltar(tabela: string, coluna: string, definicao: string) {
    const colunas = db.prepare(`PRAGMA table_info(${tabela})`).all();
    if (!colunas.some((item) => item.name === coluna)) {
        db.exec(`ALTER TABLE ${tabela} ADD COLUMN ${coluna} ${definicao}`);
    }
}

function atualizarTabelas() {
    adicionarColunaSeFaltar("categorias", "ordem", "INTEGER NOT NULL DEFAULT 0");
    adicionarColunaSeFaltar("categorias", "visivel", "INTEGER NOT NULL DEFAULT 1");
    adicionarColunaSeFaltar("categorias", "imagem_url", "TEXT");
    adicionarColunaSeFaltar("pratos", "quantidade", "INTEGER NOT NULL DEFAULT 0");
}

export function iniciarBanco() {
    criarTabelas();
    atualizarTabelas();
    inserirDadosIniciais();
  }

import { db } from "./connection";

//função para criar as tabelas do banco de dados

function criarTabelas() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome       TEXT NOT NULL UNIQUE COLLATE NOCASE,
      descricao  TEXT,
      criado_em  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pratos (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      nome          TEXT    NOT NULL,
      descricao     TEXT,
      preco         REAL    NOT NULL,
      disponivel    INTEGER NOT NULL DEFAULT 1,
      imagem_url    TEXT,
      categoria_id  INTEGER NOT NULL,
      criado_em     TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
    );
  `)

}

export function iniciarBanco() {
    criarTabelas();
  }
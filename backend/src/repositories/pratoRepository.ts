import { db } from "../database/connection";

export interface Prato {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  disponivel: number;
  imagem_url: string | null;
  categoria_id: number;
  criado_em: string;
}

export function listarPratos(): Prato[] {
  return db.prepare("SELECT * FROM pratos ORDER BY nome").all() as unknown as Prato[];
}

export function buscarPratoPorId(id: number): Prato | undefined {
  return db.prepare("SELECT * FROM pratos WHERE id = ?").get(id) as unknown as Prato | undefined;
}

export function inserirPrato(
  nome: string,
  descricao: string | null,
  preco: number,
  disponivel: number,
  imagem_url: string | null,
  categoria_id: number
): number {
  const resultado = db
    .prepare(
      "INSERT INTO pratos (nome, descricao, preco, disponivel, imagem_url, categoria_id) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(nome, descricao, preco, disponivel, imagem_url, categoria_id);
  return Number(resultado.lastInsertRowid);
}

export function atualizarPrato(
  id: number,
  nome: string,
  descricao: string | null,
  preco: number,
  disponivel: number,
  imagem_url: string | null,
  categoria_id: number
): void {
  db.prepare(
    "UPDATE pratos SET nome = ?, descricao = ?, preco = ?, disponivel = ?, imagem_url = ?, categoria_id = ? WHERE id = ?"
  ).run(nome, descricao, preco, disponivel, imagem_url, categoria_id, id);
}

export function excluirPrato(id: number): void {
  db.prepare("DELETE FROM pratos WHERE id = ?").run(id);
}
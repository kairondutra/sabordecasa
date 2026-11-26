// acesso à tabela de pratos
import { db } from "../database/connection";

export interface DadosPrato {
  nome: string;
  descricao: string | null;
  preco: number;
  quantidade: number;
  disponivel: number;
  imagem_url: string | null;
  categoria_id: number;
}

export interface Prato extends DadosPrato {
  id: number;
  criado_em: string;
}

export function listarPratos(): Prato[] {
  return db.prepare("SELECT * FROM pratos ORDER BY nome").all() as unknown as Prato[];
}

export function listarPratosPorCategoria(categoriaId: number): Prato[] {
  return db
    .prepare("SELECT * FROM pratos WHERE categoria_id = ? ORDER BY nome")
    .all(categoriaId) as unknown as Prato[];
}

export function buscarPratoPorId(id: number): Prato | undefined {
  return db.prepare("SELECT * FROM pratos WHERE id = ?").get(id) as unknown as Prato | undefined;
}

export function inserirPrato(dados: DadosPrato): number {
  const resultado = db
    .prepare(
      `INSERT INTO pratos (nome, descricao, preco, quantidade, disponivel, imagem_url, categoria_id)
       VALUES (:nome, :descricao, :preco, :quantidade, :disponivel, :imagem_url, :categoria_id)`
    )
    .run({ ...dados });
  return Number(resultado.lastInsertRowid);
}

export function atualizarPrato(id: number, dados: DadosPrato): void {
  db.prepare(
    `UPDATE pratos SET nome = :nome, descricao = :descricao, preco = :preco, quantidade = :quantidade,
     disponivel = :disponivel, imagem_url = :imagem_url, categoria_id = :categoria_id WHERE id = :id`
  ).run({ ...dados, id });
}

export function excluirPrato(id: number): void {
  db.prepare("DELETE FROM pratos WHERE id = ?").run(id);
}

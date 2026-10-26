import { db } from "../database/connection";

export interface Categoria {
  id: number;
  nome: string;
  descricao: string | null;
  criado_em: string;
}

export function listarCategorias(): Categoria[] {
  return db.prepare("SELECT * FROM categorias ORDER BY nome").all() as unknown as Categoria[];
}

export function buscarCategoriaPorId(id: number): Categoria | undefined {
  return db.prepare("SELECT * FROM categorias WHERE id = ?").get(id) as unknown as Categoria | undefined;
}

// a coluna nome usa COLLATE NOCASE, então a busca ignora maiúsculas e minúsculas
export function buscarCategoriaPorNome(nome: string): Categoria | undefined {
  return db.prepare("SELECT * FROM categorias WHERE nome = ?").get(nome) as unknown as Categoria | undefined;
}

export function inserirCategoria(nome: string, descricao: string | null): number {
  const resultado = db.prepare("INSERT INTO categorias (nome, descricao) VALUES (?, ?)").run(nome, descricao);
  return Number(resultado.lastInsertRowid);
}

export function atualizarCategoria(id: number, nome: string, descricao: string | null): void {
  db.prepare("UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?").run(nome, descricao, id);
}

export function excluirCategoria(id: number): void {
  db.prepare("DELETE FROM categorias WHERE id = ?").run(id);
}

export function contarPratosDaCategoria(categoriaId: number): number {
  const linha = db
    .prepare("SELECT COUNT(*) AS total FROM pratos WHERE categoria_id = ?")
    .get(categoriaId) as unknown as { total: number };
  return linha.total;
}
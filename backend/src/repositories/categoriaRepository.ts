// acesso à tabela de categorias
import { db } from "../database/connection";

export interface DadosCategoria {
  nome: string;
  descricao: string | null;
  ordem: number;
  visivel: number;
  imagem_url: string | null;
}

export interface Categoria extends DadosCategoria {
  id: number;
  criado_em: string;
}

export function listarCategorias(): Categoria[] {
  return db.prepare("SELECT * FROM categorias ORDER BY ordem, nome").all() as unknown as Categoria[];
}

export function buscarCategoriaPorId(id: number): Categoria | undefined {
  return db.prepare("SELECT * FROM categorias WHERE id = ?").get(id) as unknown as Categoria | undefined;
}

export function inserirCategoria(dados: DadosCategoria): number {
  const resultado = db
    .prepare(
      `INSERT INTO categorias (nome, descricao, ordem, visivel, imagem_url)
       VALUES (:nome, :descricao, :ordem, :visivel, :imagem_url)`
    )
    .run({ ...dados });
  return Number(resultado.lastInsertRowid);
}

export function atualizarCategoria(id: number, dados: DadosCategoria): void {
  db.prepare(
    `UPDATE categorias SET nome = :nome, descricao = :descricao, ordem = :ordem,
     visivel = :visivel, imagem_url = :imagem_url WHERE id = :id`
  ).run({ ...dados, id });
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

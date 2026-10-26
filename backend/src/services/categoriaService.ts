import { AppError } from "../errors/AppError";
import * as repo from "../repositories/categoriaRepository";

interface DadosCategoria {
  nome?: unknown;
  descricao?: string;
}

function validarNome(nome: unknown): string {
  if (typeof nome !== "string" || nome.trim() === "") {
    throw new AppError("O nome da categoria é obrigatório.", 400);
  }
  return nome.trim();
}

function garantirNomeDisponivel(nome: string, idAtual?: number): void {
  const existente = repo.buscarCategoriaPorNome(nome);
  // ao atualizar, a própria categoria pode manter o mesmo nome
  if (existente && existente.id !== idAtual) {
    throw new AppError("Já existe uma categoria com esse nome.", 409);
  }
}

export function buscarOuFalhar(id: number) {
  const categoria = repo.buscarCategoriaPorId(id);
  if (!categoria) {
    throw new AppError("Categoria não encontrada.", 404);
  }
  return categoria;
}

export function listar() {
  return repo.listarCategorias();
}

export function criar(dados: DadosCategoria) {
  const nome = validarNome(dados.nome);
  garantirNomeDisponivel(nome);
  const id = repo.inserirCategoria(nome, dados.descricao ?? null);
  return repo.buscarCategoriaPorId(id);
}

export function atualizar(id: number, dados: DadosCategoria) {
  buscarOuFalhar(id);
  const nome = validarNome(dados.nome);
  garantirNomeDisponivel(nome, id);
  repo.atualizarCategoria(id, nome, dados.descricao ?? null);
  return repo.buscarCategoriaPorId(id);
}

export function excluir(id: number): void {
  buscarOuFalhar(id);
  // o banco também bloqueia (ON DELETE RESTRICT), mas aqui devolvemos uma mensagem clara
  if (repo.contarPratosDaCategoria(id) > 0) {
    throw new AppError("Não é possível excluir uma categoria que ainda possui pratos.", 409);
  }
  repo.excluirCategoria(id);
}
import { AppError } from "../errors/AppError";
import * as repo from "../repositories/pratoRepository";
import { buscarCategoriaPorId } from "../repositories/categoriaRepository";

interface DadosPrato {
  nome?: unknown;
  descricao?: string;
  preco?: unknown;
  disponivel?: unknown;
  imagem_url?: string;
  categoria_id?: unknown;
}

function validarNome(nome: unknown): string {
  if (typeof nome !== "string" || nome.trim() === "") {
    throw new AppError("O nome do prato é obrigatório.", 400);
  }
  return nome.trim();
}

function validarPreco(preco: unknown): number {
  const valor = Number(preco);
  if (typeof preco === "boolean" || preco === "" || !Number.isFinite(valor) || valor <= 0) {
    throw new AppError("O preço deve ser maior que zero.", 400);
  }
  return valor;
}

function validarCategoria(categoriaId: unknown): number {
  const id = Number(categoriaId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("A categoria informada é inválida.", 400);
  }
  if (!buscarCategoriaPorId(id)) {
    throw new AppError("Categoria não encontrada.", 404);
  }
  return id;
}

function validarDisponivel(disponivel: unknown): number {
  if (disponivel === undefined) return 1;
  if (disponivel === true || disponivel === 1) return 1;
  if (disponivel === false || disponivel === 0) return 0;
  throw new AppError("Valor inválido para o campo disponível.", 400);
}

export function buscarOuFalhar(id: number) {
  const prato = repo.buscarPratoPorId(id);
  if (!prato) {
    throw new AppError("Prato não encontrado.", 404);
  }
  return prato;
}

export function listar() {
  return repo.listarPratos();
}

export function criar(dados: DadosPrato) {
  const nome = validarNome(dados.nome);
  const preco = validarPreco(dados.preco);
  const categoriaId = validarCategoria(dados.categoria_id);
  const disponivel = validarDisponivel(dados.disponivel);

  const id = repo.inserirPrato(
    nome,
    dados.descricao ?? null,
    preco,
    disponivel,
    dados.imagem_url ?? null,
    categoriaId
  );

  return repo.buscarPratoPorId(id);
}

export function atualizar(id: number, dados: DadosPrato) {
  buscarOuFalhar(id);
  const nome = validarNome(dados.nome);
  const preco = validarPreco(dados.preco);
  const categoriaId = validarCategoria(dados.categoria_id);
  const disponivel = validarDisponivel(dados.disponivel);

  repo.atualizarPrato(
    id,
    nome,
    dados.descricao ?? null,
    preco,
    disponivel,
    dados.imagem_url ?? null,
    categoriaId
  );

  return repo.buscarPratoPorId(id);
}

export function excluir(id: number): void {
  buscarOuFalhar(id);
  repo.excluirPrato(id);
}
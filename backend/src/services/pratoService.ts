// regras de negócio dos pratos
import { AppError } from "../errors/AppError";
import * as repo from "../repositories/pratoRepository";
import { buscarCategoriaPorId } from "../repositories/categoriaRepository";
import { normalizarTexto } from "../utils/normalizarTexto";
import * as validar from "./validacoes";

interface EntradaPrato {
  nome?: unknown;
  descricao?: unknown;
  preco?: unknown;
  quantidade?: unknown;
  disponivel?: unknown;
  imagem_url?: unknown;
  categoria_id?: unknown;
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

function validarDados(entrada: EntradaPrato): repo.DadosPrato {
  return {
    nome: validar.validarTextoObrigatorio(entrada.nome, "O nome do prato é obrigatório."),
    descricao: validar.validarTextoOpcional(entrada.descricao, "descrição"),
    preco: validarPreco(entrada.preco),
    quantidade: validar.validarInteiroNaoNegativo(entrada.quantidade, "A quantidade deve ser um número inteiro, de zero para cima."),
    disponivel: validar.validarSimNao(entrada.disponivel, "disponível"),
    imagem_url: validar.validarImagem(entrada.imagem_url),
    categoria_id: validarCategoria(entrada.categoria_id),
  };
}

// não deixa cadastrar dois pratos com o mesmo nome
function garantirNomeDisponivel(nome: string, idAtual?: number): void {
  const repetido = repo
    .listarPratos()
    .some((prato) => prato.id !== idAtual && normalizarTexto(prato.nome) === normalizarTexto(nome));

  if (repetido) {
    throw new AppError("Já existe um prato com esse nome.", 409);
  }
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

export function criar(entrada: EntradaPrato) {
  const dados = validarDados(entrada);
  garantirNomeDisponivel(dados.nome);
  const id = repo.inserirPrato(dados);
  return repo.buscarPratoPorId(id);
}

export function atualizar(id: number, entrada: EntradaPrato) {
  buscarOuFalhar(id);
  const dados = validarDados(entrada);
  garantirNomeDisponivel(dados.nome, id);
  repo.atualizarPrato(id, dados);
  return repo.buscarPratoPorId(id);
}

export function excluir(id: number): void {
  buscarOuFalhar(id);
  repo.excluirPrato(id);
}

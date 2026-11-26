// regras de negócio das categorias
import { AppError } from "../errors/AppError";
import * as repo from "../repositories/categoriaRepository";
import { listarPratosPorCategoria } from "../repositories/pratoRepository";
import { normalizarTexto } from "../utils/normalizarTexto";
import * as validar from "./validacoes";

interface EntradaCategoria {
  nome?: unknown;
  descricao?: unknown;
  ordem?: unknown;
  visivel?: unknown;
  imagem_url?: unknown;
}

function validarDados(entrada: EntradaCategoria): repo.DadosCategoria {
  return {
    nome: validar.validarTextoObrigatorio(entrada.nome, "O nome da categoria é obrigatório."),
    descricao: validar.validarTextoOpcional(entrada.descricao, "descrição"),
    ordem: validar.validarInteiroNaoNegativo(entrada.ordem, "A ordem deve ser um número inteiro, de zero para cima."),
    visivel: validar.validarSimNao(entrada.visivel, "visível"),
    imagem_url: validar.validarImagem(entrada.imagem_url),
  };
}

// não deixa repetir o nome, mesmo mudando acentos ou letras maiúsculas
function garantirNomeDisponivel(nome: string, idAtual?: number): void {
  // ao atualizar, a própria categoria pode manter o mesmo nome
  const repetida = repo
    .listarCategorias()
    .some((categoria) => categoria.id !== idAtual && normalizarTexto(categoria.nome) === normalizarTexto(nome));

  if (repetida) {
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

export function listarPratos(id: number) {
  buscarOuFalhar(id);
  return listarPratosPorCategoria(id);
}

export function criar(entrada: EntradaCategoria) {
  const dados = validarDados(entrada);
  garantirNomeDisponivel(dados.nome);
  const id = repo.inserirCategoria(dados);
  return repo.buscarCategoriaPorId(id);
}

export function atualizar(id: number, entrada: EntradaCategoria) {
  buscarOuFalhar(id);
  const dados = validarDados(entrada);
  garantirNomeDisponivel(dados.nome, id);
  repo.atualizarCategoria(id, dados);
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

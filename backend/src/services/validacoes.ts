// validações usadas tanto por categorias quanto por pratos
import { AppError } from "../errors/AppError";

const TAMANHO_MAXIMO_IMAGEM = 2_800_000; // cerca de 2 MB depois de convertida para texto
const FORMATO_IMAGEM = /^(assets\/images\/[\w.-]+|data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+)$/;

export function validarTextoObrigatorio(valor: unknown, mensagem: string): string {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new AppError(mensagem, 400);
  }
  return valor.trim();
}

export function validarTextoOpcional(valor: unknown, campo: string): string | null {
  if (valor === undefined || valor === null) return null;
  if (typeof valor !== "string") {
    throw new AppError(`Valor inválido para o campo ${campo}.`, 400);
  }
  return valor.trim() || null;
}

// quando o campo não é enviado, vale zero
export function validarInteiroNaoNegativo(valor: unknown, mensagem: string): number {
  if (valor === undefined || valor === null) return 0;
  if (typeof valor !== "number" || !Number.isInteger(valor) || valor < 0) {
    throw new AppError(mensagem, 400);
  }
  return valor;
}

// o SQLite não tem booleano, por isso guardamos 1 ou 0
export function validarSimNao(valor: unknown, campo: string): number {
  if (valor === undefined) return 1;
  if (valor === true || valor === 1) return 1;
  if (valor === false || valor === 0) return 0;
  throw new AppError(`Valor inválido para o campo ${campo}.`, 400);
}

export function validarImagem(valor: unknown): string | null {
  const imagem = validarTextoOpcional(valor, "imagem");
  if (imagem === null) return null;
  if (imagem.length > TAMANHO_MAXIMO_IMAGEM || !FORMATO_IMAGEM.test(imagem)) {
    throw new AppError("Envie uma imagem JPG ou PNG de até 2 MB.", 400);
  }
  return imagem;
}

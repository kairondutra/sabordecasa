import { Request } from "express";
import { AppError } from "../errors/AppError";

// pega o id da URL e confere se é um número inteiro positivo
export function lerId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("O id informado é inválido.", 400);
  }
  return id;
}

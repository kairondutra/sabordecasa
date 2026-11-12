import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function tratarErros(err: Error, req: Request, res: Response, next: NextFunction) {
  // erros previstos (AppError) voltam com a mensagem e o código definidos nas regras
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }
  // qualquer outro erro é inesperado: registra no servidor e não expõe detalhes ao usuário
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
}
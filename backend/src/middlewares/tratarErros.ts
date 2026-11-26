import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

// erros que o próprio express gera ao ler os dados enviados
const errosDeLeitura: Record<string, { status: number; mensagem: string }> = {
  "entity.parse.failed": { status: 400, mensagem: "Os dados enviados não estão em um JSON válido." },
  "entity.too.large": { status: 413, mensagem: "Envie uma imagem JPG ou PNG de até 2 MB." },
};

export function tratarErros(err: Error & { type?: string }, req: Request, res: Response, next: NextFunction) {
  // erros previstos (AppError) voltam com a mensagem e o código definidos nas regras
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }
  const erroDeLeitura = errosDeLeitura[err.type ?? ""];
  if (erroDeLeitura) {
    return res.status(erroDeLeitura.status).json({ erro: erroDeLeitura.mensagem });
  }
  // qualquer outro erro é inesperado: registra no servidor e não expõe detalhes ao usuário
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
}

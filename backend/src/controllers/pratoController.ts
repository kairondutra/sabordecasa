import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import * as service from "../services/pratoService";

function lerId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("O id informado é inválido.", 400);
  }
  return id;
}

export function listar(req: Request, res: Response) {
  res.json(service.listar());
}

export function buscarPorId(req: Request, res: Response) {
  res.json(service.buscarOuFalhar(lerId(req)));
}

export function criar(req: Request, res: Response) {
  res.status(201).json(service.criar(req.body ?? {}));
}

export function atualizar(req: Request, res: Response) {
  res.json(service.atualizar(lerId(req), req.body ?? {}));
}

export function excluir(req: Request, res: Response) {
  service.excluir(lerId(req));
  res.status(204).send();
}
// recebe a requisição, chama o serviço e devolve a resposta
import { Request, Response } from "express";
import * as service from "../services/pratoService";
import { lerId } from "../utils/lerId";

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

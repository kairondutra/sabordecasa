// rotas de categorias
import { Router } from "express";
import * as controller from "../controllers/categoriaController";

const router = Router();

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
// pratos de uma categoria
router.get("/:id/pratos", controller.listarPratos);
router.post("/", controller.criar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

export default router;

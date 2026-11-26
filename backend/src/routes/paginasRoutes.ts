// entrega as telas do site pelo mesmo servidor da API
import express, { Router } from "express";
import path from "node:path";

// pasta principal do projeto, onde ficam os arquivos HTML
const pastaDoSite = path.resolve(__dirname, "../../..");

const paginas = [
  "index.html",
  "pratos_categoria.html",
  "novo_prato.html",
  "editar_prato.html",
  "nova_categoria.html",
  "editar_categoria.html",
];

const router = Router();

// liberamos só as pastas do site, para o código do back-end não ficar exposto
["css", "js", "assets"].forEach((pasta) => {
  router.use(`/${pasta}`, express.static(path.join(pastaDoSite, pasta)));
});

router.get("/", (req, res) => res.sendFile(path.join(pastaDoSite, "index.html")));

paginas.forEach((pagina) => {
  router.get(`/${pagina}`, (req, res) => res.sendFile(path.join(pastaDoSite, pagina)));
});

export default router;

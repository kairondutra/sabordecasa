// entrega as telas do site pelo mesmo servidor da API
import express, { Router } from "express";
import path from "node:path";

const pastaDoSite = path.resolve(__dirname, "../../../frontend");
const pastaDasPaginas = path.join(pastaDoSite, "pages")

const paginas = [
  "index.html",
  "pratos_categoria.html",
  "novo_prato.html",
  "editar_prato.html",
  "nova_categoria.html",
  "editar_categoria.html",
];

const router = Router();

// liberamos só as pastas do site
["css", "js", "assets"].forEach((pasta) => {
  router.use(`/${pasta}`, express.static(path.join(pastaDoSite, pasta)));
});

router.get("/", (req, res) => res.sendFile(path.join(pastaDasPaginas, "index.html")));

paginas.forEach((pagina) => {
  router.get(`/${pagina}`, (req, res) => res.sendFile(path.join(pastaDasPaginas, pagina)));
});

export default router;

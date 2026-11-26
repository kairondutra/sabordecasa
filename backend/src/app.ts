import express from "express"
import categoriaRoutes from "./routes/categoriaRoutes"
import pratoRoutes from "./routes/pratoRoutes"
import paginasRoutes from "./routes/paginasRoutes"
import { tratarErros } from "./middlewares/tratarErros"

const app = express()

// limite maior porque a foto é enviada junto com os dados
app.use(express.json({ limit: "3mb" }));
app.use("/categorias", categoriaRoutes);
app.use("/pratos", pratoRoutes);
app.use(paginasRoutes);

// qualquer outro endereço
app.use((req, res) => {
    res.status(404).json({ erro: "Endereço não encontrado." });
});

app.use(tratarErros)

export default app

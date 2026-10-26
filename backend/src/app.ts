import express from "express"
import categoriaRoutes from "./routes/categoriarRoutes"
import { tratarErros } from "./middlewares/tratarErros"

const app = express()

app.use(express.json());
app.use("/categorias", categoriaRoutes);

// middleware de erros
app.use(tratarErros)

export default app
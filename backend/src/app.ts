import express from "express"
import categoriaRoutes from "./routes/categoriarRoutes"
import pratoRoutes from "./routes/pratoRoutes"
import { tratarErros } from "./middlewares/tratarErros"

const app = express()

app.use(express.json());
app.use("/categorias", categoriaRoutes);
app.use("/pratos", pratoRoutes);

app.use(tratarErros)

export default app
import app from "./app";
import { iniciarBanco } from "./database/schema";

const PORT = 3000;

iniciarBanco();

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
} )

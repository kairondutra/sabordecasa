import app from "./app";
import { iniciarBanco } from "./database/schema";

// o serviço de hospedagem informa a porta pela variável PORT
const PORT = Number(process.env.PORT) || 3000;

iniciarBanco();

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
} )

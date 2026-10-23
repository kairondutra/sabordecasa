import { DatabaseSync } from "node:sqlite";
import path from "node:path";

//process.env.DB_PATH serve para pegar o caminho do banco de dados se ja tiver criado e o path.join(process.cwd() serve para criar o banco de dados caso não exista
const caminhoBanco = process.env.DB_PATH || path.join(process.cwd(), 'marmitaria.db');

const db = new DatabaseSync(caminhoBanco);

// ativa a verificação de chaves estrangeiras.
db.exec('PRAGMA foreign_keys = ON;')

export { db };

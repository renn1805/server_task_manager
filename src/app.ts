import express from "express";
import cors from "cors";
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma';
import 'dotenv/config';

// O segredo está aqui: passamos a URL dentro de um objeto, como o erro sugeriu
const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./database.db'
});

const prisma = new PrismaClient({ adapter });

const app = express();
app.use(express.json());
app.use(cors());

export { app, prisma };
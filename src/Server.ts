import express from "express";
import cors from "cors";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma";
import "dotenv/config";
import routes from "./route";
import errorHandler from "./middleware/ErrorHandler";

// O segredo está aqui: passamos a URL dentro de um objeto, como o erro sugeriu
const dbUrl = process.env.DATABASE_URL || "file:/app/data/database.db";

const adapter = new PrismaLibSql({
    url: dbUrl,
});

const prisma = new PrismaClient({ adapter });

const app = express();
app.use(express.json());
app.use(cors());

app.use(routes);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, "0.0.0.0", () =>
    console.log(`The server is running on port ${PORT}`),
);

export { app, prisma };

import "reflect-metadata";
import { DataSource } from "typeorm";  
import "dotenv/config";
import { Roles1708974926321 } from "./migrations/1708974926321-roles";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "tattoo_studio",
    entities: [],
    migrations: [Roles1708974926321],
    synchronize: false,
    logging: false,
});
import "reflect-metadata";
import { DataSource } from "typeorm";  
import "dotenv/config";
import { Roles1708974926321 } from "./migrations/1708974926321-roles";
import { Users1708975325676 } from "./migrations/1708975325676-users";
import { Services1708976078071 } from "./migrations/1708976078071-services";
import { Appointments1708976549606 } from "./migrations/1708976549606-appointments";
import { Catalogue1708977049545 } from "./migrations/1708977049545-catalogue";
import { Role } from "../models/Role"; 
import { User } from "../models/User"; 
import { Service } from "../models/Service"; 
import { Catalogue } from "../models/Catalogue"; 
import { Appointment } from "../models/Appointment";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "tattoo_studio",
    entities: [Role, User, Service, Catalogue, Appointment],
    migrations: [Roles1708974926321, Users1708975325676, Services1708976078071, Appointments1708976549606, Catalogue1708977049545],
    synchronize: false,
    logging: false,
});
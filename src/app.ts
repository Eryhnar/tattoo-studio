import express from 'express';
import { getRoles, updateRole, createRole } from "./controllers/role-controller";

export const app = express();

app.use(express.json());

app.get("/roles", getRoles);

app.post("/roles", createRole);

app.put("/roles", updateRole);
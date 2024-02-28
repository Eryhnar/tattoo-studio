import express from 'express';
import { getRoles, updateRole, createRole } from "./controllers/role-controller";
import { register } from "./controllers/auth-controller";

export const app = express();

app.use(express.json());

//roles routes
app.get("/roles", getRoles);
app.post("/roles", createRole);
app.put("/roles", updateRole);

//auth routes
app.post("/auth/register", register);
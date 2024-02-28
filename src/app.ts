import express from 'express';
import { getRoles, updateRole, createRole } from "./controllers/role-controller";
import { register } from "./controllers/auth-controller";
import { getUsers } from './controllers/user-controller';

export const app = express();

app.use(express.json());

//roles routes
app.get("/roles", getRoles);
app.post("/roles", createRole);
app.put("/roles", updateRole);

//auth routes
app.post("/api/register", register);

//user routes
app.get("/api/users", getUsers);
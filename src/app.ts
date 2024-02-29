import express, { Application } from "express";
import { getRoles, updateRole, createRole } from "./controllers/role-controller";
import { login, register } from "./controllers/auth-controller";
import { deleteUserById, getUsers, updateUserById, updateUserPassword } from "./controllers/user-controller";

export const app: Application = express();

app.use(express.json());

//roles routes
app.get("/roles", getRoles);
//app.post("/roles", createRole);
//app.put("/roles", updateRole);

//auth routes
app.post("/api/register", register);
app.post("/api/login", login);

//user routes
app.get("/api/users", getUsers);
app.put("/api/users/:id", updateUserById);
app.put("/api/users/:id", updateUserPassword);
app.delete("/api/users/:id", deleteUserById);

//Service routes
//create service
//delete service
//update service
//get service by id
//get all services
//get service by name // not necesary

//catalogue routes
//create entry
//delete entry
//update entry
//get entry by id
//get entry by name
//get entry by service
//get entry by artist
//get all entries

//appointment routes
//create appointment
//cancel appointment
//get appointments
//get appointment by id
//get appointment by service
//update appointment by id
//get all appointments (admin)

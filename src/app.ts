import express, { Application } from "express";
import { getRoles, updateRole, createRole } from "./controllers/role-controller";
import { login, register } from "./controllers/auth-controller";
import { deactivateUser, deleteUserById, getProfile, getUsers, updateProfile, updateProfilePassword, updateUserById } from "./controllers/user-controller";

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
app.get("/api/users/profile", getProfile) //user
app.put("/api/users/profile", updateProfile) //user
app.put("/api/users/profile/password", updateProfilePassword); //user
app.put("/api/users/profile", deactivateUser); //user
app.get("/api/users", getUsers); //admin 
app.put("/api/users/:id", updateUserById); //admin
app.delete("/api/users/:id", deleteUserById); //admin

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

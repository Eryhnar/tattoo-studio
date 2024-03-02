import express, { Application } from "express";
import { getRoles, updateRole, createRole } from "./controllers/role-controller";
import { login, register } from "./controllers/auth-controller";
import { deactivateUser, deleteUserById, getProfile, getUsers, updateProfile, updateProfilePassword, updateUserById } from "./controllers/user-controller";
import { createService, deleteService, getServices, updateService } from "./controllers/service-controller";
import { createCatalogueEntry } from "./controllers/catalogue-controller";

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
app.put("/api/users/profile/delete", deactivateUser); //user
app.get("/api/users", getUsers); //admin 
app.put("/api/users/:id", updateUserById); //admin
app.delete("/api/users/:id", deleteUserById); //admin

//Service routes
//create service
app.post("/api/services", createService);
//get all services
app.get("/api/services", getServices);
//update service
app.put("/api/services/:id", updateService);
//delete service
app.delete("/api/services/:id", deleteService);


//get service by id
//get service by name // not necesary

//catalogue routes
//create entry
app.post("/api/catalogue", createCatalogueEntry);
//update entry
app.put("/api/catalogue/:id", updateCatalogueEntry);
//delete entry
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

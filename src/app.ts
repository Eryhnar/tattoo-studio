import express, { Application } from "express";
import { getRoles, updateRole, createRole } from "./controllers/role-controller";
import { login, register } from "./controllers/auth-controller";
import { deactivateUser, deleteUserById, getProfile, getUsers, updateProfile, updateProfilePassword, updateUserById } from "./controllers/user-controller";
import { createService, deleteService, getServices, updateService } from "./controllers/service-controller";
import { createCatalogueEntry, deleteCatalogueEntry, getCatalogueEntries, updateCatalogueEntry } from "./controllers/catalogue-controller";
import { cancelAppointment, createAppointment, deleteAppointment, getAppointmentById, getAppointments, updateAppointment } from "./controllers/appointment-controller";
import { auth, isSuperAdmin, validateEmail, validatePassword, validateTargetId, validateUserName, validateUserSurname } from "./middlewares/validation-middleware";

export const app: Application = express();

app.use(express.json());

//roles routes
app.get("/api/roles", auth, isSuperAdmin, getRoles);
//app.post("/roles", createRole);
//app.put("/roles", updateRole);

//auth routes
app.post("/api/register", validateUserName, validateUserSurname, validateEmail, validatePassword, register);
app.post("/api/login", validateEmail, validatePassword, login);

//user routes
app.get("/api/users/profile", auth, getProfile) //user
app.put("/api/users/profile", auth, validateUserName, validateUserSurname, validateEmail, updateProfile) //user
app.put("/api/users/profile/password", auth, updateProfilePassword); //user
app.put("/api/users/profile/delete", auth, deactivateUser); //user
app.get("/api/users", auth, isSuperAdmin, getUsers); //admin 
app.put("/api/users/:id", auth, isSuperAdmin, validateTargetId, updateUserById); //admin
app.delete("/api/users/:id", auth, isSuperAdmin, validateTargetId, deleteUserById); //admin

//Service routes
//create service
app.post("/api/services", auth, isSuperAdmin, createService);
//get all services
app.get("/api/services", getServices);
//update service
app.put("/api/services/:id", auth, isSuperAdmin, validateTargetId, updateService);
//delete service
app.delete("/api/services/:id", auth, isSuperAdmin, validateTargetId, deleteService);


//get service by id
//get service by name // not necesary

//catalogue routes
//create entry
app.post("/api/catalogue", auth, isSuperAdmin, createCatalogueEntry);
//update entry
app.put("/api/catalogue/:id", auth, isSuperAdmin, updateCatalogueEntry);
//delete entry
app.delete("/api/catalogue/:id", auth, isSuperAdmin, deleteCatalogueEntry);
//get all entries
app.get("/api/catalogue", getCatalogueEntries);

//appointment routes
//create appointment
app.post("/api/appointments", auth, createAppointment);
//update appointment by id
app.put("/api/appointments/:id", auth, updateAppointment);
//cancel appointment by id
app.put("/api/appointments/:id/cancel", auth, cancelAppointment);
//get all appointments (admin)
app.get("/api/appointments", auth, getAppointments);
//get appointments
//app.get("/api/appointments", getAllAppointments); //admin
//get appointment by id
app.get("/api/appointments/:id", auth, getAppointmentById);
//get appointment by service
//delete appointment by id
app.delete("/api/appointments/:id", auth, isSuperAdmin, deleteAppointment); //admin

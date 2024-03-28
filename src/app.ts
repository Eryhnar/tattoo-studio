import express, { Application, Request, Response } from "express";
import { getRoles, updateRole, createRole } from "./controllers/role-controller";
import { login, register } from "./controllers/auth-controller";
import { deactivateUser, deleteUserById, getProfile, getUsers, updateProfile, updateProfilePassword, updateUserById } from "./controllers/user-controller";
import { createService, deleteService, getServices, updateService } from "./controllers/service-controller";
import { createCatalogueEntry, deleteCatalogueEntry, getCatalogueEntries, updateCatalogueEntry } from "./controllers/catalogue-controller";
import { cancelAppointment, createAppointment, deleteAppointment, getAppointmentById, getAppointments, getOwnAppointments, updateAppointment } from "./controllers/appointment-controller";
import { auth, isSuperAdmin, validateEmail, validatePassword, validateTargetId, validateUserName, validateUserSurname } from "./middlewares/validation-middleware";
import cors from "cors";

export const app: Application = express();

app.use(express.json());
app.use(cors());

app.get("/api/healthy", (req: Request, res: Response) => (
    res.status(200).json(
        {
            success: true,
            message: "Server is healthy"
        }
    )
))

//roles routes
app.get("/api/roles", auth, isSuperAdmin, getRoles);
//app.post("/roles", auth, isSuperAdmin, createRole);
//app.put("/roles", auth, isSuperAdmin, updateRole);

//auth routes
app.post("/api/register", validateUserName, validateUserSurname, validateEmail, validatePassword, register);
app.post("/api/login", validateEmail, validatePassword, login);

//user routes
app.get("/api/users/profile", auth, getProfile) //user
app.put("/api/users/profile", auth, validateUserName, validateUserSurname, validateEmail, updateProfile) //user
app.put("/api/users/profile/password", auth, updateProfilePassword); //user TODO add password middleware here too.
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
app.put("/api/catalogue/:id", auth, isSuperAdmin,validateTargetId, updateCatalogueEntry);
//delete entry
app.delete("/api/catalogue/:id", auth, isSuperAdmin,validateTargetId, deleteCatalogueEntry);
//get all entries
app.get("/api/catalogue", getCatalogueEntries);

//appointment routes
//create appointment
app.post("/api/appointments", auth, createAppointment);
//get own appointments
app.get("/api/appointments/user", auth, getOwnAppointments);
//update appointment by id
app.put("/api/appointments/:id", auth, validateTargetId, updateAppointment);
//cancel appointment by id
app.put("/api/appointments/:id/cancel", auth, validateTargetId, cancelAppointment);
//get all appointments (admin)
app.get("/api/appointments", auth, getAppointments);
//get appointments
//app.get("/api/appointments", getAllAppointments); //admin
//get appointment by id
app.get("/api/appointments/:id", auth, validateTargetId, getAppointmentById);
//get appointment by service
//delete appointment by id
app.delete("/api/appointments/:id", auth, isSuperAdmin, validateTargetId, deleteAppointment); //admin

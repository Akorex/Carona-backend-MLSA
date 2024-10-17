import { Router } from "express";
import isLoggedIn from "../middlewares/auth.js";
import { createTrip, getTrip, deleteTrip } from "../controllers/trip.js";

const tripRouter = Router();

tripRouter.get('/:id', isLoggedIn, getTrip);

tripRouter.post('/', isLoggedIn, createTrip);

tripRouter.delete('/:id', isLoggedIn, deleteTrip);

export default tripRouter;
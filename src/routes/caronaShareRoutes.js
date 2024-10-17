import express from "express"

// import tokenAuthentication from "../middlewares/"
import { shareValidation } from "../middlewares/shareValidations.js"
import { shareATrip, getAlltrips, getAShareTrip, deleteAtrip, tripstatus } from "../controllers/caronaShare.controller.js"
import isLoggedIn from "../middlewares/auth.js"

export const shareRouter = express.Router()

shareRouter.post('/create', isLoggedIn,  shareValidation, shareATrip)
shareRouter.get('/shared-trips', isLoggedIn, getAlltrips)
shareRouter.get('/trip/:id', isLoggedIn, getAShareTrip)
shareRouter.delete('/trip/:id', isLoggedIn, deleteAtrip)
shareRouter.post('/trip/:id/status', isLoggedIn, tripstatus)



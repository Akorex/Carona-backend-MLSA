import { Router } from "express";
import { changePassword, loginAccount, registerAccount } from "../controllers/auth.js";
import { signUpValidation } from "../middlewares/authValidations.js";

const authRouter = Router()
authRouter.post('/register', signUpValidation, registerAccount)
authRouter.post("/login", loginAccount)
authRouter.patch("/change-password", changePassword)


export default authRouter

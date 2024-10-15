import User from "../models/auth.js"
import { successResponse, errorResponse } from "../utils/responses.js"
import { StatusCodes } from "http-status-codes"
import { createAccessToken, generateHashedValue, isPasswordCorrect } from "../utils/auth.js"
import logger from "../utils/logger.js"
import { isVerified } from "../utils/signUpValidationFunc.js"

export const registerAccount = async (req, res, next)  => {
    try{
        logger.info("START: Register Account Service")

        const {firstName, lastName, email, password, username} = req.validatedUser

        const existingUser = await User.findOne({email})

        if (existingUser){
            return errorResponse(res, StatusCodes.BAD_REQUEST, `User already exists. Log in instead`)
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: generateHashedValue(password),
            username,
        })

        const isUserVerified = isVerified(req, res, newUser)

        const accessToken = createAccessToken(newUser.id)

        logger.info("END: Register Account Service")

        successResponse(res, StatusCodes.CREATED, `Successfully created an account`, {user: newUser, token: accessToken})

    }catch(error){
        if (error.code === 11000) {
            logger.error("Error: Username already exists")
            next(error)
            return errorResponse(res, StatusCodes.CONFLICT, "Username already exists. Try another username.")
        }
        console.log(JSON.stringify(error))
        next(error)
    }

}

export const loginAccount = async (req, res, next) => {
    try {
        logger.info("START: Started Login Service")

        const {username, password} = req.body

        if (!username || !password) {
            logger.info("END: Started Login Service")

            return errorResponse(res, StatusCodes.UNPROCESSABLE_ENTITY, "missing parameter(s): input password and username")
        }

        const existingUser = await User.findOne({username})

        if (!existingUser) {
            logger.info("END: Started Login Service")

            return errorResponse(res, StatusCodes.BAD_REQUEST, "User does not exist. Register account instead.")
        }

        if (!isPasswordCorrect(password, existingUser.password)) {
            logger.info("END: Started Login Service")

            return errorResponse(res, StatusCodes.BAD_REQUEST, "You have entered the wrong username or password.")
        }

        const accessToken = createAccessToken(existingUser.id)

        logger.info("END: Started Login Service")

        successResponse(res, StatusCodes.OK, "Login Successful", {user: existingUser, token: accessToken})
    }

    catch(error) {
        logger.error(error)
        next(error)
    }
}

export const forgotPassword = async (req, res, next) => {

    // user is loggedout
    // token is generated 
    
}

export const changePassword = async (req, res, next) => {
    // user is loggedin

    try {
        logger.info("START: Started ChangePassword Service")

        const {password} = req.body

        const updateUser = await User.findOneAndUpdate({password})

        if (!password) {
            return errorResponse(res, StatusCodes.UNPROCESSABLE_ENTITY, "nothing to update here")
        }

        return successResponse(res, StatusCodes.OK, "Password changed successfully")
    } catch (error) {
        logger.error(error)
        next(error)
    }
    
}

export const resetPassword = async (req, res, next) => {

}
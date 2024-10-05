import User from "../models/auth.js"
import { successResponse, errorResponse } from "../utils/responses.js"
import { StatusCodes } from "http-status-codes"
import { generateHashedValue } from "../utils/auth.js"

export const registerAccount = async (req, res, next)  => {
    try{
        const {firstName, lastName, email, password, username} = req.body

        const existingUser = await User.findOne({email})

        if (existingUser){
            return errorResponse(res, StatusCodes.BAD_REQUEST, `User already exists. Log in instead`)
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: generateHashedValue(password),
            username
        })

        successResponse(res, StatusCodes.CREATED, `Successfully created an account`, newUser)

    }catch(error){
        console.log(error)
        next(error)
    }

}

export const loginAccount = async (req, res, next) => {

}

export const forgotPassword = async (req, res, next) => {
    // user is loggedout
    // token is generated 
    
}

export const changePassword = async (req, res, next) => {
    // user is loggedin
    
}

export const resetPassword = async (req, res, next) => {

}
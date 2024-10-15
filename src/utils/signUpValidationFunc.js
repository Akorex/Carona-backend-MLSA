import { StatusCodes } from "http-status-codes"
import { errorResponse } from "./responses.js"

export const isVerified = (req, res, newUser) => {

        if (typeof(req.body.firstName) === "string" && req.body.firstName.length > 2 && req.body.firstName.length < 21 && typeof(req.body.lastName) === "string" && req.body.lastName.length > 2 && req.body.lastName.length < 21 && typeof(req.body.username) === "string" && typeof(req.body.password) === "string" && typeof(req.body.email) === "string") {
            newUser.isVerified = true
        }
        
        // The authValidation covers this already, so this condition is subject to change...should verify the email by sending after a confirmation mail is sent
        else {
            return errorResponse(res, StatusCodes.BAD_REQUEST, `Invalid input parameter(s)`)
        }


}
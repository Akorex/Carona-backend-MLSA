import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { errorResponse} from "../utils/responses.js";

const userSchema = z.object({
    firstName: z.string({
                    required_error: "firstname is required",
                    invalid_type_error: "firstname must be a string"
                })
                .min(3, {message:"Must be at least 3 Characters long" })
                .max(30, {message:"firstName must not be longer than 30 characters"})
                .trim()
                .toLowerCase(),

    lastName: z.string({
                    required_error: "lastname is required",
                    invalid_type_error: "lastname must be a string"
                })
                .min(3, {message: "LastName must be at least 30 Characters long"})
                .max(30, {message: "LastName must not be longer than 30 characters"})
                .trim()
                .toLowerCase(),

    username: z.string({
                    required_error: "Username is required",
                    invalid_type_error: "Username must be a string"
                })
                .min(3, {message: "Username must be at least 3 Characters long"})
                .trim()
                .toLowerCase(),

    email: z.string({
                required_error: "Email is required"
            })
            .email({message: "Invalid email address"})
            .trim()
            .toLowerCase(),

    password: z.string({
                    required_error: "Password is required"
                })
               .trim()

})




export const signUpValidation = async(req, res, next) =>{
    try{
    const signUpData = userSchema.safeParse(req.body)
    
    if(!signUpData.success){
        const validationErrors = signUpData.error.errors.map(err => ({
            field: err.path[0],
            message: err.message,
        }));
  
        return errorResponse(res,StatusCodes.BAD_REQUEST,{
            message : "Validation Failed, Try again!",
            validationErrors
        })
    }

    req.validatedUser = signUpData.data //Controller has access to validated User
    next()
    }
    catch(error){
        console.log(error)
        next(error)
    }
}


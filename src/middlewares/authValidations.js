import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils/responses.js";
import { User } from "../models/auth.js"
import { createAccessToken, generateHashedValue } from "../utils/auth.js";


// signup validation
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
// registerAccount

const registerSchema = z.object({
    firstName: z.string({
        required_error: "First name is required",
        invalid_type_error: "First name must be a string"
    })
    .min(3, { message: "First name must be at least 3 characters long"})
    .max(30, { message: "First name must not be longer than 30 characters"})
    .trim()
    .toLowerCase(),


    LastName: z.string({
        required_error: "Last name is required",
        invalid_type_error: "Last name must be a string"
    })
    .min(3, { message: "Last name must be at least 3 characters long"})
    .max(30, { message: "Last name must not be longer than 30 characters"})
    .trim()
    .toLowerCase(),

    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string"
    })
    .min(3, { message: "Username must be at least 3 characters long" })
    .trim()
    .toLowerCase(),

    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string"
        
    })  
    .email({ message: "Invalid email address"})
    .trim()
    .toLowerCase(),

    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    })
    .min(6, { message: "Password must be at least 6 characters"})
    .trim()
    
    });

    export const registerAccount = async (req, res, next) => {
        try {
            logger.info("START: Register Account Service");

            const registerData = registerSchema.safeParse(req.body);

            if(!registerData.success) {
                const validationErrors = registerData.error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message,
                }))

                logger.info("END: Validation failed during registeration ");

                return errorResponse(res, StatusCodes.UNPROCESSABLE_ENTITY, {
                    message: "Validation Failed, Try again",
                    validationErrors
                });
            }

            const { firstName, lastName, username, email, password } = registerData.data;

            const existingUser = await User.findOne ({ email });

            if (existingUser) {
                logger.info("END: User already exists");

                return errorResponse(res, StatusCodes.BAD_REQUEST, "User already exists. Login Instead.");
            }

            const newUser = await User.create({
                firstName,
                lastName,
                email,
                username,
                password: generateHashedValue(passwword),
            });

            const accessToken = createAccessToken(newUser.id);

            logger.info("END: Registration successful");

            return successResponse(res, StatusCodes.CREATED, "Successfully created an account", { user: newUser, token: accessToken});
    } catch (error) {
        if (error.code === 11000) {
            logger.error("Error: Username already exists");
            return errorResponse(res, StatusCodes.CONFLICT, "Username already exists. Try another username. ");

        }
        logger.error(error);
        next(error);
    }
}




// loginAccount
const loginSchema = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string"

    })
    .min(3, {message: "Username must be at least 3 characters long"})
    .trim()
    .toLowerCase(),

    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    })
    .min(6, { message: "Password must be at least 6 characters long"})
    .trim()
}); 

export const loginAccount = async (req, res, next) => {
    try {
        logger.info("START: Started Login Service");

        const loginData = loginSchema.safeParse(req.body);

        if(!loginData.success) {
            const validationErrors = loginData.error.errors.map(err => ({
                field: err.path[0],
                message: err.message
            }));

            logger.info('END: Validation failed during login');

            return errorResponse(res, StatusCodes.UNPROCESSABLE_ENTITY, {
                message: "Validation Failed, Try again!",
                validationErrors
            });
        }

        const {username, password} = loginData.data;

        const existingUser = await User.findOne({ username });

        if(!existingUser) {
            logger.info("END: User does not exist");

            return errorResponse(res, StatusCodes.BAD_REQUEST, "User does not exist. Register account instead.");
            
        }

        const accessToken = createAccessToken(existingUser.id);

        logger.info("END: Login successful");

        return successResponse(res, StatusCodes.OK, "Login Successful", { user: existingUser, token: accessToken});
   } catch (error) {
    logger.error(error);
    next(error);
   }

};


//

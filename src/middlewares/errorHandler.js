import { StatusCodes } from "http-status-codes"
import { errorResponse } from "../utils/responses.js"
import mongoose from "mongoose"
import logger from '../utils/logger.js'

const errorHandler = (error, req, res, next) => {
    let message = "Request failed. Try again later"
    let errCode = StatusCodes.INTERNAL_SERVER_ERROR

    if (
        error instanceof mongoose.Error.ValidationError ||
        error instanceof mongoose.Error.CastError ||
        error instanceof mongoose.Error.MissingSchemaError ||
        error instanceof mongoose.Error.OverwriteModelError ||
        error instanceof mongoose.Error.ValidationError
    ){
        message = error.message
        errCode = StatusCodes.BAD_REQUEST
    }else if (
        error instanceof RangeError ||
        error instanceof EvalError ||
        error instanceof TypeError ||
        error instanceof ReferenceError ||
        error instanceof URIError ||
        error instanceof SyntaxError
    ){
        message = error.message
        errCode = StatusCodes.BAD_REQUEST
    }else if (error.errorResponse.code === 11000){ // from mongodb
        message = "Resource already exists"
        errCode = StatusCodes.CONFLICT
    }

    logger.error(`[${req.method} ${req.url}] ${typeof message === 'string' ? message: JSON.stringify(message)}`)


    errorResponse(res, errCode, message)

}


export default errorHandler
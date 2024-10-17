
import Routes from "../models/routes.js"
import { isArrayOfNumbers } from "../utils/functions.js"
import { successResponse } from "../utils/responses.js"
import { StatusCodes } from 'http-status-codes'
import logger from '../utils/logger.js'


export const createRoute = async (req, res, next) => {
    try {
        let newRoute = req.body
        logger.info(`START: Create Route Service`)
        if (typeof (newRoute.startPoint) == "string" && typeof (newRoute.endPoint) == "string" && isArrayOfNumbers(newRoute.coordinates) && typeof (newRoute.distance) == "number" && typeof (newRoute.duration) == "number") {
            const result = await Routes.findOne(newRoute);
            console.log(result);
            if (result) {
                logger.info(`END: Create Route Service`)
                return res.send("Route Already Exists")
            }

            const route = await Routes.create(newRoute)
            successResponse(res, 200, "Route created successfully", route)
        } else {
            logger.info(`END: Create Route Service`)
            res.send("Invalid Format")
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const getAllRoutes = async (req, res, next) => {

    try {
        res.send(await Routes.find())
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const getRoute = async (req, res, next) => {
    try {
        const routeId = req.params.id

        const route = await Routes.findOne({ _id: routeId })

        if (!route) {
            return errorResponse(res, StatusCodes.NOT_FOUND, 'That route doesnt exist')
        }
        successResponse(res, StatusCodes.OK, 'successfully found route', route)
    } catch (error) {
        console.log(error)
        next(error)
    }

}

export const deleteRoute = async (req, res, next) => {
    try {
        const routeId = req.params.id

        const route = await Routes.findOne({ _id: routeId })


        if (!route) {
            return errorResponse(res, StatusCodes.BAD_REQUEST, `Route does not exist`)
        }

        await Routes.deleteOne({ _id: routeId })

        successResponse(res, StatusCodes.OK, `successfully deleted a route`, null)

    } catch (error) {
        console.log(error)
        next(error)
    }

}


export const updateRoute = async (req, res, next) => {
    try {
        const routeId = req.params.id
        const routeObject = req.body

        const updatedRoute = await Routes.findOneAndUpdate({ _id: routeId },
            routeObject,
            { new: true, runValidators: true })

        if (!updatedRoute) {
            return errorResponse(res, StatusCodes.BAD_REQUEST, `Route does not exist`)
        }

        successResponse(res, StatusCodes.OK, 'successfully updated route details', updatedRoute)

    } catch (error) {
        console.log(error)
        next(error)
    }

}


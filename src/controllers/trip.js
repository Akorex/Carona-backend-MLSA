import { StatusCodes } from "http-status-codes";
import z from "zod";

import Route from "../models/routes.js";
import Trip from "../models/trip.js";

import { successResponse, errorResponse } from "../utils/responses.js";
import { calculatePrice } from "../utils/calculatePrice.js";

import logger from "../utils/logger.js";

const tripSchema = z.object({
    pickupPoint: z.string().min(3).max(50),
    destination: z.string().min(3).max(50),
    distance: z.number(),
    duration: z.number().min(1),
    price: z.number().min(750)
}).required();

export const getTrip = async (req, res, next) => {
    try {
        
        logger.info("START: Get A Trip");

        const { id: tripId } = req.params;
        const { userId } = req.user;

        const trip = await Trip.findOne({ _id: tripId, createdBy: userId });

        if (trip) {
            logger.info("END: Get A Trip");
            return successResponse(res, StatusCodes.OK, "Trip fetched successfully.", trip);
        } else {
            logger.info("END: Get A Trip");
            return errorResponse(res, StatusCodes.NOT_FOUND, "Trip was not found.")
        }

    } catch (error) {
        logger.error(error);
        next(error);
    }
}

export const createTrip = async (req, res, next) => {
    try {
        logger.info("START: Create A Trip");
        
        const { pickupPoint, destination } = req.body;
        const { userId } = req.user;

        const existingRoute = await Route.findOne({
            startPoint: pickupPoint,
            endPoint: destination
        });

        if (!existingRoute) {
            logger.info("END: Create A Trip");
            return errorResponse(res, StatusCodes.UNPROCESSABLE_ENTITY, "Route is currently not supported.")
        }

        const { distance, duration } = existingRoute;

        const trip = {
            pickupPoint,
            destination,
            createdBy: userId,
            distance,
            duration,
            price: calculatePrice(distance, duration)
        }

        tripSchema.parse(trip);

        const existingTrip = await Trip.findOne(trip);

        if (existingTrip) {
            logger.info("END: Create A Trip");
            return errorResponse(res, StatusCodes.BAD_REQUEST, "Trip already exists.")
        }

        const newTrip = await Trip.create(trip);

        logger.info("END: Create A Trip");
        return successResponse(res, StatusCodes.CREATED, "Trip created successfully.", newTrip);

    } catch (error) {
        logger.error(error);
        next(error);
    }
}
export const deleteTrip = async (req, res, next) => {
    try {
        logger.info("START: Delete A Trip");

        const { id: tripId } = req.params;
        const { userId } = req.user;

        const trip = await Trip.findOneAndDelete({ _id: tripId, createdBy: userId });

        if (trip) {
            logger.info("END: Delete A Trip");
            return successResponse(res, StatusCodes.OK, "Trip deleted successfully.");
        } else {
            logger.info("END: Delete A Trip");
            return errorResponse(res, StatusCodes.NOT_FOUND, "Trip was not found.")
        }

    } catch (error) {
        logger.error(error);
        next(error);
    }
}
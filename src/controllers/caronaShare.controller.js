import { StatusCodes } from "http-status-codes";


import User from "../models/auth.js";
import shareUser from "../models/shareUser.js";
import { successResponse, errorResponse } from "../utils/responses.js";
import logger from "../utils/logger.js";
import { response } from "express";
//import Vehicles from "..models/vehicles.js"
//import KYC from "../models/KYC.js"


export const shareATrip = async(req, res, next) =>{
    const userId = req.user.id
    const {from, to, tripstatus, maxriders} = req.validatedShare

    try{ 
        logger.info(`START: Attempting to create a new Share Trip`)
        const user = await User.findById(userId)

        if(!user){
            return errorResponse(res, StatusCodes.NOT_FOUND, `Kindly Login to access caronaShare`)
        }
 
    
        if(!user.isVerified){
                return errorResponse(res, StatusCodes.UNAUTHORIZED, `Kindly Complete KYC to access CaronaShare!`)
        }

        // if(!vehicle.isVerified){
        //     return errorResponse(res, StatusCodes.UNAUTHORIZED, `Only Users with Verified Vehicles can use Carona Share!`)
        // }
    
        const newsharetrip = await shareUser.create({
            from,
            to,
            tripstatus,
            maxriders,
            owner: user._id
        })

        await newsharetrip.save()

    logger.info(`END: New Share Trip was successfully created.`)
    return successResponse(res, StatusCodes.CREATED, `A Share Trip has been Created, Kindly Vet incoming requests to join your trip! remember Shine ya eyes :)`, newsharetrip)
    }

    catch(error){
        logger.error(`END: New Trip was not created successfully!`)
        next(error)
    }

}

export const tripstatus = async(req, res, next) =>{
    /*
    add something like a no of trips fields to the model so when a trip is completed
    the trips field is update by +1,
    that way we could easily just divide user ratings by no of trips to get average ratings of the trip.
    */

    const {status} = req.body
    const userId = req.user.userId
    const tripId = req.params.id

    try {
        logger.info(`START: Attempting to Update Status of a trip`)

        const user = await User.findById(userId)
        if(!user){
            errorResponse(res, StatusCodes.NOT_FOUND, `No User was Found`)
        }

        const shareTrip = await shareUser.findOne({ _id:tripId, owner: userId })

        if(!shareTrip){
            errorResponse(res, StatusCodes.UNAUTHORIZED, `Only Trip Owners can Delete trips`)
        }

        shareTrip.tripstatus = status;

        // If the trip is completed, increment the `nooftrips` field
        if (status === 'completed') {
            shareTrip.nooftrips = (shareTrip.nooftrips || 0) + 1;
        }

        // Save the updated trip
        await shareTrip.save();

        logger.info(`END: Status of trip Updated Successfully`);
        return successResponse(res, StatusCodes.CREATED, `Trip status was Updated Successfully.`, shareTrip);

    } 
    catch (error) {
        logger.error(`END: Failed to Update Trip Status`)
        next(error)
    }
}
export const deleteAtrip = async(req, res, next) =>{

    //Only Users that created the trip get to delete a Trip
    const userId = req.user.userId
    const tripId = req.params.id

    try{
        logger.info(`START: Attempting to Delete a trip`)

        const user = await User.findById(userId)
        if(!user){
            errorResponse(res, StatusCodes.NOT_FOUND, `No User was Found`)
        }

        const deleteshareTrip = await shareUser.findOneAndDelete({ _id:tripId, owner: userId })

        if(!deleteshareTrip){
            errorResponse(res, StatusCodes.UNAUTHORIZED, `Only Trip Owners can Delete trips`)
        }

        logger.info(`END: Trip has been successfully Deleted`)
        successResponse(res, StatusCodes.NO_CONTENT,`OK`)
    }

    catch(error){
        logger.error(`END: Trip could not be deleted`)
        next(error)
    }
}

export const getAlltrips = async(req, res, next) =>{
    /* 
    The User is able to retrive all the trips that are completed and pending,
    here is able to keep track of past history
    */

    const userId = req.user.userId

    try {
        logger.info(`START: Attempting to get all trips`)

        const user = await User.findById(userId)
        if(!user){
            errorResponse(res, StatusCodes.NOT_FOUND, `No User was Found`)
        }

        const getSharedTrips = await shareUser.find({owner: userId})

        if(!getSharedTrips){
            errorResponse(res, StatusCodes.NOT_FOUND, `No Shared Trips Created by this User was found!`)
        }

        logger.info(`END: Successfully Returned all Trips Shared`)
        successResponse(res, StatusCodes.OK, `Here are the Trips you ${user.username} has created so far`, getSharedTrips)

    } catch (error) {
        logger.error(`END: Faild to get all Shared Trips`)
        next(error)
        
    }
}

export const getAShareTrip = async(req, res, next) =>{
    
    // User can access a particular share trip based on the trip idea to see reqeusts to join trips and accepted requests.  
    const userId = req.user.userId
    const tripId = req.params.id

    try {
        const user = await User.findById(userId)
        if(!user){
            errorResponse(res, StatusCodes.NOT_FOUND, `No User was Found, Kindly Register!`)
        }

        const getAShareTrip = await shareUser.findOne({_id: tripId, owner: userId})

        if(getAShareTrip.owner !== userId){
            errorResponse(res, StatusCodes.UNAUTHORIZED, `Only Trip Owners can View this!`)
        }

        if(!getAShareTrip){
            errorResponse(res, StatusCodes.NOT_FOUND, ` No Trip Was found!`)
        }

        logger.info(`END: Shared Trip was Successfully found`)
        successResponse(res, StatusCodes.OK, `Shared Trip Found!`, getAShareTrip)

        
    } catch (error) {
        logger.error(`END: Failed to get a Particular trip!`)
        next(error)

        
    }
    
}
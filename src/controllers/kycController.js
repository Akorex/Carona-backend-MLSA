import { StatusCodes } from "http-status-codes";
import KYC from "../models/kycModel";
import { errorResponse, successResponse } from "../utils/responses";
import User from "../models/auth";
import { error } from "winston";

exports.submitKYC = async (req, res, next) => {
  try {
    logger.info(`START: Attempting to Submit KYC details`);
    const kycData = req.body;

    const {
      userId,
      firstName,
      lastName,
      dateOfBirth,
      address,
      identificationDocument,
    } = kycData;
    if (
      !userId ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !address ||
      !identificationDocument
    ) {
      logger.info(`END: KYC Service Failed, Required fields are missing`);
      errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        `Required fields are missing`
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      logger.info(`END: KYC Service Failed, User not found`);
      errorResponse(res, StatusCodes.BAD_REQUEST, `User cannot be found`);
    }
    const newKYC = new KYC({
		user: user._id,
		firstName,
		lastName,
		dateOfBirth,
		address,
		identificationDocument,
		status: "pending",
		submittedAt: new Date(),
	});
    const savedKYC = await newKYC.save();
    logger.info(`END: KYC details Submitted Successfully`);
    successResponse(
      res,
      StatusCodes.ACCEPTED,
      `KYC details Submitted Successfully`,
      savedKYC
    );
  } catch (error) {
    next(error);
  }
};

exports.getKYCByUserId = async (req, res, next) => {
  try {
    const { userId } = req.user._id;
    const kycDetails = await KYC.findOne({ userId });
    if (!kycDetails) {
      return errorResponse(res, StatusCodes.BAD_REQUEST,"KYC details not found");
    }
    successResponse(res, StatusCodes.OK, `Retrieved KYC Details`, kycDetails);
  } catch (error) {
    next(error);
  }
};

exports.verifyKYCStatus = async (req, res, next) => {
  try {
    const { userId } = req.user._id;
	const { user } = req.user;
    const { status } = req.body;
    const updatedKYC = await KYC.findOneAndUpdate(
      { userId },
      { status, verifiedAt: status === "approved" ? new Date() : null },
      { new: true }
    );
    if (!updatedKYC) {
      return res.status(404).json({ message: "KYC details not found" });
    }
	user.isVerified = true;
    successResponse(res, StatusCodes.ACCEPTED, `Verified KYC Application`,updatedKYC);
  } catch (error) {
    next(error);
  }
};

exports.rejectKYC = async (req, res, next) => {
	try {
		const { userId } = req.user._id;
		const { status } = req.body;
		const updatedKYC = await KYC.findOneAndUpdate(
		{ userId },
		{ status, verifiedAt: status === "rejected" ? new Date() : null },
		{ new: true }
	);
	if (!updatedKYC) {
	  return errorResponse(res, StatusCodes.BAD_REQUEST, { message: "KYC details not found" });
	}
	successResponse(res, StatusCodes.ACCEPTED, `Rejected KYC Application`,updatedKYC);
  } catch (error) {
	next(error);
  }
};

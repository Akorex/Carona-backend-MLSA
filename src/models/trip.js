import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    pickupPoint: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
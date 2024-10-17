import {Schema, model} from "mongoose"
import { number } from "zod"


const shareUserSchema = new Schema({
    from:{
        type: String,
        required: true
    },

    to:{
        type: String,
        required: true
    },

    tripstatus: {
        type: String,
        enum: ['waiting','ongoing','completed'],
        default: 'waiting'
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    maxriders: {
        type: Number,
        required: true
    },

    requeststojoin: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    acceptedrequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    nooftrips : {
        type: Number,
        default: 0
    }
})

shareUserSchema.set('toJSON',{
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


const shareUser = model('shareUser', shareUserSchema)

export default shareUser
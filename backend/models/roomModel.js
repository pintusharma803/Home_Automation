const mongoose = require('mongoose')
const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    deviceCount:{
        type:Number,
        default:0
    },
    icon: {
        type: String,
        required: true,
        default: "home"
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // controllerId: {
    //     type: mongoose.Schema.type.ObjectId,
    //     ref: "Controller",
    //     required: true
    // }
},
    {
        timestamps: true
    }
);

roomSchema.index({ownerId:1,name:1},{unique:true});
module.exports  = mongoose.model('Room', roomSchema);
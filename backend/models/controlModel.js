const mongoose = require('mongoose');
const controlSchema = mongoose.Schema({
    status: {
        type: String,
        enum:["ON","OFF"],
        default:"OFF",
        required: true,
    },

    topic: {
        type: String,
        required: true,
        // unique:true
    },

    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
        required: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
},
    {
        timestamps: false
    }
);

controlSchema.index({ownerId:1,topic:1},{unique:true});

module.exports = mongoose.model('Control', controlSchema);
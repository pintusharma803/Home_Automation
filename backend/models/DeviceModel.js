const mongoose = require('mongoose');
// const { DEVICE_TYPES, DEVICE_ICONS, DEVICE_STATUSES } = require('../utils/deviceConstant');

const deviceSchema = new mongoose.Schema(
  {
    deviceName: {
      type: String,
      required: [true, 'Device name is required'],
      trim: true,
      maxlength: [100, 'Device name cannot exceed 100 characters'],
    },
    deviceId: {
      type: String,
      required: [true, 'Device ID is required'],
      trim: true,
      maxlength: [100, 'Device ID cannot exceed 100 characters'],
    },
    deviceType: {
      type: String,
      required: [true, 'Device type is required'],
      //   enum: { values: DEVICE_TYPES, message: 'Invalid device type' },
    },
    room: {
      type: String,
      required: true,
      default: null,
    },
    // description: {
    //   type: String,
    //   trim: true,
    //   maxlength: [200, 'Description cannot exceed 200 characters'],
    //   default: '',
    // },
    icon: {
      type: String,
      //   enum: { values: DEVICE_ICONS, message: 'Invalid device icon' },
      default: 'cpu',
    },
    status: {
      type: String,
      //   enum: { values: DEVICE_STATUSES, message: 'Invalid device status' },
      default: 'active',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// A device ID only needs to be unique within a single user's account,
// not globally across every user in the system.
deviceSchema.index({ owner: 1, deviceId: 1 }, { unique: true });

module.exports = mongoose.model('Device', deviceSchema);

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, sendTokenResponse } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const Device = require("../models/DeviceModel");
const { decode } = require('punycode');
const { deviceStates } = require('../config/mqtt');
const Role = require('../models/roleModel');
const Room = require('../models/roomModel');
const Control = require('../models/controlModel');
const mongoose = require('mongoose');
const { getIO } = require('../socket/socket');

exports.updateDevice = async (req, res) => {
  try {
    const userId = req.user._id;
    // const ownerId = req.user.ownerId;
    // if (!ownerId) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "owner not found"
    //   })
    // };
    const { deviceName, deviceId, deviceType, room, icon, status } = req.body;
    const DEVICE_ID = req.params.id;
    const device = await Device.findOne({
      _id: DEVICE_ID,
      // owner: ownerId,
    });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      })
    };
    const state = deviceStates.get(deviceId);
    device.deviceName = deviceName;
    device.deviceId = deviceId;
    device.deviceType = deviceType;
    device.room = room;
    // device.description = description;
    device.icon = icon;
    device.status = state?.status || "inactive";
    await device.save();
    res.status(200).json({
      success: true,
      data: device,
      message: "Device updated successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.addControl = async (req, res) => {
  try {
    const { deviceId, topic, status } = req.body;
    if (!deviceId || !topic?.trim()) {
      return res.status(400).json({
        success: false,
        message: "deviceId and topicName are required"
      })
    };

    const device = await Device.findOne({
      _id: deviceId,
      owner: req.user.ownerId
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found or not authorized"
      })
    };


    // 🚫 Optional: duplicate check (same device + topic)
    // const exists = await QuickControl.findOne({
    //   deviceId,
    //   topicName: topicName.trim(),
    //   ownerId: req.user.ownerId,
    // });

    // if (exists) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "Quick control already exists",
    //   });
    // }


    // Create
    const controlData = await Control.create({
      status: status,
      deviceId: deviceId,
      topic: topic.trim(),
      ownerId: req.user.ownerId
    });

    return res.status(201).json({
      success: true,
      message: "Quick control added successfully",
      data: controlData
    })


  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "topic already exists."
      })
    };
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
}

exports.getQuickControls = async (req, res) => {
  try {
    const ownerId = req.user.ownerId;
    if (!ownerId) {
      return res.status(404).json({
        success: false,
        message: "owner not found"
      })
    };

    const controlData = await Control.find({ ownerId: ownerId })
      .populate({
        path: "deviceId",
        select: "deviceName deviceType room icon"
      })
      .select("status _id")
      .lean();

    if (controlData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "data not found"
      });
    };

    res.status(200).json({
      success: true,
      data: controlData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error"
    });
  }
}

exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.ownerId,
    });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }
    // await Room.findByIdAndUpdate(device.roomId,
    //   {
    //     $inc: { deviceCount: -1 },
    //   });

    // transaction use kiya ja skta hai taki count sahi ho

    await Control.deleteMany({
      deviceId: req.params.id,
      ownerId: req.user.ownerId
    });

    await Room.findByIdAndUpdate(
      device.roomId,
      [
        {
          $set: {
            deviceCount: {
              $max: [{ $subtract: ["$deviceCount", 1] }, 0]
            }
          }
        }
      ],
    );

    res.status(200).json({
      success: true,
      message: "Device deleted successfully"
    });


  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  };
};

// exports.getDevices = async (req, res) => {

//   try {
//     let token;
//     if (req.headers.authorization?.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access token not found"
//       });
//     }
//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//     console.log(decoded.id);
//     const user = await User.findById({ _id: decoded.id });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "user not found"
//       })
//     };
//     const ownerId = user.ownerId;
//     if (!ownerId) {
//       return res.status(401).json({
//         success: false,
//         message: "Owner not found"
//       })
//     };
//     const devices = await Device.find({ owner: ownerId });
//     if (devices.length === 0) {
//       return res.status(500).json({
//         success: true,
//         message: "No device available",
//       });
//     }
//     console.log("geting device", devices);
//     res.status(200).json({
//       success: true,
//       data: devices
//     })
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


exports.gettingDevice = async (req, res) => {
  try {
    const ownerId = req.user.ownerId;
    if (!ownerId) {
      return res.status(404).json({
        success: false,
        message: "owner not found"
      });
    }

    const device = await Device.find({ owner: ownerId });
    if (device.length === 0) {
      return res.status(404).json({
        success: false,
        message: "device not found"
      });
    };

    // console.log("getting device", device);
    return res.status(200).json({
      success: true,
      data: device
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error"
    });
  }
}

exports.getRooms = async (req, res) => {
  try {
    const ownerId = req.user.ownerId;
    if (!ownerId) {
      return res.status(404).json({
        success: false,
        message: "owner not found"
      });
    };

    const room = await Room.find({ ownerId: ownerId }).select("name icon _id deviceCount").lean();

    if (room.length === 0) {
      return res.status(404).json({
        success: false,
        message: "room not found"
      });
    };

    res.status(200).json({
      success: true,
      message: "room found successfully",
      data: room
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error"
    })
  }
};

exports.loadRoomMeta = async (req, res) => {
  try {
    const ownerId = req.user.ownerId;
    if (!ownerId) {
      return res.status(404).json({
        success: false,
        message: "owner not found"
      });
    };

    const room = await Room.find({ ownerId: ownerId }).select("name _id").lean();

    if (room.length === 0) {
      return res.status(404).json({
        success: false,
        message: "room not found"
      });
    };

    res.status(200).json({
      success: true,
      message: "room found successfully",
      data: room
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error"
    })
  }
}


exports.addRoom = async (req, res) => {
  try {
    const ownerId = req.user.ownerId;
    const { roomName, icon } = req.body;

    if (!roomName || roomName.trim() === "") {
      const err = new Error("Room name is required");
      err.statusCode = 400;
      throw err;
    };


    const normalizedName = roomName.trim().toLowerCase();
    const result = await Room.findOneAndUpdate(
      { name: normalizedName, ownerId: ownerId },
      {
        $setOnInsert: {
          name: normalizedName,
          ownerId: ownerId,
          icon: icon
        }
      },
      {
        new: true,
        upsert: true,
        includeResultMetadata: true
      }
    );

    const room = result.value;
    const isExisting = result.lastErrorObject.updatedExisting;

    if (isExisting) {
      const err = new Error("Room already exist");
      err.statusCode = 400;
      throw err;
    }
    res.status(201).json({
      success: true,
      message: "was created successfully",
      data: room
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "internal server error"
    });
  }
};

exports.addDevice = async (req, res) => {
  try {
    const ownerId = req.user.ownerId;
    if (!ownerId) {
      return res.status(404).json({
        success: false,
        message: "Owner not found"
      })
    };
    const { deviceName, deviceId, deviceType, room, icon, status } = req.body;

    // For device status
    const state = deviceStates.get(deviceId);
    const currentStatus = state?.status || "inactive";

    const roomData = await Room.findOne({ name: room, ownerId: ownerId });
    if (!roomData) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      })
    }

    const device = await Device.create({
      deviceName: deviceName,
      deviceId: deviceId,
      deviceType: deviceType,
      room: room,
      icon: icon,
      roomId: roomData._id,
      status: currentStatus,
      owner: ownerId
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "device not created"
      })
    }

    await Room.findByIdAndUpdate(roomData._id, {
      $inc: { deviceCount: 1 }
    });

    res.status(201).json({
      success: true,
      data: device,
      message: "device add successfully"
    })

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Device already exists."
      })
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.profileData = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token not found",
      });
    }

    // 2. Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 3. Token se id nikalo
    console.log(decoded.id);

    // 4. Database se user nikalo
    const user = await User.findById(decoded.id).select("-password -refreshToken");
    res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.log("error2");

    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  } finally {
    console.log("api called");
  }

};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User is already registered'
      });
    }
    const role = await Role.findOne({ name: "Owner" });
    if (!role) {
      return res.status(500).json({
        success: false,
        message: 'Role not found'
      });
    };
    const user = await User.create({
      name: name,
      email: email,
      password: password,
      roleId: role._id,
      role: role.name
    });
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken });
    user.ownerId = user._id; // Set ownerId to the user's own ID
    await user.save();
    sendTokenResponse(user, 201, res, accessToken, refreshToken);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalUsers = await User.countDocuments({ ownerId: userId });
    // const activeUsers = await User.countDocuments({ ownerId: userId, status: 'active' });
    // const inactiveUsers = await User.countDocuments({ ownerId: userId, status: 'inactive' });
    const members = await User.countDocuments({ ownerId: userId, role: 'Member' });
    const owners = await User.countDocuments({ ownerId: userId, role: 'Owner' });
    const admins = await User.countDocuments({ ownerId: userId, role: 'Admin' });
    // const totalUsers = await User.countDocuments({ ownerId: userId, role: 'Member' });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        members,
        guests: owners,
        admins
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user stats",
    });

  }
}

exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      // status
    } = req.body;
    const query = {};
    const userId = req.user._id;
    query.ownerId = userId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    // role filter
    if (role && role !== 'all') {
      query.role = role;
    }
    // status filter
    // if(status && status !== 'all'){
    //   query.status = status;
    // }
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password -refreshTokens -ownerId -__v -roleId -loginAttempts')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        startIndex: (page - 1) * limit + 1,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    })
  }
}

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const ownerId = req.user._id.toString();
    if(ownerId === userId){
      return res.status(401).json({
        success: false,
        message:"Owner can't be deleted"
      });
    }
  
    const user = await User.deleteOne({_id: userId});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    };

    // Tell user's browser to logout immediately
    getIO().to(userId.toString()).emit("forceLogout", {
      reason: "USER_DELETED",
      message: "Your account has been deleted."
    });

    return res.status(200).json({
      success: true,
      message: "deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
}

exports.createUser = async (req, res) => {
  try {
    const ownerUser = req.user;
    const { name, email, password, role, status } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'user is already registered'
      });
    };
    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return res.status(500).json({
        success: false,
        message: 'Role not found'
      });
    };

    const user = await User.create({
      name: name,
      email: email,
      password: password,
      roleId: roleDoc._id,
      role: role
    });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken });
    user.ownerId = ownerUser._id;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'was added successfully',
    });
    // sendTokenResponse(user, 201, res, accessToken, refreshToken,message='was added successfully');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'User creation failed',
      error: error.message
    });
  }
}

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts. Try again later.',
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    await user.resetLoginAttempts();
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Keep only the last 5 refresh tokens per user (multi-device support, capped)
    user.refreshTokens.push({ token: refreshToken });
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();
    sendTokenResponse(user, 200, res, accessToken, refreshToken);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// @desc    Refresh access token using refresh token cookie
// @route   POST /api/auth/refresh
exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
    if (!tokenExists) {
      // Possible token reuse/theft - invalidate all sessions for safety
      user.refreshTokens = [];
      await user.save();
      return res.status(401).json({ success: false, message: 'Refresh token is invalid, please log in again' });
    }

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    const newAccessToken = generateAccessToken(user._id, user.role);

    sendTokenResponse(user, 200, res, newAccessToken, newRefreshToken);

  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// @desc    Logout - invalidate refresh token
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
          await user.save();
        }
      } catch (err) {
        // token already invalid, nothing to clean up
      }
    }

    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

// @desc    Get currently logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
    },
  });
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Always respond the same way to avoid leaking which emails are registered
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If email is registered, a reset link has been sent',
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await sendEmail({ email: req.body.email, resetLink });
    console.log("email sent");


    // In production: email the resetToken (as a link) to the user via a mail service.
    // For local/dev testing only, we return it directly:
    res.status(200).json({
      success: true,
      message: 'If email is registered, a reset link has been sent',
      devOnlyResetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not process request', error: error.message });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = []; // invalidate all existing sessions
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful, please log in' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password reset failed', error: error.message });
  }
};

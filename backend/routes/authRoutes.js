const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  refresh,
  logout,
  profileData,
  addDevice,
  gettingDevice,
  deleteDevice,
  updateDevice,
  createUser,
  getUsers,
  getUserStats,
  deleteUser,
  addRoom,
  loadRoomMeta,
  getRooms,
  getQuickControls,
  addControl
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Rate limiter for login/register to slow down brute-force / credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

router.post(
  '/addControl',
  protect,
  authorize("Owner","Admin"),
  addControl
);

router.get(
  '/getQuickControls',
  protect,
  getQuickControls
);

router.get(
  '/getRooms',
  protect,
  getRooms
);

router.get(
  '/rooms/meta',
  protect,
  authorize("Owner","Admin"),
  loadRoomMeta
)

router.post(
  '/addRoom',
  protect,
  authorize("Owner","Admin"),
  addRoom
);

router.delete(
  '/deleteUser/:userId',
  protect,
  authorize("Owner"),
  deleteUser
);

router.get(
  '/getUserStats',
  protect,
  authorize("Owner"),
  getUserStats
);

router.post(
  '/getUsers',
  protect,
  authorize("Owner"),
  getUsers
);

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
  ],
  validate,
  register
);

router.get(
  '/profileData',
  profileData
);

router.put(
  '/updateDevice/:id',
  protect,
  authorize("Owner", "Admin"),
  updateDevice
);

router.delete(
  '/deleteDevice/:id',
  protect,
  authorize("Owner", "Admin"),
  deleteDevice
);

router.post(
  '/devices',
  protect,
  authorize("Owner", "Admin"),
  addDevice
);

router.get(
  '/gettingDevice',
  protect,
  gettingDevice
);
router.post('/createUser',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
    body("role").isIn(["Owner", "Admin", "Member", "Guest"])
  ],
  validate,
  protect,
  authorize("Owner"),
  createUser
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post(
  '/refresh',
  refresh
);
router.post(
  '/logout',
  logout
);
router.get(
  '/me',
  protect,
  getMe
);

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail().withMessage('Valid email is required').normalizeEmail()],
  validate,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
  ],
  validate,
  resetPassword
);

module.exports = router;

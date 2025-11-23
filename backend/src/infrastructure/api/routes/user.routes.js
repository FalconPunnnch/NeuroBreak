const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadsDir = path.join(__dirname, '../../../uploads/profile-pictures');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${req.userId}-${uniqueSuffix}${ext}`);
  }
});
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPG, PNG, WEBP)'), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});
router.post(
  '/profile-picture',
  authMiddleware,
  upload.single('profilePicture'),
  (req, res) => {
    UserController.uploadProfilePicture(req, res);
  }
);
router.delete(
  '/profile-picture',
  authMiddleware,
  (req, res) => {
    UserController.deleteProfilePicture(req, res);
  }
);
router.put(
  '/profile',
  authMiddleware,
  (req, res) => {
    UserController.updateProfile(req, res);
  }
);
module.exports = router;

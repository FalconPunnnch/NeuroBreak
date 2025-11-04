// User Routes - Con edición de perfil
// backend/src/infrastructure/api/routes/user.routes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, '../../../uploads/profile-pictures');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de multer para subir imágenes
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

// Filtro para solo aceptar imágenes
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

// POST /api/users/profile-picture - Subir foto de perfil
router.post(
  '/profile-picture',
  authMiddleware,
  upload.single('profilePicture'),
  (req, res) => {
    UserController.uploadProfilePicture(req, res);
  }
);

// DELETE /api/users/profile-picture - Eliminar foto de perfil
router.delete(
  '/profile-picture',
  authMiddleware,
  (req, res) => {
    UserController.deleteProfilePicture(req, res);
  }
);

// PUT /api/users/profile - Editar información del perfil
router.put(
  '/profile',
  authMiddleware,
  (req, res) => {
    UserController.updateProfile(req, res);
  }
);

module.exports = router;
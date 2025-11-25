import express from 'express';
import { admin, protect } from '../middleware/auth.js';
import { getProfile, listUsers, getMyShipping, updateMyShipping, updateProfile, uploadProfilePhoto, changePassword } from '../controllers/userController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/photo', protect, upload.single('photo'), uploadProfilePhoto);
router.put('/change-password', protect, changePassword);
router.get('/', protect, admin, listUsers);
router.get('/me/shipping', protect, getMyShipping);
router.put('/me/shipping', protect, updateMyShipping);

export default router;

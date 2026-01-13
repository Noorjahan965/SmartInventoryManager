import express from 'express';

import { getAllUser, createUser, loginUser, updateUser, deleteUser, verifiedToken } from '../controller/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get-all-users', verifyToken, getAllUser);
router.post('/create-user', verifyToken, createUser);
router.post('/login', loginUser);
router.put('/update-user', verifyToken, updateUser);
router.delete('/delete-user', verifyToken, deleteUser);

router.get('/verify-token', verifyToken, verifiedToken);

export default router;
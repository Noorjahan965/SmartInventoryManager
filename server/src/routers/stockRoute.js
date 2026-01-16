import express from 'express';

import { verifyToken } from '../middleware/authMiddleware.js';
import { createBill } from '../controller/stockController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/bill', createBill);

export default router;
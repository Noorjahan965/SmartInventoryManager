import express from 'express';

import { verifyToken } from '../middleware/authMiddleware.js';
import { createBill, addStock, getLogs, getRecords } from '../controller/stockController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/bill', createBill);
router.post('/add-stock', addStock);
router.get('/logs', getLogs);
router.get('/records', getRecords);

export default router;
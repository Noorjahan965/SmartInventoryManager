import express from 'express';

import { verifyToken } from '../middleware/authMiddleware.js';
import { createBill, addStock, getLogs, getRecords, getDashboardStats, updatePaidStatus } from '../controller/stockController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/bill', createBill);
router.post('/add-stock', addStock);
router.get('/logs', getLogs);
router.get('/records', getRecords);
router.get('/dashboard-stats', getDashboardStats);
router.put('/paid-status', updatePaidStatus);

export default router;
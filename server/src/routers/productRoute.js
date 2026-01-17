import express from 'express';

import { verifyToken } from '../middleware/authMiddleware.js';
import { getProduct, getAllProducts, addProduct, updateProduct, deleteProduct, getLowStockProducts } from '../controller/productController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getProduct);
router.get('/all', getAllProducts);
router.post('/', addProduct);
router.put('/', updateProduct);
router.delete('/', deleteProduct);
router.get('/low-stock', getLowStockProducts);

export default router;
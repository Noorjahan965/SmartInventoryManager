import express from 'express';

import { verifyToken } from '../middleware/authMiddleware.js';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../controller/productController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/all', getAllProducts);
router.post('/', addProduct);
router.put('/', updateProduct);
router.delete('/', deleteProduct);

export default router;
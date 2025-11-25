import express from 'express';
import { admin, protect } from '../middleware/auth.js';
import { listOrders, getMyOrders, getOrderById, createOrder, cancelOrder, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.get('/mine', protect, getMyOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

router.get('/', protect, admin, listOrders);
router.put('/:id', protect, admin, updateOrderStatus);

export default router;

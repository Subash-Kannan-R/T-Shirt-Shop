import express from 'express';
import { getCheckout, updateCheckout, completeCheckout, deleteCheckout } from '../controllers/checkoutController.js';

const router = express.Router();

router.get('/:sessionId', getCheckout);
router.put('/:sessionId', updateCheckout);
router.post('/:sessionId/complete', completeCheckout);
router.delete('/:sessionId', deleteCheckout);

export default router;

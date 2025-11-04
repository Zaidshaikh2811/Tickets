import { Router } from 'express';
import { getOrders, createOrder, getOrderById, cancelOrder, payForOrder, updateOrder } from '../middleware/orders';

const router = Router();

router.get('/health', (req, res) => {
    res.status(200).send({ status: 'Orders service is healthy' });
});


router.get("/", getOrders);

router.post("/", createOrder);

router.get("/:orderId", getOrderById);

router.delete("/:orderId", cancelOrder);

router.post("/:orderId/pay", payForOrder);

router.put("/:orderId", updateOrder)


export { router as orderRouter };
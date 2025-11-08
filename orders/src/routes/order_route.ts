import { Router } from 'express';
import {
    getOrders,
    createOrder,
    getOrderById,
    cancelOrder,
    payForOrder,
    updateOrder
} from '../controller/ordersController';

import { validateRequest, requireAuth } from "@zspersonal/common";
import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (req, res) => {
    res.status(200).send({ status: 'Orders service is healthy' });
});

router.get(
    "/",
    requireAuth,
    getOrders
);


router.post(
    "/:ticketId",
    requireAuth,
    [
        param("ticketId")
            .custom(id => mongoose.Types.ObjectId.isValid(id))
            .withMessage("TicketId must be a valid Mongo ID")
    ],
    validateRequest,
    createOrder
);


router.get(
    "/:orderId",
    [
        param("orderId")
            .isMongoId()
            .withMessage("OrderId must be a valid Mongo ID")
    ],
    validateRequest,
    requireAuth,
    getOrderById
);


router.delete(
    "/:orderId",
    [
        param("orderId")
            .isMongoId()
            .withMessage("OrderId must be a valid Mongo ID")
    ],
    validateRequest,
    requireAuth,
    cancelOrder
);


router.post(
    "/:orderId/pay",
    [
        param("orderId")
            .isMongoId()
    ],
    validateRequest,
    requireAuth,
    payForOrder
);


router.put(
    "/:orderId",
    [
        param("orderId").isMongoId(),
        body("status")
            .isIn(["created", "cancelled", "completed", "awaiting:payment"])
            .withMessage("Status must be one of created, cancelled, completed, awaiting:payment")
    ],
    validateRequest,
    requireAuth,
    updateOrder
);

export { router as orderRouter };

import { Router } from 'express';
import { getOrders, createOrder, getOrderById, cancelOrder, payForOrder, updateOrder } from '../controller/ordersController';
import { validateRequest, requireAuth } from "@zspersonal/common";
import { body } from 'express-validator';

const router = Router();

router.get('/health', (req, res) => {
    res.status(200).send({ status: 'Orders service is healthy' });
});


router.get("/",
    validateRequest,
    requireAuth,
    [body("status").optional().isIn(["created", "cancelled", "completed", "awaiting:payment"]).
        withMessage("Status must be one of created, cancelled, completed, awaiting:payment")],
    getOrders);

router.post("/",
    validateRequest,
    requireAuth,
    [body("ticketId").not().isEmpty().withMessage("TicketId must be provided")],
    createOrder);

router.get("/:orderId",
    validateRequest,
    requireAuth,
    [body("orderId").isMongoId().withMessage("OrderId must be a valid Mongo ID")],
    getOrderById);

router.delete("/:orderId",
    validateRequest,
    requireAuth,
    [body("orderId").isMongoId().withMessage("OrderId must be a valid Mongo ID")],
    cancelOrder);

router.post("/:orderId/pay",
    validateRequest,
    requireAuth,
    [body("orderId").isMongoId().withMessage("OrderId must be a valid Mongo ID")],
    payForOrder);


router.put("/:orderId",
    validateRequest,
    requireAuth,
    [body("orderId").isMongoId().withMessage("OrderId must be a valid Mongo ID"),
    body("status").isIn(["created", "cancelled", "completed", "awaiting:payment"]).
        withMessage("Status must be one of created, cancelled, completed, awaiting:payment")],
    updateOrder)


export { router as orderRouter };
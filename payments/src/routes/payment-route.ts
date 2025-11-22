import express from 'express';
import { body, param } from 'express-validator';
import { validateRequest, requireAuth } from "@zspersonal/common";
import {
    paymentComplete,
    getPaymentStatus,
    refundPayment,
    listUserPayments,
    listAllPayments,
    cancelPayment,
    retryPayment,
    applyDiscount,
    getPaymentDetails,
    getAllOrders
} from "../controller/paymentController";

const router = express.Router();


router.get("/get-all-orders",
    requireAuth,
    getAllOrders);

router.post("/",
    requireAuth,
    [
        body("orderId")
            .not().isEmpty()
            .withMessage("OrderId must be provided"),
        body("paymentMethod")
            .isIn(["credit_card", "paypal", "stripe"])
            .withMessage("Payment method must be one of: credit_card, paypal, stripe")
    ],
    validateRequest, paymentComplete);


router.get("/:orderId/status",
    requireAuth,
    [param("orderId").not().isEmpty().withMessage("orderId param is required")],
    validateRequest,
    getPaymentStatus);

router.post("/refund",
    requireAuth,
    [
        body("orderId")
            .not().isEmpty()
            .withMessage("OrderId must be provided")
    ],
    validateRequest,
    refundPayment);

router.get("/user/payments",
    requireAuth,
    listUserPayments);


router.post("/cancel",
    requireAuth,
    [
        body("orderId")
            .not().isEmpty()
            .withMessage("OrderId must be provided")
    ],
    validateRequest,
    cancelPayment);

router.post("/retry",
    requireAuth,
    [
        body("orderId")
            .not().isEmpty()
            .withMessage("OrderId must be provided"),
    ],
    validateRequest,
    retryPayment);

router.post("/apply-discount",
    requireAuth,
    [
        body("orderId")
            .not().isEmpty()
            .withMessage("OrderId must be provided"),
    ],
    validateRequest,
    applyDiscount);

router.get("/:orderId/details",
    requireAuth,
    [param("orderId").not().isEmpty().withMessage("orderId param is required")],
    validateRequest,
    getPaymentDetails);





export { router as paymentRouter };
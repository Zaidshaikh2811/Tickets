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

router.use((req, res, next) => {
    console.log("➡️ Entered /api/payments router:", req.method, req.path);
    next();
});


router.get("/get-all-orders", requireAuth, getAllOrders);

router.post(
    "/",
    requireAuth,
    [
        body("orderId").not().isEmpty().withMessage("OrderId must be provided"),
        body("paymentMethod")
            .isIn(["credit_card", "paypal", "stripe"])
            .withMessage("Invalid payment method"),
    ],
    validateRequest,
    paymentComplete
);


router.post(
    "/refund",
    requireAuth,
    [body("orderId").not().isEmpty().withMessage("OrderId must be provided")],
    validateRequest,
    refundPayment
);

router.get("/user/payments", requireAuth, listUserPayments);

router.post(
    "/cancel",
    requireAuth,
    [body("orderId").not().isEmpty().withMessage("OrderId must be provided")],
    validateRequest,
    cancelPayment
);

router.post(
    "/retry",
    requireAuth,
    [body("orderId").not().isEmpty().withMessage("OrderId must be provided")],
    validateRequest,
    retryPayment
);

router.post(
    "/apply-discount",
    requireAuth,
    [body("orderId").not().isEmpty().withMessage("OrderId must be provided")],
    validateRequest,
    applyDiscount
);

router.get("/user-payments", requireAuth, listUserPayments);

// Dynamic routes LAST
router.get(
    "/:orderId/status",
    requireAuth,
    [param("orderId").not().isEmpty().withMessage("orderId is required")],
    validateRequest,
    getPaymentStatus
);

router.get(
    "/:orderId/details",
    requireAuth,
    [param("orderId").not().isEmpty().withMessage("orderId is required")],
    validateRequest,
    getPaymentDetails
);

export { router as paymentRouter };

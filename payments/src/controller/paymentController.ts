import { Request, Response, NextFunction } from "express";
import { Order } from "../models/orders";
import { CustomError, OrderStatus } from "@zspersonal/common";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publisher/PaymentCreatedPublisher";
import { PaymentCompletedPublisher } from "../events/publisher/PaymentCompletedPublisher";
import { PaymentFailedPublisher } from "../events/publisher/PaymentFailedPublisher";
import { PaymentRefundedPublisher } from "../events/publisher/PaymentRefundedPublisher";
import { natsWrapper } from "../nats-wrapper";
import crypto from "crypto";

const generateStripeId = () => "pi_" + crypto.randomBytes(8).toString("hex");

declare global {
    namespace Express {
        interface Request {
            currentUser?: { id: string; email?: string };
        }
    }
}

type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

const asyncHandler =
    (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>
        fn(req, res, next).catch(next);

const getCurrentUserId = (req: Request): string => {
    if (!req.currentUser?.id) {
        // Should normally never happen if requireAuth is used
        throw new CustomError("Authentication required", 401);
    }
    return req.currentUser.id;
};

const findUserOrderOrThrow = async (orderId: string, userId: string) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new CustomError("Order not found", 404);
    }

    if (order.userId.toString() !== userId) {
        throw new CustomError("Not authorized to access this order", 401);
    }

    return order;
};


export const paymentComplete = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const { orderId, paymentMethod } = req.body;

        const order = await findUserOrderOrThrow(orderId, userId);

        if (order.status === OrderStatus.Cancelled) {
            throw new CustomError("Cannot pay for a cancelled order", 400);
        }

        if (order.status === OrderStatus.Completed) {
            throw new CustomError("Order is already completed", 400);
        }

        if (
            order.status !== OrderStatus.AwaitingPayment &&
            order.status !== OrderStatus.Created &&
            order.status !== OrderStatus.Pending
        ) {
            throw new CustomError(
                `Cannot pay for order in status: ${order.status}`,
                400
            );
        }

        const stripeId = generateStripeId();

        const payment = Payment.build({
            orderId: order.id,
            stripeId,
        });
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            paymentId: payment.id,
            orderId: payment.orderId,
            userId,
            amount: order.price
        });

        order.status = OrderStatus.Completed;
        await order.save();




        await new PaymentCompletedPublisher(natsWrapper.client).publish({
            paymentId: payment.id,
            orderId: order.id,
            userId: order.userId,
            amount: order.price,
            ticketId: order.ticketId,
        });

        res.status(200).send({ success: true, order });
    }
);


export const getPaymentStatus = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const { orderId } = req.params;

        const order = await findUserOrderOrThrow(orderId, userId);

        res.status(200).send({
            success: true,
            orderId: order.id,
            status: order.status,
        });
    }
);


export const refundPayment = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const { orderId } = req.body;

        const order = await findUserOrderOrThrow(orderId, userId);

        if (order.status !== OrderStatus.Completed) {
            throw new CustomError(
                "Only completed orders can be refunded",
                400
            );
        }

        const payment = await Payment.findOne({ orderId: order.id }).sort({
            createdAt: -1,
        });

        if (!payment) {
            throw new CustomError(
                "No payment found for this order to refund",
                400
            );
        }

        order.status = OrderStatus.Refunded;
        await order.save();

        await new PaymentRefundedPublisher(natsWrapper.client).publish({
            paymentId: payment.id,
            orderId: order.id,
            userId: order.userId,
            amount: order.price,
        });

        res.status(200).send({ success: true, order });
    }
);


export const listUserPayments = asyncHandler(
    async (req: Request, res: Response) => {

        const userId = getCurrentUserId(req);

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        res.status(200).send({ success: true, orders });
    }
);


export const listAllPayments = asyncHandler(
    async (_req: Request, res: Response) => {
        // if (!req.currentUser?.isAdmin) {
        //   throw new CustomError("Admin access required", 403);
        // }

        const orders = await Order.find({}).sort({ createdAt: -1 });

        res.status(200).send({ success: true, orders });
    }
);


export const cancelPayment = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const { orderId } = req.body;

        const order = await findUserOrderOrThrow(orderId, userId);

        if (order.status === OrderStatus.Cancelled) {
            throw new CustomError("Order is already cancelled", 400);
        }

        if (order.status === OrderStatus.Completed) {
            throw new CustomError("Cannot cancel a completed order", 400);
        }

        if (
            order.status !== OrderStatus.AwaitingPayment &&
            order.status !== OrderStatus.Created &&
            order.status !== OrderStatus.Pending
        ) {
            throw new CustomError(
                `Cannot cancel order in status: ${order.status}`,
                400
            );
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        const payment = await Payment.findOne({ orderId: order.id }).sort({
            createdAt: -1,
        });

        await new PaymentFailedPublisher(natsWrapper.client).publish({
            paymentId: payment ? payment.id : "unknown",
            orderId: order.id,
            userId: order.userId,
            amount: order.price,
        });

        res.status(200).send({ success: true, order });
    }
);


export const retryPayment = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const { orderId } = req.body;

        const order = await findUserOrderOrThrow(orderId, userId);

        if (
            order.status !== OrderStatus.AwaitingPayment &&
            order.status !== OrderStatus.Pending &&
            order.status !== OrderStatus.Failed
        ) {
            throw new CustomError(
                "Only awaiting, pending, or failed orders can be retried for payment",
                400
            );
        }

        const stripeId = generateStripeId();

        const payment = Payment.build({
            orderId: order.id,
            stripeId,
        });
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            paymentId: payment.id,
            orderId: payment.orderId,
            userId: order.userId,
            amount: order.price,

        });

        order.status = OrderStatus.Completed;
        await order.save();

        await new PaymentCompletedPublisher(natsWrapper.client).publish({
            paymentId: payment.id,
            orderId: order.id,
            userId: order.userId,
            amount: order.price,
            ticketId: order.ticketId,
        });

        res.status(200).send({ success: true, order });
    }
);


export const applyDiscount = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const { orderId, discountCode } = req.body;

        const order = await findUserOrderOrThrow(orderId, userId);

        if (
            order.status !== OrderStatus.AwaitingPayment &&
            order.status !== OrderStatus.Created
        ) {
            throw new CustomError(
                "Discounts can only be applied to orders awaiting payment or created",
                400
            );
        }

        // TODO: validate discountCode and adjust order.price accordingly
        // For now just echo back the order.
        res.status(200).send({
            success: true,
            order,
            appliedDiscountCode: discountCode ?? null,
        });
    }
);


export const getPaymentDetails = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        const { orderId } = req.params;

        const order = await findUserOrderOrThrow(orderId, userId);

        res.status(200).send({
            success: true,
            paymentDetails: {
                orderId: order.id,
                amount: order.price,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            },
        });
    }
);


export const getAllOrders = asyncHandler(
    async (_req: Request, res: Response) => {
        // if (!req.currentUser?.isAdmin) {
        //   throw new CustomError("Admin access required", 403);
        // }

        const orders = await Order.find({}).sort({ createdAt: -1 });

        res.status(200).send({ success: true, orders });
    }
);

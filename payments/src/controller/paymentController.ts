
import { Request, Response, NextFunction } from "express";
import { Order } from "../models/orders";
import { CustomError, OrderStatus } from "@zspersonal/common";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publisher/PaymentCreatedPublisher";
import { natsWrapper } from "../nats-wrapper";


declare global {
    namespace Express {
        interface Request {
            currentUser?: { id: string; email?: string };
        }
    }
}

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



export const paymentComplete = async (req: Request, res: Response, next: NextFunction) => {


    const userId = getCurrentUserId(req);
    const { orderId, paymentMethod } = req.body;

    const order = await findUserOrderOrThrow(orderId, userId);

    if ((order.status as OrderStatus) === OrderStatus.Cancelled) {
        return next(new CustomError("Cannot pay for a cancelled order", 400));
    }

    if ((order.status as OrderStatus) === OrderStatus.Completed) {
        return next(new CustomError("Order is already completed", 400));
    }

    if (
        order.status !== OrderStatus.AwaitingPayment &&
        order.status !== OrderStatus.Created &&
        order.status !== OrderStatus.Pending
    ) {
        throw new CustomError(`Cannot pay for order in status: ${order.status}`, 400);
    }

    order.status = OrderStatus.Completed;
    await order.save();

    const payment = Payment.build({
        orderId: order.id,
        stripeId: "some_stripe_id"
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });

    res.status(200).send(order);
}


export const getPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {

    const userId = getCurrentUserId(req);
    const { orderId } = req.params;
    const order = await findUserOrderOrThrow(orderId, userId);
    res.status(200).send({ orderId: order.id, status: order.status });
}
export const refundPayment = async (req: Request, res: Response, next: NextFunction) => {

    const userId = getCurrentUserId(req);
    const { orderId } = req.body;
    const order = await findUserOrderOrThrow(orderId, userId);

    if (order.status !== OrderStatus.Completed) {
        return next(new CustomError("Only completed orders can be refunded", 400));
    }
    order.status = OrderStatus.Refunded;
    await order.save();

    res.status(200).send(order);
}

export const listUserPayments = async (req: Request, res: Response, next: NextFunction) => {

    const userId = getCurrentUserId(req);

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).send(orders);
}
export const listAllPayments = async (req: Request, res: Response, next: NextFunction) => {

    // if (!req.currentUser?.isAdmin) {
    //     return next(new CustomError("Admin access required", 403));
    // }

    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).send(orders);
}

export const cancelPayment = async (req: Request, res: Response, next: NextFunction) => {

    const userId = getCurrentUserId(req);
    const { orderId } = req.body;
    const order = await findUserOrderOrThrow(orderId, userId);


    if (order.status === OrderStatus.Cancelled) {
        throw new CustomError("Order is already cancelled", 400);
    }


    if (order.status === OrderStatus.Completed) {
        return next(new CustomError("Cannot cancel a completed order", 400));
    }

    if (
        order.status !== OrderStatus.AwaitingPayment &&
        order.status !== OrderStatus.Created &&
        order.status !== OrderStatus.Pending
    ) {
        throw new CustomError(`Cannot cancel order in status: ${order.status}`, 400);
    }


    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(200).send(order);
}

export const retryPayment = async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.currentUser?.id;
    const { orderId, paymentMethod } = req.body;
    const order = await findUserOrderOrThrow(orderId, userId!);

    if (
        order.status !== OrderStatus.AwaitingPayment &&
        order.status !== OrderStatus.Pending &&
        order.status !== OrderStatus.Failed
    ) {
        throw new CustomError("Only awaiting, pending, or failed orders can be retried for payment", 400);

    }

    order.status = OrderStatus.Completed;
    await order.save();

    res.status(200).send(order);
}

export const applyDiscount = async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.currentUser?.id;
    const { orderId, discountCode } = req.body;
    const order = await findUserOrderOrThrow(orderId, userId!);

    if (order.status !== OrderStatus.AwaitingPayment && order.status !== OrderStatus.Created) {
        throw new CustomError("Discounts can only be applied to orders awaiting payment or created", 400);
    }
    res.status(200).send(order);
}

export const getPaymentDetails = async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.currentUser?.id;
    const { orderId } = req.params;
    const order = await findUserOrderOrThrow(orderId, userId!);
    res.status(200).send({
        orderId: order.id,
        amount: order.price,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt

    });
}   
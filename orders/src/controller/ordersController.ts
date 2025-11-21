
import { Request, Response } from 'express';
import { CustomError, OrderStatus, ensureValidMongoId } from "@zspersonal/common"
import mongoose from 'mongoose';
import { Ticket } from '../model/tickets';
import { Order } from '../model/orders';
import { OrderCreatedPublisher } from '../events/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/order-cancelled-publisher';




declare global {
    namespace Express {
        interface Request {
            currentUser?: { id: string; email?: string };
        }
    }
}



export const getOrders = async (req: Request, res: Response) => {
    const userId = req.currentUser?.id;

    const orders = await Order.find({ userId }).populate("ticket").lean();

    res.status(200).send({ success: true, orders });

};

export const createOrder = async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    ensureValidMongoId(ticketId);

    const ticket = await Ticket.findById(ticketId);


    if (!ticket) throw new CustomError("Ticket not found", 404);


    const isReserved = await ticket.isReserved();

    if (isReserved) throw new CustomError("Ticket is already reserved", 400);


    const expiration = new Date();
    expiration.setUTCMinutes(expiration.getUTCMinutes() + 1);
    console.log("Expiration time set to:", expiration.toISOString());


    const order = Order.build({
        userId: new mongoose.Types.ObjectId(req.currentUser!.id) as unknown as mongoose.Schema.Types.ObjectId,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    });
    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id.toString(),
        status: order.status,
        userId: order.userId.toString(),
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id.toString(),
            price: ticket.price
        },
        version: order.version
    });

    res.status(201).send({ success: true, order });

}


export const getOrderById = async (req: Request, res: Response) => {

    const { orderId } = req.params;
    ensureValidMongoId(orderId);
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) throw new CustomError("Order not found", 404);
    res.status(200).send({ success: true, order });


}

export const cancelOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;


    ensureValidMongoId(orderId);


    const order = await Order.findById(orderId);
    if (!order) {
        throw new CustomError("Order not found", 404);
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id.toString(),
        status: order.status,
        userId: order.userId.toString(),
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: order.ticket.toString(),
            price: (order.ticket as any).price
        },
        version: order.version
    });

    res.status(204).send({ success: true });


}
export const payForOrder = (req: Request, res: Response) => {

    const { orderId } = req.params;
    ensureValidMongoId(orderId);
    res.status(200).send({ success: true, order: { id: orderId }, status: 'Payment successful' });

}

export const updateOrder = async (req: Request, res: Response) => {

    const { orderId } = req.params;
    const { status } = req.body;

    ensureValidMongoId(orderId);

    if (!Object.values(OrderStatus).includes(status)) {
        throw new CustomError("Invalid order status", 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new CustomError("Order not found", 404);
    }
    order.status = status;
    await order.save();

    res.status(200).send({ success: true, order: { id: orderId, status } });

}
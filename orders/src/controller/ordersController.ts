
import { Request, Response } from 'express';
import { CustomError, OrderStatus } from "@zspersonal/common"
import mongoose from 'mongoose';
import { Ticket } from '../model/tickets';
import { Order } from '../model/orders';

declare global {
    namespace Express {
        interface Request {
            currentUser?: { id: string; email?: string };
        }
    }
}


const ensureValidMongoId = (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError("Invalid ID format", 400);
    }
};

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
    expiration.setMinutes(expiration.getMinutes() + 15);


    const order = Order.build({
        userId: new mongoose.Types.ObjectId(req.currentUser!.id) as unknown as mongoose.Schema.Types.ObjectId,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    });
    await order.save();




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
    console.log("Cancled Order");

    res.status(204).send();


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

    res.status(200).send({ order: { id: orderId, status } });

}
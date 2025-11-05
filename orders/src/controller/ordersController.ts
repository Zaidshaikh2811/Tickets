
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


export const getOrders = (req: Request, res: Response) => {

    res.status(200).send({ orders: [] });

};

export const createOrder = async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    console.log("Start from cotroller");

    const ticket = await Ticket.findById(ticketId);
    console.log(ticket);

    if (!ticket) {
        throw new CustomError("Order not found", 404);
    }

    const existingOrder = await ticket.isReserved();
    console.log("existingOrder order ");

    if (existingOrder) {
        throw new CustomError("Ticket is already reserved", 400);
    }

    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 15);
    console.log("saving");

    const order = Order.build({
        userId: new mongoose.Types.ObjectId(req.currentUser!.id) as unknown as mongoose.Schema.Types.ObjectId,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    });
    await order.save();
    console.log("Saved from controller");

    res.status(201).send(order);


}


export const getOrderById = async (req: Request, res: Response) => {

    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
        console.log("Order Not FOund");

        throw new CustomError("Order not found", 404);
    }
    res.status(200).send({ order });


}

export const cancelOrder = async (req: Request, res: Response) => {


    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
        throw new CustomError("Order not found", 404);
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    res.status(204).send({});


}
export const payForOrder = (req: Request, res: Response) => {

    const { orderId } = req.params;
    // Logic to pay for order
    res.status(200).send({ order: { id: orderId }, status: 'Payment successful' });


}
export const updateOrder = (req: Request, res: Response) => {

    const { orderId } = req.params;
    const { status } = req.body;
    // Logic to update order
    res.status(200).send({ order: { id: orderId, status } });

}
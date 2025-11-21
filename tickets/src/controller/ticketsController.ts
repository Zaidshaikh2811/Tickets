
import { Request, Response } from "express";

import { CustomError, ensureValidMongoId, Subjects } from "@zspersonal/common"
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publisher/ticker-updated-publihser";
import { OutboxEvent, OutboxStatus } from "../models/outbox";
import { Ticket, TicketStatus } from "../models/tickets";


declare global {
    namespace Express {
        interface Request {
            currentUser?: { id: string };
        }
    }
}



export const addTicket = async (req: Request, res: Response) => {


    const { title, price } = req.body;
    const userId = req.currentUser?.id;

    if (!userId) {
        throw new CustomError("User not authenticated", 401);
    }


    ensureValidMongoId(userId);

    const existingTicket = await Ticket.findOne({ title, status: { $in: [TicketStatus.Created, TicketStatus.Reserved] }, });


    if (existingTicket) {
        throw new CustomError("Ticket is already created or reserved", 400);
    }

    if (!title || price === undefined) {
        throw new CustomError("Title and Price are required", 400);
    }


    const ticket = Ticket.build({ title, price, userId });


    await ticket.save();

    // new TicketCreatedPublisher(natsWrapper.client).publish({
    //     id: ticket.id,
    //     title: ticket.title,
    //     price: ticket.price,
    //     userId: ticket.userId,
    // });



    await OutboxEvent.create(
        {
            eventType: Subjects.TicketCreated,
            data: {
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
                version: ticket.version,
                status: ticket.status,
            },
            status: OutboxStatus.Pending,
        },

    );




    res.status(201).json({ success: true, data: ticket });


}

export const getTickets = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '10' } = req.query as { page?: string; limit?: string };
        const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit as string, 10) || 10);

        const tickets = await Ticket.find()
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();
        res.status(200).json({ success: true, count: tickets.length, data: tickets });
    } catch (err) {
        throw new CustomError("Internal Server Error", 500);
    }
}




export const updateTicket = async (req: Request, res: Response) => {


    const { ticketId } = req.params;
    const userId = req.currentUser?.id;

    ensureValidMongoId(ticketId);


    const existingTicket = await Ticket.findById(ticketId);

    if (!existingTicket) {
        throw new CustomError("Ticket not found", 404);
    }

    if (existingTicket.orderId) {
        throw new CustomError("Cannot edit a reserved ticket", 400);
    }

    if (existingTicket.userId !== userId) {
        throw new CustomError("Not authorized to update this ticket", 403);
    }



    const {
        title, price
    } = req.body;

    if (title) existingTicket.title = title;
    if (price !== undefined) existingTicket.price = price;

    await existingTicket.save();

    // new TicketUpdatedPublisher(natsWrapper.client).publish({
    //     id: existingTicket.id,
    //     title: existingTicket.title,
    //     price: existingTicket.price,
    //     userId: existingTicket.userId,
    // });
    await OutboxEvent.create(
        {
            eventType: Subjects.TicketUpdated,
            data: {
                id: existingTicket.id,
                title: existingTicket.title,
                price: existingTicket.price,
                userId: existingTicket.userId,
                version: existingTicket.version,
            },
            status: OutboxStatus.Pending,
        },

    );

    res.status(200).json({ success: true, message: "Ticket updated successfully", data: existingTicket });



}

export const deleteTicket = async (req: Request, res: Response) => {

    const { ticketId } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
        throw new CustomError("Ticket not found", 404);
    }

    res.status(200).json({ success: true, message: "Ticket deleted successfully", data: deletedTicket });

}

export const getParticularTicket = async (req: Request, res: Response) => {

    const ticketId = req.params.id;


    ensureValidMongoId(ticketId);

    const ticket = await Ticket.findById(ticketId).lean();
    if (!ticket) {
        throw new CustomError("Ticket not found", 404);
    }
    res.status(200).json({ success: true, data: ticket });


}
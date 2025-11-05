
import { Request, Response } from "express";
import { Ticket } from "../models/tickets"
import { CustomError } from "@zspersonal/common"
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publisher/ticker-updated-publihser";

declare global {
    namespace Express {
        interface Request {
            currentUser?: { id: string };
        }
    }
}

export const addTicket = (req: Request, res: Response) => {


    const { title, price } = req.body;
    if (!title || price === undefined) {
        throw new CustomError("Title and Price are required", 400);
    }
    const userId = req.currentUser?.id;
    if (!userId) {
        throw new CustomError("Login Again", 401);
    }
    const ticket = Ticket.build({ title, price, userId });
    ticket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
    });

    res.status(201).json(ticket);


}

export const getTickets = async (req: Request, res: Response) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.status(200).json({ count: tickets.length, data: tickets });
    } catch (err) {
        throw new CustomError("Internal Server Error", 500);

    }
}


export const updateTicket = async (req: Request, res: Response) => {

    const { id } = req.params;
    const updateData = req.body;

    const updatedTicket = await Ticket.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!updatedTicket) {
        throw new CustomError("Ticket not found", 404);
    }

    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: updatedTicket.id,
        title: updatedTicket.title,
        price: updatedTicket.price,
        userId: updatedTicket.userId,
    });

    res.status(200).json({ message: "Ticket updated successfully", data: updatedTicket });



}

export const deleteTicket = async (req: Request, res: Response) => {

    const { id } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
        throw new CustomError("Ticket not found", 404);
    }

    res.status(200).json({ message: "Ticket deleted successfully", data: deletedTicket });



}

export const getParticularTicket = async (req: Request, res: Response) => {

    const ticketId = req.params.id;
    // Simulate fetching ticket from database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new CustomError("Ticket not found", 404);
    }
    res.status(200).json(ticket);


}
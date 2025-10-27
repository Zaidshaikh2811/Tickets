
import { Request, Response } from "express";



export const addTicket = (req: Request, res: Response) => {
    res.status(200).json({ message: "Ticket added successfully" });
}

export const getTickets = (req: Request, res: Response) => {
    res.status(200).json([]);
}


export const updateTicket = (req: Request, res: Response) => {
    res.status(200).json({ message: `Ticket with ID ${req.params.id} updated successfully` });
}

export const deleteTicket = (req: Request, res: Response) => {
    res.status(200).json({ message: `Ticket with ID ${req.params.id} deleted successfully` });
}
import { z } from "zod"

export const ticketSchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.number().positive("Price must be positive"),
})

export const displayTicketSchema = ticketSchema.extend({
    _id: z.string().uuid(),
    createdAt: z.string(),
    updatedAt: z.string(),
})
export type TicketSchema = z.infer<typeof ticketSchema>
export type DisplayTicketSchema = z.infer<typeof displayTicketSchema>
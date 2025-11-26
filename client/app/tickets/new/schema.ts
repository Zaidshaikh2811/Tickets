import { z } from "zod"

export const ticketSchema = z.object({
    title: z.string().min(1, "Title is required"),
    price: z.number().positive("Price must be positive"),
})

export type TicketSchema = z.infer<typeof ticketSchema>

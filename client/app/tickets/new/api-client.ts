import { apiFetch } from "@/lib/api";
import { TicketSchema } from "./schema";

export async function createTicket(values: TicketSchema) {
    return await apiFetch("/api/tickets", {
        method: "POST",
        body: JSON.stringify(values),
    });
}

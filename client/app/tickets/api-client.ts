import { apiFetch } from "@/lib/api";
import { TicketSchema } from "./new/schema";

export async function fetchAllTickets() {
    return await apiFetch("/api/tickets", { method: "GET" });
}

export async function createTicket(values: TicketSchema) {
    return await apiFetch("/api/tickets", {
        method: "POST",
        body: JSON.stringify(values),
    });
}

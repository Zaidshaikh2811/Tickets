import { apiFetch } from "@/lib/api";

export async function fetchTicket(ticketId: string) {
    return await apiFetch(`/api/tickets/${ticketId}`, {
        method: "GET",
    });
}


export async function BookTicket(orderId: string, paymentMethod: string) {
    return await apiFetch(`/api/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderId,
            paymentMethod,
        }),
    });
}

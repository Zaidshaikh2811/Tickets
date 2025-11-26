"use server"

import { ticketSchema } from "./schema"

export async function getIndividual(ticketId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tickets/${ticketId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // We want fresh data, not cached
            cache: "no-store",
            credentials: "include",
        });

        if (!res.ok) {
            return { success: false, error: "Failed to fetch tickets" };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (err) {
        return { success: false, error: "Internal error fetching tickets" };
    }
}
export async function createTicketAction(formData: FormData) {
    const raw = {
        title: formData.get("title"),
        price: Number(formData.get("price")),
    }
    const parsed = ticketSchema.safeParse(raw)

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        }
    }
    const data = parsed.data


    const res = await fetch(`${process.env.API_TICKETS_URL}/api/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    })
    const payload = await res.json().catch(() => null)

    if (!res.ok) {
        return {
            success: false,
            errors: payload?.message || "Failed to create ticket",
        }
    }

    return { success: true, data: payload }
}
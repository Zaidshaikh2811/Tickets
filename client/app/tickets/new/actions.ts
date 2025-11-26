"use server";

import { ticketSchema } from "./schema";

export async function createTicketAction(formData: FormData) {
    try {

        const raw = {
            title: formData.get("title"),
            price: Number(formData.get("price")),
        };

        const parsed = ticketSchema.safeParse(raw);

        if (!parsed.success) {

            return {
                success: false,
                type: "validation",
                errors: parsed.error.flatten().fieldErrors,
            };
        }

        const data = parsed.data;


        let res: Response;
        try {
            res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tickets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
                cache: "no-store",
            });
        } catch (err) {
            console.error("Network error during fetch in createTicketAction:", err);
            return { success: false, type: "network", errors: "Network error", networkError: err };
        }
        const payload = await res.json().catch(() => null);

        if (!res.ok) {
            console.log("Error response from createTicketAction:", payload);

            return {
                success: false,
                type: "server",
                errors: payload?.message || payload?.error || "Failed to create ticket",
                status: res.status,
            };
        }

        return { success: true, data: payload };

    } catch (err: any) {

        console.error("Unhandled error in createTicketAction:", err);

        return {
            success: false,
            type: "fatal",
            errors: "Something went wrong. Please try again later.",
        };
    }
}

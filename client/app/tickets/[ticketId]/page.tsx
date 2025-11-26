"use client";

import { useEffect, useState } from "react";
import { fetchTicket, BookTicket } from "./api-client";
import { useParams } from "next/navigation";

interface Ticket {
    _id: string;
    title: string;
    price: number;
    createdAt: string;
    orderId: string;
}

export default function TicketDetailsPage() {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isBuying, setIsBuying] = useState(false);
    const [success, setSuccess] = useState("");
    const params = useParams();

    useEffect(() => {
        async function loadTicket() {
            const ticketId = Array.isArray(params.ticketId)
                ? params.ticketId[0]
                : params.ticketId;

            console.log("params.ticketId", ticketId);

            if (!ticketId) {
                setError("Missing ticket id");
                setLoading(false);
                return;
            }

            const { res, data } = await fetchTicket(ticketId);

            if (!res.ok) {
                setError(data?.message || "Failed to load ticket");
            } else {
                setTicket(data?.data || null);
            }

            setLoading(false);
        }

        loadTicket();
    }, [params.ticketId]);

    async function handlePurchase() {
        if (!ticket) return;
        if (ticket.orderId === undefined) {
            setError("Ticket is not available for purchase.");
            return;
        }

        setIsBuying(true);
        setSuccess("");
        setError("");

        const { res, data } = await BookTicket(ticket.orderId, "credit_card");

        setIsBuying(false);

        if (!res.ok) {
            setError(data?.message || "Purchase failed");
            return;
        }

        setSuccess("Ticket purchased successfully!");
    }

    if (loading) {
        return (
            <div className="flex justify-center py-10 text-gray-500">
                Loading ticket...
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="text-red-600 p-4 text-center">
                Failed to load ticket: {error || "Not found"}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">
                <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
                    Ticket Details
                </h1>

                <div className="space-y-4">
                    <p className="text-xl font-semibold text-indigo-700">{ticket.title}</p>

                    <p className="text-gray-700">
                        <span className="font-semibold">Price:</span> ${ticket.price}
                    </p>

                    <p className="text-gray-500">
                        <span className="font-semibold">Created:</span>{" "}
                        {new Date(ticket.createdAt).toLocaleString()}
                    </p>

                    <p className="text-gray-500">
                        <span className="font-semibold">Ticket ID:</span> {ticket._id}
                    </p>

                    {error && <p className="text-red-600">{error}</p>}
                    {success && <p className="text-green-600">{success}</p>}

                    <button
                        onClick={handlePurchase}
                        disabled={isBuying}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg 
                                   font-semibold transition disabled:opacity-50 mt-4"
                    >
                        {isBuying ? "Processing..." : "Purchase Ticket"}
                    </button>
                </div>
            </div>
        </div>
    );
}

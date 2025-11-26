"use client";

import { useEffect, useState } from "react";
import { DisplayTicketSchema } from "./[ticketId]/schema";
import { fetchAllTickets } from "./api-client";

export default function TicketsPage() {
    const [tickets, setTickets] = useState<DisplayTicketSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTickets() {
            try {
                const { res, data } = await fetchAllTickets();
                console.log("tickets:", { res, data });

                if (!res.ok) {
                    setError(data?.message || "Failed to fetch tickets");
                    setTickets([]);
                } else {
                    setTickets(data.data || []);
                }
            } catch (err) {
                console.error("Tickets fetch error:", err);
                setError("Network error fetching tickets");
            }

            setLoading(false);
        }

        loadTickets();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading tickets...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl font-medium">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
                    All Tickets
                </h1>

                {tickets.length === 0 && (
                    <p className="text-center text-gray-500 text-lg">
                        No tickets available.
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {tickets.map((t) => (
                        <div
                            key={t._id}
                            className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm 
                                       transition hover:shadow-md"
                        >
                            <h2 className="text-xl font-semibold text-indigo-700">
                                {t.title}
                            </h2>

                            <p className="text-gray-700 mt-1">Price: ${t.price}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Created: {new Date(t.createdAt).toLocaleString()}
                            </p>

                            <a
                                href={`/tickets/${t._id}`}
                                className="mt-4 inline-block text-indigo-600 font-medium hover:underline"
                            >
                                View Details →
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

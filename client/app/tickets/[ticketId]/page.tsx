"use client";

import { useEffect, useState } from "react";
import { fetchTicket, createOrder, makePayment } from "./api-client";
import { useParams } from "next/navigation";

interface Ticket {
    _id: string;
    title: string;
    price: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    version: number;
}

export default function TicketDetailsPage() {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [step, setStep] = useState<"buy" | "payment" | "done">("buy");
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [orderId, setOrderId] = useState<string | null>(null);

    const params = useParams();

    // -----------------------
    // FETCH TICKET
    // -----------------------
    useEffect(() => {
        async function loadTicket() {
            const ticketId = Array.isArray(params.ticketId)
                ? params.ticketId[0]
                : params.ticketId;

            if (!ticketId) {
                setError("Missing ticket id");
                setLoading(false);
                return;
            }

            const { res, data } = await fetchTicket(ticketId);

            if (!res.ok) setError(data?.message || "Failed to load ticket");
            else setTicket(data.data);

            setLoading(false);
        }

        loadTicket();
    }, [params.ticketId]);

    // -----------------------
    // 1️⃣ CREATE ORDER
    // -----------------------
    async function handleCreateOrder() {
        if (!ticket) return;

        if (ticket.status !== "created") {
            setError("This ticket is not available for purchase");
            return;
        }

        setError("");
        setSuccess("");

        const { res, data } = await createOrder(ticket._id);

        if (!res.ok) {
            setError(data?.message || "Failed to create order");
            return;
        }

        const id = data.order.id;
        setOrderId(id);
        setStep("payment");
    }

    // -----------------------
    // 2️⃣ MAKE PAYMENT
    // -----------------------
    async function handlePayment() {
        if (!orderId) {
            setError("Order not created");
            return;
        }

        setError("");
        setSuccess("");

        const { res, data } = await makePayment(orderId, paymentMethod);

        if (!res.ok) {
            setError(data?.message || "Payment failed");
            return;
        }

        setSuccess("Payment successful! Ticket purchased.");
        setStep("done");
    }

    if (loading) return <div className="p-6 text-gray-500 text-center">Loading ticket...</div>;

    if (error && step === "buy")
        return <div className="p-6 text-red-600 text-center">{error}</div>;

    if (!ticket)
        return <div className="p-6 text-red-600 text-center">Ticket not found</div>;

    return (
        <div className="min-h-screen flex justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">


                <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
                    {ticket.title}
                </h1>


                <p className="text-lg"><strong>Price:</strong> ${ticket.price}</p>

                <p className="text-sm text-gray-700 mt-2">
                    <strong>Status:</strong>{" "}
                    <span className={
                        ticket.status === "created" ? "text-green-600" :
                            ticket.status === "reserved" ? "text-orange-600" :
                                "text-red-600"
                    }>
                        {ticket.status.toUpperCase()}
                    </span>
                </p>

                <p className="text-sm text-gray-500 mt-2">
                    <strong>Version:</strong> {ticket.version}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                    <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}
                </p>


                {error && <p className="text-red-600 mt-3">{error}</p>}
                {success && <p className="text-green-600 mt-3">{success}</p>}


                {step === "buy" && (
                    <button
                        onClick={handleCreateOrder}
                        disabled={ticket.status !== "created"}
                        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg disabled:opacity-50"
                    >
                        Buy Ticket
                    </button>
                )}


                {step === "payment" && (
                    <>
                        <select
                            className="mt-6 text-black w-full bg-white border border-gray-300 py-2 rounded-lg"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="credit_card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="stripe">Stripe</option>
                        </select>

                        <button
                            onClick={handlePayment}
                            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                        >
                            Pay Now
                        </button>
                    </>
                )}


                {step === "done" && (
                    <div className="mt-6 text-green-600 text-center font-semibold">
                        🎉 Purchase completed!
                    </div>
                )}
            </div>
        </div>
    );
}

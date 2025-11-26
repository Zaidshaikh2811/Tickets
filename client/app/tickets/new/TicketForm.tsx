"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketSchema, TicketSchema } from "./schema";
import { createTicket } from "./api-client";

export default function TicketForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TicketSchema>({
        resolver: zodResolver(ticketSchema),
    });

    function onSubmit(values: TicketSchema) {
        setServerError(null);
        setSuccessMsg(null);

        startTransition(async () => {
            const { res, data } = await createTicket(values);

            if (!res.ok) {
                setServerError(data?.message || "Failed to create ticket");
                return;
            }

            setSuccessMsg("Ticket created successfully!");
            reset();
        });
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 w-full"
        >
            {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {serverError}
                </div>
            )}

            {successMsg && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {successMsg}
                </div>
            )}

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    {...register("title")}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 
                               text-black focus:ring-2 focus:ring-indigo-500"
                />
                {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
            </div>


            <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 
                               text-black focus:ring-2 focus:ring-indigo-500"
                />
                {errors.price && (
                    <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
                )}
            </div>


            <button
                disabled={isPending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg 
                           font-semibold transition disabled:opacity-50"
            >
                {isPending ? "Creating..." : "Create Ticket"}
            </button>
        </form>
    );
}

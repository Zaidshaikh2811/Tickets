"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function SignInPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        setError("");

        startTransition(async () => {
            const email = formData.get("email");
            const password = formData.get("password");

            const { res, data } = await apiFetch("/api/users/signin", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                setError(data?.message || "Invalid credentials");
                return;
            }

            login(data.user, data.token);
            router.push("/tickets");
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
                    Sign In
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            disabled={isPending}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 
                                       text-black focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isPending}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2
                                       text-black focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2
                                   rounded-lg font-semibold transition disabled:opacity-50"
                    >
                        {isPending ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="text-indigo-600 hover:underline font-medium">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

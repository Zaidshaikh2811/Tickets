"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
        };

        startTransition(async () => {
            try {
                const response = await fetch("/api/users/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Sign up failed");
                }

                router.push("/");
                router.refresh();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            }
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
                    Create an Account
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            required
                            disabled={isPending}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            required
                            disabled={isPending}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="********"
                            required
                            minLength={6}
                            disabled={isPending}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-indigo-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
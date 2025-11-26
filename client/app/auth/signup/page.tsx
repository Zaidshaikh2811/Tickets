"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function SignUpPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);

        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
        };

        startTransition(async () => {
            const { res, data } = await apiFetch("/api/users/signup", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                setError(data?.message || "Sign up failed");
                return;
            }

            login(data.user, data.token);
            router.push("/");
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
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
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            name="name"
                            required
                            disabled={isPending}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 
                                       text-black focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            disabled={isPending}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2
                                       text-black focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
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
                        {isPending ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-indigo-600 hover:underline font-medium">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

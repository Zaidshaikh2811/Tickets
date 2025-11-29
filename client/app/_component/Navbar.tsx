"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-indigo-600">
                        TicketForge
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-6">

                        <Link href="/tickets" className="text-gray-700 hover:text-indigo-600">
                            Tickets
                        </Link>

                        {user ? (
                            <>
                                <span className="text-gray-700">
                                    Hi, {user.name.split(" ")[0]}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    href="/auth/signup"
                                    className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

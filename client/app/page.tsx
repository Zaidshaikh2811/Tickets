import Link from "next/link";
import Navbar from "./_component/Navbar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />


            <section className="flex flex-col items-center justify-center text-center pt-24 pb-32 px-6">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-3xl">
                    Buy & Sell Tickets Seamlessly
                    <span className="text-indigo-600"> — Powered by Microservices</span>
                </h1>

                <p className="mt-6 text-lg text-gray-600 max-w-2xl">
                    A scalable ticketing platform built using Node.js, NATS Streaming,
                    Kubernetes, Next.js, and secure payments.
                </p>

                <div className="mt-8 flex gap-4">
                    <Link
                        href="/tickets"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700"
                    >
                        Browse Tickets
                    </Link>

                    <Link
                        href="/auth/signup"
                        className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg text-lg hover:bg-indigo-50"
                    >
                        Get Started
                    </Link>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-20 grid sm:grid-cols-3 gap-8">
                <div className="bg-white p-6 shadow-md rounded-xl">
                    <h3 className="text-xl font-semibold text-indigo-600">Fast Booking</h3>
                    <p className="text-gray-600 mt-2">
                        Reserve and purchase tickets instantly using our event-driven architecture.
                    </p>
                </div>

                <div className="bg-white p-6 shadow-md rounded-xl">
                    <h3 className="text-xl font-semibold text-indigo-600">Secure Payments</h3>
                    <p className="text-gray-600 mt-2">
                        Integrated payment flow ensures all transactions are safe and reliable.
                    </p>
                </div>

                <div className="bg-white p-6 shadow-md rounded-xl">
                    <h3 className="text-xl font-semibold text-indigo-600">Microservices Ready</h3>
                    <p className="text-gray-600 mt-2">
                        Deployed on Kubernetes with independent services for users, tickets, orders & payments.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t py-6 text-center text-gray-500">
                © {new Date().getFullYear()} TicketForge. All rights reserved.
            </footer>
        </div>
    );
}

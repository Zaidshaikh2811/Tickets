import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-12 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to <span className="text-indigo-600">TicketX</span>
      </h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-8">
        A modern ticketing platform built with microservices, Kubernetes, and Next.js.
      </p>

      <div className="flex gap-4">
        <Link
          href="/signup"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
        <Link
          href="/signin"
          className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
        >
          Sign In
        </Link>
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} TicketX. All rights reserved.
      </footer>
    </div>
  );
}

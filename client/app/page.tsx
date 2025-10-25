import Link from "next/link";
import { cookies } from "next/headers"; // 👈 import this
import Header from "./_component/Header";

async function getData() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");



  // Make internal API call with cookie
  const res = await fetch("http://auth-srv:3000/api/users/currentuser", {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    return null; // user not logged in
  }

  return res.json();
}

export default async function Home() {
  const data = await getData();


  const currentUser = data?.user;



  return (
    <>
      <Header currentUser={currentUser} />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-12 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-indigo-600">TicketX</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          A modern ticketing platform built with microservices, Kubernetes, and Next.js.
        </p>

        {currentUser ? (
          <div className="text-lg text-gray-800 mb-6">
            👋 Welcome back, <span className="font-semibold text-indigo-600">{currentUser.name || currentUser.email}</span>!
          </div>
        ) : null}

        <div className="flex gap-4">
          {!currentUser && (
            <>
              <Link
                href="/signup"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/auth/signin"
                className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              >
                Sign In
              </Link>
            </>
          )}
          {currentUser && (
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        <footer className="mt-12 text-sm text-gray-500">
          © {new Date().getFullYear()} TicketX. All rights reserved.
        </footer>
      </div> </>
  );
}

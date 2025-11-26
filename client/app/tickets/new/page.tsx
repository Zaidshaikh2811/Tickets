import TicketForm from "./TicketForm";

export default function NewTicketPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
                    Create a New Ticket
                </h1>

                <TicketForm />
            </div>
        </div>
    );
}




export default function Header({ currentUser }: { currentUser: any }) {
    return (
        <header className="w-full bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-2">
                <h1 className="text-2xl font-bold">TicketX</h1>
                {currentUser && (
                    <div className="mt-2">
                        <span className="text-sm text-gray-600">Logged in as:</span>{" "}
                        <span className="font-semibold">{currentUser.name}</span>
                    </div>
                )}
            </div>
        </header>
    );
}

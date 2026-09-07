function DashboardHeader() {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="mb-2 text-sm font-medium text-pink-600">
                    Your learning journey
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
                    Good morning, Developer.
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                    Here's what your progress looks like today.
                </p>
            </div>

            <div className="rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm">
                September 5, 2026
            </div>
        </div>
    );
}

export default DashboardHeader;
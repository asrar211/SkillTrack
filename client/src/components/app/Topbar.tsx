import {
    Bell,
    Command,
    LogOut,
    Search,
    Settings,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/features/auth/AuthContext";
import { useTodayGoal } from "@/features/goals/hooks/useTodayGoal";

function Topbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [search, setSearch] = useState("");
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { data: goalData } = useTodayGoal();
    const goal = goalData?.data;

    useEffect(() => {
        const handleShortcut = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleShortcut);
        return () => window.removeEventListener("keydown", handleShortcut);
    }, []);

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = search.trim();
        navigate(query ? `/skills?search=${encodeURIComponent(query)}` : "/skills");
    };

    const handleLogout = async () => {
        await logout();

        navigate("/login", {
            replace: true,
        });
    };

    const initials =
        user?.name
            ?.split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "U";

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <form onSubmit={handleSearch} className="hidden items-center gap-2 rounded-xl border bg-zinc-50 px-3 py-2 md:flex md:w-80">
                <Search className="size-4 text-zinc-400" />

                <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search skills..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />
                <kbd className="rounded border bg-white px-1.5 py-0.5 text-[10px] text-zinc-400">⌘K</kbd>
            </form>

            <div className="ml-auto flex items-center gap-3">
                <div className="relative">
                    <button
                        type="button"
                        aria-label="Open learning reminders"
                        aria-expanded={isNotificationsOpen}
                        onClick={() => setIsNotificationsOpen((open) => !open)}
                        className="relative flex size-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        <Bell className="size-4" />
                        {goal && !goal.completed && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-pink-500" />}
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border bg-white p-4 shadow-xl">
                            <div className="flex items-center gap-2"><Command className="size-4 text-pink-500" /><p className="text-sm font-semibold">Learning reminders</p></div>
                            {goal ? (
                                <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm">
                                    {goal.completed ? "Today’s learning goal is complete — nice work." : `${Math.max(goal.targetMinutes - goal.completedMinutes, 0)} minutes left in today’s goal.`}
                                    <button type="button" onClick={() => { setIsNotificationsOpen(false); navigate("/goals"); }} className="mt-2 block font-medium text-pink-600 hover:text-pink-700">View daily goal →</button>
                                </div>
                            ) : (
                                <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-600">Set a daily goal to receive a focused study reminder.<button type="button" onClick={() => { setIsNotificationsOpen(false); navigate("/goals"); }} className="mt-2 block font-medium text-pink-600 hover:text-pink-700">Set a goal →</button></div>
                            )}
                        </div>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button
                            type="button"
                            className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-pink-500"
                        >
                            <Avatar className="size-9">
                                <AvatarFallback className="bg-linear-to-br from-pink-500 to-purple-600 text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-56"
                    >
                        <div className="px-2 py-2">
                            <p className="text-sm font-semibold">
                                {user?.name}
                            </p>

                            <p className="truncate text-xs text-zinc-500">
                                {user?.email}
                            </p>
                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={() =>
                                navigate("/settings")
                            }
                        >
                            <Settings />
                            Settings
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-600 focus:text-red-600"
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

export default Topbar;

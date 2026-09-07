import {
    Bell,
    LogOut,
    Search,
    Settings,
} from "lucide-react";
import { useState, type FormEvent } from "react";

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

function Topbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [search, setSearch] = useState("");

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
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search skills..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />
            </form>

            <div className="ml-auto flex items-center gap-3">
                <button
                    type="button"
                    aria-label="Notifications are coming soon"
                    title="Notifications are coming soon"
                    disabled
                    className="relative flex size-9 items-center justify-center rounded-xl text-zinc-400 disabled:cursor-not-allowed"
                >
                    <Bell className="size-4" />

                    <span className="absolute right-2 top-2 size-1.5 rounded-full bg-pink-500" />
                </button>

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

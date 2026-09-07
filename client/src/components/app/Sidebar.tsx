import {
    BarChart3,
    BookOpen,
    BrainCircuit,
    Lightbulb,
    Flame,
    LayoutDashboard,
    Settings,
    Target,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { useStreak } from "@/features/goals/hooks/useStreak";

const navigation = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        label: "Roadmaps",
        icon: BookOpen,
        path: "/roadmaps",
    },
    {
        label: "Skills",
        icon: BrainCircuit,
        path: "/skills",
    },
    {
        label: "DSA",
        icon: BarChart3,
        path: "/dsa",
    },
    {
        label: "Goals",
        icon: Target,
        path: "/goals",
    },
    {
        label: "Insights",
        icon: Lightbulb,
        path: "/insights",
    },
];

function Sidebar() {
    const { user } = useAuth();
    const { data: streakData } = useStreak();
    const initials = user?.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ?? "U";

    return (
        <aside className="hidden w-64 shrink-0 border-r bg-white lg:flex lg:flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-purple-600 text-sm font-bold text-white">
                        S
                    </div>

                    <span className="text-lg font-bold tracking-tight">
                        SkillTrack
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                [
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-pink-50 text-pink-600"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                                ].join(" ")
                            }
                        >
                            <Icon className="size-4" />
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="border-t p-4">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        [
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-zinc-100 text-zinc-900"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                        ].join(" ")
                    }
                >
                    <Settings className="size-4" />
                    Settings
                </NavLink>

                <div className="mt-4 flex items-center gap-3 rounded-xl bg-zinc-50 p-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                        {initials}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                            {user?.name ?? "Developer"}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <Flame className="size-3 text-orange-500" />
                            {streakData?.data.currentStreak ?? 0} day streak
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;

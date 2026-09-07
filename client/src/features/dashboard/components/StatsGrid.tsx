import {
    ArrowUpRight,
    BrainCircuit,
    Flame,
    Target,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import type { DashboardOverview, Streak } from "../dashboard.types";

interface StatsGridProps {
    overview: DashboardOverview;
    streak: Streak
}

function StatsGrid({
    overview,
    streak
}: StatsGridProps) {
    const stats = [
        {
            label: "Skills Progress",
            value: `${overview.overallProgress}%`,
            description: "Overall progress",
            icon: BrainCircuit,
        },
        {
            label: "Current Streak",
            value: streak.currentStreak,
            description: "days",
            icon: Flame
        },
        {
            label: "DSA Solved",
            value: overview.solvedDSA,
            description: "Problems solved",
            icon: Target,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <Card
                        key={stat.label}
                        className="rounded-2xl border-zinc-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-zinc-500">
                                        {stat.label}
                                    </p>

                                    <div className="mt-3 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold tracking-tight">
                                            {stat.value}
                                        </span>

                                        <span className="text-sm text-zinc-500">
                                            {stat.description}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex size-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                                    <Icon className="size-5" />
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600">
                                <ArrowUpRight className="size-3" />
                                Keep going
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default StatsGrid;
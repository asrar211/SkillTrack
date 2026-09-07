import type { ReactNode } from "react";

import {
    BarChart3,
    Brain,
    Flame,
    GitBranch,
    Target,
} from "lucide-react";


const date = new Date();

function ProductPreview() {
    return (
        <div className="mx-auto mt-16 max-w-6xl">
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/60">

                {/* Browser header */}
                <div className="flex h-12 items-center border-b border-zinc-200 bg-zinc-50 px-5">
                    <div className="flex gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-zinc-300" />
                        <span className="h-3 w-3 rounded-full bg-zinc-300" />
                        <span className="h-3 w-3 rounded-full bg-zinc-300" />
                    </div>

                    <div className="mx-auto hidden rounded-md bg-white px-16 py-1 text-xs text-zinc-400 shadow-sm sm:block">
                        app.skilltrack.dev
                    </div>
                </div>

                {/* Dashboard */}
                <div className="grid min-h-125 grid-cols-12 bg-zinc-50">

                    {/* Sidebar */}
                    <aside className="col-span-3 hidden border-r border-zinc-200 bg-white p-5 md:block">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
                                S
                            </div>

                            <span className="font-bold">
                                Skill<span className="text-pink-500">Track</span>
                            </span>
                        </div>

                        <div className="mt-8 space-y-2">
                            <SidebarItem
                                icon={<BarChart3 />}
                                label="Dashboard"
                                active
                            />

                            <SidebarItem
                                icon={<GitBranch />}
                                label="Roadmaps"
                            />

                            <SidebarItem
                                icon={<Brain />}
                                label="Skills"
                            />

                            <SidebarItem
                                icon={<Target />}
                                label="DSA"
                            />

                            <SidebarItem
                                icon={<Flame />}
                                label="Goals"
                            />
                        </div>
                    </aside>

                    {/* Main dashboard */}
                    <div className="col-span-12 p-6 md:col-span-9 lg:p-8">

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-500">
                                    {date.toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        "day": "numeric"
                                    })}
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-zinc-950">
                                    Good morning, Developer 👋
                                </h2>
                            </div>

                            <div className="hidden h-9 w-9 rounded-full bg-linear-to-br from-pink-400 to-purple-500 sm:block" />
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <StatCard
                                label="Skills Progress"
                                value="68%"
                                change="+8.4%"
                            />

                            <StatCard
                                label="Current Streak"
                                value="12 days"
                                change="🔥"
                            />

                            <StatCard
                                label="DSA Solved"
                                value="124"
                                change="+12 this week"
                            />
                        </div>

                        {/* Progress section */}
                        <div className="mt-4 grid gap-4 lg:grid-cols-5">

                            <div className="rounded-2xl border border-zinc-200 bg-white p-5 lg:col-span-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-zinc-500">
                                            Learning Progress
                                        </p>

                                        <p className="mt-1 text-lg font-bold">
                                            Full-Stack Development
                                        </p>
                                    </div>

                                    <span className="text-sm font-semibold text-pink-500">
                                        68%
                                    </span>
                                </div>

                                <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-100">
                                    <div className="h-full w-[68%] rounded-full bg-linear-to-r from-pink-500 to-purple-500" />
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-3">
                                    <ProgressItem
                                        label="JavaScript"
                                        value="92%"
                                    />

                                    <ProgressItem
                                        label="React"
                                        value="76%"
                                    />

                                    <ProgressItem
                                        label="Node.js"
                                        value="54%"
                                    />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-zinc-200 bg-white p-5 lg:col-span-2">
                                <p className="text-sm font-medium text-zinc-500">
                                    Today's Goal
                                </p>

                                <p className="mt-1 text-lg font-bold">
                                    3 / 5 tasks completed
                                </p>

                                <div className="mt-6 space-y-4">
                                    <GoalItem
                                        label="Complete React Hooks"
                                        completed
                                    />

                                    <GoalItem
                                        label="Solve 2 DSA problems"
                                        completed
                                    />

                                    <GoalItem
                                        label="Read Node.js streams"
                                        completed
                                    />

                                    <GoalItem label="Build API endpoint" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({
    icon,
    label,
    active = false,
}: {
    icon: ReactNode;
    label: string;
    active?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                active
                    ? "bg-pink-50 text-pink-600"
                    : "text-zinc-500"
            }`}
        >
            <span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">
                {icon}
            </span>

            {label}
        </div>
    );
}

function StatCard({
    label,
    value,
    change,
}: {
    label: string;
    value: string;
    change: string;
}) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="text-xs font-medium text-zinc-500">
                {label}
            </p>

            <div className="mt-2 flex items-end justify-between">
                <p className="text-xl font-bold">
                    {value}
                </p>

                <span className="text-xs font-medium text-pink-500">
                    {change}
                </span>
            </div>
        </div>
    );
}

function ProgressItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <div className="flex justify-between text-xs">
                <span className="text-zinc-500">
                    {label}
                </span>

                <span className="font-medium">
                    {value}
                </span>
            </div>

            <div className="mt-2 h-1.5 rounded-full bg-zinc-100">
                <div className="h-full w-3/4 rounded-full bg-pink-400" />
            </div>
        </div>
    );
}

function GoalItem({
    label,
    completed = false,
}: {
    label: string;
    completed?: boolean;
}) {
    return (
        <div className="flex items-center gap-3 text-sm">
            <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    completed
                        ? "border-pink-500 bg-pink-500"
                        : "border-zinc-300"
                }`}
            >
                {completed && (
                    <span className="text-[10px] text-white">
                        ✓
                    </span>
                )}
            </div>

            <span
                className={
                    completed
                        ? "text-zinc-400 line-through"
                        : "text-zinc-700"
                }
            >
                {label}
            </span>
        </div>
    );
}

export default ProductPreview;
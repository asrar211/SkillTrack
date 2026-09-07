// src/features/roadmaps/components/RoadmapStats.tsx

import {
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
} from "lucide-react";

interface RoadmapStatsProps {
  overallProgress: number;
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
}

export default function RoadmapStats({
  overallProgress,
  totalItems,
  completedItems,
  inProgressItems,
}: RoadmapStatsProps) {
  const notStartedItems = Math.max(
    totalItems -
      completedItems -
      inProgressItems,
    0
  );

  const stats = [
    {
      label: "Overall Progress",
      value: `${overallProgress}%`,
      icon: ListTodo,
    },
    {
      label: "Completed",
      value: completedItems,
      icon: CheckCircle2,
    },
    {
      label: "In Progress",
      value: inProgressItems,
      icon: Clock3,
    },
    {
      label: "Not Started",
      value: notStartedItems,
      icon: Circle,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {stat.value}
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-3">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import {
  CheckCircle2,
  Code2,
  Target,
  BookOpen,
} from "lucide-react";

import type {
  LearningActivity,
} from "@/features/activity/activity.types";

interface RecentActivityProps {
  activities?: LearningActivity[];
  isLoading?: boolean;
}

const activityConfig = {
  learning: {
    icon: BookOpen,
    label: "Logged learning time",
  },
  "skill-completed": {
    icon: BookOpen,
    label: "Completed a skill",
  },

  "dsa-solved": {
    icon: Code2,
    label: "Solved a DSA problem",
  },

  "goal-completed": {
    icon: Target,
    label: "Completed daily goal",
  },
};

export default function RecentActivity({
  activities = [],
  isLoading = false,
}: RecentActivityProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />

        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-100" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your latest learning activity.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="py-10 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-gray-300" />

          <p className="mt-3 font-medium">
            No activity yet
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Start learning to see your activity here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {activities.slice(0, 8).map((activity) => {
            const config =
              activityConfig[activity.type];

            if (!config) return null;

            const Icon = config.icon;

            return (
              <div
                key={activity._id}
                className="flex items-center gap-3"
              >
                <div className="rounded-lg bg-gray-100 p-2">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {config.label}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(
                      activity.createdAt
                    ).toLocaleDateString()}{" "}
                    {" "}
                    {new Date(
                      activity.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

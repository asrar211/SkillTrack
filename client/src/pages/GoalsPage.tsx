// src/pages/GoalsPage.tsx

import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Flame,
  Target,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTodayGoal } from "@/features/goals/hooks/useTodayGoal";
import { useStreak } from "@/features/goals/hooks/useStreak";
import { useCreateGoal } from "@/features/goals/hooks/useCreateGoal";
import { useUpdateGoalProgress } from "@/features/goals/hooks/useUpdateGoalProgress";

export default function GoalsPage() {
  const {
    data: goalData,
    isLoading: isGoalLoading,
  } = useTodayGoal();

  const {
    data: streakData,
    isLoading: isStreakLoading,
  } = useStreak();

  const createGoal = useCreateGoal();
  const updateGoalProgress = useUpdateGoalProgress();

  const goal = goalData?.data ?? null;
  const streak = streakData?.data;

  const [targetMinutes, setTargetMinutes] = useState(60);
  const [completedMinutes, setCompletedMinutes] = useState<number | null>(null);

  const progress = goal
    ? Math.min(
        Math.round(
          (goal.completedMinutes / goal.targetMinutes) * 100
        ),
        100
      )
    : 0;

  const remainingMinutes = goal
    ? Math.max(
        goal.targetMinutes - goal.completedMinutes,
        0
      )
    : 0;

  const handleCreateGoal = () => {
    if (targetMinutes <= 0) return;

    createGoal.mutate({
      targetMinutes,
    });
  };

  const handleUpdateProgress = () => {
    if (!goal) return;

    const minutes = completedMinutes ?? goal.completedMinutes;

    if (minutes < 0) return;

    updateGoalProgress.mutate({
      completedMinutes: minutes,
    });
  };

  const handleQuickProgress = (minutes: number) => {
    if (!goal) return;

    const newProgress =
      goal.completedMinutes + minutes;

    updateGoalProgress.mutate({
      completedMinutes: newProgress,
    });
  };

  if (isGoalLoading || isStreakLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-56 animate-pulse rounded-lg bg-gray-100" />

        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>

        <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Daily Goals
        </h1>

        <p className="mt-1 text-gray-500">
          Build consistency by completing your daily
          learning goals.
        </p>
      </div>

      {/* Streak Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Current Streak
              </p>

              <p className="mt-2 text-3xl font-bold">
                {streak?.currentStreak ?? 0}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                consecutive days
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Longest Streak
              </p>

              <p className="mt-2 text-3xl font-bold">
                {streak?.longestStreak ?? 0}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                personal best
              </p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Completed Days
              </p>

              <p className="mt-2 text-3xl font-bold">
                {streak?.totalCompletedDays ?? 0}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                total goal days
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Goal */}

      {goal ? (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Goal information */}

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Today's Goal
                  </p>

                  <h2 className="text-2xl font-bold">
                    {goal.targetMinutes} minutes
                  </h2>
                </div>
              </div>

              {/* Progress */}

              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {goal.completedMinutes} /{" "}
                    {goal.targetMinutes} minutes
                  </span>

                  <span className="text-sm font-semibold">
                    {progress}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <Clock3 className="h-4 w-4" />

                  {goal.completed ? (
                    <span className="font-medium text-green-600">
                      Goal completed for today!
                    </span>
                  ) : (
                    <span>
                      {remainingMinutes} minutes remaining
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress controls */}

            <div className="w-full lg:max-w-sm">
              <div className="rounded-xl bg-gray-50 p-5">
                <p className="mb-3 text-sm font-medium">
                  Update study time
                </p>

                <input
                  type="number"
                  min={0}
                  value={completedMinutes ?? goal.completedMinutes}
                  onChange={(event) =>
                    setCompletedMinutes(
                      Number(event.target.value)
                    )
                  }
                  placeholder={`${goal.completedMinutes}`}
                  className="w-full rounded-lg border bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
                />

                <Button
                  className="mt-3 w-full"
                  onClick={handleUpdateProgress}
                  disabled={
                    updateGoalProgress.isPending
                  }
                >
                  {updateGoalProgress.isPending
                    ? "Updating..."
                    : "Update Progress"}
                </Button>

                {/* Quick actions */}

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[15, 30, 60].map((minutes) => (
                    <Button
                      key={minutes}
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuickProgress(minutes)
                      }
                      disabled={
                        updateGoalProgress.isPending
                      }
                    >
                      +{minutes}m
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* No goal */

        <section className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Set today's learning goal
            </h2>

            <p className="mt-2 text-gray-500">
              Choose how many minutes you want to spend
              learning today.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="number"
                min={1}
                value={targetMinutes}
                onChange={(event) =>
                  setTargetMinutes(
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                placeholder="Target minutes"
              />

              <Button
                onClick={handleCreateGoal}
                disabled={
                  createGoal.isPending ||
                  targetMinutes <= 0
                }
                className="sm:w-40"
              >
                {createGoal.isPending
                  ? "Creating..."
                  : "Create Goal"}
              </Button>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {[30, 60, 90, 120].map((minutes) => (
                <Button
                  key={minutes}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTargetMinutes(minutes)
                  }
                >
                  {minutes}m
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Goal completion information */}

      {goal?.completed && (
        <section className="rounded-2xl border bg-green-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>

            <div>
              <h3 className="font-semibold text-green-700">
                Daily goal completed
              </h3>

              <p className="mt-1 text-sm text-green-600">
                Great work! Keep the streak going tomorrow.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

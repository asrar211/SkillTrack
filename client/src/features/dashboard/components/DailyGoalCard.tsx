import { Clock3, Target } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import type { DailyGoal } from "../dashboard.types";

interface DailyGoalCardProps {
    goal: DailyGoal | null;
}

function DailyGoalCard({
    goal,
}: DailyGoalCardProps) {
    if (!goal) {
        return (
            <Card className="rounded-2xl border-zinc-200 shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <Target className="size-5" />
                        </div>

                        <div>
                            <CardTitle className="text-lg">
                                Today's Goal
                            </CardTitle>

                            <p className="text-sm text-zinc-500">
                                No goal set for today
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <p className="text-sm text-zinc-500">
                        Set a daily learning target to start
                        tracking your progress.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const progress = Math.min(
        Math.round(
            (goal.completedMinutes /
                goal.targetMinutes) *
                100
        ),
        100
    );

    return (
        <Card className="rounded-2xl border-zinc-200 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                        <Target className="size-5" />
                    </div>

                    <div>
                        <CardTitle className="text-lg">
                            Today's Goal
                        </CardTitle>

                        <p className="text-sm text-zinc-500">
                            Keep your momentum going
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-3xl font-bold">
                            {goal.completedMinutes}
                        </span>

                        <span className="text-zinc-400">
                            /{goal.targetMinutes} min
                        </span>
                    </div>

                    <span className="text-sm font-medium text-zinc-500">
                        {progress}%
                    </span>
                </div>

                <Progress
                    value={progress}
                    className="mt-3 h-2"
                />

                <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
                    <Clock3 className="size-4" />

                    {goal.completed
                        ? "Daily goal completed"
                        : `${goal.targetMinutes - goal.completedMinutes} minutes remaining`}
                </div>
            </CardContent>
        </Card>
    );
}

export default DailyGoalCard;
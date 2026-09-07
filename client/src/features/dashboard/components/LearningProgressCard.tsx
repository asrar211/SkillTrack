import { ArrowRight } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface LearningProgressCardProps {
    progress: number;
}
function LearningProgressCard({progress}: LearningProgressCardProps) {
    return (
        <Card className="rounded-2xl border-zinc-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg">
                        Learning Progress
                    </CardTitle>

                    <p className="mt-1 text-sm text-zinc-500">
                        Full-Stack Development
                    </p>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                >
                    View roadmap
                    <ArrowRight className="size-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="font-medium">
                        Overall completion
                    </span>

                    <span className="font-semibold">
                        {progress}%
                    </span>
                </div>

                <Progress value={progress} className="h-2" />

                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-2xl font-bold">17</p>
                        <p className="text-xs text-zinc-500">
                            Completed
                        </p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-xs text-zinc-500">
                            In progress
                        </p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">6</p>
                        <p className="text-xs text-zinc-500">
                            Remaining
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default LearningProgressCard;
import {
  CheckCircle2,
  Circle,
  Clock3,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Topic } from "@/features/topics/topics.types";
import type { TopicProgress } from "@/features/progress/progress.types";

interface SkillTopicsProps {
  topics: Topic[];
  progress: TopicProgress[];
  onUpdateProgress: (
    topicId: string,
    progress: number
  ) => void;
  isUpdating: boolean;
}

export default function SkillTopics({
  topics,
  progress,
  onUpdateProgress,
  isUpdating,
}: SkillTopicsProps) {
  const getTopicProgress = (topicId: string) => {
    return progress.find(
      (item) => item.topicId._id === topicId
    );
  };

  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Learning path
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Work through each topic to build this skill.
        </p>
      </div>

      <div className="space-y-3">
        {topics.map((topic, index) => {
          const topicProgress =
            getTopicProgress(topic._id);

          const currentProgress =
            topicProgress?.progress ?? 0;

          const completed =
            currentProgress === 100;

          return (
            <div
              key={topic._id}
              className="rounded-2xl border p-4 transition hover:border-gray-300"
            >
              <div className="flex items-start gap-4">
                {/* Step indicator */}
                <div className="flex shrink-0 flex-col items-center">
                  {completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-300" />
                  )}

                  {index < topics.length - 1 && (
                    <div className="mt-2 h-8 w-px bg-gray-200" />
                  )}
                </div>

                {/* Topic */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Topic {index + 1}
                      </p>

                      <h3 className="mt-0.5 font-semibold">
                        {topic.name}
                      </h3>

                      {topic.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {topic.description}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 text-sm font-semibold">
                      {currentProgress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-pink-500 to-purple-500 transition-all duration-500"
                      style={{
                        width: `${currentProgress}%`,
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="mt-4">
                    {currentProgress === 0 && (
                      <Button
                        size="sm"
                        onClick={() =>
                          onUpdateProgress(
                            topic._id,
                            10
                          )
                        }
                        disabled={isUpdating}
                      >
                        <Play className="mr-2 h-3.5 w-3.5" />
                        Start
                      </Button>
                    )}

                    {currentProgress > 0 &&
                      currentProgress < 100 && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              onUpdateProgress(
                                topic._id,
                                Math.min(
                                  currentProgress + 10,
                                  100
                                )
                              )
                            }
                            disabled={isUpdating}
                          >
                            Continue
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              onUpdateProgress(
                                topic._id,
                                100
                              )
                            }
                            disabled={isUpdating}
                          >
                            Complete
                          </Button>
                        </div>
                      )}

                    {completed && (
                      <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </div>
                    )}
                  </div>

                  {topicProgress?.startedAt && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                      <Clock3 className="h-3 w-3" />
                      Started
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
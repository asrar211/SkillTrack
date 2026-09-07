import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Circle,
  RotateCcw,
} from "lucide-react";

import { useDSAProblem } from "@/features/dsa/hooks/useDSAProblem";
import { useDSAProgress } from "@/features/dsa/hooks/useDSAProgress";
import { useUpdateDSAProgress } from "@/features/dsa/hooks/useUpdateDSAProgress";

const difficultyStyles = {
  easy: "text-green-600 bg-green-50",
  medium: "text-yellow-600 bg-yellow-50",
  hard: "text-red-600 bg-red-50",
};

export default function DSAProblemDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: problemResponse,
    isLoading: isProblemLoading,
    isError: isProblemError,
  } = useDSAProblem(id ?? "");

  const { data: progressResponse } = useDSAProgress();
  const updateProgress = useUpdateDSAProgress();

  const problem = problemResponse?.data;

  const currentProgress = progressResponse?.data?.find((item) => {
    const problemId =
      typeof item.problemId === "string"
        ? item.problemId
        : item.problemId._id;

    return problemId === id;
  });

  const [attempts, setAttempts] = useState<number | null>(null);
  const [notes, setNotes] = useState<string | null>(null);

  if (isProblemLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">
          Loading problem...
        </p>
      </div>
    );
  }

  if (isProblemError || !problem) {
    return (
      <div className="space-y-4">
        <Link
          to="/dsa"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to DSA
        </Link>

        <div className="rounded-xl border p-8 text-center">
          <p className="text-muted-foreground">
            Problem not found.
          </p>
        </div>
      </div>
    );
  }

  const status = currentProgress?.status ?? "not-started";
  const currentAttempts = attempts ?? currentProgress?.attempts ?? 0;
  const currentNotes = notes ?? currentProgress?.notes ?? "";

  const handleStatusChange = (
    newStatus: "not-started" | "attempted" | "solved"
  ) => {
    updateProgress.mutate({
      problemId: problem._id,
      status: newStatus,
      attempts: currentAttempts,
      notes: currentNotes,
    });
  };

  const handleSaveProgress = () => {
    updateProgress.mutate({
      problemId: problem._id,
      status,
      attempts: currentAttempts,
      notes: currentNotes,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/dsa"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to DSA
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  difficultyStyles[problem.difficulty]
                }`}
              >
                {problem.difficulty}
              </span>

              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                {problem.platform}
              </span>

              {status === "solved" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                  <CheckCircle2 size={14} />
                  Solved
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {problem.title}
            </h1>

            {problem.description && (
              <p className="max-w-3xl text-muted-foreground">
                {problem.description}
              </p>
            )}
          </div>

          <a
            href={problem.problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Solve Problem
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Topics */}
          <section className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Topics
            </h2>

            <div className="flex flex-wrap gap-2">
              {problem.topics.length > 0 ? (
                problem.topics.map((topic) => (
                  <span
                    key={topic._id}
                    className="rounded-md border bg-muted/40 px-3 py-1.5 text-sm"
                  >
                    {topic.name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No topics assigned.
                </p>
              )}
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Notes
            </h2>

            <textarea
              value={currentNotes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Write your approach, mistakes, or important insights..."
              rows={6}
              className="w-full resize-none rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </section>
        </div>

        {/* Progress sidebar */}
        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <h2 className="mb-5 text-lg font-semibold">
              Your Progress
            </h2>

            <div className="space-y-5">
              {/* Status */}
              <div>
                <p className="mb-3 text-sm font-medium">
                  Status
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => handleStatusChange("not-started")}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition ${
                      status === "not-started"
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Circle size={17} />
                    Not Started
                  </button>

                  <button
                    onClick={() => handleStatusChange("attempted")}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition ${
                      status === "attempted"
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                  >
                    <RotateCcw size={17} />
                    Attempted
                  </button>

                  <button
                    onClick={() => handleStatusChange("solved")}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition ${
                      status === "solved"
                        ? "border-green-500 bg-green-50"
                        : "hover:bg-muted"
                    }`}
                  >
                    <CheckCircle2 size={17} />
                    Solved
                  </button>
                </div>
              </div>

              {/* Attempts */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Attempts
                </label>

                <input
                  type="number"
                  min={0}
                  value={currentAttempts}
                  onChange={(event) =>
                    setAttempts(Number(event.target.value))
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                onClick={handleSaveProgress}
                disabled={updateProgress.isPending}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {updateProgress.isPending
                  ? "Saving..."
                  : "Save Progress"}
              </button>
            </div>
          </section>

          {/* Problem metadata */}
          <section className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">
              Problem Info
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Platform
                </span>
                <span className="font-medium capitalize">
                  {problem.platform}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Difficulty
                </span>
                <span className="font-medium capitalize">
                  {problem.difficulty}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Attempts
                </span>
                <span className="font-medium">
                  {currentAttempts}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

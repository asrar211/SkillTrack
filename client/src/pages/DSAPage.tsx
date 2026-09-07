import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Plus,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useDSAProblems } from "@/features/dsa/hooks/useDSAProblems";
import { useDSATopics } from "@/features/dsa/hooks/useDSATopics";
import { useDSAProgress } from "@/features/dsa/hooks/useDSAProgress";
import { useDSASummary } from "@/features/dsa/hooks/useDSASummary";
import { useUpdateDSAProgress } from "@/features/dsa/hooks/useUpdateDSAProgress";
import AddDSAProblemDialog from "@/features/dsa/components/AddDSAProblemDialog";

import type {
  DSAProgressStatus,
} from "@/features/dsa/dsa.types";

export default function DSAPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(1);
  const [isAddProblemOpen, setIsAddProblemOpen] = useState(false);

  const limit = 20;

  const {
    data: problemsData,
    isLoading: isProblemsLoading,
  } = useDSAProblems({
    search: search || undefined,
    platform: platform || undefined,
    difficulty: difficulty || undefined,
    topic: topic || undefined,
    page,
    limit,
  });

  const { data: topicsData } = useDSATopics();

  const { data: progressData } = useDSAProgress();

  const { data: summaryData } = useDSASummary();

  const updateProgress = useUpdateDSAProgress();

  const problems = problemsData?.data ?? [];
  const topics = topicsData?.data ?? [];
  const summary = summaryData?.data;

  /*
   * Convert the user's progress array into a Map.
   *
   * Instead of repeatedly doing:
   *
   * progress.find(...)
   *
   * for every problem, we create:
   *
   * problemId -> status
   *
   * This makes status lookup simple and efficient.
   */
  const progressMap = useMemo(() => {
    const map = new Map<string, DSAProgressStatus>();

    for (const item of progressData?.data ?? []) {
      const problemId =
        typeof item.problemId === "string"
          ? item.problemId
          : item.problemId._id;

      map.set(problemId, item.status);
    }

    return map;
  }, [progressData?.data]);

  const handleStatusChange = (
    problemId: string,
    status: DSAProgressStatus
  ) => {
    updateProgress.mutate({
      problemId,
      status,
    });
  };

  /*
   * The backend's `summary.total` means:
   *
   * number of problems the user has tracked.
   *
   * Therefore:
   *
   * Remaining = Tracked - Solved - Attempted
   *
   * "Not started" progress records are included in tracked.
   */
  const remaining = summary
    ? Math.max(
        summary.total -
          summary.solved -
          summary.attempted,
        0
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">DSA Practice</h1><p className="mt-1 text-gray-500">Track problems, attempts and solved questions.</p></div>
        <Button onClick={() => setIsAddProblemOpen(true)}><Plus className="mr-2 h-4 w-4" />Add problem</Button>
      </div>

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Tracked
          </p>

          <p className="mt-1 text-2xl font-bold">
            {summary?.total ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Solved
          </p>

          <p className="mt-1 text-2xl font-bold">
            {summary?.solved ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Attempted
          </p>

          <p className="mt-1 text-2xl font-bold">
            {summary?.attempted ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Not Started
          </p>

          <p className="mt-1 text-2xl font-bold">
            {remaining}
          </p>
        </div>
      </div>

      {/* Filters */}

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search problems..."
              className="w-full rounded-lg border bg-white py-3 pl-9 pr-4 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Platform */}

          <select
            value={platform}
            onChange={(event) => {
              setPlatform(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">
              All platforms
            </option>

            <option value="leetcode">
              LeetCode
            </option>

            <option value="codeforces">
              Codeforces
            </option>

            <option value="codechef">
              CodeChef
            </option>

            <option value="geeksforgeeks">
              GeeksForGeeks
            </option>

            <option value="hackerrank">
              HackerRank
            </option>

            <option value="atcoder">
              AtCoder
            </option>

            <option value="other">
              Other
            </option>
          </select>

          {/* Difficulty */}

          <select
            value={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">
              All difficulties
            </option>

            <option value="easy">
              Easy
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="hard">
              Hard
            </option>
          </select>

          {/* Topic */}

          <select
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">
              All topics
            </option>

            {topics.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Problems */}

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        {isProblemsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-xl bg-gray-100"
                />
              )
            )}
          </div>
        ) : problems.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-medium">
              No problems found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map((problem) => {
              const status =
                progressMap.get(problem._id) ??
                "not-started";

              return (
                <div
                  key={problem._id}
                  className="rounded-xl border p-4 transition hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    {/* Problem */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/dsa/${problem._id}`
                            )
                          }
                          className="text-left font-medium hover:underline"
                        >
                          {problem.title}
                        </button>

                        {/* Difficulty */}

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                            problem.difficulty ===
                            "easy"
                              ? "bg-green-50 text-green-600"
                              : problem.difficulty ===
                                "medium"
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {problem.difficulty}
                        </span>

                        {/* Platform */}

                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize">
                          {problem.platform}
                        </span>

                        {/* Status */}

                        {status === "solved" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Solved
                          </span>
                        )}

                        {status === "attempted" && (
                          <span className="rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-600">
                            Attempted
                          </span>
                        )}

                        {status === "not-started" && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
                            Not Started
                          </span>
                        )}
                      </div>

                      {/* Topics */}

                      {problem.topics.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {problem.topics.map(
                            (item) => (
                              <span
                                key={item._id}
                                className="text-xs text-gray-500"
                              >
                                #{item.name}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status */}

                    <select
                      value={status}
                      onChange={(event) =>
                        handleStatusChange(
                          problem._id,
                          event.target
                            .value as DSAProgressStatus
                        )
                      }
                      disabled={
                        updateProgress.isPending
                      }
                      className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="not-started">
                        Not started
                      </option>

                      <option value="attempted">
                        Attempted
                      </option>

                      <option value="solved">
                        Solved
                      </option>
                    </select>

                    {/* External problem */}

                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <a
                        href={problem.problemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {status === "solved" && (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}

                        Solve

                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}

        {problemsData?.pagination && (
          <div className="mt-6 flex items-center justify-between border-t pt-5">
            <p className="text-sm text-gray-500">
              Page{" "}
              {problemsData.pagination.page}{" "}
              of{" "}
              {problemsData.pagination.totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={
                  !problemsData.pagination
                    .hasPreviousPage
                }
                onClick={() =>
                  setPage((current) =>
                    Math.max(current - 1, 1)
                  )
                }
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  !problemsData.pagination
                    .hasNextPage
                }
                onClick={() =>
                  setPage((current) =>
                    current + 1
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </section>

      <AddDSAProblemDialog open={isAddProblemOpen} topics={topics} onClose={() => setIsAddProblemOpen(false)} />
    </div>
  );
}

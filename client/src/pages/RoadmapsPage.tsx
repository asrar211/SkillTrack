import {
  ArrowRight,
  Map,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useRoadmaps } from "@/features/roadmaps/hooks/useRoadmaps";

export default function RoadmapsPage() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useRoadmaps();

  const roadmaps = data?.data ?? [];


  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-48 animate-pulse rounded bg-gray-100" />

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-3xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">
          Unable to load roadmaps
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Something went wrong while loading your
          roadmaps.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-pink-500">
            Your learning journey
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Roadmaps
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Organize your skills into focused learning
            paths and track your progress.
          </p>
        </div>

        <Button onClick={() => navigate("/roadmaps/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create roadmap
        </Button>
      </div>

      {/* Empty state */}
      {roadmaps.length === 0 && (
        <div className="rounded-3xl border border-dashed bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <Map className="h-6 w-6 text-gray-500" />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            No roadmaps yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Create your first learning roadmap to
            organize the skills you want to master.
          </p>

          <Button className="mt-5" onClick={() => navigate("/roadmaps/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first roadmap
          </Button>
        </div>
      )}

      {/* Roadmap cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {roadmaps.map((roadmap) => (
          <button
            key={roadmap._id}
            type="button"
            onClick={() =>
              navigate(`/roadmaps/${roadmap._id}`)
            }
            className="group rounded-3xl border bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50">
                <Map className="h-5 w-5 text-pink-500" />
              </div>

              <ArrowRight className="h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-pink-500" />
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              {roadmap.name}
            </h2>

            {roadmap.description && (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                {roadmap.description}
              </p>
            )}

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <span>
                {roadmap.items.length}{" "}
                {roadmap.items.length === 1
                  ? "item"
                  : "items"}
              </span>

              <span>•</span>

              <span>
                {roadmap.items.filter(
                  (item) =>
                    item.priority === "high"
                ).length}{" "}
                high priority
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

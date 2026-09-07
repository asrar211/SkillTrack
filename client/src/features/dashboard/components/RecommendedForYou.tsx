import {
  ArrowRight,
  Clock3,
  Sparkles,
} from "lucide-react";

import type { LearningRecommendation } from "../dashboard.types";
import { useNavigate } from "react-router-dom";

interface RecommendedForYouProps {
  recommendations: LearningRecommendation[];
}


export default function RecommendedForYou({
  recommendations,
}: RecommendedForYouProps) {

  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-50">
              <Sparkles className="h-4 w-4 text-pink-500" />
            </div>

            <span className="text-sm font-medium text-pink-500">
              AI powered
            </span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight">
            Recommended for you
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Skills you should focus on next.
          </p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <p className="font-medium text-gray-900">
            No recommendations yet
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Add a roadmap to start getting personalized recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((recommendation) => (
            <RecommendationItem
              key={recommendation.roadmapItemId}
              recommendation={recommendation}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RecommendationItem({
  recommendation,
}: {
  recommendation: LearningRecommendation;
}) {
  const {
    skill,
    progress,
    status,
    priority,
    estimatedMinutes,
    reason,
  } = recommendation;

  const navigate = useNavigate();
  return (
    <div className="group rounded-2xl border p-4 transition hover:border-pink-200 hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold">
          {skill.name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-gray-900">
              {skill.name}
            </h3>

            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                priority === "high"
                  ? "bg-pink-50 text-pink-600"
                  : priority === "medium"
                    ? "bg-purple-50 text-purple-600"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {priority}
            </span>
          </div>

          <p className="mt-1 line-clamp-1 text-sm text-gray-500">
            {reason}
          </p>

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {estimatedMinutes} min
            </span>

            <span>
              {status === "in-progress"
                ? `${progress}% complete`
                : "Not started"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/skills/${skill._id}`)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border opacity-0 transition group-hover:opacity-100"
          aria-label={`Open ${skill.name}`}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
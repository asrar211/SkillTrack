import {
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useLearningActivities } from "@/features/activity/hooks/useLearningActivities";
import { useLearningProgress, useProgressSummary } from "@/features/progress/hooks/useLearningProgress";
import { useAIRecommendations, useRecommendations } from "@/features/recommendations/hooks/useRecommendations";
import type { LearningProgress } from "@/features/progress/progress.types";

const activityLabels = {
  learning: "Logged learning time",
  "skill-completed": "Completed a skill",
  "dsa-solved": "Solved a DSA problem",
  "goal-completed": "Completed a daily goal",
};

function getEntityName(value: LearningProgress["skillId"] | LearningProgress["topicId"]) {
  return typeof value === "string" ? null : value?.name ?? null;
}

function getSkillId(value: LearningProgress["skillId"]) {
  return typeof value === "string" ? value : value._id;
}

export default function InsightsPage() {
  const navigate = useNavigate();
  const { data: summaryData, isLoading: isSummaryLoading } = useProgressSummary();
  const { data: progressData, isLoading: isProgressLoading } = useLearningProgress();
  const { data: recommendationData, isLoading: isRecommendationsLoading } = useRecommendations();
  const { data: activityData, isLoading: isActivityLoading } = useLearningActivities(12);
  const aiRecommendations = useAIRecommendations();

  const summary = summaryData?.data;
  const progress = progressData?.data ?? [];
  const recommendations = recommendationData?.data ?? [];
  const activity = activityData?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-pink-500">Learning intelligence</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Insights</h1>
          <p className="mt-2 max-w-2xl text-zinc-500">
            See your learning momentum, prioritize the right next skill, and get a focused coaching plan.
          </p>
        </div>
        <Button
          onClick={() => aiRecommendations.mutate()}
          disabled={aiRecommendations.isPending || recommendations.length === 0}
        >
          <Sparkles className="size-4" />
          {aiRecommendations.isPending ? "Creating your plan..." : "Generate coaching plan"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Target} label="Overall progress" value={isSummaryLoading ? "—" : `${summary?.overallProgress ?? 0}%`} accent="bg-pink-50 text-pink-600" />
        <MetricCard icon={CheckCircle2} label="Completed" value={isSummaryLoading ? "—" : summary?.completedItems ?? 0} accent="bg-emerald-50 text-emerald-600" />
        <MetricCard icon={Clock3} label="In progress" value={isSummaryLoading ? "—" : summary?.inProgressItems ?? 0} accent="bg-amber-50 text-amber-600" />
        <MetricCard icon={BrainCircuit} label="Tracked items" value={isSummaryLoading ? "—" : summary?.totalItems ?? 0} accent="bg-violet-50 text-violet-600" />
      </div>

      {aiRecommendations.isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {aiRecommendations.error.message} Your regular recommendations are still available below.
        </div>
      )}

      {aiRecommendations.data && (
        <section className="rounded-3xl border border-violet-100 bg-linear-to-br from-violet-50 via-white to-pink-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-violet-700">Your coaching plan</p>
              <h2 className="mt-1 text-xl font-semibold">{aiRecommendations.data.data.ai.summary}</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {aiRecommendations.data.data.ai.recommendations.map((item) => (
              <article key={item.skill} className="rounded-2xl border border-violet-100 bg-white/90 p-4">
                <h3 className="font-semibold">{item.skill}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{item.why}</p>
                <p className="mt-4 text-sm font-medium text-violet-700">Next: {item.nextStep}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">What to learn next</h2>
              <p className="mt-1 text-sm text-zinc-500">Ordered from your roadmap, priorities, and prerequisites.</p>
            </div>
            <Lightbulb className="size-5 text-amber-500" />
          </div>

          {isRecommendationsLoading ? (
            <div className="mt-6 space-y-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-zinc-100" />)}</div>
          ) : recommendations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed p-8 text-center">
              <p className="font-medium">No recommendations yet</p>
              <p className="mt-1 text-sm text-zinc-500">Create a roadmap with skills to unlock a tailored plan.</p>
              <Button className="mt-4" variant="outline" onClick={() => navigate("/roadmaps/create")}>Create roadmap</Button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {recommendations.map((item) => (
                <button
                  key={item.roadmapItemId}
                  type="button"
                  onClick={() => navigate(`/skills/${item.skill._id}`)}
                  className="group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition hover:border-pink-200 hover:shadow-sm"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 font-semibold text-pink-600">{item.skill.name.charAt(0)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><h3 className="font-semibold">{item.skill.name}</h3><span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs capitalize text-zinc-600">{item.priority}</span></div>
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-500">{item.reason}</p>
                  </div>
                  <span className="text-sm font-semibold text-zinc-700">{item.progress}%</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <p className="mt-1 text-sm text-zinc-500">Your latest learning milestones.</p>
          <div className="mt-6 space-y-4">
            {isActivityLoading ? Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-xl bg-zinc-100" />) : activity.length === 0 ? (
              <p className="rounded-xl bg-zinc-50 p-5 text-sm text-zinc-500">Complete a skill, solve a problem, or finish a goal to start your activity history.</p>
            ) : activity.map((item) => (
              <div key={item._id} className="flex gap-3">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-pink-500" />
                <div><p className="text-sm font-medium">{activityLabels[item.type]}</p><p className="mt-0.5 text-xs text-zinc-500">{new Date(item.createdAt).toLocaleString()}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Progress by item</h2>
        <p className="mt-1 text-sm text-zinc-500">A complete view of every skill and topic you have started.</p>
        {isProgressLoading ? <div className="mt-6 h-48 animate-pulse rounded-2xl bg-zinc-100" /> : progress.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed p-8 text-center"><p className="font-medium">Nothing tracked yet</p><Button className="mt-4" variant="outline" onClick={() => navigate("/skills")}>Explore skills</Button></div>
        ) : (
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {progress.map((item) => {
              const skillName = getEntityName(item.skillId) ?? "Skill";
              const topicName = getEntityName(item.topicId);
              return <button key={item._id} type="button" onClick={() => navigate(`/skills/${getSkillId(item.skillId)}`)} className="rounded-2xl border p-4 text-left transition hover:border-pink-200 hover:shadow-sm">
                <div className="flex items-center justify-between gap-2"><p className="truncate font-semibold">{topicName ? `${skillName} · ${topicName}` : skillName}</p><span className="text-sm font-semibold">{item.progress}%</span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100"><div className="h-full rounded-full bg-linear-to-r from-pink-500 to-violet-500" style={{ width: `${item.progress}%` }} /></div>
                <p className="mt-2 text-xs capitalize text-zinc-500">{item.status.replace("-", " ")}</p>
              </button>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, accent }: { icon: typeof Target; label: string; value: string | number; accent: string }) {
  return <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-zinc-500">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight">{value}</p></div><div className={`rounded-xl p-2.5 ${accent}`}><Icon className="size-5" /></div></div></div>;
}

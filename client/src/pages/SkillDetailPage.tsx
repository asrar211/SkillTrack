import {
  ArrowLeft,
  CheckCircle2,
  Play,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useSkill } from "@/features/skills/hooks/useSkill";

import { useSkillProgress } from "@/features/progress/hooks/useSkillProgress";
import { useTopicProgress } from "@/features/progress/hooks/useTopicProgress";
import { useUpdateProgress } from "@/features/progress/hooks/useUpdateProgress";

import { useTopics } from "@/features/topics/hooks/useTopics";

import SkillTopics from "@/features/skills/components/SkillTopics";
import { useSkillDependencies } from "@/features/dependencies/hooks/useSkillDependencies";

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const skillId = id ?? "";

  // Skill
  const {
    data,
    isLoading,
    isError,
  } = useSkill(skillId);

  // Skill-level progress
  const {
    data: progressData,
    isLoading: isProgressLoading,
  } = useSkillProgress(skillId);

  // Topics
  const {
    data: topicsData,
    isLoading: isTopicsLoading,
  } = useTopics(skillId);

  // Topic-level progress
  const {
    data: topicProgressData,
    isLoading: isTopicProgressLoading,
  } = useTopicProgress(skillId);

  // Progress mutation
  const updateProgress = useUpdateProgress();
  const { prerequisites, dependents } = useSkillDependencies(skillId);

  /*
   * Skill-level progress does not have topicId.
   *
   * Topic-level progress has topicId.
   */
  const skillProgress = progressData?.data?.find(
    (item) => !item.topicId
  );

  const progress = skillProgress?.progress ?? 0;

  const topics = topicsData?.data ?? [];

  const topicProgress =
    topicProgressData?.data ?? [];

  // -----------------------------
  // Skill progress handlers
  // -----------------------------

  const handleStartLearning = () => {
    updateProgress.mutate({
      skillId: skillId,
      progress: 10,
    });
  };

  const handleContinueLearning = () => {
    updateProgress.mutate({
      skillId: skillId,
      progress: Math.min(progress + 10, 100),
    });
  };

  const handleComplete = () => {
    updateProgress.mutate({
      skillId: skillId,
      progress: 100,
    });
  };

  // -----------------------------
  // Topic progress handler
  // -----------------------------

  const handleTopicProgress = (
    topicId: string,
    topicProgress: number
  ) => {
    updateProgress.mutate({
      skillId: skillId,
      topicId,
      progress: topicProgress,
    });
  };

  // -----------------------------
  // Loading
  // -----------------------------

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-24 animate-pulse rounded bg-gray-100" />

        <div className="h-40 animate-pulse rounded-3xl bg-gray-100" />

        <div className="h-48 animate-pulse rounded-3xl bg-gray-100" />

        <div className="h-64 animate-pulse rounded-3xl bg-gray-100" />
      </div>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------

  if (isError || !data?.data) {
    return (
      <div className="rounded-3xl border bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">
          Skill not found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          We couldn't load this skill.
        </p>

        <Button
          className="mt-5"
          onClick={() => navigate("/skills")}
        >
          Back to skills
        </Button>
      </div>
    );
  }

  const skill = data.data;

  return (
    <div className="space-y-6">
      {/* -------------------------------- */}
      {/* Back */}
      {/* -------------------------------- */}

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* -------------------------------- */}
      {/* Skill Header */}
      {/* -------------------------------- */}

      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex items-start gap-5">
          {/* Skill Icon */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-xl font-semibold">
            {skill.icon ? (
              <span>{skill.icon.charAt(0).toUpperCase()}</span>
            ) : (
              <span>
                {skill.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Skill Information */}
          <div className="min-w-0">
            {skill.domain && (
              <span className="text-sm font-medium text-pink-500">
                {skill.domain}
              </span>
            )}

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              {skill.name}
            </h1>

            {skill.description && (
              <p className="mt-3 max-w-2xl leading-7 text-gray-500">
                {skill.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Skill Progress */}
      {/* -------------------------------- */}

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              Your progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track your progress while learning this
              skill.
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold">
              {isProgressLoading
                ? "..."
                : `${progress}%`}
            </p>

            <p className="text-xs text-gray-500">
              completed
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-pink-500 to-purple-500 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Actions */}
        <div className="mt-6">
          {progress === 0 && (
            <Button
              onClick={handleStartLearning}
              disabled={updateProgress.isPending}
            >
              <Play className="mr-2 h-4 w-4" />

              {updateProgress.isPending
                ? "Starting..."
                : "Start learning"}
            </Button>
          )}

          {progress > 0 && progress < 100 && (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleContinueLearning}
                disabled={updateProgress.isPending}
              >
                {updateProgress.isPending
                  ? "Updating..."
                  : "Continue learning"}
              </Button>

              <Button
                variant="outline"
                onClick={handleComplete}
                disabled={updateProgress.isPending}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark complete
              </Button>
            </div>
          )}

          {progress === 100 && (
            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Skill completed
            </div>
          )}
        </div>
      </section>

      {!isTopicsLoading &&
        !isTopicProgressLoading && (
          <SkillTopics
            topics={topics}
            progress={topicProgress}
            onUpdateProgress={handleTopicProgress}
            isUpdating={updateProgress.isPending}
          />
        )}

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">Skill connections</h2>
          <p className="mt-1 text-sm text-gray-500">
            Understand what to learn first and which skills this one unlocks.
          </p>
        </div>

        {prerequisites.isLoading || dependents.isLoading ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ConnectionGroup
              title="Learn first"
              empty="This skill has no prerequisites."
              skills={(prerequisites.data?.data ?? []).flatMap((item) => item.prerequisiteSkillId ? [item.prerequisiteSkillId] : [])}
              onOpen={(dependencyId) => navigate(`/skills/${dependencyId}`)}
            />
            <ConnectionGroup
              title="Unlocks next"
              empty="No dependent skills have been added yet."
              skills={(dependents.data?.data ?? []).flatMap((item) => {
                const dependent = item.skillId ?? item.dependentSkillId;
                return dependent ? [dependent] : [];
              })}
              onOpen={(dependencyId) => navigate(`/skills/${dependencyId}`)}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function ConnectionGroup({ title, empty, skills, onOpen }: { title: string; empty: string; skills: Array<{ _id: string; name: string; domain?: string }>; onOpen: (id: string) => void }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {skills.length === 0 ? <p className="mt-3 text-sm text-gray-500">{empty}</p> : <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((dependency) => <button key={dependency._id} type="button" onClick={() => onOpen(dependency._id)} className="rounded-full border bg-white px-3 py-1.5 text-sm font-medium transition hover:border-pink-200 hover:text-pink-600">{dependency.name}</button>)}
      </div>}
    </div>
  );
}

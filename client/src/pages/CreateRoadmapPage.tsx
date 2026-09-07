import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useSkills } from "@/features/skills/hooks/useSkills";
import { useTopics } from "@/features/topics/hooks/useTopics";
import { useCreateRoadmap } from "@/features/roadmaps/hooks/useCreateRoadmap";

import type {
  CreateRoadmapItemPayload,
  RoadmapPriority,
} from "@/features/roadmaps/roadmaps.types";

interface DraftRoadmapItem extends CreateRoadmapItemPayload {
  tempId: string;
}

export default function CreateRoadmapPage() {
  const navigate = useNavigate();

  const { data: skillsData, isLoading: isSkillsLoading } = useSkills();

  const createRoadmap = useCreateRoadmap();

  const skills = skillsData?.data;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const [priority, setPriority] =
    useState<RoadmapPriority>("medium");

  const [estimatedMinutes, setEstimatedMinutes] = useState(0);

  const [items, setItems] = useState<DraftRoadmapItem[]>([]);

  const {
    data: topicsData,
    isLoading: isTopicsLoading,
  } = useTopics(selectedSkillId);

  const topics = topicsData?.data;

  const selectedSkill = useMemo(
    () => skills?.find((skill) => skill._id === selectedSkillId),
    [skills, selectedSkillId]
  );

  const selectedTopic = useMemo(
    () => topics?.find((topic) => topic._id === selectedTopicId),
    [topics, selectedTopicId]
  );

  const handleSkillChange = (skillId: string) => {
    setSelectedSkillId(skillId);

    // A topic belongs to a specific skill,
    // so changing the skill invalidates the selected topic.
    setSelectedTopicId("");
  };

  const handleAddItem = () => {
    if (!selectedSkillId) return;

    const newItem: DraftRoadmapItem = {
      tempId: crypto.randomUUID(),
      skillId: selectedSkillId,
      topicId: selectedTopicId || undefined,
      order: items.length,
      priority,
      estimatedMinutes,
    };

    setItems((current) => [...current, newItem]);

    setSelectedSkillId("");
    setSelectedTopicId("");
    setPriority("medium");
    setEstimatedMinutes(0);
  };

  const handleRemoveItem = (tempId: string) => {
    setItems((current) =>
      current
        .filter((item) => item.tempId !== tempId)
        .map((item, index) => ({
          ...item,
          order: index,
        }))
    );
  };

  const handleCreateRoadmap = () => {
    if (!name.trim()) return;

    createRoadmap.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        items: items.map((item) => ({
          skillId: item.skillId,
          topicId: item.topicId,
          order: item.order,
          priority: item.priority,
          estimatedMinutes: item.estimatedMinutes,
          targetDate: item.targetDate,
          notes: item.notes,
        })),
      },
      {
        onSuccess: (response) => {
          navigate(`/roadmaps/${response.data._id}`);
        },
      }
    );
  };

  const isFormValid =
    name.trim().length > 0 &&
    items.length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/roadmaps")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-3xl font-bold">
            Create Roadmap
          </h1>

          <p className="mt-1 text-muted-foreground">
            Build a personalized learning path.
          </p>
        </div>
      </div>

      {/* Basic Information */}

      <section className="rounded-xl border bg-card p-6">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Roadmap Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Full Stack Developer"
              className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe what you want to achieve..."
              rows={4}
              className="w-full resize-none rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2"
            />
          </div>
        </div>
      </section>

      {/* Add Roadmap Item */}

      <section className="rounded-xl border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Add Learning Item
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose a skill and optionally a topic.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Skill */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Skill
            </label>

            <select
              value={selectedSkillId}
              onChange={(event) =>
                handleSkillChange(event.target.value)
              }
              disabled={isSkillsLoading}
              className="w-full rounded-lg border bg-background px-4 py-3"
            >
              <option value="">
                Select a skill
              </option>

              {skills?.map((skill) => (
                <option
                  key={skill._id}
                  value={skill._id}
                >
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Topic
            </label>

            <select
              value={selectedTopicId}
              onChange={(event) =>
                setSelectedTopicId(event.target.value)
              }
              disabled={
                !selectedSkillId ||
                isTopicsLoading
              }
              className="w-full rounded-lg border bg-background px-4 py-3"
            >
              <option value="">
                {selectedSkillId
                  ? "Optional topic"
                  : "Select a skill first"}
              </option>

              {topics?.map((topic) => (
                <option
                  key={topic._id}
                  value={topic._id}
                >
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Priority
            </label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as RoadmapPriority
                )
              }
              className="w-full rounded-lg border bg-background px-4 py-3"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Estimated Minutes */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Estimated Minutes
            </label>

            <input
              type="number"
              min={0}
              value={estimatedMinutes}
              onChange={(event) =>
                setEstimatedMinutes(
                  Math.max(
                    0,
                    Number(event.target.value)
                  )
                )
              }
              className="w-full rounded-lg border bg-background px-4 py-3"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={handleAddItem}
            disabled={!selectedSkillId}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {selectedSkill && (
          <p className="mt-3 text-right text-sm text-muted-foreground">
            {selectedSkill.name}
            {selectedTopic
              ? ` → ${selectedTopic.name}`
              : ""}
          </p>
        )}
      </section>

      {/* Roadmap Items */}

      <section className="rounded-xl border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Roadmap Items
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {items.length}{" "}
            {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="text-muted-foreground">
              No learning items added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const skill = skills?.find(
                (skill) =>
                  skill._id === item.skillId
              );

              return (
                <div
                  key={item.tempId}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-medium">
                        {skill?.name ?? "Unknown skill"}
                      </p>

                      <div className="mt-1 flex gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">
                          {item.priority}
                        </span>

                        <span>•</span>

                        <span>
                          {item.estimatedMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleRemoveItem(item.tempId)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Create */}

      <div className="flex justify-end gap-3 pb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/roadmaps")}
        >
          Cancel
        </Button>

        <Button
          onClick={handleCreateRoadmap}
          disabled={
            !isFormValid ||
            createRoadmap.isPending
          }
        >
          {createRoadmap.isPending
            ? "Creating..."
            : "Create Roadmap"}
        </Button>
      </div>

      {createRoadmap.isError && (
        <p className="pb-8 text-right text-sm text-destructive">
          Failed to create roadmap. Please try again.
        </p>
      )}
    </div>
  );
}

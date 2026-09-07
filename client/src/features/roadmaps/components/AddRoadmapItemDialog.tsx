import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useSkills } from "@/features/skills/hooks/useSkills";
import { useTopics } from "@/features/topics/hooks/useTopics";

import { useAddRoadmapItem } from "../hooks/useAddRoadmapItem";

import type { RoadmapPriority } from "../roadmaps.types";

interface AddRoadmapItemDialogProps {
  roadmapId: string;
  open: boolean;
  onClose: () => void;
}

export default function AddRoadmapItemDialog({
  roadmapId,
  open,
  onClose,
}: AddRoadmapItemDialogProps) {
  const { data: skillsData } = useSkills();

  const skills = skillsData?.data ?? [];

  const addRoadmapItem = useAddRoadmapItem();

  const [skillId, setSkillId] = useState("");
  const [topicId, setTopicId] = useState("");

  const [priority, setPriority] =
    useState<RoadmapPriority>("medium");

  const [estimatedMinutes, setEstimatedMinutes] =
    useState(0);

  const [targetDate, setTargetDate] =
    useState("");

  const [notes, setNotes] = useState("");

  const {
    data: topicsData,
    isLoading: isTopicsLoading,
  } = useTopics(skillId);

  const topics = topicsData?.data ?? [];

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (addRoadmapItem.isPending) return;
    setSkillId("");
    setTopicId("");
    setPriority("medium");
    setEstimatedMinutes(0);
    setTargetDate("");
    setNotes("");
    onClose();
  };

  const handleSkillChange = (value: string) => {
    setSkillId(value);

    // Topic belongs to the selected skill.
    setTopicId("");
  };

  const handleSubmit = () => {
    if (!skillId) {
      return;
    }

    addRoadmapItem.mutate(
      {
        roadmapId,

        payload: {
          skillId,

          topicId: topicId || undefined,

          priority,

          estimatedMinutes,

          targetDate:
            targetDate || undefined,

          notes:
            notes.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-semibold">
            Add learning item
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add another skill or topic to this roadmap.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {/* Skill */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Skill
            </label>

            <select
              value={skillId}
              onChange={(event) =>
                handleSkillChange(
                  event.target.value
                )
              }
              className="w-full rounded-lg border bg-white px-4 py-3"
            >
              <option value="">
                Select a skill
              </option>

              {skills.map((skill) => (
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
              value={topicId}
              onChange={(event) =>
                setTopicId(event.target.value)
              }
              disabled={
                !skillId ||
                isTopicsLoading
              }
              className="w-full rounded-lg border bg-white px-4 py-3"
            >
              <option value="">
                {!skillId
                  ? "Select a skill first"
                  : isTopicsLoading
                    ? "Loading topics..."
                    : "Optional topic"}
              </option>

              {topics.map((topic) => (
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
                  event.target
                    .value as RoadmapPriority
                )
              }
              className="w-full rounded-lg border bg-white px-4 py-3"
            >
              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>
          </div>

          {/* Estimated time */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Estimated minutes
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
              className="w-full rounded-lg border bg-white px-4 py-3"
            />
          </div>

          {/* Target date */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Target date
            </label>

            <input
              type="date"
              value={targetDate}
              onChange={(event) =>
                setTargetDate(
                  event.target.value
                )
              }
              className="w-full rounded-lg border bg-white px-4 py-3"
            />
          </div>

          {/* Notes */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={3}
              placeholder="Optional notes..."
              className="w-full resize-none rounded-lg border bg-white px-4 py-3"
            />
          </div>
        </div>

        {/* Actions */}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={
              addRoadmapItem.isPending
            }
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              !skillId ||
              addRoadmapItem.isPending
            }
          >
            {addRoadmapItem.isPending
              ? "Adding..."
              : "Add item"}
          </Button>
        </div>

        {addRoadmapItem.isError && (
          <p className="mt-4 text-sm text-destructive">
            Failed to add the roadmap item.
          </p>
        )}
      </div>
    </div>
  );
}

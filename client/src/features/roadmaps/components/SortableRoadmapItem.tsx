// The error means your existing SortableRoadmapItemProps
// does not define `onRemove`.
//
// Fix it by updating:
//
// src/features/roadmaps/components/SortableRoadmapItem.tsx

import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CheckCircle2,
  Circle,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  RoadmapProgressItem,
} from "../roadmaps.types";

interface SortableRoadmapItemProps {
  item: RoadmapProgressItem;
  onRemove: () => void;
  isRemoving?: boolean;
  onEdit?: () => void;
}

export default function SortableRoadmapItem({
  item,
  onRemove,
  isRemoving = false,
  onEdit,
}: SortableRoadmapItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.itemId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border bg-white p-4 ${
        isDragging
          ? "relative z-10 shadow-lg"
          : ""
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}

        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-gray-400 hover:text-gray-700 active:cursor-grabbing"
          aria-label="Reorder roadmap item"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Status */}

        <div className="shrink-0">
          {item.status === "completed" ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-300" />
          )}
        </div>

        {/* Content */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">
              {item.skill.name}
            </h3>

            {item.topic && (
              <span className="text-sm text-gray-500">
                / {item.topic.name}
              </span>
            )}

            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize">
              {item.priority}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span>
              {item.progress}% complete
            </span>

            <span>
              {item.estimatedMinutes} min
            </span>

            <span className="capitalize">
              {item.status.replace("-", " ")}
            </span>
          </div>

          {/* Progress */}

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${Math.min(
                  Math.max(item.progress, 0),
                  100
                )}%`,
              }}
            />
          </div>

          {item.notes && (
            <p className="mt-3 text-sm text-gray-500">
              {item.notes}
            </p>
          )}
        </div>

        {/* Actions */}

        <div className="flex shrink-0 items-center gap-2">
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            disabled={isRemoving}
          >
            <Trash2 className="mr-2 h-4 w-4" />

            {isRemoving
              ? "Removing..."
              : "Remove"}
          </Button>
        </div>
      </div>
    </div>
  );
}
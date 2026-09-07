// src/pages/RoadmapDetailPage.tsx

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useRoadmapById } from "@/features/roadmaps/hooks/useRoadmapById";
import { useRoadmapProgress } from "@/features/roadmaps/hooks/useRoadmapProgress";
import { useReorderRoadmapItems } from "@/features/roadmaps/hooks/useReorderRoadmapItems";
import { useRemoveRoadmapItem } from "@/features/roadmaps/hooks/useRemoveRoadmapItem";
import { useDeleteRoadmap } from "@/features/roadmaps/hooks/useDeleteRoadmap";

import SortableRoadmapItem from "@/features/roadmaps/components/SortableRoadmapItem";
import RoadmapProgressBar from "@/features/roadmaps/components/RoadmapProgressBar";
import RoadmapStats from "@/features/roadmaps/components/RoadmapStats";
import AddRoadmapItemDialog from "@/features/roadmaps/components/AddRoadmapItemDialog";
import EditRoadmapItemDialog from "@/features/roadmaps/components/EditRoadmapItemDialog";
import type { RoadmapProgressItem } from "@/features/roadmaps/roadmaps.types";

export default function RoadmapDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: roadmapData,
    isLoading: isRoadmapLoading,
    isError: isRoadmapError,
  } = useRoadmapById(id ?? "");

  const {
    data: progressData,
    isLoading: isProgressLoading,
  } = useRoadmapProgress(id ?? "");

  const reorderMutation =
    useReorderRoadmapItems();

  const removeMutation =
    useRemoveRoadmapItem();
  const deleteMutation = useDeleteRoadmap();

  const roadmap = roadmapData?.data;
  const roadmapProgress = progressData?.data;

  const [orderedItems, setOrderedItems] = useState(
    roadmapProgress?.items ?? []
  );
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RoadmapProgressItem | null>(null);

  const roadmapItemsSignature = (roadmapProgress?.items ?? [])
    .map((item) => `${item.itemId}:${item.order}:${item.progress}:${item.status}:${item.priority}:${item.estimatedMinutes}:${item.targetDate}:${item.notes}`)
    .join("|");
  const [syncedSignature, setSyncedSignature] = useState(roadmapItemsSignature);

  if (syncedSignature !== roadmapItemsSignature) {
    setSyncedSignature(roadmapItemsSignature);
    setOrderedItems(roadmapProgress?.items ?? []);
  }

  if (isRoadmapLoading || isProgressLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-100" />

        <div className="h-36 animate-pulse rounded-2xl bg-gray-100" />

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (
    isRoadmapError ||
    !roadmap ||
    !roadmapProgress
  ) {
    return (
      <div className="space-y-4">
        <Link
          to="/roadmaps"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Roadmaps
        </Link>

        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="font-medium">
            Roadmap not found
          </p>
        </div>
      </div>
    );
  }

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedItems.findIndex(
      (item) => item.itemId === active.id
    );

    const newIndex = orderedItems.findIndex(
      (item) => item.itemId === over.id
    );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    const reordered = arrayMove(
      orderedItems,
      oldIndex,
      newIndex
    ).map((item, index) => ({
      ...item,
      order: index,
    }));

    setOrderedItems(reordered);

    reorderMutation.mutate({
      roadmapId: roadmap._id,
      items: reordered.map((item) => ({
        itemId: item.itemId,
        order: item.order,
      })),
    });
  };

  const handleRemove = (itemId: string) => {
    removeMutation.mutate({
      roadmapId: roadmap._id,
      itemId,
    });
  };

  const handleDeleteRoadmap = () => {
    if (!window.confirm(`Delete “${roadmap.name}”? This cannot be undone.`)) {
      return;
    }

    deleteMutation.mutate(roadmap._id, {
      onSuccess: () => navigate("/roadmaps", { replace: true }),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <Link
          to="/roadmaps"
          className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Roadmaps
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {roadmapProgress.roadmap.name}
            </h1>

            {roadmapProgress.roadmap.description && (
              <p className="mt-2 max-w-2xl text-gray-500">
                {roadmapProgress.roadmap.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setIsAddItemOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button variant="outline" onClick={handleDeleteRoadmap} disabled={deleteMutation.isPending} className="text-red-600 hover:text-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}

      <RoadmapStats
        overallProgress={
          roadmapProgress.overallProgress
        }
        totalItems={
          roadmapProgress.totalItems
        }
        completedItems={
          roadmapProgress.completedItems
        }
        inProgressItems={
          roadmapProgress.inProgressItems
        }
      />

      {/* Overall Progress */}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <RoadmapProgressBar
          progress={
            roadmapProgress.overallProgress
          }
        />
      </section>

      {/* Roadmap Items */}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            Learning Path
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Drag items to change their order.
          </p>
        </div>

        {orderedItems.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-medium">
              No roadmap items
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add a skill or topic to start your roadmap.
            </p>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedItems.map(
                (item) => item.itemId
              )}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {orderedItems.map((item) => (
                  <SortableRoadmapItem
                    key={item.itemId}
                    item={item}
                    onRemove={() =>
                      handleRemove(item.itemId)
                    }
                    isRemoving={
                      removeMutation.isPending
                    }
                    onEdit={() => setItemToEdit(item)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>

      <AddRoadmapItemDialog
        roadmapId={roadmap._id}
        open={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
      />
      <EditRoadmapItemDialog
        roadmapId={roadmap._id}
        item={itemToEdit}
        open={Boolean(itemToEdit)}
        onClose={() => setItemToEdit(null)}
      />
    </div>
  );
}

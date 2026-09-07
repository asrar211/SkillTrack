import { useState, type ReactNode } from "react";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUpdateRoadmapItem } from "@/features/roadmaps/hooks/useUpdateRoadmapItem";
import type { RoadmapPriority, RoadmapProgressItem } from "@/features/roadmaps/roadmaps.types";

interface EditRoadmapItemDialogProps {
  roadmapId: string;
  item: RoadmapProgressItem | null;
  open: boolean;
  onClose: () => void;
}

export default function EditRoadmapItemDialog({ roadmapId, item, open, onClose }: EditRoadmapItemDialogProps) {
  if (!open || !item) return null;

  return <EditRoadmapItemForm key={item.itemId} roadmapId={roadmapId} item={item} onClose={onClose} />;
}

function EditRoadmapItemForm({ roadmapId, item, onClose }: { roadmapId: string; item: RoadmapProgressItem; onClose: () => void }) {
  const updateRoadmapItem = useUpdateRoadmapItem();
  const [priority, setPriority] = useState<RoadmapPriority>(item.priority);
  const [estimatedMinutes, setEstimatedMinutes] = useState(item.estimatedMinutes);
  const [targetDate, setTargetDate] = useState(item.targetDate?.slice(0, 10) ?? "");
  const [notes, setNotes] = useState(item.notes ?? "");

  const handleSubmit = () => {
    updateRoadmapItem.mutate({
      roadmapId,
      itemId: item.itemId,
      payload: { priority, estimatedMinutes, targetDate: targetDate || null, notes: notes.trim() || undefined },
    }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-roadmap-item-title">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-xl">
        <div><h2 id="edit-roadmap-item-title" className="text-xl font-semibold">Edit roadmap item</h2><p className="mt-1 text-sm text-gray-500">{item.skill.name}{item.topic ? ` · ${item.topic.name}` : ""}</p></div>
        <div className="mt-6 space-y-5">
          <FormField label="Priority"><select value={priority} onChange={(event) => setPriority(event.target.value as RoadmapPriority)} className="w-full rounded-lg border bg-white px-4 py-3"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></FormField>
          <FormField label="Estimated minutes"><input type="number" min={0} value={estimatedMinutes} onChange={(event) => setEstimatedMinutes(Math.max(0, Number(event.target.value)))} className="w-full rounded-lg border bg-white px-4 py-3" /></FormField>
          <FormField label="Target date" icon={<CalendarDays className="h-4 w-4" />}><input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} className="w-full rounded-lg border bg-white px-4 py-3" /></FormField>
          <FormField label="Notes"><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Add notes for this learning item..." className="w-full resize-none rounded-lg border bg-white px-4 py-3" /></FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={onClose} disabled={updateRoadmapItem.isPending}>Cancel</Button><Button onClick={handleSubmit} disabled={updateRoadmapItem.isPending}>{updateRoadmapItem.isPending ? "Saving..." : "Save changes"}</Button></div>
        {updateRoadmapItem.isError && <p className="mt-4 text-sm text-destructive">{updateRoadmapItem.error.message}</p>}
      </div>
    </div>
  );
}

function FormField({ label, icon, children }: { label: string; icon?: ReactNode; children: ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center gap-2 text-sm font-medium">{icon}{label}</span>{children}</label>;
}

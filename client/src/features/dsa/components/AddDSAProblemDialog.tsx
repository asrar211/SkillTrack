import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DSATopic } from "../dsa.types";
import { useCreateDSAProblem } from "../hooks/useCreateDSAProblem";

interface AddDSAProblemDialogProps {
  open: boolean;
  topics: DSATopic[];
  onClose: () => void;
}

const slugify = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const fieldClass = "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100";

export default function AddDSAProblemDialog({ open, topics, onClose }: AddDSAProblemDialogProps) {
  const createProblem = useCreateDSAProblem();
  const [title, setTitle] = useState("");
  const [problemUrl, setProblemUrl] = useState("");
  const [platform, setPlatform] = useState<"leetcode" | "codeforces" | "codechef" | "geeksforgeeks" | "hackerrank" | "atcoder" | "other">("leetcode");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [description, setDescription] = useState("");
  const [topicIds, setTopicIds] = useState<string[]>([]);

  if (!open) return null;

  const resetAndClose = () => {
    if (createProblem.isPending) return;
    setTitle("");
    setProblemUrl("");
    setPlatform("leetcode");
    setDifficulty("medium");
    setDescription("");
    setTopicIds([]);
    onClose();
  };

  const toggleTopic = (topicId: string) => {
    setTopicIds((current) => current.includes(topicId)
      ? current.filter((id) => id !== topicId)
      : [...current, topicId]);
  };

  const handleSubmit = () => {
    const slug = slugify(title);
    if (!title.trim() || !problemUrl.trim() || !slug) return;
    createProblem.mutate({
      title: title.trim(),
      slug,
      problemUrl: problemUrl.trim(),
      platform,
      difficulty,
      topics: topicIds,
      description: description.trim() || undefined,
    }, { onSuccess: resetAndClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby="new-problem-title">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><h2 id="new-problem-title" className="text-xl font-semibold">Add a practice problem</h2><p className="mt-1 text-sm text-zinc-500">Save any challenge you want to track in SkillTrack.</p></div>
          <button type="button" onClick={resetAndClose} className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100" aria-label="Close"><X className="size-5" /></button>
        </div>

        <div className="mt-6 space-y-4">
          <Field label="Problem title"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Two Sum" className={fieldClass} autoFocus /></Field>
          <Field label="Problem URL"><input value={problemUrl} onChange={(event) => setProblemUrl(event.target.value)} type="url" placeholder="https://leetcode.com/problems/two-sum" className={fieldClass} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Platform"><select value={platform} onChange={(event) => setPlatform(event.target.value as typeof platform)} className={fieldClass}><option value="leetcode">LeetCode</option><option value="codeforces">Codeforces</option><option value="codechef">CodeChef</option><option value="geeksforgeeks">GeeksForGeeks</option><option value="hackerrank">HackerRank</option><option value="atcoder">AtCoder</option><option value="other">Other</option></select></Field>
            <Field label="Difficulty"><select value={difficulty} onChange={(event) => setDifficulty(event.target.value as typeof difficulty)} className={fieldClass}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></Field>
          </div>
          <Field label="Description (optional)"><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="What should you remember about this problem?" className={`${fieldClass} resize-none`} /></Field>
          <div><p className="text-sm font-medium">Topics</p><div className="mt-2 flex flex-wrap gap-2">{topics.length === 0 ? <p className="text-sm text-zinc-500">No topics have been set up yet.</p> : topics.map((topic) => <button key={topic._id} type="button" onClick={() => toggleTopic(topic._id)} className={`rounded-full border px-3 py-1.5 text-sm transition ${topicIds.includes(topic._id) ? "border-pink-300 bg-pink-50 text-pink-700" : "bg-white hover:border-zinc-300"}`}>{topic.name}</button>)}</div></div>
        </div>

        {createProblem.isError && <p className="mt-4 text-sm text-red-600">{createProblem.error.message}</p>}
        <div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={resetAndClose} disabled={createProblem.isPending}>Cancel</Button><Button onClick={handleSubmit} disabled={!title.trim() || !problemUrl.trim() || createProblem.isPending}>{createProblem.isPending ? "Adding..." : "Add problem"}</Button></div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{children}</label>;
}

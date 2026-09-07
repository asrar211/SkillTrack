// NEXT: Roadmap UI polish + real progress visualization

// src/features/roadmaps/components/RoadmapProgressBar.tsx

interface RoadmapProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

export default function RoadmapProgressBar({
  progress,
  showLabel = true,
}: RoadmapProgressBarProps) {
  const safeProgress = Math.min(
    Math.max(progress, 0),
    100
  );

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Progress
          </span>

          <span className="text-sm font-semibold">
            {safeProgress}%
          </span>
        </div>
      )}

      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{
            width: `${safeProgress}%`,
          }}
        />
      </div>
    </div>
  );
}
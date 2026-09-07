import { Search } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { useSkills } from "@/features/skills/hooks/useSkills";

export default function SkillsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const setSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("search", value);
    } else {
      next.delete("search");
    }
    setSearchParams(next, { replace: true });
  };

  const { data, isLoading, isError } = useSkills();

  const skills = data?.data;

  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();

    const availableSkills = skills ?? [];

    if (!query) {
      return availableSkills;
    }

    return availableSkills.filter((skill) => {
      return (
        skill.name.toLowerCase().includes(query) ||
        skill.domain?.toLowerCase().includes(query) ||
        skill.description?.toLowerCase().includes(query)
      );
    });
  }, [skills, search]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-gray-100" />

        <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-100" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-3xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">
          Unable to load skills
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Something went wrong while fetching your skills.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-pink-500">
          Learning library
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Skills
        </h1>

        <p className="mt-2 max-w-2xl text-gray-500">
          Explore the technologies and skills available in
          your learning journey.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search skills..."
          className="h-12 rounded-2xl border-gray-200 bg-white pl-11"
        />
      </div>

      {/* Empty state */}
      {filteredSkills.length === 0 && (
        <div className="rounded-3xl border border-dashed bg-white p-12 text-center">
          <h2 className="font-semibold">
            No skills found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try searching for another skill or domain.
          </p>
        </div>
      )}

      {/* Skills */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredSkills.map((skill) => (
          <button
            key={skill._id}
            type="button"
            onClick={() => navigate(`/skills/${skill._id}`)}
            className="group rounded-3xl border bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-lg font-semibold transition group-hover:bg-pink-50 group-hover:text-pink-600">
                {skill.name.charAt(0).toUpperCase()}
              </div>

              {skill.domain && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {skill.domain.toLocaleUpperCase()}
                </span>
              )}
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              {skill.name}
            </h2>

            {skill.description && (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                {skill.description}
              </p>
            )}

            <div className="mt-5 text-sm font-medium text-pink-500 opacity-0 transition group-hover:opacity-100">
              View skill →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

import { Search, X } from "lucide-react";
import type { WorkplaceType } from "@/types";
import {
  DEFAULT_FILTERS,
  SALARY_RANGES,
  WORKPLACE_LABELS,
  type JobFilters as Filters,
  type SortOption,
} from "@/lib/jobs";

type JobFiltersProps = {
  filters: Filters;
  locations: string[];
  onChange: (filters: Filters) => void;
};

const selectClass =
  "rounded-lg border border-white/10 bg-black px-3 py-2 text-sm tracking-tight text-zinc-300 outline-none transition-colors hover:border-white/20 focus:border-white/30";

export default function JobFilters({ filters, locations, onChange }: JobFiltersProps) {
  const update = (changes: Partial<Filters>) => onChange({ ...filters, ...changes });

  const toggleWorkplace = (type: WorkplaceType) => {
    const selected = filters.workplaceTypes.includes(type)
      ? filters.workplaceTypes.filter((t) => t !== type)
      : [...filters.workplaceTypes, type];
    update({ workplaceTypes: selected });
  };

  const hasActiveFilters =
    JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search by job title, company or keyword"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pr-4 pl-11 text-sm tracking-tight text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-white/30"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Location"
          value={filters.location}
          onChange={(e) => update({ location: e.target.value })}
          className={selectClass}
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          aria-label="Salary range"
          value={filters.salaryRange}
          onChange={(e) => update({ salaryRange: Number(e.target.value) })}
          className={selectClass}
        >
          {SALARY_RANGES.map((range, index) => (
            <option key={range.label} value={index}>
              {range.label}
            </option>
          ))}
        </select>

        <div className="flex gap-1 rounded-lg border border-white/10 p-1">
          {(Object.keys(WORKPLACE_LABELS) as WorkplaceType[]).map((type) => {
            const active = filters.workplaceTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => toggleWorkplace(type)}
                className={`rounded-md px-3 py-1 text-sm font-medium tracking-tight transition-colors ${
                  active ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                {WORKPLACE_LABELS[type]}
              </button>
            );
          })}
        </div>

        <select
          aria-label="Sort by"
          value={filters.sort}
          onChange={(e) => update({ sort: e.target.value as SortOption })}
          className={`${selectClass} sm:ml-auto`}
        >
          <option value="newest">Newest first</option>
          <option value="salary_high">Salary: high to low</option>
          <option value="salary_low">Salary: low to high</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm tracking-tight text-zinc-500 transition-colors hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { SearchBar } from "./SearchBar";
import { SlidersHorizontal, Camera, Play, Music2 } from "lucide-react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const PLATFORM_META = {
  instagram: {
    color:  "#f472b6",
    bg:     "rgba(244,114,182,0.1)",
    border: "rgba(244,114,182,0.28)",
    glow:   "rgba(244,114,182,0.2)",
    icon:   Camera,
  },
  youtube: {
    color:  "#f87171",
    bg:     "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.28)",
    glow:   "rgba(248,113,113,0.2)",
    icon:   Play,
  },
  tiktok: {
    color:  "#22d3ee",
    bg:     "rgba(34,211,238,0.1)",
    border: "rgba(34,211,238,0.28)",
    glow:   "rgba(34,211,238,0.2)",
    icon:   Music2,
  },
};

const SORT_OPTIONS = [
  { value: "followers_desc",  label: "Most Followers" },
  { value: "engagement_desc", label: "Best Engagement" },
  { value: "followers_asc",   label: "Fewest Followers" },
];

export function PlatformFilter({
  selected, onChange, searchQuery, onSearchChange,
  totalCount, filteredCount, sortBy, onSortChange,
}: PlatformFilterProps) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Row 1: Platform tabs + Search + Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Platform tabs */}
        <div
          className="flex items-center gap-1 p-1.5 rounded-xl flex-shrink-0"
          style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-subtle)" }}
        >
          {PLATFORMS.map((p) => {
            const isActive = selected === p;
            const meta = PLATFORM_META[p];
            const Icon = meta.icon;
            return (
              <button
                key={p}
                onClick={() => onChange(p)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer press-active relative transition-all duration-200"
                style={
                  isActive
                    ? {
                        color:       meta.color,
                        background:  meta.bg,
                        border:      `1px solid ${meta.border}`,
                        boxShadow:   `0 0 14px ${meta.glow}`,
                      }
                    : {
                        color:      "var(--text-muted)",
                        background: "transparent",
                        border:     "1px solid transparent",
                      }
                }
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {getPlatformLabel(p)}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={`Search creators on ${getPlatformLabel(selected)}…`}
          className="flex-1"
        />

        {/* Sort */}
        <div className="relative flex-shrink-0">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="input-base appearance-none cursor-pointer"
            style={{ paddingLeft: "32px", paddingRight: "28px", fontSize: "12px", width: "auto", minWidth: "155px" }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Result count */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-lg"
          style={{ color: "var(--text-muted)", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
        >
          {searchQuery
            ? `${filteredCount} of ${totalCount} creators match "${searchQuery}"`
            : `${totalCount} creators on ${getPlatformLabel(selected)}`}
        </span>
      </div>
    </div>
  );
}

import { useState, useMemo, useCallback } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles, getPlatformLabel } from "@/utils/dataHelpers";
import { useDebounce } from "@/hooks/useDebounce";
import { Users, TrendingUp, Sparkles } from "lucide-react";

function sortProfiles(profiles: UserProfileSummary[], sortBy: string): UserProfileSummary[] {
  return [...profiles].sort((a, b) => {
    if (sortBy === "followers_asc")   return (a.followers ?? 0) - (b.followers ?? 0);
    if (sortBy === "engagement_desc") return (b.engagement_rate ?? 0) - (a.engagement_rate ?? 0);
    return (b.followers ?? 0) - (a.followers ?? 0);
  });
}

function formatBigNum(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)         return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

const PLATFORM_COLOR: Record<Platform, string> = {
  instagram: "#f472b6",
  youtube:   "#f87171",
  tiktok:    "#22d3ee",
};

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("followers_desc");

  const debouncedQuery = useDebounce(searchQuery, 200);

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered    = useMemo(() => filterProfiles(allProfiles, debouncedQuery), [allProfiles, debouncedQuery]);
  const sorted      = useMemo(() => sortProfiles(filtered, sortBy), [filtered, sortBy]);

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  // Aggregate stats
  const totalFollowers  = useMemo(() => allProfiles.reduce((s, p) => s + (p.followers || 0), 0), [allProfiles]);
  const avgEngagement   = useMemo(() => {
    const withEng = allProfiles.filter((p) => p.engagement_rate !== undefined);
    if (!withEng.length) return 0;
    return withEng.reduce((s, p) => s + (p.engagement_rate ?? 0), 0) / withEng.length;
  }, [allProfiles]);

  const accentColor = PLATFORM_COLOR[platform];

  return (
    <Layout title="Discover Creators" subtitle="Find and save top-performing influencers">
      {/* ── Stats banner ── */}
      <div
        className={`flex items-center gap-4 p-4 rounded-2xl mb-6 border overflow-hidden relative anim-fade-in-up`}
        style={{
          background: `linear-gradient(135deg, ${accentColor}0d 0%, transparent 60%), var(--bg-surface)`,
          borderColor: `${accentColor}25`,
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)` }}
        />

        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
              {getPlatformLabel(platform)}
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)]">
              Creator Pool
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 flex-shrink-0" style={{ background: "var(--border-subtle)" }} />

        <div className="hidden sm:flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <div>
            <div className="text-xs font-bold text-[var(--text-primary)]">{allProfiles.length.toLocaleString()}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Creators</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <div>
            <div className="text-xs font-bold text-[var(--text-primary)]">{formatBigNum(totalFollowers)}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Total Reach</div>
          </div>
        </div>

        {avgEngagement > 0 && (
          <div className="hidden md:flex items-center gap-1.5">
            <div>
              <div className="text-xs font-bold" style={{ color: accentColor }}>
                {(avgEngagement * 100).toFixed(2)}%
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">Avg Engagement</div>
            </div>
          </div>
        )}
      </div>

      <PlatformFilter
        selected={platform}
        onChange={handlePlatformChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={allProfiles.length}
        filteredCount={filtered.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <ProfileList
        profiles={sorted}
        platform={platform}
        searchQuery={debouncedQuery}
        onProfileClick={() => {}}
      />
    </Layout>
  );
}

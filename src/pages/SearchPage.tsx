import { useState, useMemo, useCallback } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce the query: filtering only fires after 200ms of no typing
  const debouncedQuery = useDebounce(searchQuery, 200);

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  // Use debouncedQuery so the grid doesn't re-render on every single keystroke
  const filtered = useMemo(() => filterProfiles(allProfiles, debouncedQuery), [allProfiles, debouncedQuery]);

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  return (
    <Layout title="Discover Top Creators">
      <p className="text-slate-400 mb-8 max-w-xl text-sm leading-relaxed">
        Analyze real-time metrics, search by keywords, and save the best-performing creators to your custom marketing lists.
      </p>

      <PlatformFilter
        selected={platform}
        onChange={handlePlatformChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Showing {filtered.length} of {allProfiles.length} creators
        </p>
        <span className="text-xs font-bold text-violet-400 capitalize">
          Active: {platform}
        </span>
      </div>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={debouncedQuery}
        onProfileClick={() => {}}
      />
    </Layout>
  );
}

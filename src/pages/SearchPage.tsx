import { useState, useMemo, useCallback } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useDebounce } from "@/hooks/useDebounce";

function sortProfiles(profiles: UserProfileSummary[], sortBy: string): UserProfileSummary[] {
  return [...profiles].sort((a, b) => {
    if (sortBy === "followers_asc")  return (a.followers ?? 0) - (b.followers ?? 0);
    if (sortBy === "engagement_desc") return (b.engagement_rate ?? 0) - (a.engagement_rate ?? 0);
    // default: followers_desc
    return (b.followers ?? 0) - (a.followers ?? 0);
  });
}

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("followers_desc");

  const debouncedQuery = useDebounce(searchQuery, 200);

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(() => filterProfiles(allProfiles, debouncedQuery), [allProfiles, debouncedQuery]);
  const sorted = useMemo(() => sortProfiles(filtered, sortBy), [filtered, sortBy]);

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  return (
    <Layout title="Discover Creators" subtitle="Find and save top-performing influencers">
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

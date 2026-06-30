import { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useListStore } from "@/store/useListStore";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { Bookmark, BookmarkCheck, ArrowUpRight } from "lucide-react";
import { Avatar } from "./Avatar";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

// Engagement tier badge
function EngagementBadge({ rate }: { rate?: number }) {
  if (rate === undefined) return null;
  const pct = rate * 100;
  if (pct >= 3)   return <span className="badge badge-high">{pct.toFixed(1)}% eng.</span>;
  if (pct >= 1)   return <span className="badge badge-medium">{pct.toFixed(1)}% eng.</span>;
  return              <span className="badge badge-low">{pct.toFixed(1)}% eng.</span>;
}

// Platform badge
function PlatformBadge({ platform }: { platform: Platform }) {
  return <span className={`badge badge-${platform}`}>{platform}</span>;
}

function ProfileCardComponent({ profile, platform, onProfileClick }: ProfileCardProps) {
  const navigate = useNavigate();

  // Granular Zustand selectors — only this card re-renders when its own saved state changes
  const isSelected = useListStore((s) => s.selectedProfiles.some((p) => p.user_id === profile.user_id));
  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);

  const username = profile.username || profile.handle || "creator";
  const displayName = `@${username}`;

  const handleClick = useCallback(() => {
    if (onProfileClick) onProfileClick(username);
    navigate(`/profile/${username}?platform=${platform}`);
  }, [navigate, onProfileClick, platform, username]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) removeProfile(profile.user_id);
    else addProfile(profile, platform);
  }, [addProfile, isSelected, platform, profile, removeProfile]);

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
  }, [handleClick]);

  // Metric to show in second slot
  const secondStat = useMemo(() => {
    if (profile.engagement_rate !== undefined)
      return { value: formatEngagementRate(profile.engagement_rate), label: "Engagement" };
    if (profile.avg_views !== undefined && profile.avg_views > 0)
      return { value: formatFollowers(profile.avg_views), label: "Avg Views" };
    return null;
  }, [profile.avg_views, profile.engagement_rate]);

  return (
    <div
      onClick={handleClick}
      className="surface-card p-5 flex flex-col gap-4 cursor-pointer relative"
      style={{ borderRadius: "12px" }}
    >
      {/* Top row: Avatar + name + badges */}
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar
            src={profile.picture}
            alt={profile.fullname}
            className="w-12 h-12 rounded-full object-cover"
            fallbackText={username}
          />
          {profile.is_verified && (
            <span className="absolute -bottom-0.5 -right-0.5">
              <VerifiedBadge verified />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {displayName}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{profile.fullname}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <PlatformBadge platform={platform} />
            <EngagementBadge rate={profile.engagement_rate} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="grid gap-px rounded-lg overflow-hidden"
        style={{ gridTemplateColumns: secondStat ? "1fr 1fr" : "1fr", background: "var(--border-subtle)" }}
      >
        <div className="py-3 px-3 flex flex-col gap-0.5" style={{ background: "var(--bg-base)" }}>
          <span className="text-[15px] font-bold text-[var(--text-primary)] tabular-nums">
            {formatFollowers(profile.followers)}
          </span>
          <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide">Followers</span>
        </div>
        {secondStat && (
          <div className="py-3 px-3 flex flex-col gap-0.5" style={{ background: "var(--bg-base)" }}>
            <span className="text-[15px] font-bold text-[var(--text-primary)] tabular-nums">{secondStat.value}</span>
            <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide">{secondStat.label}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggle}
          className={isSelected ? "btn-saved flex-1 justify-center" : "btn-ghost flex-1 justify-center"}
          style={{ padding: "7px 12px", fontSize: "12px" }}
          title={isSelected ? "Remove from list" : "Save to list"}
        >
          {isSelected ? (
            <><BookmarkCheck className="w-3.5 h-3.5" /><span>Saved</span></>
          ) : (
            <><Bookmark className="w-3.5 h-3.5" /><span>Save</span></>
          )}
        </button>
        <button
          onClick={handleOpen}
          className="btn-ghost"
          style={{ padding: "7px 10px" }}
          title="View profile"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export const ProfileCard = memo(ProfileCardComponent);

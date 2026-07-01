import { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useListStore } from "@/store/useListStore";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { Bookmark, BookmarkCheck, ArrowUpRight, TrendingUp } from "lucide-react";
import { Avatar } from "./Avatar";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
  index?: number;
}

const PLATFORM_META = {
  instagram: { bar: "platform-bar-instagram", color: "var(--instagram-color)", cardClass: "card-instagram" },
  youtube:   { bar: "platform-bar-youtube",   color: "var(--youtube-color)",   cardClass: "card-youtube" },
  tiktok:    { bar: "platform-bar-tiktok",    color: "var(--tiktok-color)",    cardClass: "card-tiktok" },
};

function EngagementBadge({ rate }: { rate?: number }) {
  if (rate === undefined) return null;
  const pct = rate * 100;
  if (pct >= 3)  return <span className="badge badge-high">{pct.toFixed(1)}%</span>;
  if (pct >= 1)  return <span className="badge badge-medium">{pct.toFixed(1)}%</span>;
  return             <span className="badge badge-low">{pct.toFixed(1)}%</span>;
}

function ProfileCardComponent({ profile, platform, onProfileClick, index = 0 }: ProfileCardProps) {
  const navigate = useNavigate();
  const meta = PLATFORM_META[platform];

  const userId = profile.user_id;
  const isSelected    = useListStore((s) => s.selectedProfiles.some((p) => p.user_id === userId));
  const addProfile    = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const [justSaved, setJustSaved] = useState(false);

  const username    = profile.username || profile.handle || "creator";
  const displayName = `@${username}`;

  const handleClick = useCallback(() => {
    if (onProfileClick) onProfileClick(username);
    navigate(`/profile/${username}?platform=${platform}`);
  }, [navigate, onProfileClick, platform, username]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      removeProfile(profile.user_id);
    } else {
      addProfile(profile, platform);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 500);
    }
  }, [addProfile, isSelected, platform, profile, removeProfile]);

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
  }, [handleClick]);

  const secondStat = useMemo(() => {
    if (profile.engagement_rate !== undefined)
      return { value: formatEngagementRate(profile.engagement_rate), label: "Engagement", icon: TrendingUp };
    if (profile.avg_views !== undefined && profile.avg_views > 0)
      return { value: formatFollowers(profile.avg_views), label: "Avg Views", icon: TrendingUp };
    return null;
  }, [profile.avg_views, profile.engagement_rate]);

  const staggerDelay = `${Math.min(index, 8) * 50}ms`;

  // Cards beyond the initial 12 are off-screen — skip layout/paint until near viewport
  const isOffScreen = index >= 12;

  return (
    <div
      onClick={handleClick}
      className={`surface-card ${meta.cardClass} cursor-pointer flex flex-col anim-fade-in-up`}
      style={{
        borderRadius: "14px",
        animationDelay: staggerDelay,
        ...(isOffScreen ? {
          contentVisibility: "auto",
          containIntrinsicSize: "auto none auto 220px",
        } : {}),
      }}
    >
      {/* Platform colour accent bar */}
      <div className={`h-0.5 w-full ${meta.bar} rounded-t-[14px] flex-shrink-0`} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Top row: Avatar + name + badges */}
        <div className="flex items-start gap-3">
          {/* Avatar with platform-coloured ring */}
          <div
            className="relative flex-shrink-0 rounded-full p-[2px]"
            style={{ background: `linear-gradient(135deg, ${meta.color}66, ${meta.color}22)` }}
          >
            <div className="rounded-full overflow-hidden" style={{ background: "var(--bg-base)" }}>
            <Avatar
                src={profile.picture}
                alt={profile.fullname}
                className="w-11 h-11 rounded-full object-cover block"
                fallbackText={username}
                lazy={index > 0}
                fetchPriority={index === 0 ? "high" : undefined}
              />
            </div>
            {profile.is_verified && (
              <span className="absolute -bottom-0.5 -right-0.5">
                <VerifiedBadge verified />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-[var(--text-primary)] truncate leading-tight">
                {displayName}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] truncate mt-0.5 leading-snug">{profile.fullname}</p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className={`badge badge-${platform}`}>{platform}</span>
              <EngagementBadge rate={profile.engagement_rate} />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="grid gap-px rounded-xl overflow-hidden flex-1"
          style={{ gridTemplateColumns: secondStat ? "1fr 1fr" : "1fr", background: "var(--border-subtle)" }}
        >
          <div className="py-3 px-3 flex flex-col gap-0.5" style={{ background: "var(--bg-base)" }}>
            <span className="text-[16px] font-black text-[var(--text-primary)] tabular-nums leading-none">
              {formatFollowers(profile.followers)}
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
              Followers
            </span>
          </div>
          {secondStat && (
            <div className="py-3 px-3 flex flex-col gap-0.5" style={{ background: "var(--bg-base)" }}>
              <span
                className="text-[16px] font-black tabular-nums leading-none"
                style={{ color: meta.color }}
              >
                {secondStat.value}
              </span>
              <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
                {secondStat.label}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`press-active flex-1 flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              isSelected ? "btn-saved" : "btn-ghost"
            }`}
            style={{ padding: "7px 10px" }}
            title={isSelected ? "Remove from list" : "Save to list"}
          >
            {isSelected ? (
              <>
                <BookmarkCheck className={`w-3.5 h-3.5 ${justSaved ? "anim-icon-pop" : ""}`} />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>
          <button
            onClick={handleOpen}
            className="btn-ghost press-active"
            style={{ padding: "7px 10px" }}
            title="View profile"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export const ProfileCard = memo(ProfileCardComponent);

import { memo } from "react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext: string;
  colorClass?: string;
  /** Optional inline color for the icon container background */
  glowColor?: string;
}

const MetricCardComponent = function MetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  colorClass = "text-indigo-400",
  glowColor,
}: MetricCardProps) {
  const iconBg = glowColor
    ? `rgba(${glowColor}, 0.1)`
    : "var(--bg-elevated)";
  const iconBorder = glowColor
    ? `1px solid rgba(${glowColor}, 0.2)`
    : "1px solid var(--border-subtle)";

  return (
    <div className="stat-card flex flex-col gap-3">
      {/* Label row */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg, border: iconBorder }}
        >
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
        <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
          {label}
        </span>
      </div>

      {/* Value */}
      <div>
        <div className={`text-2xl font-black text-[var(--text-primary)] tabular-nums leading-none mb-1 ${colorClass}`}>
          {value}
        </div>
        <div className="text-xs text-[var(--text-muted)]">{subtext}</div>
      </div>
    </div>
  );
};

export const MetricCard = memo(MetricCardComponent);

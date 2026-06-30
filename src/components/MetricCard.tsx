import { memo } from "react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext: string;
  colorClass?: string;
}

const MetricCardComponent = function MetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  colorClass = "text-indigo-400",
}: MetricCardProps) {
  return (
    <div className="stat-card">
      {/* Label row */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)" }}>
          <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
        </div>
        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">{label}</span>
      </div>
      {/* Value */}
      <div className="text-2xl font-bold text-[var(--text-primary)] tabular-nums leading-none mb-1">
        {value}
      </div>
      {/* Subtext */}
      <div className="text-xs text-[var(--text-muted)]">{subtext}</div>
    </div>
  );
};

export const MetricCard = memo(MetricCardComponent);

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
  colorClass = "text-violet-400",
}: MetricCardProps) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group">
      <div className="absolute -bottom-2 -right-2 text-white/5 w-16 h-16 pointer-events-none group-hover:scale-110 transition-transform">
        <Icon className="w-full h-full" />
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
          <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
          <span>{label}</span>
        </div>
        <div className="text-2xl font-extrabold text-white mt-1.5 leading-none">
          {value}
        </div>
      </div>
      <div className="text-[11px] text-slate-400">{subtext}</div>
    </div>
  );
};

// Pure presentational component — memo prevents re-renders when parent
// (ProfileDetailPage) cycles through loading states.
export const MetricCard = memo(MetricCardComponent);

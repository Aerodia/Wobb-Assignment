import { useState, useCallback, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useListStore } from "@/store/useListStore";
import {
  Search, Bookmark, Trash2, X, ClipboardCopy, Check, Menu, Zap, ChevronRight,
  GitCompareArrows,
} from "lucide-react";
import { Avatar } from "./Avatar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
}

function PlatformDot({ platform }: { platform: string }) {
  const color =
    platform === "instagram" ? "#f472b6" :
    platform === "youtube"   ? "#f87171" : "#22d3ee";
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{ background: color, boxShadow: `0 0 4px ${color}80` }}
    />
  );
}

export function Layout({ children, title, subtitle, headerActions }: LayoutProps) {
  const location = useLocation();
  const { selectedProfiles, removeProfile, clearList } = useListStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleExport = useCallback(() => {
    if (selectedProfiles.length === 0) return;
    const text = selectedProfiles
      .map((p) => `@${p.username || p.handle || "creator"} (${p.platform})`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [selectedProfiles]);

  const sidebarJSX = (onClose?: () => void) => (
    <div className="flex flex-col h-full py-5">
      {/* Brand */}
      <div className="px-4 mb-7">
        <Link to="/" className="flex items-center gap-3 no-underline group" onClick={onClose}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a855f7 100%)",
              boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
            }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-[var(--text-primary)] leading-none tracking-tight gradient-text-accent">
              Wobb
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5 tracking-wide">
              Creator Hub
            </div>
          </div>
        </Link>
      </div>

      {/* Section label */}
      <div className="px-4 mb-1.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
          Navigation
        </span>
      </div>

      {/* Nav */}
      <div className="px-3 space-y-0.5 mb-6">
        <Link
          to="/"
          className={`nav-item ${isActive("/") ? "active" : ""}`}
          onClick={onClose}
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: isActive("/") ? "rgba(99,102,241,0.15)" : "var(--bg-elevated)",
              border: "1px solid " + (isActive("/") ? "var(--accent-border)" : "var(--border-subtle)"),
            }}
          >
            <Search className="w-3.5 h-3.5" />
          </div>
          <span>Discover</span>
        </Link>
        <Link
          to="/compare"
          className={`nav-item ${isActive("/compare") ? "active" : ""}`}
          onClick={onClose}
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: isActive("/compare") ? "rgba(99,102,241,0.15)" : "var(--bg-elevated)",
              border: "1px solid " + (isActive("/compare") ? "var(--accent-border)" : "var(--border-subtle)"),
            }}
          >
            <GitCompareArrows className="w-3.5 h-3.5" />
          </div>
          <span className="flex-1">Compare</span>
          {selectedProfiles.length >= 2 && (
            <span
              key={selectedProfiles.length}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border anim-badge-bump"
              style={{
                color: isActive("/compare") ? "var(--accent)" : "var(--text-muted)",
                background: isActive("/compare") ? "var(--accent-bg)" : "var(--bg-elevated)",
                borderColor: isActive("/compare") ? "var(--accent-border)" : "var(--border-subtle)",
              }}
            >
              {selectedProfiles.length}
            </span>
          )}
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-4" style={{ height: "1px", background: "var(--border-subtle)" }} />

      {/* Saved section label */}
      <div className="px-4 mb-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
          Saved List
        </span>
      </div>

      {/* Saved list */}
      <div className="px-3 flex-1 overflow-hidden flex flex-col min-h-0">
        {selectedProfiles.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
            >
              <Bookmark className="w-4 h-4 text-[var(--text-muted)]" />
            </div>
            <p className="text-xs text-[var(--text-muted)]">No creators saved yet</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 opacity-60">
              Browse Discover to save
            </p>
          </div>
        ) : (
          <>
            <button
              onClick={() => setListExpanded((v) => !v)}
              className="nav-item w-full text-left mb-1"
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="flex-1 text-left">My List</span>
              <span
                key={selectedProfiles.length}
                className="text-[11px] font-bold bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded-full border border-indigo-500/25 anim-badge-bump"
              >
                {selectedProfiles.length}
              </span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${listExpanded ? "rotate-90" : ""}`} />
            </button>

            {listExpanded && (
              <div className="flex-1 overflow-y-auto space-y-0.5 mt-1 min-h-0">
                {selectedProfiles.map((profile, idx) => (
                  <div
                    key={profile.user_id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--bg-elevated)] group transition-colors anim-slide-left"
                    style={{ animationDelay: `${Math.min(idx, 6) * 30}ms` }}
                  >
                    <Avatar
                      src={profile.picture}
                      alt={profile.fullname}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0 text-[10px]"
                      fallbackText={profile.username || profile.handle || "?"}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-[var(--text-primary)] truncate leading-none">
                        @{profile.username || profile.handle || "creator"}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <PlatformDot platform={profile.platform} />
                        <span className="text-[10px] text-[var(--text-muted)] capitalize">{profile.platform}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeProfile(profile.user_id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 pt-3 space-y-1.5 border-t border-[var(--border-subtle)]">
              {selectedProfiles.length >= 2 && (
                <Link
                  to="/compare"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer no-underline press-active"
                  style={{
                    color: "var(--accent)",
                    background: "var(--accent-bg)",
                    borderColor: "var(--accent-border)",
                    boxShadow: "0 0 12px rgba(99,102,241,0.15)",
                  }}
                >
                  <GitCompareArrows className="w-3.5 h-3.5" />
                  <span>Compare {selectedProfiles.length} Creators</span>
                </Link>
              )}
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer"
                style={{
                  color: "#818cf8",
                  background: "rgba(99,102,241,0.06)",
                  borderColor: "rgba(99,102,241,0.15)",
                }}
              >
                {copied
                  ? <><Check className="w-3.5 h-3.5" /><span>Copied!</span></>
                  : <><ClipboardCopy className="w-3.5 h-3.5" /><span>Export List</span></>}
              </button>
              <button
                onClick={clearList}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer hover:bg-red-500/8 hover:text-red-400"
                style={{ color: "var(--text-muted)" }}
              >
                <Trash2 className="w-3.5 h-3.5" /><span>Clear All</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer status */}
      <div className="px-4 pt-4 border-t border-[var(--border-subtle)] mt-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.6)" }} />
          <span className="text-[10px] text-[var(--text-muted)] font-medium">Live data</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Desktop sidebar */}
      <aside className="sidebar-surface hidden md:flex flex-col flex-shrink-0" style={{ width: "224px" }}>
        {sidebarJSX()}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="sidebar-surface relative flex flex-col z-10 anim-slide-left" style={{ width: "224px" }}>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarJSX(() => setSidebarOpen(false))}
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header
          className="flex items-center justify-between px-5 flex-shrink-0"
          style={{
            background: "rgba(14,14,18,0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--border-subtle)",
            minHeight: "54px",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {title && (
              <div>
                <h1 className="text-sm font-bold text-[var(--text-primary)] leading-none tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {headerActions}
            {selectedProfiles.length > 0 && !headerActions && (
              <Link
                to="/compare"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg no-underline transition-all press-active"
                style={{
                  background: "var(--accent-bg)",
                  border: "1px solid var(--accent-border)",
                  boxShadow: "0 0 10px rgba(99,102,241,0.1)",
                }}
              >
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-400">
                  {selectedProfiles.length} saved
                </span>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

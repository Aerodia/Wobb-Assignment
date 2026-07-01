import { useState, useMemo } from "react";

interface AvatarProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackText: string;
  /** Set to "high" for the first visible avatar (LCP candidate), omit for all others */
  fetchPriority?: "high" | "low" | "auto";
  /** Whether to lazy-load. Default: true (below the fold). Set false for above-fold avatars. */
  lazy?: boolean;
}

export function Avatar({
  src,
  alt,
  className = "",
  fallbackText,
  fetchPriority,
  lazy: lazyLoad = true,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const initial = fallbackText
    ? fallbackText.replace(/^@/, "").charAt(0).toUpperCase()
    : "?";

  const gradientClass = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < fallbackText.length; i++) {
      hash = fallbackText.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % 4;
    if (index === 0) return "from-violet-600 to-indigo-600 text-white";
    if (index === 1) return "from-pink-500 to-rose-500 text-white";
    if (index === 2) return "from-cyan-500 to-blue-600 text-white";
    return "from-emerald-500 to-teal-600 text-white";
  }, [fallbackText]);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-tr ${gradientClass} font-bold select-none ${className}`}
        title={alt}
        aria-label={alt}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading={lazyLoad ? "lazy" : "eager"}
      decoding="async"
      {...(fetchPriority ? { fetchPriority } : {})}
    />
  );
}

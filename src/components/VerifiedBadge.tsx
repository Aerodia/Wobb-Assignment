export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;
  return (
    <span
      title="Verified Creator"
      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white flex-shrink-0"
      style={{ padding: "2px" }}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    </span>
  );
}

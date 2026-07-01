import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";

// Route-level code splitting: ComparisonPage and ProfileDetailPage are
// only needed after the user navigates — defer their JS parse cost.
const ProfileDetailPage = lazy(() =>
  import("@/pages/ProfileDetailPage").then((m) => ({ default: m.ProfileDetailPage }))
);
const ComparisonPage = lazy(() =>
  import("@/pages/ComparisonPage").then((m) => ({ default: m.ComparisonPage }))
);

// Minimal skeleton shown while a lazy route chunk loads
function RouteFallback() {
  return (
    <div
      className="flex h-screen items-center justify-center"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 shimmer rounded-xl" />
        <div className="w-24 h-3 shimmer rounded" />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/"        element={<SearchPage />} />
          <Route path="/profile/:username" element={<ProfileDetailPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

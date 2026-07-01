<div align="center">

# Wobb Creator Hub

**A production-quality influencer discovery and comparison platform built for the Wobb Frontend Assignment.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5-FF6B35?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![ESLint](https://img.shields.io/badge/ESLint-passing-4B32C3?style=flat-square&logo=eslint)](https://eslint.org/)
[![Build](https://img.shields.io/badge/build-passing-22c55e?style=flat-square)](#)
[![Deployed on Vercel](https://img.shields.io/badge/deployed-vercel-000000?style=flat-square&logo=vercel)](https://vibe-coder-assignment-eta.vercel.app)

</div>

---

## Live Demo

**[https://vibe-coder-assignment-eta.vercel.app](https://vibe-coder-assignment-eta.vercel.app)**

---

## Overview

Wobb Creator Hub is a fully redesigned influencer marketing tool that lets brand teams discover, analyze, curate, and **compare** creators across Instagram, YouTube, and TikTok. It was built from a rough starter project — fixing intentional bugs, replacing state management, and delivering a premium dark-mode UI inspired by modern B2B SaaS platforms.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

| Script | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check and produce a production bundle |
| `npm run lint` | Run ESLint with React hooks rules |

---

## Features

### Core
- **Creator Discovery** — Search and filter across Instagram, YouTube, and TikTok with debounced input and multi-sort (Most Followers / Best Engagement / Fewest Followers)
- **Platform Stats Banner** — Live aggregate stats per platform: total creator count, combined reach, and average engagement rate
- **Creator Detail** — Per-creator metrics dashboard: followers, engagement rate, avg likes, avg comments, avg views, reels plays, demographics
- **Saved List** — Add creators to a persistent list (survives refresh); remove individually or clear all; export handles to clipboard

### Comparison Matrix *(new)*
- **Side-by-side comparison** of all saved creators across up to 8 configurable metric factors
- **Sticky factor picker** — toggle chips for Followers, Engagement Rate, Avg Likes, Avg Comments, Avg Views, Est. Posts, Verified status, and Platform
- **Best / worst highlighting** — green cell = best value in row, red cell = lowest value, with a "X% vs best" diff sub-label
- Navigate to `/compare` via the sidebar or the "Compare N Creators" CTA when ≥ 2 creators are saved

### Reliability
- **Infinite scroll** — Profiles load 12 cards at a time via `IntersectionObserver`; resets on every platform or filter change
- **Resilient data parsing** — `sanitizeProfile()` fills safe defaults; per-account `try/catch` in `extractProfiles()` means a single malformed JSON entry never blanks the grid
- **Error Boundary** — React class boundary around the profile grid shows a graceful retry UI instead of a blank screen

### UI / UX
- **Premium dark design system** — Multi-layer mesh gradient background, glassmorphic sidebar and header, platform-specific glow effects on card hover
- **Platform accent system** — Each card has a coloured top bar, gradient avatar ring, and coloured stat value matching its platform (pink for Instagram, red for YouTube, cyan for TikTok)
- **Micro-interactions** — GPU-composited animations: staggered card entry, save icon spring pop, metric cascade on detail page, sidebar slide-in, badge bump
- **Responsive layout** — Sidebar collapses to a hamburger drawer on mobile; glassmorphic overlay backdrop
- **Accessibility** — Semantic HTML, keyboard-navigable controls, `title` attributes on icon-only buttons, `prefers-reduced-motion` disables all animations

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | React 19 + TypeScript | Type-safe component model |
| Build Tool | Vite 8 | Fast HMR, native ESM, `import.meta.glob` for lazy data loading |
| Styling | Tailwind CSS v4 + CSS custom properties | Utility-first with full design token system |
| State | Zustand 5 + `persist` | Zero boilerplate; built-in `localStorage` sync |
| Routing | React Router v7 | Declarative client-side routing |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Font | Inter (Google Fonts) | Industry-standard UI typeface |
| Deployment | Vercel | Zero-config CI/CD from GitHub |

---

## Project Structure

```
src/
├── assets/data/
│   ├── search/              # Platform search indexes (Instagram, YouTube, TikTok)
│   └── profiles/            # Detailed per-creator JSON (lazy-loaded via import.meta.glob)
├── components/
│   ├── Avatar.tsx            # Image with gradient-initials fallback
│   ├── ErrorBoundary.tsx     # Class-based boundary wrapping the profile grid
│   ├── Layout.tsx            # Glassmorphic sidebar + header shell (responsive)
│   ├── MetricCard.tsx        # KPI stat card — React.memo
│   ├── PlatformFilter.tsx    # Platform tabs (with icons + glow) + search + sort
│   ├── ProfileCard.tsx       # Creator card — platform accent bar, gradient avatar ring
│   ├── ProfileList.tsx       # Infinite-scroll grid via IntersectionObserver
│   ├── SearchBar.tsx         # Controlled search input
│   └── VerifiedBadge.tsx     # Verified creator indicator
├── hooks/
│   └── useDebounce.ts        # 200 ms input debounce
├── pages/
│   ├── SearchPage.tsx        # Discover page with platform stats banner
│   ├── ProfileDetailPage.tsx # Creator analytics dashboard
│   └── ComparisonPage.tsx    # Side-by-side comparison matrix
├── store/
│   └── useListStore.ts       # Zustand store with localStorage persistence
├── types/
│   └── index.ts              # Shared TypeScript interfaces
└── utils/
    ├── dataHelpers.ts        # Safe profile extraction, sanitizeProfile(), filtering
    ├── formatters.ts         # Null-safe follower count and engagement rate formatting
    └── profileLoader.ts      # Case-insensitive dynamic loader with synthesis fallback
```

---

## Implementation Notes

### 1. Bug Fixes

| Issue | Resolution |
|---|---|
| `--ignoreDeprecations` compiler flag | Removed invalid option from `tsconfig.app.json` |
| Broken avatar images | `Avatar.tsx` resets on `onError`; renders a gradient-initials fallback |
| Case-sensitive profile filenames | `profileLoader.ts` lowercases filenames before matching |
| Missing profile data for some creators | Dynamic synthesis from search index — every card opens without a 404 |
| Component declared inside render function | Refactored `Layout.tsx` to use a JSX helper function |
| `setState` called synchronously in `useEffect` | Replaced with an effect cleanup function |
| `react-beautiful-dnd` peer dependency conflict | Removed unused package (incompatible with React 19) |

### 2. Data Reliability & Error Handling

| Problem | Fix |
|---|---|
| Missing/null JSON field crashes entire list | `sanitizeProfile()` fills safe defaults for every field |
| Single bad account blanks the grid | Per-account `try/catch` in `extractProfiles()` — bad entries are silently skipped |
| `undefined` passed to `formatFollowers()` renders `NaN` | Formatter guards against `null`/`undefined`/`NaN`, returns `"N/A"` |
| Uncaught render error blanks the page | `ErrorBoundary` wraps the grid, shows retry UI |

### 3. Infinite Scroll

`ProfileList` renders **12 cards initially**. An `IntersectionObserver` is attached to a sentinel `<div>` at the bottom of the grid with `rootMargin: "200px"` look-ahead. When the sentinel enters the viewport, `visibleCount` is incremented by 12. `visibleCount` resets to 12 whenever the `profiles` prop changes (platform switch or search filter).

### 4. Comparison Matrix

The `/compare` route renders a sticky factor picker and a horizontally-scrollable table:

- **Factor types** — numeric factors (Followers, Engagement, etc.) are ranked across all columns; best gets green highlight, worst gets red with a `% vs best` label
- **Boolean factors** — Verified renders as `✓ Yes` / `— No`
- **Text factors** — Platform renders as a formatted label
- **Empty state** — prompts the user to save ≥ 2 creators with a direct link to Discover

### 5. State Management

React Context was removed entirely. A single Zustand store manages all list state:

```ts
// src/store/useListStore.ts
interface ListStore {
  selectedProfiles: SelectedProfile[];
  addProfile:    (profile: UserProfileSummary, platform: Platform) => void; // duplicate-safe
  removeProfile: (userId: string) => void;
  clearList:     () => void;
}
```

Wrapped with the `persist` middleware — state survives page refreshes via `localStorage`.

### 6. Performance Optimizations

| Optimization | Effect |
|---|---|
| `IntersectionObserver` pagination (12/batch) | DOM never holds 100+ cards at once |
| `React.memo` on `ProfileCard` | Cards skip re-render on every search keystroke |
| Granular Zustand selectors | Saving one creator re-renders only that card |
| `useDebounce(query, 200 ms)` | Filter function runs only after the user stops typing |
| `useMemo` on profiles, filtered, and sorted arrays | Recomputes only on actual dependency changes |
| `useCallback` on all prop callbacks | Stable references preserve memoization boundaries |
| GPU-composited animations (`transform` + `opacity` only) | Zero layout/paint cost; never jank |

### 7. Design System

The UI is built on CSS custom properties as design tokens with no hardcoded values in components:

```css
/* Platform-specific variables consumed by cards, badges, and glows */
--instagram-color / --instagram-bg / --instagram-border / --instagram-glow
--youtube-color   / --youtube-bg   / --youtube-border   / --youtube-glow
--tiktok-color    / --tiktok-bg    / --tiktok-border    / --tiktok-glow
```

Key visual patterns:
- **Mesh gradient background** — three layered `radial-gradient` ellipses fixed to the viewport
- **Glassmorphism** — `backdrop-filter: blur()` on the sidebar and top header
- **Platform accent cards** — thin coloured top bar + gradient avatar ring per platform
- **Gradient buttons** — `linear-gradient` fill with inner highlight and drop shadow glow

### 8. Animations

All animations use only `transform` and `opacity` — GPU-composited properties that never trigger layout or paint. `prefers-reduced-motion` disables all animations globally.

| Interaction | Animation |
|---|---|
| Creator card page load | `fade-in-up` with staggered delay per grid index |
| Save button icon | Spring-like pop (`scale + rotate` overshoot) on first save |
| Card hover | 3 px lift with platform-coloured drop shadow |
| Card / button press | Scale-down on `:active` for tactile feedback |
| Sidebar list item entry | Slide in from the left |
| Saved count badge | Scale bump on each new addition |
| Profile detail cascade | Staggered `fade-in-up` for identity card and each metric |
| Platform tab switch | Smooth color, background, and glow-shadow transition |

---

## Assumptions and Trade-offs

- **Static data only** — All data is local JSON. Production would replace `profileLoader.ts` with API calls.
- **Synthesized profiles** — Creators without a dedicated detail JSON are served a profile built from their search-index summary. All available metrics are displayed.
- **Estimated metrics** — `avg_likes` / `avg_comments` / `est_posts` on the comparison matrix are computed from `engagements` when not directly available in the JSON.
- **Clipboard export** — Simple `@handle (platform)` format. CSV export via `papaparse` would be a straightforward addition.
- **No authentication** — Out of scope for this assignment.

---

## Submission

- **GitHub:** [github.com/Aerodia/Wobb-Assignment](https://github.com/Aerodia/Wobb-Assignment)
- **Live URL:** [vibe-coder-assignment-eta.vercel.app](https://vibe-coder-assignment-eta.vercel.app)

> `npm run build` passes with zero TypeScript errors and zero ESLint warnings.

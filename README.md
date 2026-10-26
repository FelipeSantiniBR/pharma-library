# Library

A searchable library of analytics assets (KPIs, data viz, layouts and storyboards) for a pharma commercial analytics team. Built with **Next.js 14 (App Router), TypeScript, Tailwind CSS and Zustand**, with no UI component libraries.

```bash
npm install
npm run dev   # http://localhost:3000
```

## What's implemented

Everything from the flow diagram:

| Diagram node | Where |
|---|---|
| Search to filter → Filtered view, recent searches, clear search | `SearchBar`, `SearchResults` |
| Explore asset → Asset modal (base) with description, favorite, copy link | `AssetModal` |
| KPI modal: business questions, metric IDs, calculation, visuals, affiliate applicability | `details/KpiDetails` |
| Data viz modal: interactive chart, info context, applicable KPI favorites | `details/DataVizDetails`, `InteractiveChart` |
| Layout modal: amount of pages, KPIs used, preview | `details/LayoutDetails` |
| Storyboard modal: coupled KPIs/filters, affiliates, request access | `details/StoryboardDetails` |
| Scroll to asset → Featured / Trending | `AssetSection` |
| Show more → Expanded section, additional assets, "Not seeing… try search" | `AssetSection` |
| Request… | `RequestAccessDialog` |

## Key decisions

**Discriminated union for assets** (`types/asset.ts`). Every asset shares a base shape; each type adds its own fields. The modal renders one shared shell and switches on `asset.type` to pick the detail panel. An exhaustive `never` check makes a new asset type a compile error until it's handled.

**URL as state for navigation.** `?tab=`, `?q=` and `?asset=` live in the URL (`hooks/useLibraryUrlState.ts`). This makes "Copy link" open the exact asset, lets Back close the modal, and survives refresh. Typing uses `router.replace` (no history spam), opening an asset uses `push`.

**Zustand only for user data.** Favorites, recent searches and access requests, persisted to `localStorage`. Hydration is deferred (`skipHydration` + `StoreHydrator`) to avoid SSR mismatches. A second tiny store powers toasts.

**No UI libraries.** Modals use the native `<dialog>` element (`showModal()` gives focus trapping, inert background, Escape and focus return). Tabs, toasts, icons and the chart are hand-built.

**Server/client split.** `app/page.tsx` is a Server Component that loads data and passes it down; interactivity starts at `<Library />`.

## Accessibility

- Tabs follow the WAI-ARIA pattern (roving tabindex, arrow keys, Home/End).
- Cards are single buttons; all icon buttons have labels.
- Search result counts and toasts use `aria-live`.
- The chart is keyboard navigable and has a visually hidden data table.
- Form errors use `aria-invalid` and `aria-describedby`.
- Visible focus rings, `prefers-reduced-motion` respected, responsive down to 360px.

## Assumptions

- **Featured** = curated flag on the asset; **Trending** = sorted by usage, excluding featured items so the two sections don't repeat.
- Added a **Data viz** tab: the wireframe shows Featured / KPI / Layouts / Storyboards, but Data viz is one of the four asset types in the flow and otherwise can't be browsed.
- Search on **Featured** covers the whole library; on a type tab it's scoped to that type, with a "Search all assets" escape hatch in the empty state.
- A search becomes "recent" only on intent (Enter, picking a recent term, or opening a result), not on every keystroke.
- **Applicable KPI favorites** (Data viz) = the KPIs that pair with the chart, which can be favorited inline.
- **Restricted assets** still show name, description, stats and business questions so users can judge relevance before requesting access. Any asset type can be restricted, not just storyboards.
- **Request** in the header covers both locked assets and things that aren't in the library yet.
- The stats row shows usage and last-updated for every type; the middle two stats depend on the type.
- Brand names (Cardiovex, Neurion, Oncara, Immulix, Pulmira) are fictional.

## Questions I'd ask

1. What does "Used" count: views, additions to layouts, or exports?
2. Who reviews access requests, and should the user see request status over time?
3. Should favorites sync across devices (server-side) and drive their own section or tab?
4. Is Featured curated per affiliate or global?
5. Should KPI favorites in the Data viz modal be the same list as asset favorites?
6. What happens after "Favorite item": does it feed into a layout builder?

## Improvements beyond the brief

- Shareable deep links to any asset, tab or search
- Keyboard shortcut `/` to focus search; Escape clears it
- Matching terms highlighted in results; accent-insensitive search
- Drill-down between related assets (e.g. layout → KPI) inside the modal
- Bar/line toggle on the chart
- Affiliate list shows all affiliates with clear yes/no instead of only applicable ones

## With more time

- Real API with server-side search, pagination and loading/error states
- Unit tests for `searchAssets` and the store; Playwright tests for the main flows
- Favorites section and "My requests" view
- Real thumbnails for layout and storyboard previews
- Focus the first meaningful element on modal open and announce asset changes on drill-down

## Project structure

```
app/                 layout, page (server), global styles
components/
  library/           Library root, search, tabs, sections, cards, results
  asset-modal/       modal shell, shared parts, chart, per-type details
  request-access/    request dialog
  ui/                Dialog, Button, Badge, Toaster, icons
data/                mock catalog
hooks/               URL state, debounce
lib/                 search, formatting, cn
store/               Zustand stores (library, toast)
types/               domain model
```

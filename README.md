# Library

A searchable library of analytics assets (KPIs, data viz, layouts and storyboards).

Next.js 14 (App Router), TypeScript, Tailwind and Zustand. No UI libraries.

```bash
npm install
npm run dev
```

## How it's organized

- `app/page.tsx` loads the mock data and renders `<Library />`, where all the interactivity lives.
- `components/library` has the main page: search, tabs, Featured/Trending sections and search results.
- `components/asset-modal` has the asset modal. The header, stats, favorite and copy link are shared, and each asset type has its own panel in `details/`.
- `components/request-access` has the request form.
- `store/library-store.ts` holds favorites, recent searches and access requests, saved in localStorage.
- `data/assets.ts` is the mock catalog.

## A few decisions

- Assets are typed as a union (`types/asset.ts`): a shared base plus extra fields per type. The modal switches on `asset.type` to pick the right panel.
- The open asset is in the URL (`?asset=id`). That's what makes "Copy link" work, and it lets the browser Back button close the modal.
- Modals use the native `<dialog>` element, so I get Escape, focus trapping and the backdrop for free without a library.
- The chart is a small hand-made SVG for the same reason.

## Assumptions

- **Featured** is a manual flag on the asset. **Trending** is sorted by usage and leaves out featured items so the two lists don't repeat.
- Data viz doesn't have its own tab, to match the wireframe. Those assets show up in Featured, Trending and search.
- Searching from Featured searches everything. Searching from another tab only searches that type.
- Any asset can be locked, not only storyboards. When it's locked you still see the description and business questions, so you can decide whether to request it.
- The **Request** button in the header covers both locked assets and things that don't exist in the library yet.
- A search is saved as "recent" when you press Enter or open a result, not on every keystroke.

## Questions I'd ask

1. What does "Used" count: views, or times the asset was added to a layout?
2. Who approves access requests, and should users see the status afterwards?
3. Should favorites sync across devices and have their own section?
4. Is Featured the same for every affiliate?

## What I'd do next

- Real API with server-side search and loading/error states
- Tests for the search and the store
- A favorites view and a "my requests" view
- Real thumbnails for layouts and storyboards

## Note on AI

I used Claude to generate the mock data in `data/assets.ts` (the asset names, descriptions, KPIs and numbers). The brand names in it are made up.

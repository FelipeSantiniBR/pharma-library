"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User data only (favorites, recent searches, access requests), saved to localStorage.
// The asset catalog itself comes from data/assets.ts and is passed down as props.

export type AccessRequest = {
  assetId: string | null; // null = something that isn't in the library yet
  reason: string;
  requestedAt: string;
};

type LibraryState = {
  favorites: string[];
  recentSearches: string[];
  accessRequests: AccessRequest[];

  toggleFavorite: (id: string) => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
  addAccessRequest: (request: AccessRequest) => void;
};

const MAX_RECENT_SEARCHES = 5;

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      favorites: [],
      recentSearches: [],
      accessRequests: [],

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),

      // Newest first, no duplicates, max 5
      addRecentSearch: (raw) => {
        const term = raw.trim();
        if (term.length < 2) return;
        set((state) => ({
          recentSearches: [term, ...state.recentSearches.filter((t) => t !== term)].slice(0, MAX_RECENT_SEARCHES),
        }));
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      addAccessRequest: (request) => set((state) => ({ accessRequests: [...state.accessRequests, request] })),
    }),
    {
      name: "pharma-library",
      storage: createJSONStorage(() => localStorage),
      // localStorage doesn't exist on the server, so we load it after the first
      // render (see StoreHydrator) to avoid a hydration mismatch
      skipHydration: true,
    },
  ),
);

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AccessRequest = {
  assetId: string | null;
  subject?: string;
  reason: string;
  requestedAt: string;
};

type LibraryState = {
  favorites: string[];
  recentSearches: string[];
  accessRequests: AccessRequest[];

  toggleFavorite: (id: string) => void;
  addRecentSearch: (term: string) => void;
  removeRecentSearch: (term: string) => void;
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

      addRecentSearch: (raw) => {
        const term = raw.trim();
        if (term.length < 2) return;
        set((state) => ({
          recentSearches: [
            term,
            ...state.recentSearches.filter((t) => t.toLowerCase() !== term.toLowerCase()),
          ].slice(0, MAX_RECENT_SEARCHES),
        }));
      },

      removeRecentSearch: (term) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((t) => t !== term),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),

      addAccessRequest: (request) =>
        set((state) => ({ accessRequests: [...state.accessRequests, request] })),
    }),
    {
      name: "pharma-library",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export const useHasRequested = (assetId: string) =>
  useLibraryStore((s) => s.accessRequests.some((r) => r.assetId === assetId));

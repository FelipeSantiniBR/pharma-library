"use client";

import { useState, type RefObject } from "react";
import { useLibraryStore } from "@/store/library-store";
import { CloseIcon, ClockIcon, SearchIcon } from "@/components/ui/Icons";

type SearchBarProps = {
  query: string;
  onQueryChange: (q: string) => void;
  inputRef: RefObject<HTMLInputElement>;
};

export function SearchBar({ query, onQueryChange, inputRef }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const recentSearches = useLibraryStore((s) => s.recentSearches);
  const addRecentSearch = useLibraryStore((s) => s.addRecentSearch);
  const clearRecentSearches = useLibraryStore((s) => s.clearRecentSearches);

  // Recent searches only show while the field is focused and empty
  const showRecent = focused && query === "" && recentSearches.length > 0;

  return (
    <div
      className="relative"
      // Keep the dropdown open while focus moves between the input and its buttons
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          addRecentSearch(query);
        }}
      >
        <label htmlFor="library-search" className="sr-only">
          Search the library
        </label>
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          id="library-search"
          type="search"
          autoComplete="off"
          placeholder="Type to search…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </form>

      {showRecent && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 rounded-md border border-slate-200 bg-white py-2 shadow-lg">
          <div className="flex items-center justify-between px-3 pb-1">
            <p className="text-xs font-medium text-slate-500">Recent searches</p>
            <button type="button" onClick={clearRecentSearches} className="text-xs text-slate-500 hover:text-slate-900 hover:underline">
              Clear all
            </button>
          </div>
          <ul>
            {recentSearches.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  onClick={() => onQueryChange(term)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

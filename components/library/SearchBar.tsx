"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLibraryStore } from "@/store/library-store";
import { CloseIcon, ClockIcon, SearchIcon } from "@/components/ui/Icons";

type SearchBarProps = {
  query: string;
  onQueryChange: (q: string) => void;
  inputRef: RefObject<HTMLInputElement>;
};

export function SearchBar({ query, onQueryChange, inputRef }: SearchBarProps) {
  const [value, setValue] = useState(query);
  const [focused, setFocused] = useState(false);
  const debounced = useDebouncedValue(value, 200);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPushed = useRef(query);
  const panelId = useId();

  const recentSearches = useLibraryStore((s) => s.recentSearches);
  const addRecentSearch = useLibraryStore((s) => s.addRecentSearch);
  const removeRecentSearch = useLibraryStore((s) => s.removeRecentSearch);
  const clearRecentSearches = useLibraryStore((s) => s.clearRecentSearches);

  useEffect(() => {
    const next = debounced.trim();
    if (next !== query) {
      lastPushed.current = next;
      onQueryChange(next);
    }
  }, [debounced]);

  useEffect(() => {
    if (query === lastPushed.current) return;
    lastPushed.current = query;
    if (query !== value.trim()) setValue(query);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, select, [contenteditable=true]");
      if (e.key === "/" && !typing && !document.querySelector("dialog[open]")) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inputRef]);

  const applySearch = (term: string) => {
    setValue(term);
    lastPushed.current = term;
    onQueryChange(term);
    addRecentSearch(term);
  };

  const clear = () => {
    setValue("");
    lastPushed.current = "";
    onQueryChange("");
    inputRef.current?.focus();
  };

  const showRecent = focused && value === "" && recentSearches.length > 0;

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) applySearch(value.trim());
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
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && value) {
              e.preventDefault();
              clear();
            }
          }}
          aria-controls={showRecent ? panelId : undefined}
          aria-expanded={showRecent}
          className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 [&::-webkit-search-cancel-button]:hidden"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {value ? (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear search"
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          ) : (
            <kbd
              aria-hidden="true"
              className="hidden rounded border border-slate-200 px-1.5 text-[10px] text-slate-400 sm:block"
            >
              /
            </kbd>
          )}
        </div>
      </form>

      {showRecent && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full z-20 mt-1 rounded-md border border-slate-200 bg-white py-2 shadow-lg"
        >
          <div className="flex items-center justify-between px-3 pb-1">
            <p className="text-xs font-medium text-slate-500">Recent searches</p>
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-xs text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
            >
              Clear all
            </button>
          </div>
          <ul>
            {recentSearches.map((term) => (
              <li key={term} className="group flex items-center">
                <button
                  type="button"
                  onClick={() => applySearch(term)}
                  className="flex flex-1 items-center gap-2 px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 focus-visible:bg-slate-100 focus-visible:outline-none"
                >
                  <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                  {term}
                </button>
                <button
                  type="button"
                  onClick={() => removeRecentSearch(term)}
                  aria-label={`Remove "${term}" from recent searches`}
                  className="mr-2 rounded p-1 text-slate-300 hover:text-slate-700 focus-visible:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

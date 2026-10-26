"use client";

import { useEffect } from "react";
import { useLibraryStore } from "@/store/library-store";

export function StoreHydrator() {
  useEffect(() => {
    useLibraryStore.persist.rehydrate();
  }, []);
  return null;
}

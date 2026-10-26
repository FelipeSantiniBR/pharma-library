import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StoreHydrator } from "@/components/StoreHydrator";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse for assets needed to report and present analysis.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-slate-900">
        {children}
        <StoreHydrator />
        <Toaster />
      </body>
    </html>
  );
}

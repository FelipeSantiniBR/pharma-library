import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StoreHydrator } from "@/components/StoreHydrator";
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
      </body>
    </html>
  );
}

import { Suspense } from "react";
import { assets } from "@/data/assets";
import { Library } from "@/components/library/Library";

export default function Page() {
  return (
    <Suspense>
      <Library assets={assets} />
    </Suspense>
  );
}

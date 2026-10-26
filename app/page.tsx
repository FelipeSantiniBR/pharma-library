import { Suspense } from "react";
import { assets } from "@/data/assets";
import { Library } from "@/components/library/Library";

// Server component: loads the (mock) catalog and hands it to the client UI.
// Suspense is required because Library reads the URL with useSearchParams.
export default function Page() {
  return (
    <Suspense>
      <Library assets={assets} />
    </Suspense>
  );
}

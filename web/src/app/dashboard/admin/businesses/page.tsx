import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import BusinessesList from "./List/list";

export default function AdminBusinessesPage() {
  return (
    <div className="w-[75vw] flex flex-col pl-4">
      <h1>Admin Businesses</h1>
      <Suspense
        fallback={
          <div>
            <Skeleton />
          </div>
        }
      >
        <BusinessesList />
      </Suspense>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Listings from "./Listings";

//Lazy load the CategoryFilters component
const CategoryFilters = dynamic(() => import("./CategoryFilters"));

export default function ListingPage() {
  return (
    <>
      <div className="flex flex-col lg:grid grid-cols-5">
        <div className="lg:col-span-1">
          <Suspense fallback={<Skeleton />}>
            <CategoryFilters />
          </Suspense>
        </div>
        <div className="lg:col-span-4">
          <Listings />
        </div>
      </div>
    </>
  );
}

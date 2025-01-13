import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import DemoList from "./List/list";

export default function EmailPage() {
  return (
    <div className="">
      <Suspense
        fallback={
          <div>
            <Skeleton />
          </div>
        }
      >
        <DemoList />
      </Suspense>
    </div>
  );
}

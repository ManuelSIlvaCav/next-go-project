import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import DemoList from "./List";

export default function ProjectsPage() {
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

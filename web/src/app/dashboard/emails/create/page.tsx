import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const EmailEditorComponent = dynamic(() => import("../email-editor"), {
  ssr: false,
  loading: () => <Skeleton />,
});

export default function EmailPage() {
  return (
    <div className="w-[70vw] max-w-7xl flex flex-col pl-4">
      <Suspense
        fallback={
          <div>
            <Skeleton />
          </div>
        }
      >
        <EmailEditorComponent />
      </Suspense>
    </div>
  );
}

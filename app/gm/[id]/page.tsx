import { Suspense } from "react";
import LoadingGM from "./loading";
import GMDetailsContent from "@/features/marketplace/components/GMDetailsContent";

export default function GMDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Suspense fallback={<LoadingGM />}>
       
        <GMDetailsContent params={params} />
      </Suspense>
    </div>
  );
}
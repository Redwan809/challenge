import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <Skeleton className="h-16 w-96 max-w-full mx-auto" />
        <Skeleton className="h-7 w-64 max-w-full mx-auto mt-4" />
      </div>
      <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
        <div className="flex justify-center items-end gap-4 md:gap-8 h-48 w-full">
            <Skeleton className="w-32 h-32 md:w-40 md:h-40" />
            <Skeleton className="w-32 h-32 md:w-40 md:h-40" />
            <Skeleton className="w-32 h-32 md:w-40 md:h-40" />
        </div>
        <Skeleton className="h-10 w-40 mt-8" />
      </div>
    </div>
  );
}

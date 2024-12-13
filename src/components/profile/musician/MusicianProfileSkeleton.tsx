import { Skeleton } from "@/components/ui/skeleton";

export const MusicianProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="h-[280px] bg-gradient-to-br from-onus-purple/20 via-onus-blue/20 to-onus-pink/20" />
      <div className="container mx-auto px-4">
        <div className="-mt-24 mb-12">
          <div className="flex flex-col items-center">
            <Skeleton className="w-40 h-40 rounded-lg" />
            <Skeleton className="h-8 w-48 mt-4" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
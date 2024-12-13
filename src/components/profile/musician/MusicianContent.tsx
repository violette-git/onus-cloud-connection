import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music, Video } from "lucide-react";
import { SongManager } from "../SongManager";
import { VideoManager } from "../VideoManager";
import { Skeleton } from "@/components/ui/skeleton";
import type { Musician } from "@/types/musician";

interface MusicianContentProps {
  musician: Musician;
  isOwner: boolean;
  isLoading?: boolean;
}

export const MusicianContent = ({ musician, isOwner, isLoading }: MusicianContentProps) => {
  if (isLoading) {
    return (
      <>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Music className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Songs</h2>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="pr-4">
              <SongManager 
                musicianId={musician.id} 
                songs={musician.songs || []}
                isOwner={isOwner}
              />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Video className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Videos</h2>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="pr-4">
              <VideoManager 
                musicianId={musician.id} 
                videos={musician.videos || []}
                isOwner={isOwner}
              />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};
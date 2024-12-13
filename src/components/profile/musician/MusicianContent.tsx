import { Music2, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SunoPlayer } from "../SunoPlayer";
import { VideoEmbed } from "../VideoEmbed";
import type { Musician } from "@/types/musician";

interface MusicianContentProps {
  musician: Musician;
  isOwner?: boolean;
}

export const MusicianContent = ({ musician, isOwner }: MusicianContentProps) => {
  return (
    <div className="mt-12 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Songs Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Music2 className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Songs</h2>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {musician.songs?.map((song) => (
                    <div
                      key={song.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <h4 className="font-medium">{song.title}</h4>
                      <SunoPlayer songId={song.url} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Videos Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Video className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Videos</h2>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {musician.videos?.map((video) => (
                    <div
                      key={video.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <h4 className="font-medium">{video.title}</h4>
                      <VideoEmbed video={video} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <div className="lg:col-span-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">About</h3>
              {musician.bio ? (
                <p className="text-muted-foreground">{musician.bio}</p>
              ) : (
                <p className="text-muted-foreground italic">No bio available</p>
              )}
              {musician.musician_genres && musician.musician_genres.length > 0 && (
                <>
                  <div className="my-4 border-t" />
                  <div>
                    <h3 className="font-semibold mb-3">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {musician.musician_genres.map((mg, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary rounded-full text-sm"
                        >
                          {mg.genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {(!musician.songs?.length && !musician.videos?.length) && (
        <div className="text-center py-12">
          <div className="flex justify-center space-x-4">
            <Music2 className="h-12 w-12 text-muted-foreground" />
            <Video className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mt-4">No content available</p>
        </div>
      )}
    </div>
  );
};
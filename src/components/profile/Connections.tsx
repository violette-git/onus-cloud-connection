import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowingList } from "./FollowingList";
import { CollaboratorsList } from "./CollaboratorsList";

interface ConnectionsProps {
  userId: string;
}

export const Connections = ({ userId }: ConnectionsProps) => {
  return (
    <Tabs defaultValue="following" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="following">Following</TabsTrigger>
        <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
      </TabsList>
      
      <TabsContent value="following">
        <FollowingList userId={userId} />
      </TabsContent>

      <TabsContent value="collaborators">
        <CollaboratorsList userId={userId} />
      </TabsContent>
    </Tabs>
  );
};
import { useAuth } from "@/contexts/AuthContext";
import { NudgeList } from "@/components/messaging/NudgeList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";

export const Messages = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="pt-24">
        <div className="onus-container">
          <p className="text-center text-muted-foreground">
            Please sign in to view your messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="onus-container">
        <BackButton />
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <NudgeList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
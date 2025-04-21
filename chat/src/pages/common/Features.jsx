
// components/AboutChatAppCard.jsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function FeatureHighlightCard() {
  return (
    <Card className="bg-muted/40 shadow-lg rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Badge variant="outline">⚡ Feature</Badge>
        <h2 className="text-xl font-semibold">Real-time Communication</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Our chat application delivers instant messaging with end-to-end encryption,
        ensuring both speed and security. Whether it's one-on-one or group
        conversations, your messages are always protected.
      </p>
      <Button variant="link" className="mt-4 p-0 h-auto text-sm text-primary">
        Learn more →
      </Button>
    </Card>
  );
}



// components/AboutChatAppCard.jsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <Card className="bg-muted/40 shadow-lg rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Badge variant="outline">💡 Why We Built This</Badge>
        <h2 className="text-xl font-semibold">Designed for Connection</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        This chat app was built with a simple mission: to bring people closer together
        through meaningful conversations. We believe communication should be
        effortless, beautiful, and secure—so we built just that.
      </p>
      <Button variant="link" className="mt-4 p-0 h-auto text-sm text-primary">
        Read our story →
      </Button>
    </Card>
  );
}

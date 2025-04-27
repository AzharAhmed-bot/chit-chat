import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from 'lucide-react';

function DefaultMessageCard() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-8 text-center max-w-md">
        <CardContent className="flex flex-col items-center gap-4">
          <MessageSquare className="w-12 h-12 text-gray-400" />
          <h3 className="text-xl font-semibold">No chat selected</h3>
          <p className="text-gray-500">
            Select a chat from the sidebar to start messaging
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default DefaultMessageCard;
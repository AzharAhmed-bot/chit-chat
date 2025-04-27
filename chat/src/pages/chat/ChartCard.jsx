import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import tech from '../../assets/images/chat.png';

function ChartCard({chat,user, activeChatId}) {

      const latest = chat.latest_message || {};
      const content = latest.content ?? 'No messages yet';
      const senderId = latest.by_user?.user_id;
      const isMine = senderId === user;
  return (
    <Card key={chat.chat_id} className={`hover:bg-muted ${activeChatId === chat.chat_id ? 'bg-muted border-primary' : ''}`}>
        <CardContent className="py-2">
            <div className="flex items-center space-x-3">
              <img
                src={tech}
                alt={chat.chat_name}
                className="h-12 w-12 rounded-full"
              />
              <div className="w-full">
                {/* Chat title + timestamp */}
                <div className="flex justify-between">
                  <span className="font-medium">{chat.chat_name}</span>
                    {chat.latest_message_at && (
                    <p className="text-xs text-muted-foreground">
                          {new Date(chat.latest_message_at).toLocaleString()}
                    </p>
                  )}
                </div>
                    {/* Message + double ticks if mine */}
                <div className="flex justify-between mt-2">
                  <p className="text-sm text-muted-foreground">{content}</p>
                  {isMine && (
                    <span className="text-sm text-muted-foreground">
                      ✓✓
                    </span>
                  )}
                </div>
              </div>
            </div>
        </CardContent>
    </Card>
  )
}

export default ChartCard
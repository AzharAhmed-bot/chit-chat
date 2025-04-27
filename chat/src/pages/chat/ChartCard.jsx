import React, { useEffect, useState } from 'react';
import socket from 'hooks/useSocket';
import { Card, CardContent } from '@/components/ui/card';
import tech from '../../assets/images/chat.png';

function ChartCard({ chat, user, activeChatId }) {
  const latest = chat.latest_message || {};
  const [content, setContent] = useState(latest.content ?? "No messages yet");
  const senderId = latest.by_user?.user_id;
  const isMine = senderId === user;

  useEffect(() => {
    // Set initial content
    setContent(latest.content ?? "No messages yet");
  }, [chat.chat_id, latest.content]);

  useEffect(() => {
    socket.emit('join_room', { chat_id: chat.chat_id });

    function handleNewMessage(msg) {
      if (chat.chat_id === msg.chat_id) {
        setContent(msg.content);
      }
    }

    socket.on('new_message', handleNewMessage);
    
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.emit('leave_room', { chat_id: chat.chat_id });
    };
  }, [chat.chat_id]);

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
            <div className="flex justify-between">
              <span className="font-medium">{chat.chat_name}</span>
              {chat.latest_message_at && (
                <p className="text-xs text-muted-foreground">
                  {new Date(chat.latest_message_at).toLocaleString()}
                </p>
              )}
            </div>
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
  );
}

export default ChartCard;
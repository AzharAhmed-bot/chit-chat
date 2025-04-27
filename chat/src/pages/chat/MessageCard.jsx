import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, Send } from 'lucide-react';
import { getChatMessages } from 'services/api/chat';
import DefaultMessageCard from './DefaultMessageCard';

export default function MessageCard({ user, chatId, chatInfo }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    (async () => {
      const res = await getChatMessages(chatId);
      if (res.success) setMessages(res.data);
    })();
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!chatInfo.hasSelectedChat) {
    return <DefaultMessageCard />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden ">
      {/* header */}
      <div className="flex items-center justify-between p-4  border-b">
        <div className="flex items-center space-x-3">
          <img
            src={chatInfo.profile}
            alt={chatInfo.chat_name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {chatInfo.chat_name}
            </span>
            <span className="text-xs text-muted-foreground">
              Last seen  {/* … */}
            </span>
          </div>
        </div>
        <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* only this scrolls */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.map((message, idx) => {
          const isMine = message.user_id === user;
          return (
            <div
              key={idx}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`
                  relative max-w-[40%] min-w-[30%] p-0 
                  ${isMine
                    ? ' rounded-tl-lg rounded-bl-lg rounded-br-lg'
                    : ' rounded-tr-lg rounded-br-lg rounded-bl-lg'}
                `}
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
              >
                <CardContent className="px-4 py-2">
                  <div className='flex justify-between'>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                </div>
                  <div className="mt-1 text-[10px] opacity-70 text-right">
                    {new Date(message.sent_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    <span>{isMine ? " ✓✓" : ""}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* input bar – fixed height, never scrolls */}
      <div className="flex-shrink-0 flex items-center p-3  border-t">
        <Input
          placeholder="Type a message..."
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="ghost"
          className="ml-2 p-2"
          onClick={() => {
            /* send logic */
          }}
        >
          <Send className="h-5 w-5  " />
        </Button>
      </div>
    </div>
  );
}

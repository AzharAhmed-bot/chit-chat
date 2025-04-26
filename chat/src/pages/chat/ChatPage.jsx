import React, { useState, useEffect } from 'react';
import tech from '../../assets/images/chat.png';
import UseAuth from 'components/auth/UseAuth';
import { getChats } from 'services/api/chat';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function ChatPage() {
  const { user } = UseAuth();              // user is your current user_id
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      const res = await getChats();
      if (res.success) {
        setChats(res.data);
      }
    };

    loadChats();
  }, [user]);

  const peopleChats = chats.filter(c => !c.is_group);
  const groupChats = chats.filter(c => c.is_group);

  const renderList = list =>
    list.map(chat => {
      const latest = chat.latest_message || {};
      const content = latest.content ?? 'No messages yet';
      const senderId = latest.by_user?.user_id;
      const isMine = senderId === user;

      return (
        <Card key={chat.chat_id} className="hover:bg-muted">
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
      );
    });

  return (
    <div className="space-y-4 mt-4">
      <h1 className="text-xl font-semibold">Welcome, {user}</h1>
      <Input placeholder="Search for people" />

      <Tabs defaultValue="people" className="w-full">
        <TabsList>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="people">
          <div className="space-y-2">{renderList(peopleChats)}</div>
        </TabsContent>

        <TabsContent value="groups">
          <div className="space-y-2">{renderList(groupChats)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

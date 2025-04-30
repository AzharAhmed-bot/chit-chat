import React, { useState, useEffect } from 'react';
import UseAuth from 'components/auth/UseAuth';
import tech from '../../assets/images/chat.png';
import { getChats } from 'services/api/chat';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { Input } from '@/components/ui/input';
import MessagesCard from './MessageCard';
import ChartCard from './ChartCard';

export default function ChatPage() {
  const { user } = UseAuth();
  const [chatInfo, setChatInfo] = useState({
    hasSelectedChat: false,
    chat_name: "",
    profile: tech,
    isOnline: false
  });
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);


  // Fetch chats on mount and when user changes
  useEffect(() => {
    if (!user) return;
    
    const loadChats = async () => {
      const res = await getChats();
      if (res.success) setChats(res.data);
    };
    
    loadChats();
  }, [user]);

  // Set default chat if none selected
  useEffect(() => {
    if (chats.length && !activeChatId) {
      setActiveChatId(chats[0].chat_id);
    }
  }, [chats, activeChatId]);



  const peopleChats = chats.filter(c => !c.is_group);
  const groupChats = chats.filter(c => c.is_group);

  const renderList = list => list.map(chat => {


    return (
      <div key={chat.chat_id}
        onClick={() => {
          setActiveChatId(chat.chat_id);
          setChatInfo({
            hasSelectedChat: true,
            chat_name: chat.chat_name,
            profile: tech,
            is_group: chat.is_group
          });
        }}
      >
        <ChartCard chat={chat} user={user} activeChatId={activeChatId}/>
      </div>
    );
  });

  return (
    <div className="h-screen w-full overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full flex w-full"
      >
        {/* Left sidebar - Chat list */}
        <ResizablePanel
          defaultSize={25}
          minSize={25}
          maxSize={30}
        >
          <div className="h-full flex flex-col overflow-auto p-4 space-y-4">
            <h1 className="text-xl font-semibold">
              Welcome, {user}
            </h1>
            <Input placeholder="Search for people" />

            <Tabs defaultValue="people" className="mt-4">
              <TabsList>
                <TabsTrigger value="people">
                  People
                </TabsTrigger>
                <TabsTrigger value="groups">
                  Groups
                </TabsTrigger>
              </TabsList>
              <TabsContent value="people">
                <div className="space-y-2">
                  {renderList(peopleChats)}
                </div>
              </TabsContent>
              <TabsContent value="groups">
                <div className="space-y-2">
                  {renderList(groupChats)}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right panel - Messages */}
        <ResizablePanel>
          <div className="h-full w-full overflow-hidden">
            <MessagesCard
              chatId={activeChatId}
              user={user}
              chatInfo={chatInfo}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
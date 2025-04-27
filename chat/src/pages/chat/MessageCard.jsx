import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import socket from '../../hooks/useSocket';
import {AlertDialog,AlertDialogContent,AlertDialogHeader,AlertDialogTitle,AlertDialogDescription,AlertDialogFooter,AlertDialogCancel,AlertDialogAction} from '@/components/ui/alert-dialog'
import ConfirmDialog from '../common/ConfirmADialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, Send } from 'lucide-react';
import { getChatMessages, postNewMessage } from 'services/api/chat';
import DefaultMessageCard from './DefaultMessageCard';

export default function MessageCard({ user, chatId, chatInfo }) {
  const [messages, setMessages] = useState([]);
  const [errorMessage,setErrorMessage]=useState('')
  const [errorOpen, setErrorOpen] = useState(false);
  const [newMsg, setNewMsg] = useState({
    user_id: user,
    content: "",
    sent_at: null,
    seen_at:null,
    delete_at:null
  });
  const scrollRef = useRef(null);


  useEffect(() => {
    if (!chatId) return;
    socket.emit('join_room',{chat_id:chatId})

    const loadMessages=async () => {
      const res = await getChatMessages(chatId);
      if (res.success) setMessages(res.data);
    }
    loadMessages()

    return()=>{
      socket.emit('leave_room',{chat_id:chatId})
    }
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(()=>{
    const handleNewMessage = (msg) => {
        if (msg.chat_id === chatId && msg.user_id !== user) {
            setMessages(prev => [...prev, msg])
            }
    }
    socket.on('new_message',handleNewMessage)
    return ()=>{
        socket.off('new_message',handleNewMessage)
    }
  },[chatId,user])


  async function postMessage() {
    const text = newMsg.content
    if (!text) return

    const optimisticMsg = {
      user_id: user,
      content: text,
      sent_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, optimisticMsg])
    setNewMsg({
      user_id: user,
      content: "",
      sent_at: null,
      seen_at: null,
      delete_at: null
    })
    try{
        const res=await postNewMessage(chatId,text)
        if (!res.success) throw new Error(res.error || 'Server error')    
    }
    catch{
        setMessages(prev => prev.slice(0, -1))
        setErrorOpen(true)
        setErrorMessage('Something went wrong. Try again later')

    }

  }

  if (!chatInfo.hasSelectedChat) {
    return <DefaultMessageCard />;
  }

  return (
    <>
    <AlertDialog
        open={errorOpen}
        onOpenChange={setErrorOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Failed</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
        className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar"
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
          value={newMsg.content}
          onChange={e => setNewMsg(prev => ({ ...prev, content: e.target.value }))}
          className="flex-1"
        />
        <Button
          variant="ghost"
          className="ml-2 p-2"
          onClick={() => {
            postMessage()
          }}
        >
          <Send className="h-5 w-5  " />
        </Button>
      </div>
    </div>
    </>
  );
}

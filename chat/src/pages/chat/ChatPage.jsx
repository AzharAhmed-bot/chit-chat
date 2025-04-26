import React,{useState,useEffect} from 'react'
import UseAuth from 'components/auth/UseAuth'
import App from '../../App'
import getChats from '../../services/api/chat'


function ChatPage() {
    const {user}=UseAuth()
    const [chats,setChats]=useState([])

    useEffect(()=>{
        getChats().then(res=>{
            if(res.success && res.data){
              setChats(res.data)
            }
        })
        
    },[user])

    console.log(chats)

  return (
    <>
    <div>Welcome {user}</div>
    <div>
    </div>
    </>
  )
}

export default ChatPage
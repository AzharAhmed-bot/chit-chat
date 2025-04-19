import React from 'react'
import UseAuth from '../components/auth/UseAuth'

function ChatList() {
    const {user,chats}=UseAuth()
    const handleLogOut= async()=>{
        const response=await fetch("http://localhost:5000/logout",{
            method:"POST",
            credentials:"include"
        })
        const data=await response.json()
        console.log(data)
    }
    console.log(user)
  return (
    <>
    <div>Welcome {user}</div>
    <div>
        <button onClick={handleLogOut}>Logout</button>
    </div>

    </>
  )
}

export default ChatScreen
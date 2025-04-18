import React,{useState,useEffect} from 'react'
import { io, Socket } from 'socket.io-client'

const sock=io('http://localhost:5000',{
    withCredentials:true
}
)
function UseAuth() {
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    const [user,setUser]=useState(null)
    const [isLoading,setIsLoading]=useState(true)

  useEffect(()=>{
    sock.emit("check_auth")

    sock.on("auth_status",(data)=>{
    console.log(data)
    setIsAuthenticated(data.isAuthenticated)
    setUser(data.user)
    setIsLoading(false)
    })
    

  },[])
  return {isAuthenticated,user,isLoading}
}

export default UseAuth
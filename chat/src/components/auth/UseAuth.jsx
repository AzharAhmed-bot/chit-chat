import React,{useState,useEffect} from 'react'
import socket from '../../hooks/useSocket'
function UseAuth() {
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    const [user,setUser]=useState(null)
    const [isLoading,setIsLoading]=useState(true)

  useEffect(()=>{
    let timeout;
    socket.emit("check_auth")

    socket.on("auth_status",(data)=>{
    setIsAuthenticated(data.isAuthenticated)
    setUser(data.user)
    
    timeout=setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    })
    
   
    return () => {
      clearTimeout(timeout);
      socket.off("auth_status")
    };
  
  },[])
  return {isAuthenticated,user,isLoading}
}

export default UseAuth
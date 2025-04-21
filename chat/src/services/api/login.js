import socket from "../../hooks/useSocket"


const handleSendOTP=async(phoneNumber,setRequestOtp)=>{
  try{
    const response=await fetch('http://localhost:5000/login',{
      method:'POST',
      credentials:"include",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        mode:"request",
        phone_number:phoneNumber
      })

    })
    const data=await response.json()
    if(response.status===200){
      
      localStorage.setItem('otp_requested',true)
      localStorage.setItem('phone_number',phoneNumber)
      setRequestOtp(localStorage.getItem('otp_requested'))
      console.log(data)
      return {success:true,message:data.message}
    }else{
      const data=await response.json()
      console.log(data)
      return {success:false,message:data.message}
    }
  }
  catch(e){
    return {success:false,message:`Something went wrong. Try again later ${e}`}
  }
    
}

const handleVerifyOTP=async(phoneNumber,otp,navigate)=>{
  try{
    const response=await fetch('http://localhost:5000/login',{
      method:'POST',
      credentials:"include",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        mode:"verify",
        phone_number:phoneNumber,
        otp:otp
      })
  })
  const data=await response.json()
  localStorage.removeItem('otp_requested')
  if(response.status===200){

    socket.disconnect();
    socket.connect();
    socket.emit("check_auth")
    socket.on("auth_status",(data)=>{
    if(data.isAuthenticated){
      navigate('/chat')
    }
    })
    return  {success:true,message:data.message}
  }
  else if(response.status===404){
    return {success:false,message:data.message}
  }
  }
  catch(error){
    return {success:false,message:`Something went wrong. Try again later ${error}`}
  }
}


const handleLogOut=async(navigate)=>{
  try{
    const response=await fetch("http://localhost:5000/logout",{
        method:"POST",
        credentials:"include",
        headers:{
          'Content-Type':'application/json'
        }
    })
    const data=await response.json()
    if(response.status===200){
      navigate('/')
      return data.message
    }
    else{
      return {success:false,message:data.message}
    }
  }
  catch(error){
    return {success:false,message:`Something went wrong. Try again later ${error}`}
  }
}

export {handleSendOTP,handleVerifyOTP,handleLogOut}
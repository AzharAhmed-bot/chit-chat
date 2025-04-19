import socket from "../../hooks/useSocket"


const handleSendOTP=async(phoneNumber,setRequestOtp)=>{
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
    if(response.status===200){
      const data=await response.json()
      localStorage.setItem('otp_requested',true)
      setRequestOtp(localStorage.getItem('otp_requested'))
      console.log(data)
    }else{
      const data=await response.json()
      console.log(data)
    }
    
}

const handleVerifyOTP=async(phoneNumber,otp,navigate)=>{
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
    
  }
}

export {handleSendOTP,handleVerifyOTP}
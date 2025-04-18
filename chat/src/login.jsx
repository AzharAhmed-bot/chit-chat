import React from 'react'
import { useState } from 'react'
import { Navigate,useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000', {  // Fix typo in variable name
    withCredentials: true,
    autoConnect: false  // Prevent immediate connection
});

function Login() {
    const navigate=useNavigate()
    const getOtpStatus=()=>{
        const otpStatus=localStorage.getItem('otp_requested')
        if(otpStatus){
          return true
        }
        return false
    }
    const [requestOtp, setRequestOtp] = useState(getOtpStatus())
    const [phoneNumber,setPhoneNumber]=useState(null)
    const [otp,setOtp]=useState(null)
    
      
    const handleSendOTP=async()=>{
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
      const handleVerifyOTP=async()=>{
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
        navigate('/chat')
      }
    }
  return (
    <div>
    <label htmlFor="phone_number">Enter phone Number</label>
    <input type="text" id="phone_number" name="phone_number" onChange={(e)=>setPhoneNumber(e.target.value)} />
    {requestOtp ?( 
      <div>
      <input type="text" id="otp" name="otp" onChange={(e)=>setOtp(e.target.value)} placeholder="Enter OTP" />
      <button onClick={handleVerifyOTP}>Verify</button>
      </div>
      ):
      <button onClick={handleSendOTP}>Request OTP</button> 
      } 
     
   </div> 
  )
}

export default Login
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleSendOTP,handleVerifyOTP } from 'services/api/login'



function LoginPage() {
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
    
      
    
    
  return (
    <div>
    <label htmlFor="phone_number">Enter phone Number</label>
    <input type="text" id="phone_number" name="phone_number" onChange={(e)=>setPhoneNumber(e.target.value)} />
    {requestOtp ?( 
      <div>
      <input type="text" id="otp" name="otp" onChange={(e)=>setOtp(e.target.value)} placeholder="Enter OTP" />
      <button onClick={()=>handleVerifyOTP(phoneNumber,otp,navigate)}>Verify</button>
      </div>
      ):
      <button onClick={()=>handleSendOTP(phoneNumber,setRequestOtp)}>Request OTP</button> 
      } 
   </div> 
  )
}

export default LoginPage
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UseAuth from 'components/auth/UseAuth';
import Navigation from 'common/Navigation';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { handleSendOTP, handleVerifyOTP } from 'services/api/login';

function LoginPage() {
  const navigate = useNavigate();
  const {isAuthenticated}=UseAuth()

  
  const getOtpStatus = () => {
    return localStorage.getItem('otp_requested') === 'true';
  };
  const getPhoneNumber=()=>{
    return localStorage.getItem('phone_number')  || ""
  }

  const [requestOtp, setRequestOtp] = useState(getOtpStatus());
  const [phoneNumber, setPhoneNumber] = useState(getPhoneNumber());
  const [error,setError]=useState('')
  const [otp, setOtp] = useState('');
  const [activeTab, setActiveTab] = useState(getOtpStatus() ? 'otp' : 'phone');

  useEffect(() => {
    setActiveTab(requestOtp ? 'otp' : 'phone');
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [requestOtp,error]);


  const requestOtpHandler = async () => {
    if (!phoneNumber){
      setError('Please enter your phone number')
      return;
    };
    const result=await handleSendOTP(phoneNumber,setRequestOtp);
    if(!result.success){
      setError(result.message)
    }
    else{
      setError("")
    }
  };

  const verifyOtpHandler = async () => {
    if (!otp){
      setError('Please enter your OTP')
      return;
    };
    const result = await handleVerifyOTP(phoneNumber, otp, navigate);
    if(!result.success){
      setError(result.message)
    }
    else{
      setError("")
    }
  };

  return (
    <>
    <Navigation/>
    <div className='flex items-center justify-center h-screen'>
    {isAuthenticated ? (
      <Card className="w-[400px] h-[400px] flex justify-center items-center ">
      <div className="alert-card flex w-full justify-center items-center  p-6 mb-6 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex justify-center align-middle items-center">
        <i className="fas fa-check-circle text-green-500 text-2xl mr-3"></i>
        <p className="text-green-700 font-semibold">You are already logged in!</p>
      </div>
    </div>
    </Card>
    ) : (
      <Tabs value={activeTab} className="w-[400px]">
        {/* Phone Tab */}
        <TabsContent value="phone">
          <Card>
            <CardHeader>
              <CardTitle>Phone Number</CardTitle>
              <CardDescription>
                Welcome back to ChitChat, your home for secure and fast messages.
              </CardDescription>
              {
                error && <CardDescription className='text-red-500'>{error}</CardDescription>
              }
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  className={error?'border-red-500':'border-gray-300'}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={requestOtpHandler}>Request OTP</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* OTP Tab */}
        <TabsContent value="otp">
          <Card>
            <CardHeader>
              <CardTitle>OTP Verification</CardTitle>
              <CardDescription>
                Check your phone and enter the OTP.
              </CardDescription>
              {
                error && <CardDescription className='text-red-500'>{error}</CardDescription>
              }
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="number"
                  className={error?'border-red-500':'border-gray-300'}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={verifyOtpHandler}>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    )}
      
    </div>
    </>
  );
}

export default LoginPage;

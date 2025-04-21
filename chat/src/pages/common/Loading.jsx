import React,{useState,useEffect} from 'react'
import { Progress } from '@radix-ui/react-progress'
import UseAuth from 'components/auth/UseAuth'

function Loading() {
  const {isLoading}=UseAuth()
  const [progress,setProgress]=useState(0)
  const [startTime,setStartTime]=useState(null)

  useEffect(()=>{
    if (isLoading){
      setStartTime(Date.now())
    }
  },[isLoading])

  useEffect(()=>{
    let interval;
    if(isLoading){
      interval=setInterval(()=>{
        const secondsElapsed = Math.floor((Date.now()-startTime)/1000)
        const duration=5
        const percent = Math.min((secondsElapsed/duration)*100,100)
        setProgress(percent)
      },500)
    }else{
      clearInterval(interval)
    }
    return ()=>{
      clearInterval(interval)
    }
  })
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-sm text-muted-foreground">Authenticating...</p>
                <div className="w-1/2 max-w-xs">
                <Progress value={progress}/>
                </div>
    </div>
  )
}

export default Loading
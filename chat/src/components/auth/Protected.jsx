import React ,{useEffect,useState} from 'react'
import { Progress } from "@/components/ui/progress"
import UseAuth from './UseAuth'
import { Navigate,useNavigate } from 'react-router-dom'

// protected.jsx
function Protected({ children }) {
    const nav = useNavigate();
    const { isAuthenticated, isLoading } = UseAuth();
    const [progress, setProgress] = useState(0);
    const [startTime,setStartTime]=useState(null)

    useEffect(()=>{
        if(isLoading){
            setStartTime(Date.now())
            setProgress(0)
        }
    },[isLoading])

    useEffect(() => {
        let interval;
        if (isLoading) {
          interval = setInterval(() => {
            const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);

            const duration = 5; 
            const percent = Math.min((secondsElapsed / duration) * 100, 100);
            setProgress(percent);
          }, 500);
        } else {
          clearInterval(interval);
        }
    
        return () => clearInterval(interval);
    }, [isLoading, startTime]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            nav('/login');
        }
    }, [isLoading, isAuthenticated, nav]);

    if (isLoading) {
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <p className="text-sm text-muted-foreground">Authenticating...</p>
            <div className="w-1/2 max-w-xs">
            <Progress value={progress}/>
            </div>
      </div>
    }

    return isAuthenticated ? children : null;
}

export default Protected
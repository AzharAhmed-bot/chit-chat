// Import App.css
import './App.css';
import LoginPage from 'auth/LoginPage'
import ChatPage from 'chat/ChatPage'
import Protected from './components/auth/Protected'
import Home from './pages/home/Home'
import Theme from './pages/home/Theme';
import { Routes, Route } from 'react-router-dom'

function App() {
  const routes=[
   {path:"/", element:<Home/>},
   {path:"/theme",element:<Theme/>},
   {path:"/login",element:<LoginPage/>},
   {path:"/chat",element:<Protected><ChatPage/></Protected>},
  ]
  return (
    <>
    <Routes>
      {routes.map((route,index)=>(
        <Route key={index} path={route.path} element={route.element}/>
      ))}
    </Routes>
    </>
   
  )
}

export default App
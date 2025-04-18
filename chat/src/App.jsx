
import Login from './login'
import ChatPage from './chatPage'
import Protected from './Protected'
import { Routes, Route } from 'react-router-dom'

function App() {
  const routes=[
   {path:"/login",element:<Login/>},
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
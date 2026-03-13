import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, BrowserRouter , Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Authenticate from './pages/authentication';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './context/handleAuth';
import { VideoMeet } from './pages/videoMeet';
import Home from './pages/home';
import History from './pages/history';

function App() {
  

  return (
    <>
      <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path='/' element={<LandingPage></LandingPage>}></Route>
        <Route path='/home' element={<Home></Home>}></Route>
        <Route path='/auth' element={<Authenticate></Authenticate>}></Route>
        <Route path='/history' element={<History></History>}></Route>
        <Route path='/:url' element={<VideoMeet></VideoMeet>}></Route>
      </Routes>
        <ToastContainer />
      </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App

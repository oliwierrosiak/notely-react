import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Board from "./components/board/boardMain/board";
import Home from "./components/home/home";
import { useEffect, useState } from "react";
import AccessTokenContext from "./context/accessTokenContext";
import axios from "axios";
import ApiAddress from "./ApiAddress";
import LoginContext from "./context/loginContext";
import DisplayLoginContext from "./context/displayLogin";
import refreshToken from "./components/auth/refreshToken";
import Profile from "./components/profile/profile";
import ResetPassword from "./components/resetPassword/resetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UnauthorizedActionContext from "./context/unauthorizedActionContext";
import MobileDisplayContext from "./context/mobileDisplayContext";
import Page404 from "./components/404/404";

function App() {

  const [accessToken,setAccessToken] = useState('')
  const [logged,setLogged] = useState(false)
  const [loggedUser,setLoggedUser] = useState({})
  const [loginLoading,setLoginLoading] = useState(true)
  const [displayLogin,setDisplayLogin] = useState('')
  const [mobileDisplay,setMobileDisplay] = useState(window.innerWidth > 768?false:window.innerWidth <= 450?'phone':'tablet')

  const getUserData = async() =>{
    try
    {
      const token = await refreshToken()
      const response = await axios.get(`${ApiAddress}/getUserData`,{headers:{Authorization:`Bearer ${token}`}})
      setLogged(true)
      setLoggedUser(response.data)
      setLoginLoading(false)
    }
    catch(ex)
    {
        setAccessToken('')
        sessionStorage.removeItem('refreshToken')
        setLoginLoading(false)
    }
  }

  const mobileDisplaySetter = () =>
  {
      const mobileDisplay = window.innerWidth > 768?false:window.innerWidth <= 450?'phone':'tablet'
      setMobileDisplay(mobileDisplay)
  }

  useEffect(()=>{
    getUserData()
    const redirectToLogin = sessionStorage.getItem('redirectToLogin')
    window.addEventListener('resize',mobileDisplaySetter)
    if(redirectToLogin)
    {
      setDisplayLogin('login')
      sessionStorage.removeItem('redirectToLogin')
       window.removeEventListener('resize',mobileDisplaySetter)
    }
  },[])

  const logout = async() =>{
    try
    {
      const response = await axios.delete(`${ApiAddress}/logout`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('refreshToken')}`}})
      setLogged(false)
      setLoggedUser({})
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('authorizedNotes')
      setAccessToken('')
    }
    catch(ex)
    {
      setLogged(false)
      setLoggedUser({})
      setAccessToken('')
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('authorizedNotes')
    }
  }

   const authorizationError = ()=>
    {
        logout()
        setDisplayLogin('login')
    }

  return (
    <UnauthorizedActionContext.Provider value={authorizationError}>
    <GoogleOAuthProvider clientId="913719262265-5glbp82il0vpm8mvpqkg7q6nul20v1a0.apps.googleusercontent.com">
    <AccessTokenContext.Provider value={{accessToken,setAccessToken}}>
    <LoginContext.Provider value={{logged,setLogged,loggedUser,setLoggedUser,loginLoading,logout}}>
    <DisplayLoginContext.Provider value={{displayLogin,setDisplayLogin}}>
    <MobileDisplayContext.Provider value={{mobileDisplay,setMobileDisplay}}>

    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/note/:id" element={<Board />}/>
        <Route path='/profile/:id' element={<Profile />}/>
        <Route path='/passwordreset/:id' element={<ResetPassword />}/>
        <Route path="*" element={<Page404 />}/>
      </Routes>
   </Router>

    </MobileDisplayContext.Provider>
    </DisplayLoginContext.Provider>
    </LoginContext.Provider>
   </AccessTokenContext.Provider>
   </GoogleOAuthProvider>
   </UnauthorizedActionContext.Provider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Board from "./components/board/boardMain/board";
import Home from "./components/home/home";
import { useEffect, useState } from "react";
import AccessTokenContext from "./context/accessTokenContext";
import axios from "axios";
import ApiAddress from "./ApiAddress";
import LoginContext from "./context/loginContext";

function App() {

  const [accessToken,setAccessToken] = useState('')
  const [logged,setLogged] = useState(false)
  const [loggedUser,setLoggedUser] = useState({})
  const [loginLoading,setLoginLoading] = useState(true)

  const getUserData = async(accessToken) =>{
    try
    {
      const response = await axios.get(`${ApiAddress}/getUserData`,{headers:{Authorization:`Bearer ${accessToken}`}})
      setLogged(true)
      setLoggedUser(response.data)
      setLoginLoading(false)
    }
    catch(ex)
    {
      setAccessToken('')
       setLoginLoading(false)
    }
  }

  const checkLogin = async()=>{
    try
    {
        const response = await axios.post(`${ApiAddress}/refreshToken`,{},{withCredentials:true})
        setAccessToken(response.data.token)
        getUserData(response.data.token)
    }
    catch(ex)
    {
       setLoginLoading(false)
    }
  }

  useEffect(()=>{
    checkLogin()
  },[])

  const logout = () =>{
    console.log("logout")
  }

  return (

    <AccessTokenContext.Provider value={{accessToken,setAccessToken}}>
    <LoginContext.Provider value={{logged,loggedUser,loginLoading,logout}}>

    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/note/:id" element={<Board />}/>
      </Routes>
   </Router>
   
    </LoginContext.Provider>
   </AccessTokenContext.Provider>
  );
}

export default App;

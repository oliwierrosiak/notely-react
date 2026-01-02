import React from "react";

const LoginContext = React.createContext({
    logged:false,
    setLogged:()=>{},
    loggedUser:{},
    setLoggedUser:()=>{},
    loginLoading:true,
    logout:()=>{}
})

export default LoginContext
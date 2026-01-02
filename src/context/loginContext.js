import React from "react";

const LoginContext = React.createContext({
    logged:false,
    loggedUser:{},
    loginLoading:true,
    logout:()=>{}
})

export default LoginContext
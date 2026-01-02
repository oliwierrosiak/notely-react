import React from "react";

const AccessTokenContext = React.createContext({
    accessToken:'',
    setAccessToken:()=>{}
})

export default AccessTokenContext
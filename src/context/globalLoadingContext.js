import React from "react";

const GlobalLoadingContext = React.createContext({
    globalLoading:false,
    setGlobalLoading:()=>{}
})

export default GlobalLoadingContext
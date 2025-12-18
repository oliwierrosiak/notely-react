import React from "react";

const MessageContext = React.createContext({
    addMessage:()=>{},
    removeMessage:()=>{},
})

export default MessageContext
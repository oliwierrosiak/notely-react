import { io } from "socket.io-client";
import ApiAddress from "../../../ApiAddress";

const socket = io(ApiAddress,{
    autoConnect:true
})
export default socket
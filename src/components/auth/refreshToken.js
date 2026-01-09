import axios from "axios"
import ApiAddress from "../../ApiAddress"

async function refreshToken()
{
    try
    {
        const token = await axios.get(`${ApiAddress}/refreshToken`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem("refreshToken")}`}})
        return token.data.token
    }
    catch(ex)
    {
        return ex
    }
}

export default refreshToken
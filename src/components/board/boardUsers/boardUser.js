import { useContext, useEffect, useState } from 'react'
import styles from './boardUsers.module.css'
import React from 'react'
import UserItem from './userItem'
import LoginContext from '../../../context/loginContext'

function BoardUsers(props)
{

    const [users,setUsers] = useState([])

    const loginContext = useContext(LoginContext)

    useEffect(()=>{
        const users = [...props.users]
        users.splice(users.findIndex(x=>x.email === loginContext.loggedUser.email),1)
        setUsers(users)
    },[props.users])

    return(
        <div className={styles.container}>
            {users.map((x)=><UserItem key={new Date().getTime()+Math.floor(Math.random()*10000000)} {...x}/>
            )}
        </div>
    )
}

export default React.memo(BoardUsers)
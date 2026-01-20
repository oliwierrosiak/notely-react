import { useContext, useEffect, useState } from 'react'
import styles from './myNotes.module.css'
import EditIcon from '../../../assets/svg/editIcon'
import DeleteIcon from '../../../assets/svg/deleteIcon'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ApiAddress from '../../../ApiAddress'
import refreshToken from '../../auth/refreshToken'
import LoginContext from '../../../context/loginContext'
import DisplayLoginContext from '../../../context/displayLogin'
import formatNoteCode from '../../helpers/formatNoteCode'

function MyNotesItem(props)
{
    const [showDeleteConfirm,setShowDeleteConfirm] = useState(false)

    const navigate = useNavigate()

    const loginContext = useContext(LoginContext)
    const displayLogin = useContext(DisplayLoginContext)

    const transformStatus = (status) =>{
        return status === 'private'?"Prywatna":"Publiczna"
    }

    const liClicked = (e) =>{
        if(!e.target.closest('div').classList.contains(styles.edit) && !e.target.closest('div').classList.contains(styles.delete) && !e.target.closest('div').classList.contains(styles.deleteConfirm))
        {
            props.setDisplayPageRedirectionAnimation(true)
            setTimeout(() => {
                navigate(`/note/${props._id}`)
            }, 1000);
        }
    }

    const deleteNote = async()=>{
        try
        {
            const token = await refreshToken()
            const response = await axios.delete(`${ApiAddress}/deleteNote/${props._id}`,{headers:{"Authorization":`Bearer ${token}`}})
            props.setLoading(true)
            props.getData()
        }
        catch(ex)
        {
            if(ex.status == 401)
            {
                loginContext.logout()
                displayLogin.setDisplayLogin('login')
            }
            else
            {
                setShowDeleteConfirm(false)
            }
        }
    }

    return(
        <li className={styles.noteItem} onClick={liClicked}>
            <div className={`${styles.deleteConfirm} ${showDeleteConfirm?styles.deleteConfirmDisplay:''}`}>
                <h3 className={styles.deleteHeader}>Czy napewno chcesz usunąć tą notatkę?</h3>
                <span className={styles.btnContainer}>
                    <button className={`${styles.deleteBtn} ${styles.confirmBtn}`} onClick={deleteNote}>Potwierdź</button>
                    <button className={`${styles.deleteBtn} ${styles.cancelBtn}`} onClick={e=>setShowDeleteConfirm(false)}>Anuluj</button>
                </span>
            </div>
            <div className={styles.title}>{props.title}</div>
            <div className={styles.code}>{formatNoteCode(props.code)}</div>
            <div className={`${styles.status} ${props.visibility === "private"?styles.privateStatus:''}`}>{transformStatus(props.visibility)}</div>
            <div className={styles.line}></div>
            <div className={styles.edit} onClick={e=>props.setDisplayNoteEdit(props)}>
                <EditIcon class={styles.editSVG}/>
            </div>
            <div className={styles.delete} onClick={e=>setShowDeleteConfirm(true)}>
                <DeleteIcon class={styles.deleteIcon}/>
            </div>
        </li>
    )
}

export default MyNotesItem
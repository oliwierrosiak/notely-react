import styles from './notesMenu.module.css'
import ArrowIcon from '../../assets/svg/arrowIcon'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import LoadingIcon from '../../assets/svg/loadingIcon'
import ErrorIcon from '../../assets/svg/errorIcon'
import refreshToken from '../auth/refreshToken'
import LoginContext from '../../context/loginContext'
import NoteIcon from '../../assets/svg/noteIcon'
import MyNotesItem from './myNotesItem/myNotesItem'

function NotesMenu(props)
{
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [visited,setVisited] = useState()
    const [myNotes,setMyNotes] = useState()

    const loginContext = useContext(LoginContext)

    const getData = async()=>{
        try
        {
            const token = await refreshToken()
            const response = await axios.get(`${ApiAddress}/getNotes`,{headers:{"Authorization":`Bearer ${token}`}})
            setVisited(response.data.visited)
            setMyNotes(response.data.myNotes)
            setLoading(false)
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                loginContext.logout()
            }
            setError(true)
            setLoading(false)
        }
    }

    useEffect(()=>{
        getData()
    },[])

    useEffect(()=>{
        getData()
    },[props.notesUpdater])

    return(
        <article className={`${styles.container} ${props.display?styles.display:''}`}>
            <div className={styles.arrowContainer} onClick={e=>props.setDisplayNotesMenu(!props.display)}>
                <ArrowIcon class={`${styles.arrow} ${props.display?styles.arrowRotated:''}`}/>
            </div>

            {loading?<div className={styles.loadingContainer}><LoadingIcon class={styles.loading}/></div>
            :
            (error?
            <div className={styles.errorContainer}>
                <ErrorIcon class={styles.errorIcon}/>
                <h2 className={styles.errorHeader}>Wystąpił błąd serwera</h2>
            </div>
            :<>

            <section className={styles.section}>
                <h2>Ostatnio Odwiedzone</h2>
                <div className={styles.notesContainer}>
                    {visited === 404?<div className={styles.noneNotesContainer}>
                        <NoteIcon class={styles.noteIcon}/>
                        <h3 className={styles.noneNotesHeader}>Nie odwiedziłeś jeszcze żadnych notatek</h3>
                    </div>
                    :
                    <>Masz odwiedzone</>}
                </div>
            </section>

            <div className={styles.line}></div>

            <section className={styles.section}>
                <h2>Twoje Notatki</h2>
                <div className={styles.notesContainer}>
                    {myNotes === 404?<div className={styles.noneNotesContainer}>
                        <NoteIcon class={styles.noteIcon}/>
                        <h3 className={styles.noneNotesHeader}>Nie masz jeszcze żadnych notatek</h3>
                    </div>
                    :
                    <ul className={styles.list}>
                        {myNotes.map(x=><MyNotesItem setDisplayNoteEdit={props.setDisplayNoteEdit} setLoading={setLoading} getData={getData} setDisplayPageRedirectionAnimation={props.setDisplayPageRedirectionAnimation} {...x}/>)}
                    </ul>
                    }
                </div>
            </section>

            </>)}

        </article>
    )
}

export default NotesMenu
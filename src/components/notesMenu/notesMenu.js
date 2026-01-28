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
import VisitedNotesItem from './visitedNotesItem/visitedNotesItem'

function NotesMenu(props)
{
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [visited,setVisited] = useState()
    const [myNotes,setMyNotes] = useState()

    const [responsiveDisplay,setResponsiveDisplay] = useState('myNotes')
    const [smallDevice,setSmallDevice] = useState(window.innerWidth <= 768)

    const loginContext = useContext(LoginContext)

    let touchStart = 0

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

    const smallDeviceSetter = (e) =>
    {
        const smallDevice = window.innerWidth <= 768
        setSmallDevice(prev=>prev!=smallDevice?smallDevice:prev)
    }

    useEffect(()=>{
        getData()
        window.addEventListener('resize',smallDeviceSetter)
        return ()=>
        {
            window.removeEventListener('resize',smallDeviceSetter)

        }
    },[props.notesUpdater])

    const touchStartFunc = (e) =>
    {
        touchStart = e.touches[0].clientX
    }

    const touchEndFunc = (e) =>
    {
        const touchEnd = e.changedTouches[0].clientX
        if(Math.abs(touchEnd - touchStart) > window.innerWidth * 0.4)
        {
            if(touchEnd - touchStart > 0)
            {
                setResponsiveDisplay('latestVisited')
            }
            else
            {
                setResponsiveDisplay('myNotes')
            }
        }
    }

    return(
        <article onTouchStart={touchStartFunc} onTouchEnd={touchEndFunc} className={`${styles.container} ${props.display?styles.display:''}`}>
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
            
            {smallDevice && <nav className={styles.responsiveNav}>
                <h2 className={`${styles.smallDeviceHeader} ${responsiveDisplay === "latestVisited" ? styles.headerFocused:''}`} onClick={e=>setResponsiveDisplay('latestVisited')}>Ostatnio Odwiedzone</h2>
                <h2 className={`${styles.smallDeviceHeader} ${responsiveDisplay === "myNotes" ? styles.headerFocused:''}`} onClick={e=>setResponsiveDisplay('myNotes')}>Twoje Notatki</h2>
            </nav>}

            <section className={`${styles.section} ${styles.latestVisitedSection} ${responsiveDisplay === 'latestVisited'?styles.displayNotesSection:''}`}>
                {!smallDevice && <h2>Ostatnio Odwiedzone</h2>}
                <div className={styles.notesContainer}>
                    {visited === 404?<div className={styles.noneNotesContainer}>
                        <NoteIcon class={styles.noteIcon}/>
                        <h3 className={styles.noneNotesHeader}>Nie odwiedziłeś jeszcze żadnych notatek</h3>
                    </div>
                    :
                    <ul className={styles.list}>
                        {visited.map(x=><VisitedNotesItem key={x._id} setDisplayPageRedirectionAnimation={props.setDisplayPageRedirectionAnimation} {...x}/>)}
                    </ul>}
                </div>
            </section>

            <div className={styles.line}></div>

            <section className={`${styles.section} ${styles.myNotesSection} ${responsiveDisplay === 'myNotes'?styles.displayNotesSection:''}`}>
                {!smallDevice && <h2 onClick={e=>setResponsiveDisplay('myNotes')}>Twoje Notatki</h2>}
                <div className={styles.notesContainer}>
                    {myNotes === 404?<div className={styles.noneNotesContainer}>
                        <NoteIcon class={styles.noteIcon}/>
                        <h3 className={styles.noneNotesHeader}>Nie masz jeszcze żadnych notatek</h3>
                    </div>
                    :
                    <ul className={styles.list}>
                        {myNotes.map(x=><MyNotesItem key={x._id} setDisplayNoteEdit={props.setDisplayNoteEdit} setLoading={setLoading} getData={getData} setDisplayPageRedirectionAnimation={props.setDisplayPageRedirectionAnimation} {...x}/>)}
                    </ul>
                    }
                </div>
            </section>

            </>)}

        </article>
    )
}

export default NotesMenu
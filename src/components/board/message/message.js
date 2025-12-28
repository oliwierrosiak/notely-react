import { useEffect, useState } from 'react'
import styles from './message.module.css'
import InfoIcon from '../../../assets/svg/infoIcon';
import ErrorIcon from '../../../assets/svg/errorIcon';
import CloseIcon from '../../../assets/svg/closeIcon';

function Message(props)
{
    const [display,setDisplay] = useState(false)

    useEffect(()=>{
        setTimeout(() => {
            setDisplay(true)
        }, 50);
    },[])
    
    useEffect(()=>{
        if(display)
        {
            setTimeout(() => {
                setDisplay(false)

                setTimeout(() => {
                    props.removeMessage(props.id)
                }, 300);
            }, 3500);
        }
    },[display])

    const closeMessage = () =>{
        setDisplay(false)
        setTimeout(() => {
            props.removeMessage(props.id)
            
        }, 300);
    }

    return(
        <div className={`${styles.message} ${display?styles.displayMessage:''}`}>
            <div className={styles.icon}>
                {props.type === "info" && <InfoIcon />}
                {props.type === "error" && <ErrorIcon />}
            </div>
            <div className={styles.text}>
                {props.message}
            </div>
            <div className={styles.close} onClick={closeMessage}>
                <CloseIcon />
            </div>
            <div className={styles.progress}>
                <div className={`${styles.progressFill} ${display?styles.progressFilled:''}`}></div>
            </div>
        </div>
    )
}

export default Message
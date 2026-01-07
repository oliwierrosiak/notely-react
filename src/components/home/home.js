import { useState } from 'react'
import Header from '../header/header'
import styles from './home.module.css'
import JoinWithCode from '../joinWithCode/joinWithCode'

function Home()
{
    
    const [displayJoinWithCode,setDisplayJoinWithCode] = useState(false)
    const [displayRedirectPageAnimation,setDisplayRedirectPageAnimation] = useState(false)

    return(
        <div className={styles.container}>

                <Header setDisplayJoinWithCode={setDisplayJoinWithCode}/>

                {displayJoinWithCode && <JoinWithCode setDisplayJoinWithCode={setDisplayJoinWithCode} setDisplayRedirectPageAnimation={setDisplayRedirectPageAnimation}/>}

                <div className={`${styles.redirectPage} ${displayRedirectPageAnimation?styles.redirectPageDisplay:''}`}></div>

        </div>
    )
}
export default Home
import { useState } from 'react'
import styles from './addingImgForm.module.css'

function AddingImgForm(props)
{

    const [linkValue,setLinkValue] = useState('')
    const [file,setFile] = useState() 
    const [linkError,setLinkError] = useState(false)

    const inputFocused = (e) =>{
        e.target.placeholder = ''
        setLinkError(false)
    }

    const inputBlur = (e) =>
    {
        e.target.placeholder = 'Wprowadź link...'
    }

    const validLink = () =>
    {
        if(linkValue)
        {
            const regex = /^https?:\/\/.+/;
            if(regex.test(linkValue))
            {
                props.setShowAddingImgForm(false)
                props.addImg(linkValue)
            }
            else
            {
                setLinkError(true)
            }
        }
        else
        {
            setLinkError(true)
        }
    }

    return(
        <div className={`${styles.container} ${props.display ? styles.display:''}`}>
            
            <input type='text' value={linkValue} onChange={e=>setLinkValue(e.target.value)} placeholder='Wprowadź link...' className={`${styles.input} ${linkError?styles.inputError:''}`} onFocus={inputFocused} onBlur={inputBlur}/>
            <button className={styles.btn} onClick={validLink}>Potwierdź</button>
            <div className={styles.line}></div>
            <button className={styles.btn}>
                <input type='file' className={styles.inputFile}/>
                Prześlij z urządzenia
            </button>
        </div>
    )
}

export default AddingImgForm
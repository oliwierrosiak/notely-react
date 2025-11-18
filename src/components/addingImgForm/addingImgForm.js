import { useState } from 'react'
import styles from './addingImgForm.module.css'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'

function AddingImgForm(props)
{

    const [linkValue,setLinkValue] = useState('')
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
                setLinkValue('')
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

    const sendFile = async(file)=>{
        try
        {
            const data = new FormData()
            data.append('img',file)
            const response = await axios.post(`${ApiAddress}/boardImg`,data)
            props.addImg(response.data)
            setLinkValue('')
            props.setImageAddingLoading(false)
        }
        catch(ex)
        {
            props.setImageAddingError(true)
            props.setImageAddingLoading(false)
        }
    }

    const fileChosen = (e) =>
    {
        const file = e.target.files[0]
        if(file.type.includes('image/') || file.type.includes('video/'))
        {
            sendFile(file)
            e.target.value = ''
            props.setShowAddingImgForm(false)
            props.setImageAddingLoading(true)
        }
        else
        {
            props.setShowAddingImgForm(false)
            props.setImageAddingLoading(false)
            props.setImageAddingError(true)
            e.target.value = ''
        }
        
    }

    return(
        <div className={`${styles.container} ${props.display ? styles.display:''}`}>
            
            <input type='text' value={linkValue} onChange={e=>setLinkValue(e.target.value)} placeholder='Wprowadź link...' className={`${styles.input} ${linkError?styles.inputError:''}`} onFocus={inputFocused} onBlur={inputBlur}/>
            <button className={styles.btn} onClick={validLink}>Potwierdź</button>
            <div className={styles.line}></div>
            <button className={styles.btn}>
                <input type='file' onChange={fileChosen} className={styles.inputFile} accept='image/*,video/*'/>
                Prześlij z urządzenia
            </button>
        </div>
    )
}

export default AddingImgForm
import styles from './joinWithCode.module.css'
import ArrowIcon from '../../assets/svg/arrowIcon'
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import LoadingIcon from '../../assets/svg/loadingIcon'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useNavigate } from 'react-router-dom'
import AccessTokenContext from '../../context/accessTokenContext'
import refreshToken from '../auth/refreshToken'
import logo from '../../assets/img/notely.png'
import UnauthorizedActionContext from '../../context/unauthorizedActionContext'

function JoinWithCode(props)
{

    const reducer = (state,action) =>
    {
        switch(action.type)
        {
            case 'code1':
                state.code1 = action.value
                break
            case 'code2':
                state.code2 = action.value
                break
            case 'code3':
                state.code3 = action.value
                break
            case 'code4':
                state.code4 = action.value
                break
            case 'code5':
                state.code5 = action.value
                break
            case 'code6':
                state.code6 = action.value
                break
        }
        return {...state}
    }

    const [code,dispatch] = useReducer(reducer,{
        code1:'',
        code2:'',
        code3:'',
        code4:'',
        code5:'',
        code6:'',
    })

    const [joinBtnEnabled,setJoinBtnEnable] = useState(false)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')
    const accessTokenContext = useContext(AccessTokenContext)
    const unauthorizedActionContext = useContext(UnauthorizedActionContext)

    const btnRef = useRef()

    const navigate = useNavigate()

    const overlayClicked = (e) =>{
        if(loading) return;
        if(e.target.classList.contains(styles.overlay))
        {
            props.setDisplayJoinWithCode(false)
        }
    }

    const focusNextElement = (idx) =>
    {
        const inputs = document.querySelectorAll(`.${styles.input}`)
        if(idx === 6)
        {
            inputs[5].blur()
        }
        else
        {
            inputs[idx].focus()

        }
    }

    useEffect(()=>{
        setError('')
        let buttonEnable = true
        for(const key in code)
        {
            if(!code[key])
            {
                buttonEnable = false
            }
        }
        if(buttonEnable != joinBtnEnabled)
        {
            setJoinBtnEnable(buttonEnable)
        }
    },[code])

    const btnClicked = async(e) =>
    {
        setError('')
        setLoading(true)
        let fullCode = []
        for(const key in code)
        {
            fullCode.push(code[key])
        }
        fullCode = fullCode.join('')
        try
        {
            if(fullCode.length != 6)
            {
                throw new Error()
            }
            const token = await refreshToken()
            const response = await axios.get(`${ApiAddress}/joinWithCode/${fullCode}`,{headers:{Authorization:`Bearer ${token}`}})
            accessTokenContext.setAccessToken(token)
            const authorizedNotes = JSON.parse(sessionStorage.getItem('authorizedNotes'))
            if(response.data.password && (!authorizedNotes || !authorizedNotes.includes(response.data.id)))
            {
                props.setNoteIdMemory(response.data.id)
                props.setDisplayNotePassword(true)
                props.setDisplayJoinWithCode(false)
            }
            else
            {
                
                props.setDisplayRedirectPageAnimation(true)
                setTimeout(()=>{
                    navigate(`/note/${response.data.id}`)
                },1000)

            }
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                props.setDisplayJoinWithCode(false)
                unauthorizedActionContext()
            }
            if(ex?.response?.data?.status === 404)
            {
                setError("Nie znaleziono kodu notatki")
                setLoading(false)
            }
            else
            {
                setError("Wystąpił błąd serwera")
                setLoading(false)
            }
        }
    }

    const setCursorBack = (e) =>
    {
        const inputs = [...document.querySelectorAll(`.${styles.input}`)]
        const focused = document.activeElement
        const idx = inputs.findIndex(x=>x === focused)
        if(idx > 0)
        {
            if(e.target.value === '')
            {
                setTimeout(() => {
                    inputs[idx].blur()
                    inputs[idx-1].focus()
                }, 20);
            }
                    
        }
    }

    const windowEvent = (e) =>{
        if(e.key === 'Backspace')
        {
            setCursorBack(e)
        }
        if(e.key === "Enter")
        {
            btnRef.current.click()
        }
    }

    useEffect(()=>{
        window.addEventListener('keydown',windowEvent)
        return()=>{
            window.removeEventListener('keydown',windowEvent)
        }
    },[])

    const setCursorAtEnd = (e) =>
    {
        setTimeout(() => {
            e.target.setSelectionRange(1,1)
        }, 10);
    }

    const inputKeyDown = (e) =>
    {
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    }

    return(
        <article className={styles.overlay} onClick={overlayClicked}>

            <div className={styles.container}>

                <div className={`${styles.back} ${loading?styles.backWhileLoading:''}`} onClick={e=>!loading && props.setDisplayJoinWithCode(false)}>
                    <ArrowIcon class={styles.backSVG}/>
                </div>

                <img src={logo} className={styles.logo}/>

                <div className={styles.codeContainer}>

                    <input type='text' maxLength="1" inputMode='numeric' disabled={loading} className={`${styles.input} ${loading?styles.inputWhileLoading:''}`} onClick={setCursorAtEnd} value={code.code1} onKeyDown={inputKeyDown} onChange={e=>{dispatch({type:'code1',value:e.target.value});e.target.value !== "" && focusNextElement(1)}}/>

                    <input type='text' disabled={loading} onClick={setCursorAtEnd} onKeyDown={inputKeyDown} maxLength="1" inputMode='numeric' className={`${styles.input} ${loading?styles.inputWhileLoading:''}`} value={code.code2} onChange={e=>{dispatch({type:'code2',value:e.target.value});e.target.value !== "" && focusNextElement(2)}}/>
 
                    <input type='text' disabled={loading} onClick={setCursorAtEnd} onKeyDown={inputKeyDown} maxLength="1" inputMode='numeric' className={`${styles.input} ${loading?styles.inputWhileLoading:''}`} value={code.code3} onChange={e=>{dispatch({type:'code3',value:e.target.value});e.target.value !== "" && focusNextElement(3)}}/>

                    <div className={styles.dash}>-</div>

                    <input type='text' disabled={loading} onClick={setCursorAtEnd} onKeyDown={inputKeyDown} maxLength="1" inputMode='numeric' className={`${styles.input} ${loading?styles.inputWhileLoading:''}`} value={code.code4} onChange={e=>{dispatch({type:'code4',value:e.target.value});e.target.value !== "" && focusNextElement(4)}}/>

                    <input type='text' disabled={loading} onClick={setCursorAtEnd} onKeyDown={inputKeyDown} maxLength="1" inputMode='numeric' className={`${styles.input} ${loading?styles.inputWhileLoading:''}`} value={code.code5} onChange={e=>{dispatch({type:'code5',value:e.target.value});e.target.value !== "" && focusNextElement(5)}}/>

                    <input type='text' disabled={loading} maxLength="1" inputMode='numeric' onKeyDown={inputKeyDown} className={`${styles.input} ${loading?styles.inputWhileLoading:''}`} value={code.code6} onClick={setCursorAtEnd} onChange={e=>{dispatch({type:'code6',value:e.target.value});e.target.value !== "" && focusNextElement(6)}}/>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button ref={btnRef} disabled={!joinBtnEnabled || loading} onClick={btnClicked} className={`${styles.btn} ${joinBtnEnabled?styles.btnEnable:''} ${loading?styles.btnWhileLoading:''}`}>
                    {loading?<LoadingIcon class={styles.loadingIcon}/>:"Dołącz"}
                </button>
            </div>

        </article>
    )
}

export default JoinWithCode
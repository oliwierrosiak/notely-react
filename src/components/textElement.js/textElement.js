import { useEffect, useRef, useState } from 'react'
import styles from './textElement.module.css'

function TextElement(props)
{

    const containerRef = useRef()

    const [textValue,setTextValue] = useState('') 

    const changePosition = (e)=>{
        props.item.changePosition(e,props.board)
    }   

    const setSolidPosition = (e) =>{
        props.item.setSolidPosition(props.board)
    }

    const checkEditMode = (e) =>{
        props.item.checkEditMode(e,props.clearElementEdit,props.setEdit,props.item)
    }

    const resizeElement = () =>{
        props.item.resizeElement(props.board,containerRef.current)
    }

    useEffect(()=>{
        props.item.setText(textValue)
    },[textValue])

    return(
        <div className={`element editOn ${styles.element} ${props.item.getClass()}`} style={props.item.getStyles()} onMouseDown={changePosition} onMouseUp={setSolidPosition} onClick={checkEditMode} ref={containerRef}>
            <textarea placeholder="Wprowadź tekst..." onChange={e=>setTextValue(e.target.value)} value={textValue} className={styles.textArea} onFocus={e=>e.target.placeholder = ''} onBlur={e=>e.target.placeholder = 'Wprowadź tekst...'}></textarea>

            <div className={styles.resize} onMouseDown={resizeElement}></div>
        
        </div>
    )
}

export default TextElement
import { useEffect, useRef } from 'react'
import styles from './textElement.module.css'

function TextElement(props)
{

    const containerRef = useRef()

    let moveHandler, resizeHandler

    const moveElement = (e,mouseEvent) =>
    {
        const left = Math.round(mouseEvent.clientX/window.innerWidth*100)
        const top = Math.round(mouseEvent.clientY/window.innerHeight*100)
        e.target.style.left = `${left}%`
        e.target.style.top = `${top}%`
        props.item.setPosition(left,top)
    }
    
    const changePosition = (e)=>{
        if(e.target.classList.contains(`editOn`))
        {
            moveHandler = (ev) =>moveElement(e,ev)
            props.board.addEventListener('mousemove',moveHandler) 
        }
    }   

    const setSolidPosition = (e) =>{
        props.board.removeEventListener('mousemove',moveHandler)
    }



    const checkEditMode = (e) =>{
        if(!e.target.classList.contains('editOn') && e.target.classList.contains('element'))
        {
            props.clearElementEdit()
            e.target.classList.add(`editOn`)
            props.setEdit(props.id)
        }
    }

    const resizeAction = (e) =>{

        const width = (e.clientX-containerRef.current.offsetLeft)/window.innerWidth*200
        const height = (e.clientY-containerRef.current.offsetTop)/window.innerHeight*200
        containerRef.current.style.width = `${width}rem`
        containerRef.current.style.height = `${height}vh`
        props.item.setSizes(width,height)
    }

   const resizeMouseUp = ()=>{
        props.board.removeEventListener('mousemove',resizeHandler)
    }

    const resizeElement = () =>{
        resizeHandler = (e) => resizeAction(e)
        props.board.addEventListener('mousemove',resizeHandler)
        props.board.addEventListener('mouseup',resizeMouseUp)
    }

    const getStyles = () =>{
        const object = {}
        if(props.item.width)
        {
            object.width = props.item.width
        }
        if(props.item.height)
        {
            object.height = props.item.height
        }
        if(props.item.left)
        {
            object.left = props.item.left
        }
        if(props.item.top)
        {
            object.top = props.item.top
        }
        console.log(object)
        return object
    }

    return(
        <div className={`element editOn ${styles.element}`} style={getStyles()} onMouseDown={changePosition} onMouseUp={setSolidPosition} onClick={checkEditMode} ref={containerRef}>
            <textarea placeholder="Wprowadź tekst..." className={styles.textArea} onFocus={e=>e.target.placeholder = ''} onBlur={e=>e.target.placeholder = 'Wprowadź tekst...'}></textarea>

            
            <div className={styles.resize} onMouseDown={resizeElement} onMouseUp={resizeMouseUp}></div>
        
        </div>
    )
}

export default TextElement
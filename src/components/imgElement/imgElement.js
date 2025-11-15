import { useRef } from 'react'
import styles from './imgElement.module.css'

function ImgElement(props)
{

    const containerRef = useRef()

    const changePosition = (e) =>
    {
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

    return(
       <div className={`element editOn ${styles.element} ${props.item.getClass()}`} style={props.item.getStyles()} onMouseDown={changePosition} onMouseUp={setSolidPosition} onClick={checkEditMode} ref={containerRef}>
            <img src={props.link} />

            <div className={styles.resize} onMouseDown={resizeElement}></div>
        
        </div>
    )
}

export default ImgElement
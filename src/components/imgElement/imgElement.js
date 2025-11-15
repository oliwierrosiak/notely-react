import { useEffect, useRef, useState } from 'react'
import styles from './imgElement.module.css'

function ImgElement(props)
{

    const containerRef = useRef()
    const [photoLoaded,setPhotoLoaded] = useState(false)
    const [error,setError] = useState(false)

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
       <div className={`element editOn ${styles.element} ${props.item.getClass()}`} style={props.item.getStyles()} onMouseDown={e=>changePosition(e.target)} onMouseUp={setSolidPosition} onClick={e=>checkEditMode(e.target)} ref={containerRef}>

            <img src={props.item.link} onLoad={e=>setPhotoLoaded(true)} onError={e=>{setError(true);setPhotoLoaded(true)}} onDragStart={e=>e.preventDefault()} className={styles.img} onClick={e=>checkEditMode(e.target.closest('div'))} onMouseDown={e=>changePosition(e.target.closest('div'))} onMouseUp={setSolidPosition}/>

            {!photoLoaded && <div className={styles.loading}></div>}

            {error && <div className={styles.error} onClick={e=>checkEditMode(e.target.closest('.element'))} onMouseDown={e=>changePosition(e.target.closest('.element'))} onMouseUp={setSolidPosition}>
                Bład ładowania    
            </div>}

            <div className={styles.resize} onMouseDown={resizeElement}></div>
        
        </div>
    )
}

export default ImgElement
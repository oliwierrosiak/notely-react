import { useEffect, useId, useRef, useState } from 'react'
import BottomMenu from '../bottomMenu/bottomMenu'
import styles from './board.module.css'
import TextElement from '../textElement.js/textElement'
import TextMenu from '../bottomMenu/textMenu'
import TextElementClass from '../textElement.js/textElementClass'


function Board()
{
    const boardRef = useRef()

    const [textElements,setTextElements] = useState([])
    const [edit,setEdit] = useState(0)

    const addTextItem = () =>
    {
        
        const localTextElement = [...textElements]
        const item = new TextElementClass()
        localTextElement.push(item)
        setEdit(item.id)
        setTextElements(localTextElement)
    }

    const clearElementEdit = () =>{
        const elements = [...document.querySelectorAll('.element')]
        elements.forEach(x=>{
            x.classList.remove(`editOn`)
        })
        setEdit(0)
    }

    const boardClicked = (e) =>{
        if(e.target.classList.contains(styles.board))
        {
            clearElementEdit()
        }
    }

    return(
        <>
            <div className={styles.board} ref={boardRef} onClick={boardClicked}>
                {textElements.map(x=><TextElement setEdit={setEdit} key={x.id} board={boardRef.current} clearElementEdit={clearElementEdit} id={x.id} item={x} />)}
            </div>

            <BottomMenu addTextItem={addTextItem} clearElementEdit={clearElementEdit} display={edit === 0}/>

            <TextMenu display={edit!==0}/>
            
        </>
    )
}

export default Board
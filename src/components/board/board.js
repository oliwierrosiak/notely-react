import { useEffect, useId, useRef, useState } from 'react'
import BottomMenu from '../bottomMenu/bottomMenu'
import styles from './board.module.css'
import TextElement from '../textElement.js/textElement'
import TextMenu from '../bottomMenu/textMenu/textMenu'
import TextElementClass from '../textElement.js/textElementClass'
import ImgElement from '../imgElement/imgElement'
import ImgElementClass from '../imgElement/imgElementClass'


function Board()
{
    const boardRef = useRef()

    const [elements,setElements] = useState([])
    const [edit,setEdit] = useState(0)
    const [editUpdate,setEditUpdate] = useState(true)
    const [showAddingImgForm,setShowAddingImgForm] = useState(false)

    const addTextItem = () =>
    {
        
        const localTextElement = [...elements]
        const item = new TextElementClass(['fontSize18','alignLeft','colorBlack','bgYellow6','fontArial'])
        localTextElement.push(item)
        setEdit(item)
        setElements(localTextElement)
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
            setShowAddingImgForm(false)
        }
    }

    const deleteItem = (id) =>
    {
        const localTextElements = [...elements]
        const idx = localTextElements.findIndex(x=>x.id === id)
        localTextElements.splice(idx,1)
        setElements([...localTextElements])
        setEdit(0)
    }

    const addImg = (link) =>{
        const localTextElement = [...elements]
        const img = new ImgElementClass([],link)
        localTextElement.push(img)
        setElements(localTextElement)
    }

    return(
        <>
            <div className={styles.board} ref={boardRef} onClick={boardClicked}>
                {elements.map((x)=>{
                    if(x.type === "text")
                    {
                        return <TextElement setEdit={setEdit} key={x.id} board={boardRef.current} clearElementEdit={clearElementEdit} id={x.id} item={x} />
                    }
                    else if(x.type === "img")
                    {
                        return <ImgElement key={x.id} board={boardRef.current} clearElementEdit={clearElementEdit} setEdit={setEdit} item={x}/>
                    }
                    
                })}
            </div>

            <BottomMenu addTextItem={addTextItem} addImg={addImg} showAddingImgForm={showAddingImgForm} setShowAddingImgForm={setShowAddingImgForm} clearElementEdit={clearElementEdit} display={edit === 0}/>

            

            <TextMenu display={edit!==0} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} board={boardRef} deleteItem={deleteItem}/>
            
        </>
    )
}

export default Board
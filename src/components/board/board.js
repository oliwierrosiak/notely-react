import { useEffect, useId, useRef, useState } from 'react'
import BottomMenu from '../bottomMenu/bottomMenu'
import styles from './board.module.css'
import TextElement from '../textElement.js/textElement'
import TextMenu from '../bottomMenu/textMenu/textMenu'
import TextElementClass from '../textElement.js/textElementClass'
import ImgElement from '../imgElement/imgElement'
import ImgElementClass from '../imgElement/imgElementClass'
import ImageMenu from '../bottomMenu/imageMenu/imageMenu'
import BrushMenu from '../bottomMenu/brushMenu/brushMenu'
import CanvasElement from '../canvasElement/canvasElement'

function Board()
{
    const boardRef = useRef()

    const [elements,setElements] = useState([{type:'canvas',id:`${new Date().getTime()}${Math.floor(Math.random()*100)}`}])
    const [edit,setEdit] = useState(0)
    const [editUpdate,setEditUpdate] = useState(true)
    const [showAddingImgForm,setShowAddingImgForm] = useState(false)
    const [brush,setBrush] = useState({type:'',width:20,color:'bgBlack1'})
    const movingLocked = useRef(false)

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
        if(edit.type !== "canvas" || !brush.type)
        {
            setEdit(0)
        }
    }

    const boardClicked = (e) =>{
        if(e.target.classList.contains(styles.board) || e.target.classList.contains('canvas'))
        {
            clearElementEdit()
            setShowAddingImgForm(false)
        }
    }

    const deleteItem = (id) =>
    {
        const localElements = [...elements]
        const idx = localElements.findIndex(x=>x.id === id)
        localElements.splice(idx,1)
        setElements([...localElements])
        setEdit(0)
    }

    const addImg = (data) =>{
        const localTextElement = [...elements]
        const img = new ImgElementClass(['borderBgBlack6','borderWidth1','borderRadius1'],data.link,data.mimetype)
        localTextElement.push(img)
        setEdit(img)
        setElements(localTextElement)
    }

    const brushClicked = () =>{
        const localElement = [...elements]
        const canvas = localElement.find(x=>x.type==="canvas")
        setEdit(canvas)
    }

    const brushMenuClosed = () =>{
        setEdit(0)
    }

    const setPosition = () =>{
        window.scrollTo(boardRef.current.clientWidth/2 - window.innerWidth/2,boardRef.current.clientHeight/2 - window.innerHeight/2)
    }

    const mouseMoveListener = useRef()
    const mouseDownTimeStamp = useRef()

    useEffect(()=>{
        setTimeout(() => {
            setPosition()
        }, 50);
    },[])

    useEffect(()=>{
        console.log(movingLocked)
    },[movingLocked])

    const boardMouseDown = (e) =>
    {
        mouseDownTimeStamp.current = e.timeStamp
        mouseMoveListener.current = (e) =>{
            if(!movingLocked.current)
            {
                if(e.buttons)
                {
                    window.scrollTo(window.scrollX+-e.movementX,window.scrollY+-e.movementY)

                }
                else
                {
                    boardRef.current.removeEventListener('mousemove',mouseMoveListener.current)
                }
                
            }
        }
        boardRef.current.addEventListener('mousemove',mouseMoveListener.current)
    }

    const boardMouseUp = (e) =>
    {
        if(e.timeStamp-mouseDownTimeStamp.current < 100)
        {
            boardClicked(e)
        }
        boardRef.current.removeEventListener('mousemove',mouseMoveListener.current)
    }

    return(
        <>
            <div className={styles.board} ref={boardRef} onMouseDown={boardMouseDown} onMouseUp={boardMouseUp}>
                <CanvasElement movingLocked={movingLocked} drawing={edit !== 0 && edit.type === "canvas" && brush.type !== ''} brush={brush}/>
                {elements.map((x)=>{
                    if(x.type === "text")
                    {
                        return <TextElement movingLocked={movingLocked} setEdit={setEdit} key={x.id} board={boardRef.current} clearElementEdit={clearElementEdit} id={x.id} item={x} />
                    }
                    else if(x.type === "img")
                    {
                        return <ImgElement movingLocked={movingLocked} key={x.id} board={boardRef.current} clearElementEdit={clearElementEdit} setEdit={setEdit} item={x}/>
                    }
                    
                })}
            </div>

            <BottomMenu addTextItem={addTextItem} brushClicked={brushClicked} addImg={addImg} showAddingImgForm={showAddingImgForm} setShowAddingImgForm={setShowAddingImgForm} clearElementEdit={clearElementEdit} display={edit === 0}/>

            
            {edit.type === "text" && <TextMenu display={edit!==0 && edit.type === "text"} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} board={boardRef} deleteItem={deleteItem}/>}
            
            {edit.type === 'img' && <ImageMenu display={edit !== 0 && edit.type === "img"} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} deleteItem={deleteItem}/>}
            
            {edit.type === "canvas" && <BrushMenu display={edit !==0 && edit.type === "canvas"} setBrush={setBrush} brush={brush} brushMenuClosed={brushMenuClosed} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate}/>}

        </>
    )
}

export default Board
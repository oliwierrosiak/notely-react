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
import DragDropIcon from '../../assets/svg/drag&dropIcon'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import Message from '../message/message'
import ImgLoadingIcon from '../../assets/svg/imgLoadingIcon'

function Board()
{
    const boardRef = useRef()

    const [elements,setElements] = useState([{type:'canvas',id:`${new Date().getTime()}${Math.floor(Math.random()*100)}`}])
    const [edit,setEdit] = useState(0)
    const [editUpdate,setEditUpdate] = useState(true)
    const [showAddingImgForm,setShowAddingImgForm] = useState(false)
    const [brush,setBrush] = useState({type:'',width:20,color:'bgBlack1'})
    const [displayDragElement,setDisplayDragElement] = useState(false)
    const [updater,setUpdater] = useState(false)
    const [globalLoading,setGlobalLoading] = useState(false)

    const movingLocked = useRef(false)
    const mouseMoveListener = useRef()
    const mouseDownTimeStamp = useRef()
    const messages = useRef([])

    const addTextItem = () =>
    {
        const localTextElement = [...elements]
        const item = new TextElementClass(['fontSize14','alignLeft','colorBlack','bgYellow6','fontArial'])
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
        clearElementEdit()
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

    const addMessage=(message,type)=>{
        const localMessages = [...messages.current]
        const id = Date.now()+Math.floor(Math.random()*100000)
        localMessages.push({message,type,id:id})
        messages.current = localMessages
        setUpdater(!updater)
    }

    const removeMessage = (id) =>
    {
        const localMessages = [...messages.current]
        const messageIdx = localMessages.findIndex(x=>x.id === id)
        if(messageIdx>=0)
        {
            localMessages.splice(messageIdx,1)
            messages.current = localMessages
            setUpdater(!updater)
        }

    }

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

    const sendFileToServer = async(file) =>{
        try
        {
            const data = new FormData()
            data.append('img',file)
            setGlobalLoading(true)
            const response = await axios.post(`${ApiAddress}/boardImg`,data)
            setGlobalLoading(false)
            addImg(response.data)
        }
        catch(ex)
        {
            setGlobalLoading(false)
            addMessage("Błąd przesyłania pliku","error")
        }
    }

    const drop = (e) =>
    {
        e.preventDefault()
        const file = e.dataTransfer.files[0] || null
        if(file && (file.type.includes('image/') || file.type.includes('video/')))
        {
            const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
            if(url)
            {
                addImg({link:url,mimetype:'image/*'})
            }
            else
            {
                sendFileToServer(file)
            }
        }
        else
        {
            addMessage("Nieprawidłowy format pliku","error")
        }
        
        setDisplayDragElement(false)
    }

    useEffect(()=>{
        setTimeout(() => {
            setPosition()
        }, 50);
    },[])

    return(
        <>
            <div className={`${styles.board} board`} ref={boardRef} onMouseDown={boardMouseDown} onMouseUp={boardMouseUp} onDragOver={e=>e.preventDefault()} onDrop={drop} onDragEnter={e=>setDisplayDragElement(true)} >

                <CanvasElement movingLocked={movingLocked} drawing={edit !== 0 && edit.type === "canvas" && brush.type !== ''} brush={brush}/>

                {elements.map((x)=>{
                    if(x.type === "text")
                    {
                        return <TextElement movingLocked={movingLocked} setEdit={setEdit} edit={edit} key={x.id} board={boardRef.current} clearElementEdit={clearElementEdit} id={x.id} item={x} />
                    }
                    else if(x.type === "img")
                    {
                        return <ImgElement movingLocked={movingLocked} key={x.id} board={boardRef.current} clearElementEdit={clearElementEdit} setEdit={setEdit} item={x}/>
                    }
                    
                })}

                {displayDragElement && <div className={styles.dragElement} onDragLeave={e=>setDisplayDragElement(false)}>
                    <DragDropIcon class={styles.dragDropIcon}/>
                    <h2 className={styles.dropHeader}>Upuść plik</h2>
                </div>}

            </div>

            {messages.current[0] && <div className={`${styles.messageContainer} ${globalLoading?styles.adjustBottom:''}`}>
                {messages.current.map(x=><Message removeMessage={removeMessage} key={x.id} {...x} />
                )}   
            </div>}

            {globalLoading && <div className={styles.globalLoading}>
                <ImgLoadingIcon  class={styles.loadingSVG}/>
            </div>}

            <BottomMenu addTextItem={addTextItem} brushClicked={brushClicked} addImg={addImg} showAddingImgForm={showAddingImgForm} setShowAddingImgForm={setShowAddingImgForm} clearElementEdit={clearElementEdit} display={edit === 0}/>

            
            {edit.type === "text" && <TextMenu display={edit!==0 && edit.type === "text"} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} board={boardRef} deleteItem={deleteItem}/>}
            
            {edit.type === 'img' && <ImageMenu display={edit !== 0 && edit.type === "img"} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} deleteItem={deleteItem}/>}
            
            {edit.type === "canvas" && <BrushMenu display={edit !==0 && edit.type === "canvas"} setBrush={setBrush} brush={brush} brushMenuClosed={brushMenuClosed} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate}/>}

        </>
    )
}

export default Board
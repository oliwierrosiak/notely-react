import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
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
import MessageContext from '../../context/messageContext'
import GlobalLoadingContext from '../../context/globalLoadingContext'
import ClearElementEditContext from '../../context/clearEdit'
import ArrowIcon from '../../assets/svg/arrowIcon'
import { useNavigate, useParams } from 'react-router-dom'
import ShapeElementClass from '../shapeElement.js/shapeElementClass'
import ShapeElement from '../shapeElement.js/shapeElement'
import ShapeBottomMenu from '../bottomMenu/shapeBottomMenu/shapeBottomMenu'
import LoadingIcon from '../../assets/svg/loadingIcon'
import ErrorIcon from '../../assets/svg/errorIcon'

function Board()
{
    const boardRef = useRef()
    const viewport = useRef()

    const [elements,setElements] = useState([{type:'canvas',id:`${new Date().getTime()}${Math.floor(Math.random()*100)}`}])
    const [edit,setEdit] = useState(0)
    const [editUpdate,setEditUpdate] = useState(true)
    const [showAddingImgForm,setShowAddingImgForm] = useState(false)
    const [brush,setBrush] = useState({type:'',width:20,color:'bgBlack1'})
    const [displayDragElement,setDisplayDragElement] = useState(false)
    const [updater,setUpdater] = useState(false)
    const [globalLoading,setGlobalLoading] = useState(false)
    const [projectName,setProjectName] = useState('Nowy projekt')
    const [shapeUpdater,setShapeUpdater] = useState(false)
    const [loading,setLoading] = useState(true)
    const [displayLoading,setDisplayLoading] = useState(true)
    const [loadingError,setLoadingError] = useState(false)

    const movingLocked = useRef(false)
    const mouseMoveListener = useRef()
    const mouseDownTimeStamp = useRef()
    const messages = useRef([])

    const scaleRef = useRef(1)
    const translateXRef = useRef(0)
    const translateYRef = useRef(0)
    const panStartX = useRef(0)
    const panStartY = useRef(0)

    const zoomSpeed = 0.001
    const minScale = window.innerWidth / window.innerHeight / 100
    const maxScale = 3

    const navigate = useNavigate()

    const params = useParams()

    const elementSetter= (array) =>{
        const localElements = [...elements]
        array.forEach(x=>{
            switch(x.type)
            {
                case 'text':
                    localElements.push(new TextElementClass(x))
                    break;
                case 'img':
                    localElements.push(new ImgElementClass(x))
                    break;
                case 'shape':
                    localElements.push(new ShapeElementClass(x))
                    break
            }
        })
        setElements(localElements)
    }

   

    const getData = async() =>{
        try
        {
            const data = await axios.get(`${ApiAddress}/getBoardData/${params.id}`)
            setLoading(false)
            setProjectName(data.data.title)
            elementSetter(data.data.content)
        }
        catch(ex)
        {
            setLoadingError(true)
        }
    }


    const clearElementEdit = () =>{
        const elements = [...document.querySelectorAll('.element')]
        elements.forEach(x=>{
            x.classList.remove(`editOn`)
        })
        if(edit.type !== "canvas" || !brush.type)
        {
            if(edit)
            {
                edit.updater(params.id)
            }
            setEdit(0)
        }
    }

    const addTextItem = () =>
    {
        const localTextElement = [...elements]
        const item = new TextElementClass({class:['fontSize14','alignLeft','colorBlack','bgYellow6','fontArial']})
        localTextElement.push(item)
        setEdit(item)
        setElements(localTextElement)
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
        const img = new ImgElementClass({class:['borderBgBlack6','borderWidth1','borderRadius1'],link:data.link,mimetype:data.mimetype})
        localTextElement.push(img)
        setEdit(img)
        setElements(localTextElement)
    }

    const addShape = (shape) =>
    {
        const localElements = [...elements]
        const item = new ShapeElementClass({class:['fillBlack4'],item:shape})
        localElements.push(item)
        setEdit(item)
        setElements(localElements)
    }

    const brushClicked = () =>{
        const localElement = [...elements]
        const canvas = localElement.find(x=>x.type==="canvas")
        setEdit(canvas)
    }

    const brushMenuClosed = () =>{
        setEdit(0)
    }

    const boardClicked = (e) =>{
        if(e.target.classList.contains(styles.board) || e.target.classList.contains('canvas'))
        {
            clearElementEdit()
            setShowAddingImgForm(false)
        }
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


    const setBoardTransformation = () =>
    {
        boardRef.current.style.transform = `translate(${translateXRef.current}px, ${translateYRef.current}px) scale(${scaleRef.current})`
    }

    const boardMouseDown = (e) =>
    {
        panStartX.current = e.clientX - translateXRef.current
        panStartY.current = e.clientY - translateYRef.current
        mouseDownTimeStamp.current = e.timeStamp

        mouseMoveListener.current = (e) =>{
            if(!movingLocked.current)
            {
                if(e.buttons)
                {
                    if(scaleRef.current > minScale + 0.1)
                    {
                        if(e.clientY - panStartY.current < 0 && e.clientY - panStartY.current - window.innerHeight > -5000*scaleRef.current)  
                        {
                            translateYRef.current = e.clientY - panStartY.current
                        }  
                        if(e.clientX - panStartX.current < 0 && e.clientX - panStartX.current - window.innerWidth > -5000*scaleRef.current)
                        {
                            translateXRef.current = e.clientX - panStartX.current

                        }
                        setBoardTransformation()
                    }
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

    const centerBoard = () =>{
        translateXRef.current = (viewport.current.clientWidth - boardRef.current.clientWidth*scaleRef.current) / 2
        translateYRef.current = (viewport.current.clientHeight - boardRef.current.clientHeight*scaleRef.current) /2
        setBoardTransformation()
    }

    const zoom = (e) =>{
        e.preventDefault()

        if(!e.target.classList.contains(`canvas`))
        {
            return 
        }

        const rect = viewport.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        let localScale = scaleRef.current

        localScale -= e.deltaY * zoomSpeed

        const scaleRatio = localScale / scaleRef.current

        const localTranslateX = mouseX - scaleRatio * (mouseX - translateXRef.current)
        const localTranslateY = mouseY - scaleRatio * (mouseY - translateYRef.current)

        if(localScale > minScale && localScale < maxScale)
        {
            translateXRef.current = localTranslateX
            translateYRef.current = localTranslateY
            scaleRef.current = localScale

           setBoardTransformation()
        }
        if(localScale <= minScale)
        {
            
            centerBoard()
           
        }
    }

    const zoomBtn = (value) =>{
        const rect = viewport.current.getBoundingClientRect()

        const centerX = viewport.current.clientWidth/2-rect.left
        const centerY = viewport.current.clientHeight/2-rect.top

        let localScale = scaleRef.current
        localScale -= value * zoomSpeed
        
        const scaleRatio = localScale / scaleRef.current

        const localTranslateX = centerX - scaleRatio * (centerX - translateXRef.current)
        const localTranslateY =  centerY - scaleRatio * (centerY - translateYRef.current)

        if(localScale > minScale+0.05 && localScale < maxScale)
        {
            translateXRef.current = localTranslateX
            translateYRef.current = localTranslateY
            scaleRef.current = localScale

           setBoardTransformation()
        }
        if(localScale <= minScale + 0.05)
        {
            centerBoard()
        }
    }

    const projectNameInputFocused = (e) =>{
        if(e.target.value === 'Nowy projekt')
        {
            setProjectName('')
        }
    }

    const projectNameInputBlur = async(e) =>{
        if(e.target.value.trim() === '')
        {
            setProjectName('Nowy projekt')
        }
        try
        {
            await axios.post(`${ApiAddress}/updateNoteTitle/${params.id}`,{title:projectName})
        }
        catch(ex)
        {
            addMessage('Nie udało się zmienić nazwy','error')
        }
    }

    const blockDragging = (e) =>{
        e.preventDefault()
    }

    const blockZooming = (e) =>{
        if(e.ctrlKey)
        {
            e.preventDefault()
        }
    }

    useLayoutEffect(()=>{
         translateXRef.current = (viewport.current.clientWidth - boardRef.current.clientWidth) / 2
        translateYRef.current = (viewport.current.clientHeight - boardRef.current.clientHeight) / 2
        setBoardTransformation()
    },[])

    useEffect(()=>{
       
        getData()
        if(viewport.current)
        {
            viewport.current.addEventListener("wheel",zoom,{passive:false})
        }
        window.addEventListener("resize",centerBoard)
        window.addEventListener('dragstart',blockDragging)
        window.addEventListener('wheel',blockZooming,{passive:false})

        return()=>{
            window.removeEventListener("resize",centerBoard)
            window.removeEventListener('dragstart',blockDragging)
            window.removeEventListener('wheel',blockZooming)
            viewport.current?.removeEventListener("wheel",zoom)
        }
    },[])

    useEffect(()=>{
        if(!loading)
        {
            setTimeout(() => {
                setDisplayLoading(false)
                
            }, 300);
        }
    },[loading])

    return(
        <MessageContext.Provider value={{addMessage,removeMessage}}>
        <GlobalLoadingContext.Provider value={{globalLoading,setGlobalLoading}}>
        <ClearElementEditContext.Provider value={clearElementEdit}>

            <div className={styles.back} onClick={e=>navigate('/')}>
                <ArrowIcon class={styles.arrowSvg}/>
            </div>

            {displayLoading && <div className={`${styles.loading} ${!loading?styles.loadingHide:''}`}>
                {loadingError?<div className={styles.loadingError}>
                    <ErrorIcon class={styles.errorLoadingIcon}/>
                    <h2>Wystąpił błąd serwera</h2>
                    <button onClick={e=>navigate('/')}>Wróc do strony głównej</button>
                </div>:<LoadingIcon class={styles.pageLoadingIcon}/>}
            </div>}

            <input type='text'className={styles.projectName} value={projectName} onChange={e=>setProjectName(e.target.value)} onFocus={projectNameInputFocused} onBlur={projectNameInputBlur} />

            <div className={`${styles.viewport} viewport`} ref={viewport} onDragEnter={e=>setDisplayDragElement(true)} >

                <div className={`${styles.board} board`} ref={boardRef} onMouseDown={boardMouseDown} onMouseUp={boardMouseUp}>

                    <CanvasElement movingLocked={movingLocked} drawing={edit !== 0 && edit.type === "canvas" && brush.type !== ''} brush={brush}/>

                    {elements.map((x)=>{
                        if(x.type === "text")
                        {
                            return <TextElement movingLocked={movingLocked} setEdit={setEdit} edit={edit} key={x.id} board={boardRef.current} id={x.id} item={x} />
                        }
                        else if(x.type === "img")
                        {
                            return <ImgElement movingLocked={movingLocked} key={x.id} board={boardRef.current} setEdit={setEdit} item={x}/>
                        }
                        else if(x.type === "shape")
                        {
                            return <ShapeElement shapeUpdater={shapeUpdater} key={x.id} movingLocked={movingLocked} board={boardRef.current} setEdit={setEdit} item={x} />
                        }
                    
                    })}
                </div>
            </div>

            {displayDragElement && <div className={styles.dragElement} onDragLeave={e=>setDisplayDragElement(false)} onDragOver={e=>e.preventDefault()} onDrop={drop}>
                    <DragDropIcon class={styles.dragDropIcon}/>
                    <h2 className={styles.dropHeader}>Upuść plik</h2>
            </div>}

            {messages.current[0] && <div className={`${styles.messageContainer} ${globalLoading?styles.adjustBottom:''}`}>
                {messages.current.map(x=><Message removeMessage={removeMessage} key={x.id} {...x} />
                )}   
            </div>}

            {globalLoading && <div className={styles.globalLoading}>
                <ImgLoadingIcon  class={styles.loadingSVG}/>
            </div>}

            <BottomMenu addShape={addShape} zoomBtn={zoomBtn} addTextItem={addTextItem} brushClicked={brushClicked} addImg={addImg} showAddingImgForm={showAddingImgForm} setShowAddingImgForm={setShowAddingImgForm} display={edit === 0}/>

            
            <TextMenu display={edit!==0 && edit.type === "text"} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} board={boardRef} deleteItem={deleteItem}/>
            
            <ImageMenu display={edit !== 0 && edit.type === "img"} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} deleteItem={deleteItem}/>
            
            <BrushMenu display={edit !==0 && edit.type === "canvas"} setBrush={setBrush} brush={brush} brushMenuClosed={brushMenuClosed} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate}/>

            <ShapeBottomMenu shapeUpdater={shapeUpdater} setShapeUpdater={setShapeUpdater} display={edit !==0 && edit.type === "shape"} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} deleteItem={deleteItem} />

        </ClearElementEditContext.Provider>
        </GlobalLoadingContext.Provider>
        </MessageContext.Provider>
    )
}

export default Board
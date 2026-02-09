import { useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
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
import DragDropIcon from '../../../assets/svg/drag&dropIcon'
import axios from 'axios'
import ApiAddress from '../../../ApiAddress'
import Message from '../message/message'
import ImgLoadingIcon from '../../../assets/svg/imgLoadingIcon'
import MessageContext from '../../../context/messageContext'
import GlobalLoadingContext from '../../../context/globalLoadingContext'
import ClearElementEditContext from '../../../context/clearEdit'
import { useNavigate, useParams } from 'react-router-dom'
import ShapeElementClass from '../shapeElement.js/shapeElementClass'
import ShapeElement from '../shapeElement.js/shapeElement'
import ShapeBottomMenu from '../bottomMenu/shapeBottomMenu/shapeBottomMenu'
import ErrorIcon from '../../../assets/svg/errorIcon'
import CanvasHistoryContext from '../../../context/canvasHistory'
import LoggedMenu from '../../nav/loggedMenu/loggedMenu'
import LoginContext from '../../../context/loginContext'
import NotePassword from '../../notePassword/notePassword'
import refreshToken from '../../auth/refreshToken'
import formatNoteCode from '../../helpers/formatNoteCode'
import logo from '../../../assets/img/notely60.png'
import socket from '../socketConfig/socketConfig'
import BoardUsers from '../boardUsers/boardUser'
import UnauthorizedActionContext from '../../../context/unauthorizedActionContext'

function Board()
{
    const [elements,setElements] = useState([])
    const [edit,setEdit] = useState(0)
    const [editUpdate,setEditUpdate] = useState(true)
    const [showAddingImgForm,setShowAddingImgForm] = useState(false)
    const [brush,setBrush] = useState({type:'',width:20,color:'bgBlack1'})
    const [displayDragElement,setDisplayDragElement] = useState(false)
    const [updater,setUpdater] = useState(false)
    const [globalLoading,setGlobalLoading] = useState(false)
    const [projectName,setProjectName] = useState('Nowy projekt')
    const [boardColor,setBoardColor] = useState()
    const [shapeUpdater,setShapeUpdater] = useState(false)
    const [loading,setLoading] = useState(true)
    const [displayLoading,setDisplayLoading] = useState(true)
    const [loadingError,setLoadingError] = useState(false)
    const [undoStack,setUndoStack] = useState([])
    const [redoStack,setRedoStack] = useState([])
    const [canvasHistoryUpdater,setCanvasHistoryUpdater] = useState(false)
    const [backgroundTemplate,setBackgroundTemplate] = useState()
    const [noteCode,setNoteCode] = useState('')
    const [passwordExist,setPasswordExits] = useState(false)
    const [noteId,setNoteId] = useState('')
    const [noteUsers,setNoteUsers] = useState([])

    const movingLocked = useRef(false)
    const mouseMoveListener = useRef()
    const touchMoveListener = useRef()
    const mouseDownTimeStamp = useRef()
    const messages = useRef([])
    const scaleRef = useRef(1)
    const translateXRef = useRef(0)
    const translateYRef = useRef(0)
    const panStartX = useRef(0)
    const panStartY = useRef(0)
    const boardRef = useRef()
    const viewport = useRef()
    const startDistance = useRef(null)
    const startScale = useRef(1)
    const mode = useRef(null)
    const projectNameRef = useRef()

    const loginContext = useContext(LoginContext)
    const authorizationError = useContext(UnauthorizedActionContext)

    const navigate = useNavigate()

    const params = useParams()

    const zoomSpeed = 0.001
    const minScale = window.innerWidth / window.innerHeight / 100
    const maxScale = 3

    const elementSetter= (array) =>{
        const localElements = [...elements]
        if(array.findIndex(x=>x.type === "canvas") == -1)
        {
            localElements.push({type:'canvas',id:`${new Date().getTime()}${Math.floor(Math.random()*100)}`,content:[]})
        }
        array.forEach(x=>{
            switch(x.type)
            {
                case 'canvas':
                    localElements.push(x)
                    setUndoStack(x.content||[])
                    break
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
            const token = await refreshToken()
            const data = await axios.get(`${ApiAddress}/getBoardData/${params.id}`,{headers:{"Authorization":`Bearer ${token}`}})
            if(data.data.visibility === "private" && data.data.admin !== loginContext.loggedUser.email)
            {
                const error = new Error("Unauthorized")
                error.status = 403
                throw error
            }
            setNoteCode(data.data.visibility === "private"?"Notatka Prywatna":data.data.code)
            setProjectName(data.data.title || 'Nowy projekt')
            setBoardColor(data.data.boardColor || 'bgBlack5')
            setBackgroundTemplate(data.data.template || 'backgroundTemplate9')
            elementSetter(data.data.content)
            setNoteId(data.data._id)
            if(data.data.notePassword == "true")
            {   
                const authorizedNotes = JSON.parse(sessionStorage.getItem('authorizedNotes'))
                if(!authorizedNotes || !authorizedNotes.includes(data.data._id))
                {
                    setPasswordExits(true)
                }
            }
            setLoading(false)
            
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                navigate('/')
                authorizationError()
            }
            else if(ex.status === 403)
            {
                navigate('/')
            }
            else
            {
                setLoadingError(true)

            }
        }
    }

    const saveCanvas = async()=>{
        const canvas = elements.find(x=>x.type==="canvas")
        if(canvas)
        {
            try
            {
                const token = await refreshToken()
                await axios.post(`${ApiAddress}/updateNoteCanvas/${params.id}`,{canvas},{headers:{"Authorization":`Bearer ${token}`}})
                socket.emit('canvasUpdate',{canvas:elements[0],noteId:params.id})
            }   
            catch(ex)
            {
                if(ex.status === 401)
                {
                    navigate('/')
                    authorizationError()
                }
            }
        }
    }

    const clearElementEdit = async() =>{
        setBrush({type:'',width:brush.width,color:brush.color})
        const elements = [...document.querySelectorAll('.element')]
        elements.forEach(x=>{
            x.classList.remove(`editOn`)
        })
        if(edit.type !== "canvas" && !brush.type)
        {
            if(edit)
            {
                const done = await edit.updater(params.id,authorizationError)
                if(done)
                {
                    socket.emit('elementUpdate',{noteId:params.id,element:edit})

                }
                else
                {
                    navigate('/')
                }
            }
            setEdit(0)
        }
        else
        {
            setEdit(0)
            saveCanvas()
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

    const deletePhotoFromAWS = async (link) =>{
        try
        {
            const token = await refreshToken()
            await axios.post(`${ApiAddress}/deleteAWSMedia`,{link},{headers:{"Authorization":`Bearer ${token}`}})
        }
        catch(ex){
        }
    }

    const deleteItem = async(id) =>
    {
        const localElements = [...elements]
        const idx = localElements.findIndex(x=>x.id === id)
        const awsLink = localElements[idx].type === "img" && localElements[idx].link?.includes('https://interactive-board-storage.s3.eu-north-1.amazonaws.com') ?localElements[idx].link:null
        localElements.splice(idx,1)
        setElements([...localElements])
        setEdit(0)
        if(awsLink)
        {
            deletePhotoFromAWS(awsLink)
        }
        try
        {
            const token = await refreshToken()
            await axios.delete(`${ApiAddress}/deleteBoardItem/${params.id}/${id}`,{headers:{"Authorization":`Bearer ${token}`}})
            socket.emit('elementDelete',{noteId:params.id,id})
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                navigate('/')
                authorizationError()
            }
        }
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
        saveCanvas()
    }

    const boardClicked = (e) =>{
        if(e.target.classList.contains('canvas'))
        {
            if(!brush.type)
            {
                clearElementEdit()
                setShowAddingImgForm(false)

            }
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
            const token = await refreshToken()
            const response = await axios.post(`${ApiAddress}/boardImg`,data,{headers:{"Authorization":`Bearer ${token}`}})
            setGlobalLoading(false)
            addImg(response.data)
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                navigate('/')
                authorizationError()
            }
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

    const touchZoom = (e) => {
        if (e.touches.length !== 2) return
        
        e.preventDefault()

        const [t1, t2] = e.touches

        const distance = Math.hypot(
            t1.clientX - t2.clientX,
            t1.clientY - t2.clientY
        )

        if (!startDistance.current) return

        const newScale = startScale.current * (distance / startDistance.current)

        if(newScale <= minScale + 0.05)
        {
            centerBoard()
            return
        }
        if(newScale > maxScale) return

        const rect = viewport.current.getBoundingClientRect()
        const centerX = (t1.clientX + t2.clientX) / 2 - rect.left
        const centerY = (t1.clientY + t2.clientY) / 2 - rect.top

        const scaleRatio = newScale / scaleRef.current

        translateXRef.current = centerX - scaleRatio * (centerX - translateXRef.current)

        translateYRef.current = centerY - scaleRatio * (centerY - translateYRef.current)

        scaleRef.current = newScale
        setBoardTransformation()
    }

    const boardMouseDown = (e) =>
    {
        const event = e.changedTouches?e.changedTouches[0]:e
        panStartX.current = event.clientX - translateXRef.current
        panStartY.current = event.clientY - translateYRef.current
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

        touchMoveListener.current = (e) =>{
           
            const event = e.changedTouches[0]
            if(!movingLocked.current)
                {
                    if(!mode.current || mode.current === 'pinch')
                    {
                        return touchZoom(e)
                    }
                    if(scaleRef.current > minScale + 0.1)
                    {
                        if(event.clientY - panStartY.current < 0 && event.clientY - panStartY.current - window.innerHeight > -5000*scaleRef.current)  
                        {
                            translateYRef.current = event.clientY - panStartY.current
                        }  
                        if(event.clientX - panStartX.current < 0 && event.clientX - panStartX.current - window.innerWidth > -5000*scaleRef.current)
                        {
                            translateXRef.current = event.clientX - panStartX.current

                        }
                        setBoardTransformation()
                    }
                
            }
        }

        boardRef.current.addEventListener('mousemove',mouseMoveListener.current)
        boardRef.current.addEventListener('touchmove',touchMoveListener.current,{passive:false})
    }

    const boardMouseUp = (e) =>
    {
        startDistance.current = null
        const timeStamp = e.changedTouches?e.timeStamp:e.timeStamp
        if(timeStamp-mouseDownTimeStamp.current < 100)
        {
            boardClicked(e)
        }
        boardRef.current.removeEventListener('mousemove',mouseMoveListener.current)
        boardRef.current.removeEventListener('touchmove',touchMoveListener.current)
    }

    const centerBoard = () =>{
        translateXRef.current = (viewport.current.clientWidth - boardRef.current.clientWidth*scaleRef.current) / 2
        translateYRef.current = (viewport.current.clientHeight - boardRef.current.clientHeight*scaleRef.current) /2
        setBoardTransformation()
    }

    const zoom = (e) =>{
        e.preventDefault()

        if(!e.target.closest(`.${styles.board}`))
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

    const onTouchZoomStart = (e) => {
        projectNameRef.current.blur()
        if (e.touches.length === 2) {
            const [t1, t2] = e.touches
            startDistance.current = Math.hypot(
                t1.clientX - t2.clientX,
                t1.clientY - t2.clientY
            )
            mode.current = 'pinch'
            startScale.current = scaleRef.current
        }
        if (e.touches.length === 1)
        {
            mode.current = 'pan'
        }
        boardMouseDown(e)
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
            const token = await refreshToken()
            await axios.post(`${ApiAddress}/updateNoteTitle/${params.id}`,{title:projectName},{headers:{"Authorization":`Bearer ${token}`}})
            socket.emit('titleUpdate',{noteId:params.id,title:projectName})
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                navigate('/')
                authorizationError()
            }
            else
            {
                addMessage('Nie udało się zmienić nazwy','error')

            }
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

    const getNewElement = (el) =>
    {
        switch(el.type)
        {
            case 'text':
                return new TextElementClass(el)
            case 'img':
                return new ImgElementClass(el)
            case 'shape':
                return new ShapeElementClass(el)
        }
    }

    const elementsHandler = (newElement) =>
    {
        const element = getNewElement(newElement)

        setElements((prev)=>{
            const index = prev.findIndex(x=>x.id === element.id)

            if(index === -1)
            {
                return [...prev,element]
            }
            else
            {
                const newArray = [...prev]
                newArray.splice(index,1,element)
                return [...newArray]
            }
        })

        setEdit(prev=>{
            if(element.id === prev.id)
            {
                return element
            }
            else
            {
                return prev
            }
        })

    }

    const elementsDelete = (id) =>
    {
        let deletingElement

        setElements(prev=>{
            const index = prev.findIndex(x=>x.id === id)
            deletingElement = prev[index]
            if(index !== -1)
            {
                prev.splice(index,1)
                return [...prev]
            }
        })

        setEdit(prev=>{
            if(deletingElement.id === prev.id)
            {
                return 0
            }
            else
            {
                return prev
            }
        })
    }

    const canvasHandler = (canvas) =>
    {
        setElements(prev=>{
            if(prev[0].type === 'canvas')
            {
                prev[0].content = canvas.content
                setUndoStack(canvas.content||[])
                setRedoStack([])
            }
            setCanvasHistoryUpdater(prev=>!prev)
            return [...prev]
        })
    }

    useEffect(()=>{
        if(!loginContext.loginLoading)
        {
            if(loginContext.logged)
            {
                getData()
                socket.emit('login',{user:loginContext.loggedUser,noteId:params.id})
                socket.on('usersUpdate',(userList)=>{
                    setNoteUsers(userList)
                })
                socket.on('titleUpdated',(title)=>{
                    setProjectName(title)
                })
                socket.on('elementUpdated',(element)=>{
                    elementsHandler(element)
                })
                socket.on('elementDeleted',(id)=>{
                    elementsDelete(id)
                })
                socket.on('canvasUpdated',(canvas)=>{
                    canvasHandler(canvas)
                })
                socket.on('boardTemplateUpdated',(template)=>{
                    setBackgroundTemplate(template)
                })
                socket.on('boardColorUpdated',(color)=>{
                    setBoardColor(color)
                })
            }
            else
            {
                navigate('/')
            }

        }
    },[loginContext.loginLoading])

    useEffect(()=>{
        
        if(viewport.current)
        {
        }
        window.addEventListener("wheel",zoom,{passive:false})
        window.addEventListener("resize",centerBoard)
        window.addEventListener('dragstart',blockDragging)
        window.addEventListener('wheel',blockZooming,{passive:false})

        return()=>{
            window.removeEventListener("resize",centerBoard)
            window.removeEventListener('dragstart',blockDragging)
            window.removeEventListener('wheel',blockZooming)
            window.removeEventListener("wheel",zoom)
            socket.emit("logout", { noteId: params.id })
        }
    },[])

    useEffect(()=>{
        if(!loading)
        {
            setTimeout(() => {
                setDisplayLoading(false)
                
            }, 1200);
        }
    },[loading])

    const saveBoardColor = async()=>{
        try
        {
            const token = await refreshToken()
            await axios.post(`${ApiAddress}/updateNoteColor/${params.id}`,{color:boardColor},{headers:{"Authorization":`Bearer ${token}`}})
            socket.emit('boardColorUpdate',{noteId:params.id,color:boardColor})
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                navigate('/')
                authorizationError()
            }
            addMessage('Nie zapisano koloru tła','error')
        }       
    }

    useEffect(()=>{
        if(boardColor)
        {
            saveBoardColor()
        }
    },[boardColor])

    const saveBackgroundTemplate = async() =>{
        try
        {
            const token = await refreshToken()
            await axios.post(`${ApiAddress}/updateNoteTemplate/${params.id}`,{template:backgroundTemplate},{headers:{"Authorization":`Bearer ${token}`}})
            socket.emit('boardTemplateUpdate',{noteId:params.id,template:backgroundTemplate})
        }
        catch(ex)
        {
            if(ex.status === 401)
            {
                navigate('/')
                authorizationError()
            }
            addMessage('Nie zapisano wzoru tła','error')
        }    
    }

    useEffect(()=>{
        if(backgroundTemplate)
        {
            saveBackgroundTemplate()
        }
    },[backgroundTemplate])

    useEffect(()=>{
        if(edit.type != 'canvas')
        {
            setBrush({type:'',color:brush.color,width:brush.width})
        }
    },[edit])

    useEffect(()=>{
        const body = document.querySelector('body')
        body.style.overflowY = 'hidden'
        return()=>{
            body.style.overflowY = 'auto'
        }
    },[])

    return(
        <MessageContext.Provider value={{addMessage,removeMessage}}>
        <GlobalLoadingContext.Provider value={{globalLoading,setGlobalLoading}}>
        <ClearElementEditContext.Provider value={clearElementEdit}>
        <CanvasHistoryContext value={{undoStack,setUndoStack,redoStack,setRedoStack,update:canvasHistoryUpdater,setUpdate:setCanvasHistoryUpdater}}>

            {passwordExist && <NotePassword setDisplayNotePassword={setPasswordExits} boardPassword={true} noteIdMemory={noteId}/>}

            <img src={logo} onClick={e=>navigate('/')} className={styles.logo}/>

            <BoardUsers users={noteUsers}/>

            <div className={styles.loggedMenu}>
                <LoggedMenu boardStyle={true}/>
            </div>

            {displayLoading && <div className={`${styles.loading} ${!loading?styles.loadingHide:''}`}>
                {loadingError?<div className={styles.loadingError}>
                    <ErrorIcon class={styles.errorLoadingIcon}/>
                    <h2>Wystąpił błąd serwera</h2>
                    <button onClick={e=>navigate('/')}>Wróc do strony głównej</button>
                </div>:<></>}
            </div>}

            <input ref={projectNameRef} type='text'className={styles.projectName} value={projectName} onChange={e=>setProjectName(e.target.value)} onFocus={projectNameInputFocused} onBlur={projectNameInputBlur} />

            <p className={styles.code}>{Number(noteCode) ? formatNoteCode(noteCode):noteCode}</p>

            <div className={`${styles.viewport} viewport`} ref={viewport} onDragEnter={e=>setDisplayDragElement(true)} >

                <div className={`${styles.board} board ${boardColor} ${backgroundTemplate}`} ref={boardRef} onTouchStart={onTouchZoomStart} onMouseDown={boardMouseDown} onMouseUp={boardMouseUp} onTouchEnd={boardMouseUp}>

                    {elements.find(x=>x.type === "canvas") != -1 && elements.find(x=>x.type === "canvas")?.content && <CanvasElement item={elements.find(x=>x.type==="canvas")} movingLocked={movingLocked} drawing={edit !== 0 && edit.type === "canvas" && brush.type !== ''} brush={brush}/>}

                    {elements.map((x)=>{
                        if(x.type === "text")
                        {
                            return <TextElement movingLocked={movingLocked} setEdit={setEdit} edit={edit} key={x.id} board={boardRef.current} id={x.id} item={x} />
                        }
                        else if(x.type === "img")
                        {
                            return <ImgElement movingLocked={movingLocked} key={x.id} board={boardRef.current} setEdit={setEdit} edit={edit} item={x}/>
                        }
                        else if(x.type === "shape")
                        {
                            return <ShapeElement shapeUpdater={shapeUpdater} key={x.id} movingLocked={movingLocked} board={boardRef.current} setEdit={setEdit} edit={edit} item={x} />
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

            <BottomMenu backgroundTemplate={backgroundTemplate} setBackgroundTemplate={setBackgroundTemplate} boardColor={boardColor} setBoardColor={setBoardColor} addShape={addShape} zoomBtn={zoomBtn} addTextItem={addTextItem} brushClicked={brushClicked} addImg={addImg} showAddingImgForm={showAddingImgForm} setShowAddingImgForm={setShowAddingImgForm} display={edit === 0}/>

            
            <TextMenu display={edit!==0 && edit.type === "text"} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} board={boardRef} deleteItem={deleteItem}/>
            
            <ImageMenu display={edit !== 0 && edit.type === "img"} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} deleteItem={deleteItem}/>
            
            <BrushMenu display={edit !==0 && edit.type === "canvas"} setBrush={setBrush} brush={brush} brushMenuClosed={brushMenuClosed} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate}/>

            <ShapeBottomMenu shapeUpdater={shapeUpdater} setShapeUpdater={setShapeUpdater} display={edit !==0 && edit.type === "shape"} element={edit} editUpdate={editUpdate} setEditUpdate={setEditUpdate} deleteItem={deleteItem} />

        </CanvasHistoryContext>
        </ClearElementEditContext.Provider>
        </GlobalLoadingContext.Provider>
        </MessageContext.Provider>
    )
}

export default Board
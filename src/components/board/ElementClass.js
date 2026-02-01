import axios from "axios"
import ApiAddress from "../../ApiAddress"
import refreshToken from "../auth/refreshToken"

class ElementClass
{
    constructor(config)
    {
        this.class = config.class ? [...config.class] : []
        const id = Math.floor(Math.random()*100)
        this.id = config.id || `${new Date().getTime()}${id}`
        this.left = config.left?config.left:0
        this.top = config.top?config.top:0
        this.width = config.width?config.width:""
        this.height = config.height?config.height:""
        this.moveHandler = ()=>{}
        this.touchMoveHandler = ()=>{}
        this.resizeHandler = ()=>{}
        this.resizeTouchHandler = ()=>{}
    }   

    async updater(boardId,errorFunc)
    {
        try
        {
            const token = await refreshToken()
            await axios.post(`${ApiAddress}/updateNoteContent/${boardId}`,this,{headers:{"Authorization":`Bearer ${token}`}})
            return true
        }
        catch(ex)
        {
            errorFunc()
            return false
        }
    }

    setPosition(left,top)
    {
        this.left = `${left}%`
        this.top = `${top}%`
    }

    setSizes(width,height)
    {
        this.width = `${width}px`
        this.height = `${height}px`
    }

    getTranslate()
    {
        const board = document.querySelector('.board')
        const translation = board.style['transform'].split('translate(')[1].split(')').slice(0,1).join('').split(', ')
        const scale =  Number(board.style['transform'].split('translate(')[1].split(')')[1].split('scale(')[1]) 
        const translationValues = translation.map(x=>{
            const number = Number(x.split('px')[0]) || 0
            return number
        })

        return [...translationValues,scale]
    }

    setPositionRelativeToScreen()
    {
        const [translateX,translateY,scale] = this.getTranslate()
        const left = ((window.innerWidth/2 - translateX) / scale)/5000*100
        const top = ((window.innerHeight/2 - translateY) / scale)/5000*100
        this.left = `${left}%`
        this.top = `${top}%`
    }

    getStyles()
    {
        const object = {}
        if(this.width)
        {
            object.width = this.width
        }
        if(this.height)
        {
            object.height = this.height
        }
        if(this.left)
        {
            object.left = this.left
        }
        if(this.top)
        {
            object.top = this.top
        }
        return object
    }

    addClass(name)
    {
        this.class.push(name)
    }

    removeClass(name)
    {
        const array = [...this.class]
        const idx = array.findIndex(x=>x===name)
        if(idx !== -1)
        {
            array.splice(idx,1)

        }
        this.class = [...array]
    }

    getClass()
    {
        return this.class.join(' ')
    }

    moveElement(mouseEvent,board,movingLocked,ref)
    {
        if(!mouseEvent.buttons)
        {
            this.setSolidPosition(board,movingLocked)
        }
        const [translateX,translateY,scale] = this.getTranslate()
        const left = (mouseEvent.pageX-translateX)/scale/5000*100
        const top = (mouseEvent.pageY-translateY)/scale/5000*100
        if(left > 0 + ref.clientWidth/5000*100 && left < 100-ref.clientWidth/5000*100)
        {
            ref.style.left = `${left}%`
            this.left = `${left}%`
        }
        if(top > 0 + ref.clientHeight/5000*100 && top < 100-ref.clientHeight/5000*100)
        {
            ref.style.top = `${top}%`
            this.top = `${top}%`
        }

    }

    touchMoveElement(mouseEvent,ref)
    {
        const event = mouseEvent.changedTouches[0]
        const [translateX,translateY,scale] = this.getTranslate()
        const left = (event.pageX-translateX)/scale/5000*100
        const top = (event.pageY-translateY)/scale/5000*100
        if(left > 0 + ref.clientWidth/5000*100 && left < 100-ref.clientWidth/5000*100)
        {
            ref.style.left = `${left}%`
            this.left = `${left}%`
        }
        if(top > 0 + ref.clientHeight/5000*100 && top < 100-ref.clientHeight/5000*100)
        {
            ref.style.top = `${top}%`
            this.top = `${top}%`
        }

    }

    changePosition(e,board,movingLocked,ref)
    {
        if(e.classList.contains(`editOn`))
        {
            this.moveHandler = (ev) => this.moveElement(ev,board,movingLocked,ref)
            this.touchMoveHandler = (ev) => this.touchMoveElement(ev,ref)
            board.addEventListener('mousemove',this.moveHandler) 
            board.addEventListener('touchmove',this.touchMoveHandler) 
            movingLocked.current = true
            
        }
    }  
    
    setSolidPosition(board,movingLocked){
        board.removeEventListener('mousemove',this.moveHandler)
        board.removeEventListener('touchmove',this.touchMoveHandler)
        movingLocked.current = false
    }

    checkEditMode(e,clearElementEdit,setEdit,item)
    {
        if(!e.classList.contains('editOn') && e.classList.contains('element'))
        {
            // clearElementEdit()
            e.classList.add(`editOn`)
            setEdit(item)
        }
    }

    resizeAction(e,containerRef,board,movingLocked)
    {
        if(!e.buttons)
        {
            this.resizeMouseUp(board,movingLocked)
        }
        const [translateX,translateY,scale] = this.getTranslate()
        const width = ((e.pageX-translateX)/scale-containerRef.offsetLeft)*2
        const height = ((e.pageY-translateY)/scale-containerRef.offsetTop)*2
        containerRef.style.width = `${width}px`
        containerRef.style.height = `${height}px`
        this.setSizes(width,height)
    }

    resizeTouchAction(e,containerRef)
    {
        const [translateX,translateY,scale] = this.getTranslate()
        const width = ((e.pageX-translateX)/scale-containerRef.offsetLeft)*2
        const height = ((e.pageY-translateY)/scale-containerRef.offsetTop)*2
        containerRef.style.width = `${width}px`
        containerRef.style.height = `${height}px`
        this.setSizes(width,height)
    }

    resizeMouseUp(board,movingLocked)
    {
        board.removeEventListener('mousemove',this.resizeHandler)
        board.removeEventListener('touchmove',this.resizeTouchHandler)
        movingLocked.current = false

    }

    resizeElement(board,containerRef,movingLocked)
    {
        this.resizeHandler = (e) => this.resizeAction(e,containerRef,board,movingLocked)
        this.resizeTouchHandler = (e) => this.resizeTouchAction(e.changedTouches[0],containerRef)
        board.addEventListener('mousemove',this.resizeHandler)
        board.addEventListener('touchmove',this.resizeTouchHandler)
        board.addEventListener('mouseup',e=>this.resizeMouseUp(board,movingLocked))
        board.addEventListener('touchend',e=>this.resizeMouseUp(board,movingLocked))
        movingLocked.current = true
    }

}

export default ElementClass
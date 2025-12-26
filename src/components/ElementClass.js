import axios from "axios"
import ApiAddress from "../ApiAddress"

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
        this.resizeHandler = ()=>{}
    }   

    async updater(boardId)
    {
        try
        {
            await axios.post(`${ApiAddress}/updateNoteContent/${boardId}`,this)
        }
        catch(ex){
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

    moveElement(e,mouseEvent,board,movingLocked,ref)
    {
        if(!mouseEvent.buttons)
        {
            this.setSolidPosition(board,movingLocked)
        }
        const [translateX,translateY,scale] = this.getTranslate()
        const left = (mouseEvent.pageX-translateX)/scale/5000*100
        const top = (mouseEvent.pageY-translateY)/scale/5000*100
        if(left > 0 + ref.clientWidth/1.9/5000*100 && left < 100-ref.clientWidth/1.9/5000*100)
        {
            e.style.left = `${left}%`
        }
        if(top > 0 + ref.clientHeight/1.9/5000*100 && top < 100-ref.clientHeight/1.9/5000*100)
        {
            e.style.top = `${top}%`

        }
        
        this.setPosition(left,top)
    }

    changePosition(e,board,movingLocked,ref)
    {
        if(e.classList.contains(`editOn`))
        {
            this.moveHandler = (ev) => this.moveElement(e,ev,board,movingLocked,ref)
            board.addEventListener('mousemove',this.moveHandler) 
            movingLocked.current = true
            
        }
    }  
    
    setSolidPosition(board,movingLocked){
        board.removeEventListener('mousemove',this.moveHandler)
        movingLocked.current = false
    }

    checkEditMode(e,clearElementEdit,setEdit,item)
    {
        if(!e.classList.contains('editOn') && e.classList.contains('element'))
        {
            clearElementEdit()
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

    resizeMouseUp(board,movingLocked)
    {
        board.removeEventListener('mousemove',this.resizeHandler)
        movingLocked.current = false

    }

    resizeElement(board,containerRef,movingLocked)
    {
        this.resizeHandler = (e) => this.resizeAction(e,containerRef,board,movingLocked)
        board.addEventListener('mousemove',this.resizeHandler)
        board.addEventListener('mouseup',e=>this.resizeMouseUp(board,movingLocked))
        movingLocked.current = true
    }

}

export default ElementClass
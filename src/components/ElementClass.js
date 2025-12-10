class ElementClass
{
    constructor(classNames)
    {
        this.class = classNames ? [...classNames] : []
        const id = Math.floor(Math.random()*100)
        this.id = `${new Date().getTime()}${id}`
        this.moveHandler = ()=>{}
        this.resizeHandler = ()=>{}
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

    setPositionRelativeToScreen()
    {
        const left = (window.scrollX+window.innerWidth/2)/5000 * 100
        const top = (window.scrollY+window.innerHeight/2)/5000 * 100
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

    moveElement(e,mouseEvent)
    {
        const left = mouseEvent.pageX/5000*100
        const top = mouseEvent.pageY/5000*100
        e.style.left = `${left}%`
        e.style.top = `${top}%`
        this.setPosition(left,top)
    }

    changePosition(e,board,movingLocked)
    {
        if(e.classList.contains(`editOn`))
        {
            this.moveHandler = (ev) => this.moveElement(e,ev)
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

    resizeAction(e,containerRef)
    {
        const width = (e.pageX-containerRef.offsetLeft)*2
        const height = (e.pageY-containerRef.offsetTop)*2
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
        this.resizeHandler = (e) => this.resizeAction(e,containerRef)
        board.addEventListener('mousemove',this.resizeHandler)
        board.addEventListener('mouseup',e=>this.resizeMouseUp(board,movingLocked))
        movingLocked.current = true
    }

}

export default ElementClass
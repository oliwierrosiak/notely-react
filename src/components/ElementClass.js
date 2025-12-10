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
        this.width = `${width}rem`
        this.height = `${height}vh`
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
        const width = (e.pageX-containerRef.offsetLeft)/window.innerWidth*200
        const height = (e.pageY-containerRef.offsetTop)/window.innerHeight*200
        containerRef.style.width = `${width}rem`
        containerRef.style.height = `${height}vh`
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
class TextElementClass
{
    constructor(classNames)
    {
        this.class = classNames ? [...classNames] : ''
        const id = Math.floor(Math.random()*1000000)
        this.id = id
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

    setText(val)
    {
        this.text = val
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
        console.log(object)
        return object
    }
}

export default TextElementClass
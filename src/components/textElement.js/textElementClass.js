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
}

export default TextElementClass
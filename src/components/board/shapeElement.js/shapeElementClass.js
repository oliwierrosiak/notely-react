import ElementClass from "../ElementClass";

class ShapeElementClass extends ElementClass
{
    constructor(config)
    {
        super(config)
        this.type = "shape"
        this.item = config.item
        this.rotate = config.rotate?config.rotate:0
    }

    resizeAction(e,containerRef,board,movingLocked)
    {
        if(!e.buttons)
        {
            this.resizeMouseUp(board,movingLocked)
        }
        const [translateX,translateY,scale] = this.getTranslate()
        const width = ((e.pageX-translateX)/scale-containerRef.offsetLeft)*2
        containerRef.style.width = `${width}px`
        containerRef.style.height = `${width}px`
        this.setSizes(width,width)
    }

    resizeTouchAction(e,containerRef)
    {
        const [translateX,translateY,scale] = this.getTranslate()
        const width = ((e.pageX-translateX)/scale-containerRef.offsetLeft)*2
        containerRef.style.width = `${width}px`
        containerRef.style.height = `${width}px`
        this.setSizes(width,width)
    }

    getRotate()
    {
        if(this.rotate)
        {
           return {rotate:`${this.rotate}deg`} 
        }
    }

    setRotate(deg)
    {
        this.rotate = deg
    }
}


export default ShapeElementClass
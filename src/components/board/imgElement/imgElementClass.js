import ElementClass from "../ElementClass"

class ImgElementClass extends ElementClass
{
    constructor(config)
    {
        super(config)
        this.link = config.link
        this.type = 'img'
        this.proportion = config.proportion || 1
        this.mimetype = config.mimetype
        this.brightness = config.brightness || 1
        this.contrast = config.contrast || 1
        this.minHeight = config.minHeight || 0
        this.minWidth = config.minWidth || 0
    }

    setProportion(img)
    {
        if(!this.width)
        {
            this.proportion = img.clientHeight/img.clientWidth
            this.width = '200px'
            const width = 200
            const height = width * this.proportion
            this.height = `${height*1.05}px`
            img.closest('.element').style.height = this.height
            img.closest('.element').style.minHeight = `${height/2}px`
            this.minHeight = `${height/2}px`
            img.closest('.element').style.minWidth = `${width/2}px`
            this.minWidth = `${width/2}px`
        }
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
        if(this.minHeight)
        {
            object.minHeight = this.minHeight
        }
        if(this.minWidth)
        {
            object.minWidth = this.minWidth
        }
        return object
    }

    resizeAction(e,containerRef,board,movingLocked)
    {
         if(!e.buttons)
        {
            this.resizeMouseUp(board,movingLocked)
        }
        const [translateX,translateY,scale] = this.getTranslate()
        const width = ((e.pageX-translateX)/scale-containerRef.offsetLeft)*2
        const height = width * this.proportion
        containerRef.style.width = `${width}px`
        containerRef.style.height = `${height*1.1}px`
        this.setSizes(width,height*1.1)
    }

    setBrightness(value)
    {
        this.brightness = value
    }

    getBrightnessAndContrast()
    {
        const object = {}
        if(this.brightness || this.brightness === 0)
        {
            object.filter = `brightness(${this.brightness})`
        }
        if(this.contrast || this.contrast === 0)
        {
            if(object.filter)
            {
                object.filter += ` contrast(${this.contrast})`
            }
            else
            {
                object.filter = `contrast(${this.contrast})`
            }
        }
        return object
    }

    setContrast(value)
    {
        this.contrast = value
    }



}

export default ImgElementClass
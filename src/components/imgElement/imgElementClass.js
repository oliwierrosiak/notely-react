import ElementClass from "../ElementClass"

class ImgElementClass extends ElementClass
{
    constructor(classNames,link,mimetype)
    {
        super(classNames)
        this.link = link
        this.type = 'img'
        this.proportion = 1
        this.mimetype = mimetype
        this.brightness = 1
        this.contrast = 1
    }

    setProportion(img)
    {
        this.proportion = img.clientHeight/img.clientWidth
        this.width = `200px`
        const width = 200
        const height = width * this.proportion
        this.height = `${height*1.05}px`
        img.closest('.element').style.height = this.height
        img.closest('.element').style.minHeight = `${height/2}px`
        img.closest('.element').style.minWidth = `${width/2}px`

    }

    resizeAction(e,containerRef)
    {
        const width = (e.pageX-containerRef.offsetLeft)*2
        const height = width * this.proportion
        containerRef.style.width = `${width}px`
        containerRef.style.height = `${height*1.05}px`
        this.setSizes(width,height*1.05)
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
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
    }

    setProportion(img)
    {
        console.log('teraz')
        this.proportion = img.clientHeight/img.clientWidth
        this.width = `10rem`
        const width = 10
        const height = width * this.proportion
        this.height = `${height + height*0.2}rem`
        img.closest('.element').style.height = this.height
        img.closest('.element').style.minHeight = `${height/2}rem`
        img.closest('.element').style.minWidth = `${width/2}rem`

    }

    setSizes(width,height)
    {
        this.width = `${width}rem`
        this.height = `${height}rem`
    }

    resizeAction(e,containerRef)
    {
        const width = (e.clientX-containerRef.offsetLeft)/window.innerWidth*200
        const height = width * this.proportion
        containerRef.style.width = `${width}rem`
        containerRef.style.height = `${height*1.2}rem`
        this.setSizes(width,height*1.2)
    }

}

export default ImgElementClass
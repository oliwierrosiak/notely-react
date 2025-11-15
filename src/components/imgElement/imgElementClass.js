import ElementClass from "../ElementClass"

class ImgElementClass extends ElementClass
{
    constructor(classNames,link)
    {
        super(classNames)
        this.link = link
        this.type = 'img'
    }

}

export default ImgElementClass
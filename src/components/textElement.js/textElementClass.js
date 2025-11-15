import ElementClass from "../ElementClass"

class TextElementClass extends ElementClass
{
    constructor(classNames)
    {
        super(classNames)
        this.type = 'text'
    }   

    setText(val)
    {
        this.text = val
    }
}

export default TextElementClass
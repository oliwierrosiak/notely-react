import ElementClass from "../ElementClass"

class TextElementClass extends ElementClass
{
    constructor(config)
    {
        super(config)
        this.text = config.text
        this.type = 'text'
    }   

    setText(val)
    {
        this.text = val
    }
}

export default TextElementClass
class SimpleTextEditor 
{
    constructor(element, options = {}) {
        this.element = element;
        this.textEditor = element
        this.options = {
            borderColor: '#eee',
            padding: '5px',
            defaultFontFamily: 'inherit',
            extraFontFamilies: {}, // css-name: display-name
        }
        for (let key in options) {
            this.options[key] = options[key];
        }
        this.lastRange = null;
        this.init()
        console.log(this.options);
    }
    init () {
        this.autoAdjustHeight();
        this.wrapHtml()
        this.textEditor = this.element.querySelector(".textEditor");
        this.textEditor.addEventListener("input", this.elementUpdated);
        this.textEditor.addEventListener("keyup", this.elementUpdated);
        this.textEditor.addEventListener("focusout", this.elementUpdated);
        window.addEventListener("resize", this.autoAdjustHeight);
        this.textEditor.addEventListener("resize", this.autoAdjustHeight);
        const boldButton = this.element.querySelector("#bold-button");
        const italicButton = this.element.querySelector("#italic-button");
        const underlineButton = this.element.querySelector("#underline-button");
        const strikethroughButton = this.element.querySelector("#strikethrough-button");
        const fontFamilySelect = document.getElementById("font-family-select");

        // Event listeners for the formatting buttons
        boldButton.addEventListener("click", () => this.formatText("bold"));
        italicButton.addEventListener("click", () => this.formatText("italic"));
        underlineButton.addEventListener("click", () => this.formatText("underline"));
        strikethroughButton.addEventListener("click", () => this.formatText("strikethrough"));
        fontFamilySelect.addEventListener("change", (e) => {
            this.formatText("fontName", e.target.value);
        });
        this.textEditor.addEventListener("paste", (e) => {
            e.preventDefault(); // Prevent default pasting behavior
            let text = (e.originalEvent || e).clipboardData.getData("text/plain");
            // Clean and format the pasted text
            text = text.split(/\t/g)
                .join('&nbsp;&nbsp;&nbsp;&nbsp;')
                .split(/ /g)
                .join('&nbsp;')
                .split(/\n/g)
                .join('<br>')
            const cleanedText = '' + (text) + '';
            // Insert the cleaned text into the contenteditable div
            document.execCommand("insertHTML", false, cleanedText);
        });
    }
    formatText(command, val = null) {
        // this.focusOnEditor()
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            console.log(22, selection);
            const range = selection.getRangeAt(0);
            const restoredSelection = document.createRange();
            restoredSelection.setStart(range.startContainer, range.startOffset);
            restoredSelection.setEnd(range.endContainer, range.endOffset);
            
            document.execCommand("styleWithCSS", false, true);
            document.execCommand(command, false, val);
        
            selection.removeAllRanges();
            selection.addRange(restoredSelection);
        }

        document.execCommand("styleWithCSS", false, true);
        document.execCommand(command, false, val);
    }
    focusOnEditor() {
        this.textEditor.focus();
        if (this.lastRange) {
            this.element.setSelectionRange(this.lastRange.start, this.lastRange.end);
        }
    }

    elementUpdated = (event) => {
        // console.log("element updated:" , this);
        if(this.options.onUpdate) this.options.onUpdate(event.target.innerHTML);
    }
    autoAdjustHeight() {
        // div element don't height adjustment, only the texteditor
        // this.element.style.height = "auto";
        // this.element.style.height = this.element.scrollHeight + "px";
    }
    wrapHtml() {
        let css = `
        <style>
            .marifuli-simple-texteditor {
                margin: 0;
                padding: 0;
                border: 1.5px solid ${ this.options.borderColor };
                border-radius: 1.5px;
                font-family: ${ this.options.defaultFontFamily };
            }
            .marifuli-simple-texteditor [contenteditable] {
                padding: ${ this.options.padding };
            }
            .marifuli-simple-texteditor [contenteditable]:focus {
                outline: none;
            }
            .marifuli-simple-texteditor .menus {
                border-bottom: 1px solid ${ this.options.borderColor };
                padding: 3px;
            }
            .marifuli-simple-texteditor .menus button {
                border: none;
                background: none;
                cursor: pointer;
                padding: 4px 7px;
                border-radius: 4px;
            }
            .marifuli-simple-texteditor .menus button:hover {
                background: #e4e4e4;
            }
            .marifuli-simple-texteditor .menus #bold-button {
                font-weight: bold;
            }
            .marifuli-simple-texteditor .menus #italic-button {
                font-style: italic;
                font-weight: bold; font-family: Arial;
            }
            .marifuli-simple-texteditor .menus #underline-button {
                text-decoration: underline;
                font-weight: bold;
            }
            .marifuli-simple-texteditor .menus #strikethrough-button {
                text-decoration: line-through;
                font-weight: bold;
            }
        </style>
        `
        this.element.innerHTML = css +  
            `<div class="menus">
                <button title="Bold" id="bold-button">B</button>
                <button title="Italic" id="italic-button">I</button>
                <button title="Underline" id="underline-button">U</button>
                <button title="Strike through" id="strikethrough-button">S</button>
                <select id="font-family-select">
                    <option value="inherit">Default Font</option>
                    <option value="Arial">Arial</option>
                    <option value="Arial Black">Arial Black</option>
                    <option value="serif">Serif</option>
                    <option value="sans-serif">Sans-Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="cursive">Cursive</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                </select>
            </div>` +
            '<div class="textEditor" contenteditable="true">' +
            this.element.innerHTML + 
            '</div>';
    }
}
export default SimpleTextEditor
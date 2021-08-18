import "codemirror/lib/codemirror.css"
import "codemirror/mode/javascript/javascript"
import "codemirror/mode/xml/xml"
import "codemirror/mode/clike/clike"
import "codemirror/theme/dracula.css"
import React from "react"
import { Controlled as CodeMirror } from "react-codemirror2"

const mimeTypes = {
  XML: "application/xml",
  JSON: "text/javascript",
  CSHARP: "text/x-csharp",
}

class Editor extends React.Component {

  onBeforeChange = (editor, data, value) => {
    const { onChange } = this.props
    if(onChange) onChange(value)
  }

  paste(str) {
    if (!this.editor) throw new Error("Paste called too early: no editor instance")
    this.editor.doc.replaceRange(str, this.editor.doc.getCursor())
  }

  render() {
    const { value, type, options, height } = this.props

    const _options = Object.assign({}, {
      mode: mimeTypes[type] || "text/plain",
      theme: "dracula",
      lineNumbers: true,
      autoFocus: true,
      autorefresh: true,
      extraKeys: {
        'Ctrl-Space': this.autoComplete
      }
    }, (options || {}))

    const newProps = {
      editorDidMount: editor => {
        if(height && editor) editor.setSize(null, height)
        this.editor = editor
        editor.setValue(value)
        const that = this
        setTimeout(() => that.editor.refresh(), 1)
        return this.editor
      },
      value: value,
      onBeforeChange: this.onBeforeChange,
      options: _options
    }

    return (
      <CodeMirror {...newProps} />
    )
  }
}

export default Editor

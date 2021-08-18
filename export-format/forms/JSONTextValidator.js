import React from "react"
import get from "lodash/get"
import Editor from "../../common/components/editor/Editor"

const JSONTextValidator = ({configuration, onChange}) => (
    <Editor
      type={get(configuration, "type") || ""}
      value={get(configuration, "validator") || ""}
      onChange={val => onChange(val)}
      />
  )

export default JSONTextValidator
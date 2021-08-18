import React from "react"


const StringParam = ({
  value,
  // functions 
  onChange
}) => (
  <React.Fragment>
    <input
      className="form-control"
      type="text"
      onChange={e => onChange(e.target.value)}
      value={value || ""} />
  </React.Fragment>
)

export default StringParam

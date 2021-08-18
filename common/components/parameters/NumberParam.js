import React from "react"


const NumberParam = ({
  value,
  // functions 
  onChange
}) => (
  <React.Fragment>
    <input
      className={`form-control ${!isNaN(parseFloat(value)) && isFinite(value) ? "" : "is-invalid"}`}
      type="text"
      onChange={e => onChange(e.target.value)}
      value={value || ""} />
  </React.Fragment>
)

export default NumberParam

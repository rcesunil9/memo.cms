import React from "react"
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'

const NumericProperty = ({property, value, onChange}) => (
  <React.Fragment>
    <input
      className="form-control"
      type="number" 
      step="0.01"
      onChange={e => e.currentTarget.value === null || e.currentTarget.value === "" ? onChange(e.currentTarget.value) : onChange(Number(e.currentTarget.value))}
      value={value === null ? "" : value} 
      />
  </React.Fragment>
)

export default onlyUpdateForKeys(['value', 'name'])(NumericProperty);

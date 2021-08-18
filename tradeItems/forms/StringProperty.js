import React from "react"
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';


const StringProperty = ({property, value, onChange}) => (
  <React.Fragment>
    <input
      className="form-control"
      type="text"
      onChange={e => onChange(e.target.value)}
      value={value || ""} />
  </React.Fragment>
)

export default onlyUpdateForKeys(['value', 'name'])(StringProperty);

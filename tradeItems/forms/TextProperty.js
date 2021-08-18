import React from "react"
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'


const TextProperty = ({property, value, onChange}) => (
  <React.Fragment>
    <textarea
      rows={6}
      className="form-control"
      type="text"
      value={value || ""}
      onChange={e => onChange(e.target.value)} />
  </React.Fragment>
)

export default onlyUpdateForKeys(['value', 'name'])(TextProperty);

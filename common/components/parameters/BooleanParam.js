import React from "react"

const BooleanParam = ({
  value,
  // functions 
  onChange
}) => (
  <React.Fragment>
    <input
        type="checkbox"
        className="form-control"
        checked={!!value || false}
        onChange={e => !!onChange(e.target.checked)}
        />
  </React.Fragment>
)

export default BooleanParam

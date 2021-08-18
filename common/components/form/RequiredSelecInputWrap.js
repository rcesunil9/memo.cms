import React from "react"
import Select from "react-select"

export const RequiredSelectInputWrap = (props) => {
  return <React.Fragment>
    <Select
      {...props}
    />
    <input
      tabIndex={-1}
      value={props.value || ''}
      required={props.required}
      onChange={() => {}}
      style={{
        opacity: 0,
        width: 0,
        height: 0,
        position: 'absolute',
      }}
    />
  </React.Fragment>
};
import map from "lodash/map"
import noop from "lodash/noop"
import get from "lodash/get"
import React from "react"
import Select from "react-select"

// A wrapper around 'react-select' that deals with plain string
// options instead of {value, label} objects.

const makeOption = name => ({ value: name, label: name })
const makeOptions = optionNames => map(optionNames, makeOption)

const SelectString = ({ options, value, onChange = noop, ...rest }) => (
  <Select
    {...rest}
    options={makeOptions(options)}
    value={value === null ? (rest.isMulti === true ? [] : "") : (rest.isMulti === true ? map(value, v => makeOption(v)) : makeOption(value)) }
    onChange={option => {
      return rest.isMulti === true ? (onChange(map(option, o => get(o, "value", null)))) : onChange(get(option, "value", null))
    }} />
)

export default SelectString

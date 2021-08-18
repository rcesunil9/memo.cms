import map from "lodash/map"
import React from "react"
import CheckboxSelector from "./CheckBoxSelector"

// Wrapper around CheckboxSelector that deals with strings
// instead of {value, label} objects.

const makeOption = name => ({ value: name, label: name })
const makeOptions = optionNames => map(optionNames, makeOption)

const CheckboxStringSelector = ({ options, valueArray, onChange, ...rest }) => (
  <CheckboxSelector
    {...rest}
    options={makeOptions(options)}
    valueArray={makeOptions(valueArray)}
    onChange={x => onChange(map(x, 'value'))}
  />
)

export default CheckboxStringSelector

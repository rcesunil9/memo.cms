import React from "react"
import Select, { components } from 'react-select'
import FlagIcon from "./FlagIcon"

const Option = props => (
  <components.Option {...props}>
    <FlagIcon code={props.label} />
    &nbsp;&nbsp;{props.label}
  </components.Option>
)

const LanguageSelect = props => (
  <Select
    {...props}
    components={{ Option }} />
)

export default LanguageSelect

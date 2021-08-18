import React from "react"
import Select from "react-select"
import get from "lodash/get"
import find from "lodash/find"
import { getDefaultTransformer } from "../transformers"

const getTransformation = (value, apply) => Object.assign({}, value || getDefaultTransformer(), {type: "price", value: apply})

const options = [
  {label: "EUR", value: "eur"},
]

const CurrencyTransformer = ({value, onChange}) => (
  <React.Fragment>
    <Select
      value={find(options, o => o.value === get(value, "value", null))}
      onChange={o => onChange(getTransformation(value, get(o, "value", null)))}
      isClearable={true}
      options={options} />
  </React.Fragment>
)

export default CurrencyTransformer

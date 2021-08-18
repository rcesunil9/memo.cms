import React from "react"
import get from "lodash/get"
import { getDefaultTransformer } from "../transformers"

const getTransformation = (value, apply) => apply.trim() ? Object.assign({}, value || getDefaultTransformer(), {type: "date", value: apply}) : null

const DateTransformer = ({value, onChange}) => (
  <React.Fragment>
    <input
      placeholder="dd/mm/YYYY"
      onChange={e => onChange(getTransformation(value, e.target.value))}
      value={get(value, "value", "")}
      className="form-control" />
  </React.Fragment>
)

export default DateTransformer

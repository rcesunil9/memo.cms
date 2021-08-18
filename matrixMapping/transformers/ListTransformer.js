import React from "react"
import Select from "react-select"
import update from 'immutability-helper'
import get from "lodash/get"
import find from "lodash/find"
import map from "lodash/map"
import { getDefaultTransformer } from "../transformers"

const getDefaultItem = () => {return {
  fixedValueCode: null,
  mapping: ""
}}

const getTransformation = (value, apply) => Object.assign({}, value || getDefaultTransformer(), {type: "list", values: apply})

const ListTransformer = ({value, onChange, options}) => (
  <React.Fragment>
    {map(get(value, "values", []), (v, k) => (
      <div className="row mb-2" key={`list-transform-${k}`}>
        <div className="col">
          <Select
            value={find(options, o => o.value === get(v, "fixedValueCode", null))}
            onChange={o => onChange(getTransformation(value, update(get(value, "values", []), {[k]: {fixedValueCode: {$set: o.value}}})))}
            isClearable={true}
            options={options} />
        </div>
        <div className="col">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="mapping"
              onChange={e => onChange(getTransformation(value, update(get(value, "values", []), {[k]: {mapping: {$set: e.target.value}}})))}
              value={get(v, "mapping", "")} />
            <div className="input-group-append" onClick={e => onChange(getTransformation(value, update(get(value, "values", []), {$splice: [[k, 1]]})))}>
              <div className="input-group-text"><i className="icon-close" /></div>
            </div>
          </div>
        </div>
      </div>
    ))}
    <button
      onClick={e => {
        e.preventDefault()
        onChange(getTransformation(value, update(get(value, "values", []), {$push: [getDefaultItem()]})))
      }}
      className="btn btn-sm btn-secondary"
      >+ Add</button>
  </React.Fragment>
)

export default ListTransformer

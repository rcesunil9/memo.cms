import React from "react"
import get from "lodash/get"
import { getDefaultTransformer } from "../transformers"

const getTransformation = (value, apply) => Object.assign({}, value || getDefaultTransformer(), {type: "string", value: apply})

const StringTransformer = ({value, onChange}) => (
  <React.Fragment>
    <div className="btn-group btn-group-toggle" data-toggle="buttons">
      {/* No transformation */}
      <label className={`btn btn-secondary ${get(value, "value", null) === null ? "active" : ""}`}>
        <input
          onChange={e => onChange(null)}
          type="radio"
          name="options"
          autoComplete="off" /> No transformation
      </label>
      {/* Regex */}
      <label className={`btn btn-secondary ${get(value, "value") === "regex" ? "active" : ""}`}>
        <input
          onChange={e => onChange(getTransformation(value, "regex"))}
          type="radio"
          name="options"
          autoComplete="off" /> Regex
      </label>
      {/* Uppercase */}
      <label className={`btn btn-secondary ${get(value, "value") === "upper" ? "active" : ""}`}>
        <input
          onChange={e => onChange(getTransformation(value, "upper"))}
          type="radio"
          name="options"
          autoComplete="off" /> Upper
      </label>
      {/* Lowercase */}
      <label className={`btn btn-secondary ${get(value, "value") === "lower" ? "active" : ""}`}>
        <input
          onChange={e => onChange(getTransformation(value, "lower"))}
          type="radio"
          name="options"
          autoComplete="off" /> Lower
      </label>
      {/* camelCase */}
      <label className={`btn btn-secondary ${get(value, "value") === "camelcase" ? "active" : ""}`}>
        <input
          onChange={e => onChange(getTransformation(value, "camelcase"))}
          type="radio"
          name="options"
          autoComplete="off" /> Camel Case
      </label>
      {/* trim */}
      <label className={`btn btn-secondary ${get(value, "value") === "trim" ? "active" : ""}`}>
        <input
          onChange={e => onChange(getTransformation(value, "trim"))}
          type="radio"
          name="options"
          autoComplete="off" /> Trim
      </label>
    </div>
    {/* Regex */}
    {get(value, "value") === "regex" && <div className="form-group mt-2">
      <input
        onChange={e => onChange({type: "string", value: "regex", extraValue: e.target.value})}
        value={get(value, "extraValue") || ""}
        className="form-control mb-1"
        type="text" />
      <code>Ex: {"(?<MatchedValue>\\d+)\\s*test"}</code>
      <a 
        href={`https://regex101.com?regex=${encodeURIComponent(get(value, "extraValue", ""))}&flags=g,m`} 
        target="blank" 
        className="float-right">Test you regular expression</a>
    </div>}
    
  </React.Fragment>
)

export default StringTransformer

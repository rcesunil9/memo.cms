import update from "immutability-helper"
import map from "lodash/map"
import React from "react"
import CreatableSelect from "react-select/creatable"
import { inputChanger } from "../utils"

const makeOptions = strings => map(strings, s => ({ label: s, value: s }))

const NewFileOnFTPTriggerViewModel = ({ model, onChange }) => {
  const change = inputChanger(model, onChange)
  const changeExtensions = options =>
    onChange(update(model, { fileExtensions: { $set: options.map(o => o.value) } }))

  return (
    <React.Fragment>
      {/* url	string */}
      <div className="form-group">
        <label className="control-label">URL*</label>
        <input className="form-control" name="url" value={model.url} onChange={change} required />
      </div>

      {/* username	string */}
      <div className="form-group">
        <label className="control-label">Username*</label>
        <input
          className="form-control"
          name="username"
          value={model.username}
          onChange={change}
          required
        />
      </div>

      {/* password	string */}
      <div className="form-group">
        <label className="control-label">Password*</label>
        <input
          className="form-control"
          name="$wordpass"
          value={model.password}
          onChange={change}
          required
        />
      </div>

      {/* path	string */}
      <div className="form-group">
        <label className="control-label">Path*</label>
        <input className="form-control" name="path" value={model.path} onChange={change} required />
      </div>

      {/* fileExtensions	[string] */}
      <div className="form-group">
        <label className="control-label">File extensions</label>
        <CreatableSelect
          isMulti
          closeMenuOnSelect={false}
          onChange={changeExtensions}
          options={[]}
          value={makeOptions(model.fileExtensions)}
        />
      </div>
    </React.Fragment>
  )
}

export default NewFileOnFTPTriggerViewModel

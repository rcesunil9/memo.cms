import update from "immutability-helper"
import filter from "lodash/filter"
import map from "lodash/map"
import React from "react"
import Select from "react-select"

const makeOption = obj => ({ label: obj.name, value: obj.id })

const GroupEdit = ({ group, rights, onChange, onSave, onCancel }) => {
  const save = e => {
    e.preventDefault()
    onSave()
  }

  const onInput = e => {
    const n = update(group, { [e.target.name]: { $set: e.target.value } })
    onChange(n)
  }

  const rightOptions = map(rights, makeOption)
  const selectedRightOptions = filter(rightOptions, option => group.rightIds.includes(option.value))

  const onRightsChange = options => {
    const n = update(group, { rightIds: { $set: map(options, "value") } })
    onChange(n)
  }

  return (
    <form onSubmit={save}>
      <div className="row">
        <div className="form-group col-6">
          <label className="control-label">Name*</label>
          <input
            className="form-control"
            name="name"
            onChange={onInput}
            value={group.name}
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="form-group col-6">
          <label className="control-label">Rights</label>
          <Select
            isMulti
            options={rightOptions}
            value={selectedRightOptions}
            onChange={onRightsChange}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
      </div>
      <div className="form-group d-flex justify-content-end">
        <button className="btn btn-secondary mr-2" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </div>
    </form>
  )
}

export default GroupEdit

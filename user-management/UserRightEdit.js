import update from "immutability-helper"
import React from "react"

const UserRightEdit = ({ right, onChange, onSave, onCancel }) => {
  const save = e => {
    e.preventDefault()
    onSave()
  }

  const onInput = e => {
    const n = update(right, { [e.target.name]: { $set: e.target.value } })
    onChange(n)
  }

  return (
    <form onSubmit={save}>
      <div className="row">
        <div className="col-6">
          <div className="form-group">
            <label className="control-label">Name*</label>
            <input
              className="form-control"
              name="name"
              onChange={onInput}
              value={right.name}
              required
            />
          </div>
          <div className="form-group">
            <label className="control-label">Code*</label>
            <input
              className="form-control"
              name="code"
              onChange={onInput}
              value={right.code}
              required
            />
          </div>
          <div className="form-group">
            <label className="control-label">Description</label>
            <input
              className="form-control"
              name="description"
              onChange={onInput}
              value={right.description}
            />
          </div>
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

export default UserRightEdit

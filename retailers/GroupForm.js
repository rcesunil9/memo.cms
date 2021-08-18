import update from "immutability-helper"
import React from "react"
import { Col, Row } from "./utils"

const GroupForm = props => {
  const { onChange, onSave, onDelete, onCancel, group } = props
  const change = key => value => onChange(update(group, { [key]: { $set: value } }))
  const save = e => {
    e.preventDefault()
    onSave()
  }
  return (
    <form onSubmit={save}>
      <div className="form-group">
        <label>Name*</label>
        <input
          className="form-control"
          value={group.name}
          required
          onChange={e => change("name")(e.target.value)}
        />
      </div>
      <Row>
        {onDelete && (
          <Col>
            <button className="btn btn-danger" type="button" onClick={onDelete}>
              Delete
            </button>
          </Col>
        )}
        <Col className="d-flex justify-content-end">
          <button className="btn btn-secondary mr-2" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </Col>
      </Row>
    </form>
  )
}

export default GroupForm

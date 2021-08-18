import update from "immutability-helper"
import React from "react"
import SelectString from "../common/components/form/SelectString"
import getModelForm from "./actionForm/index"
import { actionDiscriminators, inputChanger } from "./utils"

const ActionForm = props => {
  const {
    action,
    onChange,
    onSave,
    onDelete,
    businessRules,
    languages,
    retailers,
    users,
    tradeItemCategories
  } = props

  const change = inputChanger(action, onChange)
  const changeDiscriminator = val => onChange(update(action, { discriminator: { $set: val } }))
  const save = e => {
    e.preventDefault()
    onSave()
  }

  const Model = getModelForm(action.discriminator)
  return (
    <form onSubmit={save}>
      {/* Name */}
      <div className="form-group">
        <label className="control-label">Name*</label>
        <input
          className="form-control"
          name="name"
          value={action.name}
          onChange={change}
          required
        />
      </div>

      {/* Discriminator */}
      <div className="form-group">
        <label className="control-label">Type*</label>
        <SelectString
          options={actionDiscriminators()}
          value={action.discriminator}
          onChange={changeDiscriminator}
        />
      </div>

      {/* Type-specific properties */}
      <Model
        model={action}
        onChange={onChange}
        {...{ businessRules, languages, retailers, users, tradeItemCategories }}
      />

      {/* Action buttons */}
      <div className="form-group row">
        {onDelete && (
          <div className="col">
            <button className="btn btn-danger" type="button" onClick={onDelete}>
              Delete
            </button>
          </div>
        )}
        <div className="col d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </div>
    </form>
  )
}

export default ActionForm

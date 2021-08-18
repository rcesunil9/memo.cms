import update from "immutability-helper"
import filter from "lodash/filter"
import find from "lodash/find"
import map from "lodash/map"
import React from "react"
import Select from "react-select"
import CreatableSelect from "react-select/creatable"
import { inputChanger } from "../utils"

const SendEmailActionViewModel = ({ model, users, onChange }) => {
  const input = inputChanger(model, onChange)

  const registeredUserOptions = map(users, u => ({
    label: `${u.firstname} ${u.lastname}`,
    value: u.id
  }))
  const selectedRegisteredUsers = filter(registeredUserOptions, o =>
    find(model.registredRecipients, id => id === o.value)
  )
  const changeRegisteredUsers = options =>
    onChange(update(model, { registredRecipients: { $set: map(options, "value") } }))

  const changeEmails = options =>
    onChange(update(model, { unknownRecipients: { $set: map(options, o => o.value) } }))
  const selectedEmails = map(model.unknownRecipients, s => ({ label: s, value: s }))

  return (
    <React.Fragment>
      {/* unknownRecipients	[string] */}
      <div className="form-group">
        <label className="control-label">Unknown recipients</label>
        <CreatableSelect isMulti onChange={changeEmails} options={[]} value={selectedEmails} />
      </div>

      {/* registredRecipients	[uuid] */}
      <div className="form-group">
        <label className="control-label">Registered recipients</label>
        <Select
          isMulti
          closeMenuOnSelect={false}
          options={registeredUserOptions}
          value={selectedRegisteredUsers}
          onChange={changeRegisteredUsers}
        />
      </div>

      {/* object	string */}
      <div className="form-group">
        <label className="control-label">Object</label>
        <input className="form-control" name="object" value={model.object || ""} onChange={input} />
      </div>

      {/* body	string */}
      <div className="form-group">
        <label>Body</label>
        <textarea className="form-control" name="body" value={model.body || ""} onChange={input} />
      </div>
    </React.Fragment>
  )
}

export default SendEmailActionViewModel

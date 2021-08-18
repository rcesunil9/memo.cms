import update from "immutability-helper"
import filter from "lodash/filter"
import map from "lodash/map"
import get from "lodash/get"
import find from "lodash/find"
import React from "react"
import Select from "react-select"
import SelectString from "../common/components/form/SelectString"
import * as utils from "./utils"
import { date } from "app/common/utils/date"

const makeOption = obj => ({ label: obj.name, value: obj.id })

const UserEdit = ({ user, onChange, onSave, onCancel, groups, manufacturers, retailers, onMakePasswordClick }) => {
  const save = e => {
    e.preventDefault()
    onSave()
  }

  const groupOptions = map(groups, makeOption)
  const selectedGroupOptions = filter(groupOptions, option => user.groupIds.includes(option.value))

  const onInput = e => {
    const n = update(user, { [e.target.name]: { $set: e.target.value } })
    onChange(n)
  }

  const onGroupsChange = options => {
    const n = update(user, { groupIds: { $set: map(options, "value") } })
    onChange(n)
  }

  return (
    <form onSubmit={save}>
      <div className="row">
        <div className="col form-group">
          <label className="control-label">First name*</label>
          <input
            className="form-control"
            name="firstname"
            onChange={onInput}
            value={user.firstname}
            required
          />
        </div>
        <div className="col form-group">
          <label className="control-label">Last name*</label>
          <input
            className="form-control"
            name="lastname"
            onChange={onInput}
            value={user.lastname}
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col form-group">
          <label className="control-label">Email*</label>
          <input
            className="form-control"
            name="email"
            type="email"
            onChange={onInput}
            value={user.email}
            required
          />
        </div>
        <div className="col form-group">
          {user.id && (
            <button className="btn btn-link" type="button" onClick={onMakePasswordClick}>
              Generate new password
            </button>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col form-group">
          <label className="control-label">User type *</label>
          <SelectString
            name="discriminator"
            options={utils.getUserDiscriminators()}
            getOptionLabel={option => utils.getUserTypeByDiscriminator(option ? option.value : null)}
            value={get(user, "discriminator") || null}
            onChange={value => onChange(update(user, {discriminator: { $set: value }}))}
            />
        </div>
        <div className="col form-group" />
      </div>

      {/* Manufacturer user type */}
      {utils.isManufacturerUser(user) && (
        <div className="row">
          <div className="col form-group">
            <label className="control-label">Manufacturer*</label>
            <Select
              options={manufacturers}
              value={find(manufacturers, manufacturer => get(user, "manufacturerId") === manufacturer.id)}
              onChange={option => onChange(update(user, { manufacturerId: { $set: option.id } }))}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
              />
          </div>
          <div className="col form-group">
            Accepted terms version: {user.salesTermsVersion}
            <br/> Accepted terms version date: {date(user.salesTermsAcceptanceTimestamp).format("YYYY-MM-DD hh:mm:ss")}
          </div>
        </div>
      )}

      {/* Retailer user type */}
      {utils.isRetailerUser(user) && (
        <div className="row">
          <div className="col form-group">
            <label className="control-label">Retailer*</label>
            <Select
              options={retailers}
              value={find(retailers, retailer => get(user, "retailerId") === retailer.id)}
              onChange={option => onChange(update(user, { retailerId: { $set: option.id } }))}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
              />
          </div>
          <div className="col form-group" />
        </div>
      )}

      <div className="row">
        <div className="col form-group">
          <label className="control-label">Groups</label>
          <Select
            isMulti
            options={groupOptions}
            value={selectedGroupOptions}
            onChange={onGroupsChange}
            className="basic-multi-select"
            classNamePrefix="select"
            />
        </div>
        <div className="col form-group" />
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

export default UserEdit

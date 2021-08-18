import React from "react"
import Select from 'react-select'
import update from 'immutability-helper'
import get from "lodash/get"
import map from "lodash/map"
import find from "lodash/find"
import isEmpty from "lodash/isEmpty"
import DatePicker from "../../common/components/date/DatePicker"
import LocalizableStrings from '../../common/components/lang/LocalizableStrings'

const BusinessRule = ({
  onSave,
  onChange,
  onCancel,
  rule,
  taxonomies,
  groups,
  tradeItemCategories,
  properties,
  validators,
  valuesGroups,
}) => {

  const _taxonomies = map(taxonomies, g => {return {value: g.id, label: g.name}})
  const _groups = map(groups, g => {return {value: g.id, label: g.name}})
  const _tradeItemCategories = map(tradeItemCategories, s => {return {value: s.code.code, label: `${s.code.code} - ${s.name} (${s.unspsc})`}})
  const _validator = find(validators, v => v.code === get(rule, "businessRuleTypeCode", null)) || null

  return (
    <React.Fragment>
      <div className="row">
        <div className="col">
          {/* Rule name */}
          <div className="form-group">
            <label>Rule name</label>
            <input
              value={get(rule, "name") || ""}
              className="form-control"
              onChange={e => onChange(update(rule, {name: {$set: e.target.value}}))} />
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="row">
        <div className="col">
            <LocalizableStrings
              integrated
              localizableStrings={['shortDescription', 'description']}
              labels={{
                shortDescription: 'Short description',
                description: 'Description'
              }}
              components={{
                description: 'textarea'
              }}
              input={rule}
              onChange={(property, value) => onChange(update(rule, {[property]: {$set: value}}))}
              />
            <br/>
        </div>
      </div>

      <div className="row">
        {/* Taxonomy */}
        <div className="col">
          <div className="form-group">
            <label>Taxonomy</label>
            <Select
              value={find(_taxonomies, s => s.value === get(rule, "taxonomyId", null)) || null}
              onChange={group => onChange(update(rule, {taxonomyId: {$set: group.value}}))}
              name="edit-business-rule-taxonomy"
              options={_taxonomies}/>
          </div>
        </div>
        {/* Trade Item Category */}
        <div className="col">
          <div className="form-group">
            <label>Trade Item Category</label>
            <Select
              value={find(_tradeItemCategories, s => s.value === get(rule, "tradeItemCategory.code", null)) || null}
              onChange={tradeItemCategory => onChange(update(rule, {tradeItemCategory: { code: {$set: tradeItemCategory.value}}}))}
              name="edit-business-rule-trade-item-category"
              options={_tradeItemCategories}/>
          </div>
        </div>
        {/* Groups */}
        <div className="col">
          <div className="form-group">
            <label>Group</label>
            <Select
              value={find(_groups, g => g.value === get(rule, "propertyGroupId", null)) || null}
              onChange={group => onChange(update(rule, {propertyGroupId: {$set: group.value}}))}
              name="edit-business-rule-groups"
              options={_groups}/>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Properties */}
        <div className="col">
          <div className="form-group">
            <label>Property</label>
            <div className="row">
              <div className="col">
                <Select
                  value={find(properties, p => p.code === get(rule, "propertyName", null)) || null}
                  onChange={property => onChange(update(rule, {propertyName: {$set: property.code}}))}
                  getOptionLabel={property => property.code}
                  getOptionValue={property => property.code}
                  name="edit-business-rule-properties"
                  options={properties}/>
              </div>
              <div className="col">
                <input
                  placeholder="...or property from transfo."
                  value={get(rule, "propertyName") || ""}
                  className="form-control"
                  onChange={e => onChange(update(rule, {propertyName: {$set: e.target.value}}))} />
              </div>
            </div>
          </div>
        </div>
        {/* Validators */}
        <div className="col">
          <div className="form-group">
            <label>Validator</label>
            <Select
              value={_validator}
              onChange={validator => onChange(update(rule, {businessRuleTypeCode: {$set: validator.code}}))}
              getOptionLabel={property => property.code}
              getOptionValue={property => property.code}
              name="edit-business-rule-validators"
              options={validators}/>
            {/* Parameters */}
            {/* @TODO: more generic way of handling validators */}
            {_validator && !isEmpty(get(_validator, "parameters")) && map(get(_validator, "parameters"), (param, k) => {
              let ret = null
              switch(param.businessRuleParameterType) {
                case "String":
                  ret = <input
                      type="text"
                      className="form-control"
                      onChange={e => onChange(update(rule, {parameters:{[param.name]: {$set: e.target.value}}}))}
                      value={get(rule, `parameters.${param.name}`) || ""}/>
                  break;
                case "Number":
                  ret = <input
                      type="number"
                      className="form-control"
                      onChange={e => onChange(update(rule, {parameters:{[param.name]: {$set: e.target.value}}}))}
                      value={get(rule, `parameters.${param.name}`) || ""}/>
                  break;
                case "Property":
                  ret = <Select
                    value={find(properties, p => p.code === get(rule, `parameters.${param.name}`)) || null}
                    onChange={property => onChange(update(rule, {parameters:{[param.name]: {$set: property.code}}}))}
                    getOptionLabel={property => property.code}
                    getOptionValue={property => property.code}
                    options={properties}
                    />
                  break;
                case "Boolean":
                  ret = <input
                    type="checkbox"
                    className="form-control"
                    checked={get(rule, `parameters.${param.name}`) || false}
                    onChange={e => onChange(update(rule, {parameters:{[param.name]: {$set: e.target.checked}}}))}
                    />
                  break;
                case "FixedValuesId":
                  ret = <Select
                    value={find(valuesGroups, p => p.id === get(rule, `parameters.${param.name}`)) || null}
                    onChange={valuesGroup => onChange(update(rule, {parameters:{[param.name]: {$set: valuesGroup.id}}}))}
                    getOptionLabel={valuesGroup => valuesGroup.name}
                    getOptionValue={valuesGroup => valuesGroup.id}
                    options={valuesGroups}
                    />
                  break;
                case "Date":
                  ret = <DatePicker
                    onChange={d => onChange(update(rule, {parameters: {[param.name]: {$set: (d && d.format('YYYY-MM-DD')) || null}}}))}
                    inputProps={{placeholder: "Date..."}}
                    value={get(rule, `parameters.${param.name}`) || ""} />
                  break;
                default:
                  ret = `Parameter type unknown: ${param.businessRuleParameterType}.`
              }
              return <div className="form-group mt-2" key={`v-param-k`}><label>{param.name}</label>{ret}</div>
            })}
          </div>
        </div>
      </div>

      {/* Actions button */}
      <div className="row">
        <div className="col pt-5">
          <div className="text-right">
            <button
              className="btn btn-secondary mr-2"
              onClick={e => onCancel()}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={e => onSave(rule)}>{get(rule, "id") ? "Save" : "Create"}</button>
          </div>
        </div>
      </div>

    </React.Fragment>
)}

export default BusinessRule

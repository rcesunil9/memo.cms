import React from "react"
import get from "lodash/get"
import find from "lodash/find"
import update from 'immutability-helper'
import Select from "react-select"
import Card from "../common/components/layout/Card"
import { TradeItemTransformationWrapper } from "./transformers"

const MODES = [
  {label: "Advanced", value: "Advanced"},
  {label: "Basic", value: "Basic"},
]

const RequiredInputWrap = (props) => {
  return <React.Fragment>
    <Select
      {...props}
    />
    <input
      tabIndex={-1}
      value={props.value || ''}
      required={props.required}
      onChange={() => {}}
      style={{
        opacity: 0,
        width: 0,
        height: 0,
        position: 'absolute',
      }}
    />
  </React.Fragment>
};

const BasicMode = ({propertyMapping, columns, tradeItemProperties, isMapNameValid, onChange}) => (
  <React.Fragment>
    {/* Column */}
    <div className="form-group">
      <label>Column</label>
      <RequiredInputWrap
        value={columns ? find(columns, c => c.columnIdentifier === get(propertyMapping, "fileColumnIdentifier")) : null}
        onChange={c => onChange(update(propertyMapping, {
          fileColumnIdentifier: {$set: c.columnIdentifier},
          fileColumnName: {$set: c.columnName},
        }))}
        getOptionLabel={c => `(${c.columnIdentifier}) ${c.columnName}`}
        getOptionValue={c => c.columnIdentifier}
        options={columns}
        required
      />
    </div>
    {/* Transformation */}
    <div className="form-group">
      <label>Transformation</label><br/>
      <TradeItemTransformationWrapper
        tradeItemProperty={tradeItemProperties ? find(tradeItemProperties, p => p.code === get(propertyMapping, "productIdentifier")) : null}
        onChange={v => onChange(update(propertyMapping, {transformer: {$set: v}}))}
        value={get(propertyMapping, "transformer")} />
    </div>
  </React.Fragment>
)

const AdvancedMode = ({propertyMapping, columns, tradeItemProperties, isMapNameValid, onChange}) => (
  <React.Fragment>
    {/* Code */}
    <div className="form-group">
      <label>Code</label>
      <textarea
        className="form-control"
        rows="8"
        onChange={e => onChange(update(propertyMapping, {code: {$set: e.target.value}}))}
        value={get(propertyMapping, "code") || ""}>{get(propertyMapping, "code")}</textarea>
    </div>
  </React.Fragment>
)

const PropertyMapping = ({propertyMapping, columns, tradeItemProperties, isMapNameValid, onSave, onCancel, onChange}) => (
  <Card className="bg-light">
    {get(propertyMapping, "mapName") && <h5>Mapping: {get(propertyMapping, "mapName")}</h5>}

    {/* Basic mode */}
    <form className="mt-3" onSubmit={e => {e.preventDefault(); onSave(propertyMapping)}}>

      {/* Mode */}
      <div className="form-group">
        <label>Mode</label>
        <Select
          value={find(MODES, m => m.value === get(propertyMapping, "mode"))}
          onChange={mode => onChange(update(propertyMapping, {
            mode: {$set: mode.value},
            fileColumnIdentifier: {$set: null},
            fileColumnName: {$set: null},
            code: {$set: ""}
          }))}
          options={MODES} />
      </div>

      {/* Property */}
      <div className="form-group">
        <label>Property</label>
        <RequiredInputWrap
          value={tradeItemProperties ? find(tradeItemProperties, p => p.code === get(propertyMapping, "productIdentifier")) : null}
          onChange={property => onChange(update(propertyMapping, {
            productIdentifier: {$set: get(property, "code")},
            mapName: {$set: get(property, "code")}
          }))}
          getOptionLabel={property => property.code}
          getOptionValue={property => property.code}
          options={tradeItemProperties}
          required
        />
      </div>

      {get(propertyMapping, "mode") === "Basic" ? <BasicMode
        propertyMapping={propertyMapping}
        columns={columns}
        tradeItemProperties={tradeItemProperties}
        isMapNameValid={isMapNameValid}
        onChange={onChange}/>
        : <AdvancedMode
          propertyMapping={propertyMapping}
          columns={columns}
          tradeItemProperties={tradeItemProperties}
          isMapNameValid={isMapNameValid}
          onChange={onChange}/>}

      {/* Map name */}
      <div className="form-group">
        <label>Mapping name</label>
        <input
          value={get(propertyMapping, "mapName", "")}
          onChange={e => onChange(update(propertyMapping, {mapName: {$set: e.target.value}}))}
          className={`form-control ${isMapNameValid ? "" : "is-invalid"}`} />
        {!isMapNameValid && <div class="invalid-feedback">Must be unique.</div>}
      </div>

      {/* Actions button */}
      <div className="text-right pt-4">
        <button
          className="btn btn-secondary mr-2"
          onClick={e => {e.preventDefault(); onCancel()}}>Cancel</button>
        <button
          type="submit"
          className={`btn btn-primary`}>Ok</button>
      </div>
    </form>

  </Card>
)


export default PropertyMapping

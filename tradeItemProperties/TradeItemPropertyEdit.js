import update from "immutability-helper"
import find from "lodash/find"
import map from "lodash/map"
import React from "react"
import Select from "react-select"
import CheckboxSelector from "../common/components/form/CheckBoxSelector"
import SelectString from "../common/components/form/SelectString"

const cardinalities = ["Single", "Multiple"]
const discriminators = [
  "ListProductPropertyViewModel",
  "StringProductPropertyViewModel",
  "DateProductPropertyViewModel",
  "NumericProductPropertyViewModel", 
  "StringArrayProductPropertyViewModel"
]
const numericTypes = [
  "Weight (g)",
  "Size (mm)",
  "Value",
  "Price",
  "Power",
  "DataSize",
  "Frequency",
  "Voltage",
  "Dimension",
  "ElectricCharge",
  "Volume",
  "Duration (sec)",
  "BatteryCapacity",
  "Age (month)",
  "Temperature",
  "Magnification",
  "Speed",
  "MillionOfPixels",
  "Impedance",
  "FrameRate",
  "Angle",
  "AngularVelocity",
  "RotationSpeed",
  "Surface",
  "Grammage",
  "ElectricCurrent"]

const NumericTypeSelector = props => (
  <React.Fragment>
    <label>Numeric type*</label>
    <SelectString required options={numericTypes} value={props.value} onChange={props.onChange} />
  </React.Fragment>
)

const Row = props => <div className="row">{props.children}</div>
const Col = props => <div className={"col " + props.className}>{props.children}</div>

const ValueGroupsSelect = ({ valueGroups, onCreateClick, selected, onChange, onEditClick }) => {
  const options = map(valueGroups, g => ({ label: g.name, value: g.id }))
  const selectedOption = selected ? { label: selected.name, value: selected.id } : null
  const change = option => onChange(find(valueGroups, ["id", option.value]))

  return (
    <React.Fragment>
      <label>Values group*:</label>
      <Select 
        options={options} 
        onChange={change} 
        value={selectedOption} />
      <Row>
        {selected && (
          <Col>
            <button className="btn btn-link" type="button" onClick={() => onEditClick(selected)}>
              edit
            </button>
          </Col>
        )}
        <Col>
          <button className="btn btn-link" type="button" onClick={onCreateClick}>
            + add new values group
          </button>
        </Col>
      </Row>
    </React.Fragment>
  )
}

const TradeItemPropertyEdit = props => {
  const {
    tradeItemProperty,
    valid,
    valueGroups,
    onSave,
    onCancel,
    onDelete,
    onChange,
    onCreateValueGroupClick,
    onEditValueGroupClick,
    taxonomies,
    tradeItemCategories,
    groups
  } = props

  const change = attributeName => newValue =>
    onChange(update(tradeItemProperty, { [attributeName]: { $set: newValue } }))

  const submit = e => {
    e.preventDefault()
    onSave()
  }

  const makeGroupOption = group => ({ value: group.id, label: group.name })
  const makeGroupOptions = groups => map(groups, makeGroupOption)

  const makeGroupIdOption = id => ({ value: id, label: id })
  const makeGroupIdOptions = groupIds => map(groupIds, makeGroupIdOption)

  return (
    <form onSubmit={submit}>
       <Row>
        <Col className="form-group">
          <label htmlFor="property-code">Taxonomy*:</label>
          <Select
              value={taxonomies.filter(obj => obj.id === tradeItemProperty.taxonomyId)}
              onChange={e => {
                change("taxonomyId")(e.id)
              }}
              isClearable={false}
              getOptionLabel={o => o.name}
              getOptionValue={o => o.id}
              options={taxonomies || []}
             />
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <label htmlFor="property-code">Trade Item Categories:</label>
          <Select
            isMulti
            closeMenuOnSelect={false}
            value={
              tradeItemProperty.tradeItemCategoryIds != null ? tradeItemCategories.filter(r => tradeItemProperty.tradeItemCategoryIds.indexOf(r.id) !== -1) : null
            }
            onChange={selectedRules =>
              change(
                "tradeItemCategoryIds")(
                selectedRules === null
                  ? null
                  : map(selectedRules, rule => rule.id)
              )
            }
            isClearable={true}
            getOptionLabel={o => `${o.code.code} - ${o.name} (${o.unspsc})`}
            getOptionValue={o => o.id}
            options={tradeItemCategories}
          />
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <label htmlFor="property-code">Code (must be unique)*:</label>
          <input
            autoComplete="off"
            className="form-control"
            id="property-code"
            required
            value={tradeItemProperty.code}
            onChange={e => change("code")(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col className="form-group">
          <label htmlFor="property-cardinality">Cardinality*:</label>
          <SelectString
            id="property-cardinality"
            options={cardinalities}
            required
            value={tradeItemProperty.cardinality}
            onChange={change("cardinality")}
          />
        </Col>
        <Col className="form-group">
          <div className="form-group">
            <label htmlFor="property-discriminator">Discriminator*:</label>
            <SelectString
              id="property-discriminator"
              options={discriminators}
              required
              value={tradeItemProperty.discriminator}
              onChange={change("discriminator")}
            />
          </div>

          <div className="form-group">
            {tradeItemProperty.discriminator === "ListProductPropertyViewModel" && (
              <ValueGroupsSelect
                valueGroups={valueGroups}
                selected={find(valueGroups, ["id", tradeItemProperty.valuesGroupId])}
                onChange={valueGroup => change("valuesGroupId")(valueGroup.id)}
                onCreateClick={onCreateValueGroupClick}
                onEditClick={onEditValueGroupClick}
              />
            )}
            {tradeItemProperty.discriminator === "NumericProductPropertyViewModel" && (
              <NumericTypeSelector
                value={tradeItemProperty.numericType}
                onChange={change("numericType")}
              />
            )}
          </div>
        </Col>
      </Row>
      <Row>
        {/* <Col className="form-group">
          <label>Scopes:</label>
          <CheckboxStringSelector
            name="scopes"
            options={scopes}
            valueArray={tradeItemProperty.propertyScopes}
            onChange={change("propertyScopes")}
          />
        </Col> */}
        <Col className="form-group">
          <label>Groups:</label>
          <CheckboxSelector
            name="groups"
            options={makeGroupOptions(groups)}
            valueArray={makeGroupIdOptions(tradeItemProperty.propertyGroupIds)}
            onChange={x => {
              change("propertyGroupIds")(map(x, 'value'));
            }}
          />
        </Col>
        <Col className="form-group">
          <label className="d-block">Validator:</label>
          <input
            onChange={e => change("nullable")(!tradeItemProperty.nullable)}
            checked={tradeItemProperty.nullable ? true : false}
            className=""
            type="checkbox" /> Is nullable
          <br/>
          <input
            onChange={e => change("isReadOnly")(!tradeItemProperty.isReadOnly)}
            checked={tradeItemProperty.isReadOnly ? true : false}
            className=""
            type="checkbox" /> Is read only
          <br/>
          <input
            onChange={e => change("notApplicableAuthorized")(!tradeItemProperty.notApplicableAuthorized)}
            checked={tradeItemProperty.notApplicableAuthorized ? true : false}
            className=""
            type="checkbox" /> N/A authorized
            
          {tradeItemProperty.discriminator === "StringProductPropertyViewModel" && (
            <React.Fragment>
              <br/>
              <input
                onChange={e => change("localizable")(!tradeItemProperty.localizable)}
                checked={tradeItemProperty.localizable ? true : false}
                className=""
                type="checkbox" /> Localizable
            </React.Fragment>
          )}
        </Col>
      </Row>
      <Row>
        {onDelete && (
          <Col>
            <button className="btn btn-danger" type="button" onClick={event => {
              event.preventDefault()
              window.confirm(`Are you sure?`) && onDelete()
            }}>
              Delete
            </button>
          </Col>
        )}
        <Col className="d-flex justify-content-end">
          <button className="btn btn-secondary mr-2" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={!valid}>
            Save
          </button>
        </Col>
      </Row>
    </form>
  )
}

export default TradeItemPropertyEdit

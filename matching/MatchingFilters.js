import React from "react"
import Select from "react-select"
import update from "immutability-helper"
import find from "lodash/find"
import indexOf from "lodash/indexOf"
import map from "lodash/map"
import get from "lodash/get"
import filter from "lodash/filter"
import DatePicker from "../common/components/date/DatePicker"


const MatchingFilters = ({
  filters,
  retailers,
  manufacturers,
  onChange,
  onReset
}) => (
  <React.Fragment>

    {/* Manufacturer */}
    <div className="form-group mb-0 d-inline-block col-3">
      <Select
          value={filters.manufacturerId ? find(manufacturers, o => o.id === filters.manufacturerId) : null}
          onChange={v => onChange(update(filters, {manufacturerId: {$set: get(v, "id", null)}}))}
          name="matching-manufacturers"
          isClearable={true}
          placeholder="Manufacturers..."
          getOptionLabel={o => o.name}
          getOptionValue={o => o.id}
          options={manufacturers}/>
      </div>

      {/* Retailer */}
      <div className="form-group mb-0 d-inline-block col-3">
        <Select
          isMulti
          closeMenuOnSelect={false}
          value={filter(retailers, r => indexOf(filters.retailerIds, r.id) !== -1)}
          onChange={v => onChange(update(filters, {retailerIds: {$set: map(v, r => r.id)}}))}
          isClearable={true}
          placeholder="Retailers..."
          name="matching-retailers"
          getOptionLabel={o => o.name}
          getOptionValue={o => o.id}
          options={retailers} />
        </div>

      {/* Matched */}
      <div className="form-group mb-0 d-inline-block col-3">
        <div className="btn-group" role="group">
          <button type="button" className={`btn btn-secondary ${filters.matched === null ? "active" : ""}`} onClick={e => onChange(update(filters, {matched: {$set: null}}))}>No filter</button>
          <button type="button" className={`btn btn-secondary ${filters.matched ? "active" : ""}`} onClick={e => onChange(update(filters, {matched: {$set: true}}))}>Matched</button>
          <button type="button" className={`btn btn-secondary ${filters.matched === false ? "active" : ""}`} onClick={e => onChange(update(filters, {matched: {$set: false}}))}>Not matched</button>
        </div>
      </div>

    {/* Treated */}
    <div className="form-group mb-0 d-inline-block col-3">
      <div className="btn-group" role="group">
        <button type="button" className={`btn btn-secondary ${filters.ignored === null ? "active" : ""}`} onClick={e => onChange(update(filters, {ignored: {$set: null}}))}>No filter</button>
        <button type="button" className={`btn btn-secondary ${filters.ignored ? "active" : ""}`} onClick={e => onChange(update(filters, {ignored: {$set: true}}))}>Treated</button>
        <button type="button" className={`btn btn-secondary ${filters.ignored === false ? "active" : ""}`} onClick={e => onChange(update(filters, {ignored: {$set: false}}))}>Not treated</button>
      </div>
    </div>

    {/* Gtin */}
    <div className="form-group mb-0 mt-2 d-inline-block col-3">
      <input
        placeholder="GTIN"
        className="form-control"
        value={filters.gtin || ""}
        onChange={e => onChange(update(filters, {gtin: {$set: get(e, "target.value", null)}}))}/>
    </div>

    {/* Date from */}
    <div className="form-group mb-0 mt-2 d-inline-block col-3">
      <DatePicker
        onChange={d => onChange(update(filters, {startDate: {$set: (d && d.format('YYYY-MM-DD')) || null}}))}
        inputProps={{placeholder: "From..."}}
        value={filters.startDate} />
    </div>

    {/* Date to */}
    <div className="form-group mb-0 mt-2 d-inline-block col-3">
      <DatePicker
        onChange={d => onChange(update(filters, {endDate: {$set: (d && d.format('YYYY-MM-DD')) || null}}))}
        inputProps={{placeholder: "To..."}}
        value={filters.endDate} />
    </div>

    {/* Date to */}
    <div className="form-group mb-0 mt-2 d-inline-block col-3">
      <button
        onClick={e => onReset()}
        className="btn btn-block btn-secondary">Reset filters</button>
    </div>

  </React.Fragment>
)

export default MatchingFilters

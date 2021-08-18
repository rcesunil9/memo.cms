import React from "react"
import update from 'immutability-helper'
import get from "lodash/get"
import map from "lodash/map"
import orderBy from "lodash/orderBy"
import last from "lodash/last"
import filter from "lodash/filter"
import zipObject from "lodash/zipObject"
import findKey from "lodash/findKey"
import isEmpty from "lodash/isEmpty"
import reduce from "lodash/reduce"
import find from "lodash/find"
import Select from 'react-select'
import { toColumnIndex } from "../common/utils/excel"

const prepareColumns = (columns) => orderBy(columns, c => toColumnIndex(c.columnIdentifier))

const formatColumnName = (name) => name.toLowerCase().replace(/[^a-zA-Z0-9_ ]/g, "").replace(/[ ]/g, "_")

const isAlreadyMapped = (mappedColumns, columnIdentifier) => !isEmpty(get(mappedColumns, `${columnIdentifier}.property`))

const TableView = ({mapping, tradeItemProperties, onPropertySelected, mappedColumns, showOnlyNotMapped}) => (
  <div  style={{position: "relative", maxWidth: "100%", overflowX: "auto", minHeight: "500px"}}>
    <table className="table table-sm table-bordered m-0">
        <thead>
            <tr>{filter(map(mapping, m => m.columnName && ((isEmpty(get(mappedColumns, m.columnIdentifier)) && !isAlreadyMapped(mapping, m.columnIdentifier)) || !showOnlyNotMapped) && <th
              key={`auto-map-title-${m.columnIdentifier}`}
              className={`text-center ${m.property ? "bg-success text-white" : (isEmpty(get(mappedColumns, m.columnIdentifier)) ? "bg-warning" : "bg-secondary text-white")}`}>{m.columnIdentifier}</th>))}</tr>
        </thead>
        <tbody>
          <tr>{filter(map(mapping, m => m.columnName && ((isEmpty(get(mappedColumns, m.columnIdentifier)) && !isAlreadyMapped(mapping, m.columnIdentifier)) || !showOnlyNotMapped) && <td
            key={`auto-map-${m.columnIdentifier}`}
            nowrap="true">{m.columnName}</td>))}</tr>
          <tr>{filter(map(mapping, (m, k) => m.columnName && ((isEmpty(get(mappedColumns, m.columnIdentifier)) && !isAlreadyMapped(mapping, m.columnIdentifier)) || !showOnlyNotMapped) && <td
            key={`auto-map-title-mapped-${m.columnIdentifier}`}
            nowrap="true"
            style={{minWidth: "300px"}}>
              <Select
                value={m.property}
                onChange={property => onPropertySelected(m.columnIdentifier, property)}
                getOptionLabel={property => property.code}
                getOptionValue={property => property.code}
                isClearable={true}
                name={`automapping-property-${m.columnIdentifier}`}
                options={tradeItemProperties}/>
              </td>))}
          </tr>
          <tr>{filter(map(mapping, m => m.columnName && ((isEmpty(get(mappedColumns, m.columnIdentifier)) && !isAlreadyMapped(mapping, m.columnIdentifier)) || !showOnlyNotMapped) && <td key={`auto-map-already-mapped-${m.columnIdentifier}`} nowrap="true">
            {map(get(mappedColumns, m.columnIdentifier, []), c => <div key={`auto-map-already-mapped-col-${m.columnIdentifier}-${c.groupIndex}`}>Found in: {c.groupName}</div>)}
          </td>))}</tr>
        </tbody>
    </table>
  </div>
)

class AutoMappingTable extends React.Component {
  constructor(props) {
    super(props)
    this.onPropertySelected = this.onPropertySelected.bind(this)
    this.state = {
      mapping: null,
      mappedColumnsInOtherGroups: null,
      showOnlyNotMapped: false
    }
  }

  componentDidMount() {
    this.doAutoMapping()
  }

  doAutoMapping() {
    const { columns, tradeItemProperties, currentColumnsMapping, tabIndex, groupIndex, mappedColumns } = this.props
    const _mappingPerColumn = reduce(currentColumnsMapping, (r, c) => {return {...r, [c.fileColumnIdentifier]: c.productIdentifier && find(tradeItemProperties, tip => tip.code === c.productIdentifier)}}, {})

    let propertiesCodes = []
    let mapping = map(prepareColumns(columns), col => {
      let property = get(_mappingPerColumn, `${col.columnIdentifier}`, null) || last(orderBy(filter(tradeItemProperties, p => formatColumnName(col.columnName).includes(get(p, "code"))), "code")) || null
      if(property !== null) {
        if(propertiesCodes.indexOf(property.code) !== -1) property = null
        else propertiesCodes.push(property.code)
      }
      return {
        columnIdentifier: col.columnIdentifier,
        columnName: col.columnName,
        property
      }})
    mapping = zipObject(map(columns, col => col.columnIdentifier), mapping)
    this.setState({
      mapping,
      mappedColumnsInOtherGroups: reduce(mappedColumns, (r, c, k) => {return {...r, [k]: filter(c, _c => _c.sheetIndex === tabIndex && _c.groupIndex !== groupIndex)}}, {})
     })
  }

  onPropertySelected(columnIdentifier, property) {
    const { mapping } = this.state
    this.setState({mapping: update(mapping, {
      [columnIdentifier]: {
        property: {$set: property}
      }
    })})
  }

  render() {

    const { mapping, mappedColumnsInOtherGroups, showOnlyNotMapped } = this.state
    const { tabName, tradeItemProperties } = this.props
    const { onAutoMap, onCancel } = this.props

    const filteredProperties = filter(tradeItemProperties, property => !!(
      !findKey(mapping, m => get(m, "property.code") === property.code)
    ))

    return (
      <div className="row">
        {/* Sheet info */}
        <div className="col-12 pb-1">
          <h6>Tab: {tabName}</h6>
        </div>
        {/* show only not mapped */}
        <div className="col-12 pb-1">
          <div className="custom-control custom-checkbox">
            <input type="checkbox" id="showOnlyNotMapped" className="custom-control-input" checked={showOnlyNotMapped} onClick={e => this.setState({showOnlyNotMapped: !showOnlyNotMapped})}/>
            <label className="custom-control-label pt-1 font-weight-bold" htmlFor="showOnlyNotMapped">Show only not mapped</label>
          </div>
        </div>
        {/* Sheet columns */}
        <div className="col-12">
          <TableView
            showOnlyNotMapped={showOnlyNotMapped}
            mapping={mapping}
            mappedColumns={mappedColumnsInOtherGroups}
            tradeItemProperties={filteredProperties}
            onPropertySelected={this.onPropertySelected}/>
        </div>
        {/* Automap */}
        <div className="col-12 pt-5">
          <div className="text-right">
            <button className="btn btn-secondary mr-2" onClick={e => onCancel()}>Cancel</button>
            <button className="btn btn-primary" onClick={e => onAutoMap(mapping)}>Auto Map</button>
          </div>
        </div>
      </div>)
  }
}

export default AutoMappingTable

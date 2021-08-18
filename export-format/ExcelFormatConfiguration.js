import update from "immutability-helper"
import { connect } from "react-redux"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import move from 'lodash-move'
import find from "lodash/find"
import get from "lodash/get"
import map from "lodash/map"
import indexOf from "lodash/indexOf"
import isEmpty from "lodash/isEmpty"
import filter from "lodash/filter"
import range from "lodash/range"
import size from "lodash/size"
import React from "react"
import Dropzone from "react-dropzone"
import Select from "react-select"
import * as actions from "./actions"
import * as selectors from "./selectors"
import SelectString from "../common/components/form/SelectString"
import { excelColumnLabel, inputChanger, makeOption, getDefaultExcelSheetMapping, getDefaultExcelSheetConfiguration } from "./utils"
import Tabs from '../common/components/tabs/Tabs'
import Tab  from '../common/components/tabs/Tab'

const ChannelManagementFilteringViewModel = ['All', 'ChannelManaged', 'NotChannelManaged']

class ColumnMappingForm extends React.Component {

  componentDidMount() {
    const { onGroupChange } = this.props
    onGroupChange()
  }

  render() {
    const { onChange, columnMapping, businessRulesets, propertyGroups, properties, onGroupChange } = this.props
    const onInput = inputChanger(columnMapping, onChange)
    const change = (k, v) => onChange(update(columnMapping, { [k]: { $set: v } }))
    console.log(columnMapping)
    
    return (
      <div>
        {/* Sheet index */}
        <div className="form-group row">
          <div className="col-6">
            <label className="control-label">Sheet index*</label>
            <input
              className="form-control"
              required
              name="sheetIndex"
              value={columnMapping.sheetIndex}
              onChange={onInput}
            />
          </div>
        </div>
  
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label className="control-label">Property group*</label>
              <Select
                  options={propertyGroups}
                  value={find(propertyGroups, s => s.name === columnMapping.propertyGroupCode) || null}
                  name={"propertyGroupCode"}
                  getOptionLabel={o => o.name}
                  getOptionValue={o => o.id}
                  onChange={s => {
                    console.log(s)
                    change("propertyGroupCode", s.name)
                    onGroupChange(s.name)
                  }}
                />
            </div>
  
            <div className="form-group">
              <label className="control-label">Property*</label>
              <Select
                options={properties}
                onChange={o => change("property", o.code)}
                getOptionLabel={p => p.code}
                getOptionValue={p => p.code}
                value={columnMapping.property ? find(properties, p => p.code === columnMapping.property) : null}
              />
            </div>
          </div>
  
          <div className="col-12">
            {/* Excel column */}
            <div className="form-group">
              <label className="control-label">Column*</label>
              <Select
                options={range(1, 500).map(i => ({ label: excelColumnLabel(i), value: i }))}
                onChange={o => change("columnIndex", o.value)}
                value={{
                  label: excelColumnLabel(columnMapping.columnIndex),
                  value: columnMapping.columnIndex
                }}
              />
            </div>
            {/* Excel row */}
            <div className="form-group">
              <label className="control-label">Row index</label>
              <input
                className="form-control"
                required
                name="rowIndex"
                value={get(columnMapping, "rowIndex") || ""}
                onChange={onInput}
              />
            </div>
  
            <div className="form-group">
              <label className="control-label">Business rule set</label>
              <Select
                isClearable={true}
                options={map(businessRulesets, makeOption)}
                value={makeOption(find(businessRulesets, ["id", columnMapping.businessRuleId]))}
                onChange={option => change("businessRuleId", get(option, "value", null))}
              />
            </div>

          </div>
        </div>
      </div>
    )
  }

}


const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#3e8ef7' : '',
    width: "100%",
    maxHeight: "500px", 
    overflowY: "scroll"
  })

const CustomListItem = ({sheetMapping, onClick, onRemove, selected}) => (
  <div 
      onClick={onClick}
      style={{cursor: "pointer"}}
      className={`col-12 border p-2 ${selected ? "bg-surprise text-white" : ""}`}>
      <small>{
        `Sheet ${get(sheetMapping, "sheetIndex", "")} - `
        + "(" + (get(sheetMapping, "columnIndex", null) ? excelColumnLabel(get(sheetMapping, "columnIndex")) : "") + ")"
      }</small>
      <br/>
      <small>{
        get(sheetMapping, "propertyGroup", "") + " - "
        + get(sheetMapping, "property", "")
      }</small>
      <button 
          onClick={e => {
              e.preventDefault()
              onRemove()
          }}
          className={`btn btn-link btn-sm p-0 float-right ${selected ? "bg-surprise text-white" : "text-danger"}`}>Remove</button>
  </div>
)

const ColumnMappings = props => {
  const { list, onChange, businessRulesets, setExcelSheetMapping, sheetMapping, propertyGroups, properties, onGroupChange } = props

  const reorganizeColumns = (newList, fromIndex, up) => {
    if(!window.confirm(`Do you want to reorganize columns?`)) return newList;
    if(fromIndex === size(newList) - 1) return newList;
    const src = get(newList, `[${fromIndex}]`, null)
    if(!src) return newList;
    return map(newList, (sheetMap, k) => {
      if(k <= fromIndex) return sheetMap
      if(sheetMap.sheetIndex !== src.sheetIndex) return sheetMap
      return update(sheetMap, {columnIndex: {$set: (up ? sheetMap.columnIndex+1 : sheetMap.columnIndex-1 || 0) }})
    })
  }

  const add = () => {
    const df = getDefaultExcelSheetMapping()
    setExcelSheetMapping(df)
    onChange([...list, df])
  }

  const remove = index => {
    if(size(list) > index+1) setExcelSheetMapping(list[index+1])
    else setExcelSheetMapping(null)
    onChange(reorganizeColumns([...list.slice(0, index), ...list.slice(index + 1)], index-1 || 0, false))

  }

  const _move = (fromIndex, toIndex) => {
    const newList = move(list,fromIndex,toIndex)
    onChange(reorganizeColumns(newList, toIndex, true))
  }

  return (
    <React.Fragment>

      <div className="row">

        <div className="col-6">
            <DragDropContext
              onDragEnd={e => {
                  if(e.destination && e.destination.index !== e.source.index) {
                    _move(e.source.index, e.destination.index)
                  }
              }}>
              <Droppable droppableId="format-droppable">
                  {(provided, snapshot) => (
                  <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}>
                      {map(list, (listItemSheetMapping, tIndex) => (
                      <Draggable 
                          key={`export-format-excel-list-${tIndex}`} 
                          draggableId={`export-format-excel-list-${tIndex}`} 
                          index={tIndex}>
                          {(provided, snapshot) => (
                          <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}>
                              <CustomListItem 
                                  key={`export-f-export-format-excel-list-${tIndex}`} 
                                  selected={sheetMapping === listItemSheetMapping}
                                  onClick={e => setExcelSheetMapping(list[tIndex])}
                                  onRemove={e => remove(tIndex)}
                                  sheetMapping={listItemSheetMapping}
                                  id={`export-format-excel-list-${tIndex}`} />
                          </div>
                          )}
                      </Draggable>
                      ))}
                  </div>
                  )}
              </Droppable>
            </DragDropContext>
        </div>
        
        <div className="col-6">
          {sheetMapping && filter(map(list, (columnMapping, i) => (sheetMapping === list[i] && (
            <div key={i} className="mb-2">
              <div className="row mb-3">
                <div className="col-12">
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => remove(i)}>
                    Remove mapping
                  </button>
                  <button className="btn btn-link p-0 float-right" type="button" onClick={add}>
                    + Add new sheet mapping
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="row">
                <div className="col-12">
                  <ColumnMappingForm
                    properties={properties}
                    columnMapping={columnMapping}
                    businessRulesets={businessRulesets}
                    propertyGroups={propertyGroups}
                    onGroupChange={onGroupChange}
                    onChange={mapping => {
                      setExcelSheetMapping(mapping)
                      onChange(update(list, { [i]: { $set: mapping } }))
                    }}
                  />
                </div>
              </div>
            </div>
          )) || null))}

          <div>
            <button className="btn btn-link p-0 float-right" type="button" onClick={add}>
              + Add new sheet mapping
            </button>
          </div>
        </div>

      </div>
    </React.Fragment>
  )
}

const ExcelFormatConfiguration = props => {
  const { configuration, businessRulesets, propertyGroups, sheetMapping, setExcelSheetMapping, onChange, properties, loadProperties } = props

  const change = (k, v) => onChange(update(configuration, { [k]: { $set: v } }))
  const attachFile = file => change("fileLocation", file)

  
  return (
    <React.Fragment>
      <div className="form-group">
        <Dropzone
          className="w-100 text-center p-5 bg-secondary text-white"
          onDrop={acceptedFiles => attachFile(acceptedFiles[0])}
        >
          <p className="lead m-0">
            Please drop a matrix file, or click in this area to choose one.
          </p>
          {get(configuration, "fileLocation", null) ? <div className="text-success"><i>File exists</i></div> : <div className="text-danger"><i>No file</i></div>}
          {!get(configuration, "fileLocation.preview", null) && get(configuration, "fileLocation", null) && <div className="text-success"><i>{get(configuration, "fileLocation", null)}</i></div>}
        </Dropzone>
      </div>

      <div className="form-row">
        {/* Data start row */}
        <div className="form-group col-8">
          <SheetConfigurations
            configuration={configuration}
            businessRulesets={businessRulesets}
            onChange={onChange}
          />
        </div>

        {/* Business rules set */}
        <div className="form-group col-4">
          <label className="control-label">Business rules set*</label>
          <Select
            options={map(businessRulesets, makeOption)}
            value={makeOption(find(businessRulesets, ["id", configuration.businessRuleSetId]))}
            onChange={option => change("businessRuleSetId", option.value)}
          />
        </div>
      </div>

      <ColumnMappings
        properties={properties}
        sheetMapping={sheetMapping}
        setExcelSheetMapping={setExcelSheetMapping}
        list={get(configuration, "excelMappingConfiguration.orderedColumnMappings", [])}
        businessRulesets={businessRulesets}
        propertyGroups={propertyGroups}
        onGroupChange={group => loadProperties()}
        onChange={list =>
          onChange(
            update(configuration, {
              excelMappingConfiguration: {
                $set: { orderedColumnMappings: list }
              }
            })
          )
        }
      />
    </React.Fragment>
  )
}

class SheetConfigurations extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      addingNewSheetConfiguration: false,
      newSheetIndex: 0,
    }
  }

  change(k, v, index) {
    const { configuration, onChange } = this.props
    onChange(update(configuration, {sheetConfigurations: {[index]: {[k]: {$set: v}}}}))
  }

  add(index) {
    const { configuration, onChange } = this.props
    // onChange(update(configuration, {sheetConfigurations: {$set: Object.assign({}, configuration.sheetConfigurations, {[index]: getDefaultExcelSheetConfiguration(index)})  } }))
    onChange(update(configuration, {sheetConfigurations: {$set: [...configuration.sheetConfigurations || [], getDefaultExcelSheetConfiguration(index)] }}))
  }

  delete(index) {
    const { configuration, onChange } = this.props
    let newSheets = configuration.sheetConfigurations
    let newArray = [...newSheets.slice(0, index), ...newSheets.slice(index + 1)]
    onChange(update(configuration, {sheetConfigurations: {$set: newArray } }))
  }

  render() {

    const {configuration, businessRulesets} = this.props
    const {sheetConfigurations} = configuration
    const { addingNewSheetConfiguration, newSheetIndex } = this.state
    const defaultActiveIndex = get(sheetConfigurations, '[0].sheetIndex', '')
  
    return <React.Fragment>

        <div className="mb-2">
          {!addingNewSheetConfiguration && <button
            className="btn btn-sm btn-secondary"
            onClick={e => this.setState({addingNewSheetConfiguration: true})}
            >
            + Add new sheet config.
            </button>}

          {addingNewSheetConfiguration && <div>
            <label>Sheet index</label>
            <input 
              type="number"
              className="form-control d-inline-block"
              placeholder="Sheet index"
              value={newSheetIndex}
              onChange={e => this.setState({newSheetIndex: parseInt(e.target.value, 10) || 0})}
              />
            <button
              className="btn btn-sm btn-secondary d-inline-block"
              onClick={e => {
                this.add(newSheetIndex)
                this.setState({
                  addingNewSheetConfiguration: false,
                  newSheetIndex: 0,
                })
              }}
              >
              Add
            </button>
          </div>}
        </div>

        {!isEmpty(configuration.sheetConfigurations) && <Tabs activeTab={{id: `${defaultActiveIndex}-0`}}>
        {map(sheetConfigurations, (item, index) =>
          <Tab id={`${item.sheetIndex}-${index}`} title={item.sheetIndex} key={`${item.sheetIndex}-${index}`}>
            <React.Fragment>
              <div className="form-group">
                <label className="control-label">Data start row</label>
                <input
                  type="number"
                  className="form-control"
                  name="dataStartingRow"
                  value={get(item, 'dataStartingRow', '')}
                  required
                  onChange={e => this.change('dataStartingRow', e.target.value, index)}/>
              </div>
              <div className="form-group">
                <label className="control-label">Duplicate children after parent</label>
                <input
                  onChange={e => this.change('duplicateChildrenAfterParent', e.target.checked, index)}
                  checked={item.duplicateChildrenAfterParent}
                  className="form-control"
                  type="checkbox"/>
              </div>
              <div className="form-group">
                <label className="control-label">Hide assortment only</label>
                <input
                  onChange={e => this.change('hideAssortmentOnly', e.target.checked, index)}
                  checked={item.hideAssortmentOnly}
                  className="form-control"
                  type="checkbox"/>
              </div>
              <div className="form-group">
                <label className="control-label">Hide non assortment</label>
                <input
                  onChange={e => this.change('hideNonAssortment', e.target.checked, index)}
                  checked={item.hideNonAssortment}
                  className="form-control"
                  type="checkbox"/>
              </div>
              <div className="form-group">
                <label className="control-label">Channel management</label>
                <SelectString
                  options={ChannelManagementFilteringViewModel}
                  value={item.channelManagementFiltering}
                  onChange={val => this.change('channelManagementFiltering', val || null, index)}
                  />
              </div>
              <div className="form-group mb-3">
                <label className="control-label">Business rules sets</label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  value={filter(
                    businessRulesets,
                    r => indexOf(get(item, "businessRuleSetIds", []), r.id) !== -1
                  )}
                  onChange={v => this.change('businessRuleSetIds', map(v, _v => get(_v, 'id', [])), index)}
                  isClearable={true}
                  getOptionLabel={o => o.name}
                  getOptionValue={o => o.id}
                  options={businessRulesets}
                />
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={e => {
                  e.preventDefault()
                  this.delete(index)
                }}
                >Delete</button>
            </React.Fragment>
          </Tab>
        )}
      </Tabs>}
    </React.Fragment>
  }

}

const mapStateToProps = state => {
  return {
    sheetMapping: selectors.getExcelSheetMapping(state),
    properties: selectors.getMergedTradeItemProperties(state),
  }
}

export default connect(mapStateToProps, actions)(ExcelFormatConfiguration)
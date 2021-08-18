import React from "react"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import Sticky from 'react-stickynode'
import update from 'immutability-helper'
import Select from 'react-select'
import get from "lodash/get"
import map from "lodash/map"
import size from "lodash/size"
import filter from "lodash/filter"
import findIndex from "lodash/findIndex"
import * as selectors from "./selectors"
import * as actions from "./actions"
import Card from "../common/components/layout/Card"
import Alert from "../common/components/layout/Alert"
import Modal from "../common/components/layout/Modal"
import { initNewPropertyMapping, checkTransformIsEmpty, initNewStandardPropertyTransformation, isStandardMapping } from "./utils"
import MappingGroupsNavigation from "./MappingGroupsNavigation"
import AutoMappingTable from "./AutoMappingTable"
import PropertyMapping from "./PropertyMapping"
import StandardPropertyMapping from './StandardPropertyMapping'

const MAPPING_BASIC_MODE = "Basic"

class EditMatrixMapping extends React.Component {

  componentDidMount() {
    const { matrixAnalysisId, mapping } = this.props
    const { getNonStandardMatrixAnalysis, getStandardMatrixAnalysis } = this.props
    if(isStandardMapping(mapping)) {
      getStandardMatrixAnalysis()
    } else getNonStandardMatrixAnalysis(matrixAnalysisId)
    this.props.getPropertiesByGroupAndTradeItemCategory(get(this.props.mapping, "taxonomyId"), this.props.groupSelectedForNavigation.groupName, get(this.props.mapping, "tradeItemCategory.code"))
    this.selectFirstTab()
    this.initTabForMapping()
  }

  componentDidUpdate(prevProps) {
    if(this.props.matrixAnalysisId !== prevProps.matrixAnalysisId) {
      if(isStandardMapping(this.props.mapping)) {
        this.props.getStandardMatrixAnalysis()
      } else this.props.getNonStandardMatrixAnalysis(this.props.matrixAnalysisId)
    }
    if(this.props.groupSelectedForNavigation.groupName !== prevProps.groupSelectedForNavigation.groupName) {
      this.props.getPropertiesByGroupAndTradeItemCategory(get(this.props.mapping, "taxonomyId"), this.props.groupSelectedForNavigation.groupName, get(this.props.mapping, "tradeItemCategory.code"))
      this.initTabForMapping()
      this.props.cancelPropertyMappingEdit()
    }
    if(get(this.props.mapping, "id") !== get(prevProps.mapping, "id")) {
      this.selectFirstTab()
      this.initTabForMapping()
      this.props.cancelPropertyMappingEdit()
    }
    if(this.props.currentTabSelectedForMapping !== prevProps.currentTabSelectedForMapping) this.props.cancelPropertyMappingEdit()
  }

  selectFirstTab() {
    const { mappingGroupsForNav } = this.props
    const { setSelectedMappingGroupIndex } = this.props
    setSelectedMappingGroupIndex(get(mappingGroupsForNav, "[0].groupIndex"))
  }

  initTabForMapping() {
    const {mappingTabsForSelect } = this.props
    const { setTabSelectedForMapping } = this.props
    setTabSelectedForMapping(get(mappingTabsForSelect, "[0].options.[0]", null))

  }

  prepareColumnsMapping(tradeItemPropertiesMapping) {
    return filter(map(tradeItemPropertiesMapping, m => {
      const propertyCode = get(m, "property.code")
      if(!propertyCode) return null
      return {
        fileColumnIdentifier: get(m, "columnIdentifier"),
        fileColumnName: get(m, "columnName"),
        productIdentifier: propertyCode,
        mapName: propertyCode,
        mode: MAPPING_BASIC_MODE,
        code: null,
        transformer: null,
      }
    }))
  }

  render() {

    const { mapping,
      originalMapping,
      mappingGroupsForNav,
      groupSelectedForNavigation,
      groupIndex,
      mappingTabsForSelect,
      currentTotalTabsMapped,
      currentTotalTabsNotMapped,
      totalTabsMappedByGroupIndex,
      currentTabSelectedForMapping,
      currentTabSelectedIndex,
      currentColumnsMapping,
      mappingFilterByName,
      isAutoMapping,
      currentSheetIndex,
      currentTabColumns,
      tradeItemPropertiesResults,
      hasChanged,
      mappedColumns,
      propertyMapping,
      isEditingPropertyMapping,
      isCurrentMapNameValid,
      propertyMappingIndex,
      tradeItemPropertiesNotMapped,
      currentColumnsMappingNames,} = this.props

    const { setSelectedMapping,
      setSelectedMappingGroupIndex,
      setTabSelectedForMapping,
      setFilterForMappingNames,
      setAutoMapping,
      updateMappingColumns,
      pushMappingColumns,
      updateNonStandardMapping,
      startPropertyMappingEdit,
      setPropertyMappingEdit,
      cancelPropertyMappingEdit,
      setPropertyMappingEditMapName,
      updatePropertyMapping,
      createPropertyMapping,
      deletePropertiesMappings,
      deletePropertyMapping,
      //Standard mapping
      setTransformationColumns,
      updateStandardMapping,
      createStandardPropertyMapping,
      updateStandardPropertyMapping,
      deleteStandardPropertiesMappings,
      deleteStandardPropertyMapping} = this.props

    return (
      <React.Fragment>

        {get(mapping, "matrixAnalysisId") !== get(originalMapping, "matrixAnalysisId") && <Alert type={`warning`}>Matrix analysis has changed.</Alert>}

        <Card>

          {/* Head row */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <h4>
                  <input
                    style={{fontSize: "1.2rem"}}
                    className="form-control font-weight-bold border-0 p-0"
                    type="text"
                    value={`${get(mapping, "mappingTitle")}`}
                    onChange={e => setSelectedMapping(update(mapping, {mappingTitle: {$set: e.target.value}}))} />
                  <small
                    className="text-muted"
                    style={{fontSize: ".7rem"}}>{`${get(mapping, "tradeItemCategory")}`} - {`${get(mapping, "id")}`}</small>
                </h4>

                {hasChanged && !isStandardMapping(mapping) && <div>
                  <button
                    className="btn btn-secondary mr-2"
                    onClick={() => setSelectedMapping(originalMapping)}>Reset</button>
                  <button
                    className="btn btn-primary"
                    onClick={() => updateNonStandardMapping(mapping.id, mapping)}>Save</button>
                </div>}

                {isStandardMapping(mapping) && <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => updateStandardMapping(mapping.id, mapping)}>Save
                  </button>
                </div>}
              </div>
            </div>
          </div>

          {/* Mapping groups navigation */}
          <MappingGroupsNavigation
            mappingGroups={mappingGroupsForNav}
            groupSelected={groupSelectedForNavigation}
            onSelect={groupIndex => setSelectedMappingGroupIndex(groupIndex)}
            totalTabsMappedByGroupIndex={totalTabsMappedByGroupIndex} />


          {/* Mapping lists by tab */}
          <div className="row pt-4">
            <div className="col-8">
              <Select
                value={currentTabSelectedForMapping}
                onChange={option => {
                  if(isStandardMapping(mapping)) {
                    setTransformationColumns(groupIndex, option ? [{sheetIndex: option.sheetIndex, transformations: []}] : [])
                  }
                  setTabSelectedForMapping(option)
                }}
                getOptionLabel={option => option.sheetName}
                getOptionValue={option => option.sheetIndex}
                isLoading={false}
                isClearable={true}
                name="current-mapping-grouped-tabs"
                options={mappingTabsForSelect}/>
            </div>

            {/*Auto-map button*/}
            {!isStandardMapping(mapping) && <div className="col-4 pt-2">
              <span>{currentTotalTabsMapped} tab(s) mapped over {currentTotalTabsMapped + currentTotalTabsNotMapped}</span>
              {currentTabSelectedForMapping !== null && <button
                className="btn btn-warning float-right btn-sm"
                onClick={e => setAutoMapping(true)}>Auto-map</button>}
            </div>}

          </div>

          <div className="row pt-5">

          {/* Non-Standard mapping form */}
          {!isStandardMapping(mapping) && <div className="col-4">
              <h5>Current mappings</h5>
              <br/>
              <div className=" mb-2">
                {currentSheetIndex >= 0 && <button
                  onClick={e => startPropertyMappingEdit(initNewPropertyMapping())}
                  className="btn btn-sm btn-secondary mr-2">+ Add new mapping</button>}
                {size(currentColumnsMapping) > 0 && <button
                  onClick={e => deletePropertiesMappings(groupIndex, currentTabSelectedIndex)}
                  className="btn btn-sm btn-danger">Delete all mappings</button>}
              </div>
              {(size(currentColumnsMapping) > 0 || size(mappingFilterByName) > 0) && <input
                placeholder="Search mappings names"
                type="text"
                autoComplete="off"
                className="form-control form-control-sm mb-2"
                style={{maxWidth: '200px'}} value={mappingFilterByName || ''}
                onChange={e => setFilterForMappingNames(e.target.value)}/>}
              {map(currentColumnsMapping, (m, k) => <div
                key={`current-mapping-tab-${k}`}
                className="mb-2 d-flex align-items-center">
                  <span className="d-flex flex-column">
                    <span className={`mr-1 badge badge-${get(m, 'mode') === 'Basic' ? 'light' : 'warning'}`}>{get(m, 'mode', '').charAt(0)}</span>
                    {checkTransformIsEmpty(get(m, 'transformer')) &&
                    <span className="mr-1 badge badge-primary">T</span>}
                  </span>
                <div className="btn-group">
                  <button onClick={e => deletePropertyMapping(groupIndex, currentTabSelectedIndex, findIndex(currentColumnsMappingNames, mapName => mapName === m.mapName))} className="btn btn-sm btn-danger font-weight-bold"><i className="icon-close"/></button>
                  <button
                    onClick={e => {
                      setPropertyMappingEditMapName(m.mapName)
                      startPropertyMappingEdit(m)
                    }}
                    className="btn btn-secondary btn-sm">{m.mapName}</button>
                </div>
              </div>)}
          </div>}

          {/* Standard mapping form */}
          {isStandardMapping(mapping) && <div className="col-4">
              <h5>Current mappings</h5>
              <br/>
              <div className=" mb-2">
                {currentSheetIndex >= 0 && <button
                  onClick={e => startPropertyMappingEdit(initNewStandardPropertyTransformation())}
                  className="btn btn-sm btn-secondary mr-2">+ Add new mapping</button>}
                {size(currentColumnsMapping) > 0 && <button
                  onClick={e => deleteStandardPropertiesMappings(groupIndex, currentTabSelectedIndex)}
                  className="btn btn-sm btn-danger">Delete all mappings</button>}
              </div>
              {(size(currentColumnsMapping) > 0 || size(mappingFilterByName) > 0) && <input
                placeholder="Search mappings names"
                type="text"
                autoComplete="off"
                className="form-control form-control-sm mb-2"
                style={{maxWidth: '200px'}} value={mappingFilterByName || ''}
                onChange={e => setFilterForMappingNames(e.target.value)}/>}
              {map(currentColumnsMapping, (m, k) => <div
                key={`current-mapping-tab-${k}`}
                className="mb-2 d-flex align-items-center">
                  <span className="d-flex flex-column">
                    <span
                      className={`mr-1 badge badge-${get(m, 'mode') === 'Basic' ? 'light' : 'warning'}`}>{get(m, 'mode', '').charAt(0)}</span>
                    {checkTransformIsEmpty(get(m, 'transformer')) &&
                    <span className="mr-1 badge badge-primary">T</span>}
                  </span>
                <div className="btn-group">
                  <button
                    onClick={e => deleteStandardPropertyMapping(groupIndex, currentTabSelectedIndex, k)}
                    className="btn btn-sm btn-danger font-weight-bold"><i className="icon-close"/></button>
                  <button
                    onClick={e => {
                      setPropertyMappingEditMapName(m.propertyCode)
                      startPropertyMappingEdit(m)
                    }}
                    className="btn btn-secondary btn-sm">{m.propertyCode}</button>
                </div>
              </div>)}
          </div>}

            {isEditingPropertyMapping && <div className="col-8">
              <Sticky top={70}>
                {isStandardMapping(mapping) ?
                  <StandardPropertyMapping
                    onChange={pm => setPropertyMappingEdit(pm)}
                    onCancel={() => cancelPropertyMappingEdit()}
                    onSave={pm => {
                      if (propertyMappingIndex !== -1) updateStandardPropertyMapping(groupIndex, currentTabSelectedIndex, propertyMappingIndex, pm)
                      else createStandardPropertyMapping(groupIndex, currentTabSelectedIndex, pm)
                      cancelPropertyMappingEdit()
                    }}
                    propertyMapping={propertyMapping}
                    tradeItemProperties={tradeItemPropertiesNotMapped}/>
                  :
                  <PropertyMapping
                    isMapNameValid={isCurrentMapNameValid}
                    onChange={pm => setPropertyMappingEdit(pm)}
                    onCancel={() => cancelPropertyMappingEdit()}
                    onSave={pm => {
                      if (propertyMappingIndex !== -1) 
                        updatePropertyMapping(groupIndex, currentTabSelectedIndex, propertyMappingIndex, pm)
                      else 
                        createPropertyMapping(groupIndex, currentTabSelectedIndex, pm)
                      cancelPropertyMappingEdit()
                    }}
                    propertyMapping={propertyMapping}
                    columns={currentTabColumns}
                    tradeItemProperties={tradeItemPropertiesNotMapped}/>
                }
              </Sticky>
            </div>}

          </div>

          {/* Auto mapping */}
          {isAutoMapping && <Modal
            title={`Auto Mapping`}
            onClose={e => setAutoMapping(false)}
            size="lg">
              <AutoMappingTable
                onAutoMap={tradeItemPropertiesMapping => {
                  if(currentTabSelectedIndex === -1) pushMappingColumns(groupIndex, currentSheetIndex, this.prepareColumnsMapping(tradeItemPropertiesMapping))
                  else updateMappingColumns(groupIndex, currentTabSelectedIndex, this.prepareColumnsMapping(tradeItemPropertiesMapping))
                  setAutoMapping(false);
                }}
                onCancel={() => setAutoMapping(false)}
                groupIndex={groupIndex}
                tabIndex={currentTabSelectedForMapping.sheetIndex}
                tabName={currentTabSelectedForMapping.sheetName}
                columns={currentTabColumns}
                tradeItemProperties={tradeItemPropertiesResults}
                currentColumnsMapping={currentColumnsMapping}
                mappedColumns={mappedColumns} />
          </Modal>}

        </Card>
      </React.Fragment>
    )
  }

}

const mapStateToProps = (state) => {
    return {
      mapping: selectors.getSelectedMapping(state),
      originalMapping: selectors.getOriginalMapping(state),
      mappingGroupsForNav: selectors.getMappingGroupsForNavigation(state),
      groupIndex: selectors.getSelectedGroupIndex(state),
      groupSelectedForNavigation: selectors.getSelectedMappingGroupForNavigation(state),
      matrixAnalysisId: selectors.getSelectedMappingMatrixAnalysisId(state),
      mappingTabsForSelect: selectors.getGroupedTabSelectionForSelect(state),
      standardMappingTabs: selectors.getCurrentTabsMapped(state),
      currentTotalTabsMapped: selectors.getCurrentTabsTotalMapped(state),
      currentTotalTabsNotMapped: selectors.getCurrentTabsTotalNotMapped(state),
      totalTabsMappedByGroupIndex: selectors.getTabsTotalMappedByGroup(state),
      currentTabSelectedForMapping: selectors.getColumnsMappingTabSelected(state),
      currentTabSelectedIndex: selectors.getCurrentTabIndex(state),
      currentSheetIndex: selectors.getColumnsMappingTabSelectedIndex(state),
      currentColumnsMapping: selectors.getCurrentColumnsMappingOrderedByName(state),
      mappingFilterByName: selectors.getColumnsMappingFilterByName(state),
      isAutoMapping: selectors.isAutoMapping(state),
      currentTabColumns: selectors.getColumnsForAutoMapping(state),
      tradeItemPropertiesResults: selectors.getTradeItemPropertiesResults(state),
      hasChanged: selectors.hasMappingChanged(state),
      mappedColumns: selectors.getMappedColumnsByTabAndGroup(state),
      propertyMapping: selectors.getEditPropertyMapping(state),
      isEditingPropertyMapping: selectors.isEditingPropertyMapping(state),
      isCurrentMapNameValid: selectors.isCurrentMapNameValid(state),
      propertyMappingIndex: selectors.getCurrentPropertyMappingIndex(state),
      tradeItemPropertiesNotMapped: selectors.getTradeItemPropertiesNotMapped(state),
      currentColumnsMappingNames: selectors.getCurrentColumnsMappingNames(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(EditMatrixMapping))

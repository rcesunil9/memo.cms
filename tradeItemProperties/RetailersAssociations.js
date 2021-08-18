import React from 'react'
import get from 'lodash/get'
import filter from 'lodash/filter'
import map from 'lodash/map'
import indexOf from 'lodash/indexOf'
import update from 'immutability-helper'
import isEmpty from 'lodash/isEmpty'
import * as selectors from './selectors'
import * as actions from './actions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SmartDatatable from '../common/components/datatable/SmartDatatable'
import Card from '../common/components/layout/Card'
import Select from 'react-select'
import find from 'lodash/find'
import { RequiredSelectInputWrap } from '../common/components/form/RequiredSelecInputWrap'
import { makeOptionsFromStringArray, mandatoryLevelPlaceholder } from './utils'
import dotProp from 'dot-prop-immutable'
import { down, up } from '../export-format/utils'
import { filterStringValueLowerCase } from 'app/common/utils/filterString'

const EditAssociationRow = (props) => {
  const {editAssociation, setEditAssociation, businessRulesSet, mandatoryLevels, properties} = props
  const mandatoryLevelsForSelect = makeOptionsFromStringArray(mandatoryLevels)
  const change = (k, v) => setEditAssociation(dotProp.set(editAssociation, k, v))

  const moveUp = index => change('conditionalMandatoryLevels', up(get(editAssociation, 'conditionalMandatoryLevels'), index))
  const moveDown = index => change('conditionalMandatoryLevels', down(get(editAssociation, 'conditionalMandatoryLevels'), index))

  const addMandatoryLevel = () => change(`conditionalMandatoryLevels`, [...editAssociation.conditionalMandatoryLevels, mandatoryLevelPlaceholder()])

  const removeMandatoryLevel = (lvlIndex) => {
    let newArray = [...editAssociation.conditionalMandatoryLevels.slice(0, lvlIndex), ...editAssociation.conditionalMandatoryLevels.slice(lvlIndex + 1)]
    return change(`conditionalMandatoryLevels`, newArray)
  }

  return <form>
    <div className="form-row">
      <div className="col-md-2 p-2 pl-3">
        <div className="form-group">
          <label className="control-label">Property</label>
          <RequiredSelectInputWrap
            value={properties ? find(properties, p => p.code === get(editAssociation, 'productPropertyCode')) : null}
            onChange={p => change('productPropertyId', p.id)}
            getOptionLabel={p => p.code}
            getOptionValue={p => p.id}
            options={properties}
            required
          />
        </div>
      </div>

      <div className="col-md-2 p-2 pl-3">
        <div className="form-group">
          <label className="control-label">Enrichment mandatory lvl</label>
          <RequiredSelectInputWrap
            value={mandatoryLevels ? find(mandatoryLevelsForSelect, p => p.value === get(editAssociation, 'enrichmentMandatoryLevel')) : null}
            onChange={p => change(`enrichmentMandatoryLevel`, p.value)}
            options={mandatoryLevelsForSelect}
            required
            />
        </div>
      </div>


      <div className="col-md-8 p-2">
        <div className="form-row">
          <label className="col-md-2 control-label">Index</label>
          <label className="col-md-3 control-label">Level*</label>
          <label className="col-md-5 control-label">Business rule set</label>
        </div>
        {map(get(editAssociation, 'conditionalMandatoryLevels', []), (level, lvlKey) => {
          return <div className="form-row" key={`mandatory-level-item-${lvlKey}`}>
            <div className="form-group col-md-2 d-flex flex-column">
              {lvlKey > 0 && (
                <span style={{cursor: 'pointer'}} onClick={() => moveUp(lvlKey)}><i className="icon-arrow-up"/></span>)}
              {lvlKey < get(editAssociation, 'conditionalMandatoryLevels', []).length - 1 && (
                <span style={{cursor: 'pointer'}} onClick={() => moveDown(lvlKey)}><i
                  className="icon-arrow-down"/></span>)}
            </div>
            <div className="form-group col-md-3">
              <RequiredSelectInputWrap
                value={mandatoryLevels ? find(mandatoryLevelsForSelect, p => p.value === get(level, 'mandatoryLevel')) : null}
                onChange={p => change(`conditionalMandatoryLevels.${lvlKey}.mandatoryLevel`, p.value)}
                options={mandatoryLevelsForSelect}
                required
              />
            </div>

            <div className="form-group col-md-5">
              <Select
                value={businessRulesSet ? find(businessRulesSet, r => r.id === get(level, 'businessRuleSetId')) : null}
                onChange={p => change(`conditionalMandatoryLevels.${lvlKey}.businessRuleSetId`, p.id)}
                getOptionLabel={p => p.name}
                getOptionValue={p => p.id}
                options={businessRulesSet}
              />
            </div>

            <div className="form-group col-md-2 align-self-start text-center">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeMandatoryLevel(lvlKey)}
              >
                X
              </button>
            </div>
          </div>
        })}
        <div className="text-center">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => addMandatoryLevel()}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  </form>
}

class RetailersAssociations extends React.Component {

  constructor(props) {
    super(props)
    this.saveAssociation = this.saveAssociation.bind(this)
  }

  componentDidMount () {
    const {getConnectors, getBusinessRuleSets, getMandatoryLevels} = this.props
    getBusinessRuleSets()
    // getRetailersAssociations(filters)
    getConnectors()
    getMandatoryLevels()
  }

  componentWillUnmount () {
    const {setAssociationsFilters, resetConnectors, resetRetailersAssociations} = this.props
    resetConnectors()
    resetRetailersAssociations()
    setAssociationsFilters()
  }

  saveAssociation() {
    const { editAssociation, expandedRow } = this.props
    const { setExpandedRow, updateAssociation } = this.props
    const indexExpanded = Object.keys(expandedRow)[0]
    setExpandedRow()
    updateAssociation(editAssociation, indexExpanded)
  }

  render () {
    const {associations, filters, connectors, properties, businessRuleSetsById, expandedRow, editAssociation, businessRulesSet, mandatoryLevels} = this.props
    const {setAssociationsFilters, getRetailersAssociations, deleteAssociationById, setExpandedRow, setEditAssociation, updateAssociation, exportCsv} = this.props
    const change = (k, v) => {
      const newFilters = update(filters, {[k]: {$set: v}})
      if (isEmpty(get(newFilters, 'propertyIds')) && isEmpty(get(newFilters, 'connectorIds'))) return;
      getRetailersAssociations(newFilters)
      return newFilters
    }
    const allowFetch = !(isEmpty(get(filters, 'propertyIds')) && isEmpty(get(filters, 'connectorIds')))

    const conditionLevels = d => {
      return map(d.conditionalMandatoryLevels, (lvl, key) =>
        <div className="text-left" key={`levels-${key}`}>
        <span className="d-inline-block" style={{width: '65px'}}>
          {get(lvl, 'mandatoryLevel', '')}</span>
          {` - ${get(businessRuleSetsById[get(lvl, 'businessRuleSetId', '')], 'name', '')}`}
        </div>)
    }

    const expandActions = (isExpanded, original) => {
      return <React.Fragment>
        {isExpanded
          ? <button className="btn btn-link p-0 mr-2"
                    onClick={e => {
                      e.preventDefault()
                      this.saveAssociation()
                    }}
                    >Save</button>
          : <button className="btn btn-link p-0 mr-2"
                    onClick={e => {
                      e.preventDefault()
                      setEditAssociation(original)
                    }}>Edit</button>
        }

        <button className="btn btn-link text-danger p-0" onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          deleteAssociationById(original.id)
        }}>Delete
        </button>
      </React.Fragment>
    }

    return <React.Fragment>

      <Card>
        <div className="form-row mt-1">
          <div className="form-group col-md-3">
            <label className="control-label">
              Property codes:
            </label>
            <Select
              isMulti
              isClearable={true}
              closeMenuOnSelect={false}
              value={filter(
                properties,
                r => indexOf(get(filters, 'propertyIds', []), r.id) !== -1
              )}
              onChange={selected => setAssociationsFilters(change('propertyIds', selected ? map(selected, rt => rt.id) : []))}
              getOptionLabel={o => o.code}
              getOptionValue={o => o.id}
              options={properties}
            />
          </div>
          <div className="form-group col-md-3">
            <label className="control-label">
              Connectors:
            </label>
            <Select
              isMulti
              isClearable={true}
              closeMenuOnSelect={false}
              value={filter(
                connectors,
                r => indexOf(get(filters, 'connectorIds', []), r.connectorId) !== -1
              )}
              onChange={selected => setAssociationsFilters(change('connectorIds', selected ? map(selected, rt => rt.connectorId) : []))}
              getOptionLabel={o => o.name}
              getOptionValue={o => o.connectorId}
              options={connectors}
            />
          </div>
          <div className="form-group col-md-3">
            <label className="control-label">
              Mandatory level:
            </label>
            <RequiredSelectInputWrap
              isClearable={true}
              value={mandatoryLevels ? get(filters, 'mandatoryLevel') : null}
              onChange={p => setAssociationsFilters(change('mandatoryLevel', p))}
              getOptionLabel={o => o}
              getOptionValue={o => o}
              options={mandatoryLevels}
              required
            />
          </div>
          {allowFetch && <div className="form-group align-self-end ml-auto">
            <button
                onClick={e => exportCsv(filters)}
                className="btn btn-primary">
                Export
            </button>
          </div>}
          {/* <div className="form-group align-self-end ml-auto">
            <button className="btn btn-primary py-2" onClick={() => getRetailersAssociations(filters)}>Filter
            </button>
          </div> */}
        </div>
      </Card>

      {!allowFetch && 'Please select at least one filter.'}
      {/* manual
        showPaginationTop={true}
        onPageSizeChange={size => getRetailersAssociations(change('pageSize', size))}
        onPageChange={page => getRetailersAssociations(change('pageNumber', page))} 
        page={filters.pageNumber}
        pages={total > 0 ? Math.ceil(total / filters.pageSize) : 0} */}
      {allowFetch && <SmartDatatable
        style={{zIndex: 0}}
        data={associations}
        pageSizeOptions={[10, 50, 100, 200, 500]}
        expanded={expandedRow}
        onExpandedChange={(newExpanded, index, event) => {
          if (newExpanded && newExpanded[index] === false) return
          setExpandedRow({[index]: true})
        }}
        getTrProps={() => {
          return {
            style: {
              alignItems: 'center'
            }
          }
        }}
        className="-striped -highlight text-center"
        sortable={true}
        filterable={true}
        defaultFilterMethod={filterStringValueLowerCase}
        SubComponent={() => <EditAssociationRow
          editAssociation={editAssociation}
          updateAssociation={updateAssociation}
          setEditAssociation={setEditAssociation}
          properties={properties}
          businessRulesSet={businessRulesSet}
          mandatoryLevels={mandatoryLevels}
          setExpandedRow={setExpandedRow}
        />}
        columns={[
          {Header: 'Connector', accessor: 'connectorName'},
          {Header: 'Property', accessor: 'productPropertyCode'},
          //{Header: 'Group', accessor: 'group'},
          // {Header: 'Trade Item Category', accessor: 'tradeItemCategory'},
          {Header: 'Enrichment Mandatory', accessor: 'enrichmentMandatoryLevel'},
          {
            Header: 'Override and business rule sets levels',
            id: 'levels',
            accessor: d => conditionLevels(d),
            minWidth: 250
          },
          {
            expander: true,
            Header: 'Actions',
            width: 120,
            Expander: ({isExpanded, original, ...rest}) => expandActions(isExpanded, original)
          },
        ]}
      />}
    </React.Fragment>
  }
}

const mapStateToProps = (state) => {
  return {
    filters: selectors.getRetailersAssociationsFilters(state),
    total: selectors.getRetailersAssociationsTotal(state),
    associations: selectors.getRetailersAssociations(state),
    connectors: selectors.getConnectorsList(state),
    properties: selectors.getFilteredPropertiesList(state),
    businessRuleSetsById: selectors.getBusinessRuleSetListById(state),
    businessRulesSet: selectors.getBusinessRuleSetList(state),
    mandatoryLevels: selectors.getMandatoryLevels(state),
    expandedRow: selectors.getExpandedRow(state),
    editAssociation: selectors.getEditRetailersAssociation(state)
  }
}

export default withRouter(connect(mapStateToProps, actions)(RetailersAssociations))
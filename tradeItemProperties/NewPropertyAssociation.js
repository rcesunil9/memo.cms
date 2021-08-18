import React from 'react'
import map from 'lodash/map'
import { RequiredSelectInputWrap } from '../common/components/form/RequiredSelecInputWrap'
import get from 'lodash/get'
import find from 'lodash/find'
import size from 'lodash/size'
import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'
import Select from 'react-select'
import dotProp from 'dot-prop-immutable'
import update from 'immutability-helper'
import { makeOptionsFromStringArray, mandatoryLevelPlaceholder, retailerAssociationPlaceholder } from './utils'
import { connect } from 'react-redux'
import * as actions from './actions'
import * as utils from './utils'
import { Link, withRouter } from 'react-router-dom'
import * as selectors from './selectors'
import SmartDatatable from '../common/components/datatable/SmartDatatable'
import ActionsBar from '../common/components/layout/ActionsBar'
import PageWrapper from '../common/components/layout/PageWrapper'
import filter from 'lodash/filter'
import indexOf from 'lodash/indexOf'
import { tradeItemCategories } from 'app/businessRules/selectors'

const AssociationsList = ({list, onRemove, businessRulesSet, connectors, properties, taxonomies, groups, tradeItemCategories}) => {

  const conditionLevels = d => {
    return map(d.conditionalMandatoryLevels, (lvl, key) =>
      <div className="text-left" key={`levels-${key}`}>
        <span className="d-inline-block" style={{width: '65px'}}>
          {get(lvl, 'mandatoryLevel', '')}</span>
        {` - ${get(find(businessRulesSet, br => br.id === get(lvl, 'businessRuleSetId', '')), 'name', '')}`}
      </div>)
  }

  const columns = [
    {
      Header: 'Taxonomy',
      id: 'taxonomyId',
      accessor: d => get(find(taxonomies, r => r.id === d.taxonomyId), 'name', d.taxonomyId)
    },
    {
      Header: 'Category',
      id: 'tradeItemCategory.code',
      accessor: d => get(find(tradeItemCategories, r => r.code.code === d.tradeItemCategory.code), 'name', d.tradeItemCategory.code)
    },
    {
      Header: 'Group',
      id: 'propertyGroupId',
      accessor: d => get(find(groups, r => r.id === d.propertyGroupId), 'name', d.propertyGroupId)
    },
    {
      Header: 'Property',
      id: 'productPropertyId',
      accessor: d => get(find(properties, r => r.id === d.productPropertyId), 'code', d.productPropertyId)
    },
    {
      Header: 'Connectors',
      id: 'connectors',
      accessor: d => get(find(connectors, r => r.connectorId === d.connectorId), 'name', d.connectorId)
    },
    {Header: 'Override and business rule sets levels', id: 'levels', accessor: d => conditionLevels(d), minWidth: 250},
    {
      Header: 'Actions',
      id: 'actions',
      Cell: ({index}) => <button
        className="btn btn-danger"
        onClick={(e) => onRemove(index)}
      >
        Remove
      </button>
    }
  ]

  return (
    <SmartDatatable
      data={list}
      className="-striped -highlight"
      columns={columns}
      noDataText="+ Add association"
      defaultPageSize={2}
      pageSize={size(list)}
      showPaginationBottom={false}
    />
  )
}

class NewPropertyAssociation extends React.Component {
  constructor (props) {
    super(props)
    this.createAssociation = this.createAssociation.bind(this)
  }

  componentDidMount() {
    const {setNewAssociation, getTradeItemCategories, getGroups, getConnectors, getMandatoryLevels, getBusinessRuleSets, getTaxonomies} = this.props
    getTradeItemCategories()
    getGroups()
    getTaxonomies()
    getConnectors()
    getMandatoryLevels()
    getBusinessRuleSets()
    setNewAssociation(utils.getAssociationFormPlaceholder())
  }

  componentWillUnmount() {
    const {setNewAssociation} = this.props
    setNewAssociation()
  }

  searchProperties(taxonomyId, propertyGroup, propertyTradeItemCategoryCode) {
    if (taxonomyId && (propertyGroup || propertyTradeItemCategoryCode)) {
      this.props.getProperties({taxonomyId, propertyGroup, propertyTradeItemCategoryCode})
    }
  }

  selectTradeItemCategory(tradeItemCategoryCode) {
    const { groupSelected, taxonomySelected, selectTradeItemCategory } = this.props
    selectTradeItemCategory(tradeItemCategoryCode)
    this.searchProperties(taxonomySelected, groupSelected, tradeItemCategoryCode)
  }

  selectGroup(group) {
    const { tradeItemCategorySelected, taxonomySelected, selectGroup } = this.props
    selectGroup(group)
    this.searchProperties(taxonomySelected, group, tradeItemCategorySelected)
  }

  selectTaxonomy(taxonomy) {
    const { tradeItemCategorySelected, groupSelected, selectTaxonomy } = this.props
    selectTaxonomy(taxonomy)
    this.searchProperties(taxonomy, groupSelected, tradeItemCategorySelected)
  }

  createAssociation (e) {
    e.preventDefault()
    const {associationNew, createButchAssociations, history} = this.props
    createButchAssociations(associationNew.list)
    history.push('/trade-items-properties/retailers-associations')
  }

  onSubmit (e) {
    e.preventDefault()
    const {associationNew, setNewAssociation} = this.props
    const currentAssc = associationNew.current
    //Reduce list of retailerIDs and productPropertiesIds, to impl multiple create
    const reducedList = reduce(get(associationNew, 'current.connectorId', []), (acc, value) => {
      let propertiesList = map(get(associationNew, 'current.productPropertyId', []), val => {
        return update(currentAssc, {productPropertyId: {$set: val}, connectorId: {$set: value}})
      })
      return [...acc,...propertiesList]
    }, [])
    let newList = [...associationNew.list, ...reducedList]
    setNewAssociation(update(associationNew, {
      list: {$set: newList},
      current: {$set: retailerAssociationPlaceholder()}
    }))
  }

  onChange = (k, v) => {
    const {associationNew, setNewAssociation} = this.props
    setNewAssociation(dotProp.set(associationNew, `current.${k}`, v))
  }

  onRemove = (index) => {
    const {associationNew, setNewAssociation} = this.props
    setNewAssociation(update(associationNew, {list: {$set: [...associationNew.list.slice(0, index), ...associationNew.list.slice(index + 1)]}}))
  }

  render () {
    const {associationNew, properties, businessRulesSet, connectors, mandatoryLevels, groups, tradeItemCategories, taxonomies} = this.props
    const {onChange, onRemove, createAssociation} = this
    const mandatoryLevelsForSelect = makeOptionsFromStringArray(mandatoryLevels)

    return (<div className="container-fluid">
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">New property associations</h2>
          </div>
          <div className="col-8 text-right">
            <Link to={`/trade-items-properties/retailers-associations`} className="btn btn-light mr-2">Go back to list</Link>
          </div>
        </ActionsBar>

      <PageWrapper>
        <h5>Association form:</h5>
        <form onSubmit={e => this.onSubmit(e)}>
          <div className="row">
            <div className="form-row col-md-12">

              {/* Taxonomy */}
              <div className="form-group col-md-2">
                <label className="control-label">Taxonomy*</label>
                <RequiredSelectInputWrap
                  options={taxonomies}
                  getOptionLabel={p => p.name}
                  getOptionValue={p => p.id}
                  value={
                    find(taxonomies, s => s.id === get(associationNew, 'current.taxonomyId')) || null
                  }
                  onChange={p => 
                    {
                      onChange('taxonomyId', p.id);
                      this.selectTaxonomy(p.id)
                    }
                  }
                  required
                />
              </div>

              {/* Trade Item Category */}
              <div className="form-group col-md-2">
                <label className="control-label">Trade Item Category*</label>
                <RequiredSelectInputWrap
                  options={tradeItemCategories}
                  getOptionLabel={p => p.name}
                  getOptionValue={p => p.id}
                  value={find(tradeItemCategories, s => s.code.code === get(associationNew, 'current.tradeItemCategory.code')) || null}
                  onChange={p => 
                    {
                      onChange('tradeItemCategory.code', p.code.code);
                      this.selectTradeItemCategory(p.code.code)
                    }
                  }
                  required
                />
              </div>

              {/* Group */}
              <div className="form-group col-md-2">
                <label className="control-label">Group*</label>
                <RequiredSelectInputWrap
                  options={groups}
                  getOptionLabel={p => p.name}
                  getOptionValue={p => p.id}
                  value={
                    find(groups, s => s.id === get(associationNew, 'current.propertyGroupId')) || null
                  }
                  onChange={p => { 
                    onChange('propertyGroupId', p.id) 
                    this.selectGroup(p.id)
                  }}
                  required
                />
              </div>
            </div>

            {associationNew && (associationNew.current.tradeItemCategory.code && associationNew.current.propertyGroupId) &&
            <div className="form-row col-md-12">

              {/* Property */}
              <div className="form-group col-md-2">
                <label className="control-label">Property*</label>
                <RequiredSelectInputWrap
                  isMulti={true}
                  closeMenuOnSelect={false}
                  value={filter(
                    properties,
                    r => indexOf(get(associationNew, 'current.productPropertyId'), r.id) !== -1
                  )}
                  onChange={p => onChange('productPropertyId', p ? map(p, rt => rt.id) : [])}
                  getOptionLabel={p => p.code}
                  getOptionValue={p => p.id}
                  options={properties}
                  required
                />
              </div>

              {/* Connector */}
              <div className="form-group col-md-2">
                <label className="control-label">Connector*</label>
                <RequiredSelectInputWrap
                  isMulti={true}
                  closeMenuOnSelect={false}
                  value={filter(
                    connectors,
                    r => indexOf(get(associationNew, 'current.connectorId'), r.id) !== -1
                  )}
                  onChange={p => onChange('connectorId', p ? map(p, rt => rt.connectorId) : [])}
                  getOptionLabel={p => p.name}
                  getOptionValue={p => p.connectorId}
                  options={connectors}
                  required
                />
              </div>

              {/* enrichmentMandatoryLevel  */}
              <div className="form-group col-md-2" style={{ position: "relative" }}>
                <label className="control-label">Enrichment mandatory level</label>
                <RequiredSelectInputWrap
                  value={mandatoryLevels ? find(mandatoryLevelsForSelect, p => p.value === get(associationNew, 'enrichmentMandatoryLevel')) : null}
                  onChange={p => onChange(`enrichmentMandatoryLevel`, p.value)}
                  options={mandatoryLevelsForSelect}
                />
              </div>

              <div className="col-md-4">
                <div className="form-row">
                  <label className="col-md-5 control-label">Level*</label>
                  <label className="col-md-5 control-label">Business rule set</label>
                </div>
                {map(get(associationNew, 'current.conditionalMandatoryLevels', []), (level, lvlKey) => {
                  return (
                    <div className="form-row" key={`mandatory-level-item-${lvlKey}`}>
                      <div className="form-group col-md-5" style={{ position: "relative" }}>
                        <RequiredSelectInputWrap
                          value={mandatoryLevels ? find(mandatoryLevelsForSelect, p => p.value === get(level, 'mandatoryLevel')) : null}
                          onChange={p => onChange(`conditionalMandatoryLevels.${lvlKey}.mandatoryLevel`, p.value)}
                          options={mandatoryLevelsForSelect}
                          required
                        />
                      </div>

                      <div className="form-group col-md-5">
                        <Select
                          isClearable={true}
                          value={businessRulesSet ? find(businessRulesSet, r => r.id === get(level, 'businessRuleSetId')) : null}
                          onChange={p => onChange(`conditionalMandatoryLevels.${lvlKey}.businessRuleSetId`, get(p, 'id', null))}
                          getOptionLabel={p => p.name}
                          getOptionValue={p => p.id}
                          options={businessRulesSet}
                        />
                      </div>

                      <div className="form-group col-md-2 align-self-end text-center">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => onChange('conditionalMandatoryLevels', [...associationNew.current.conditionalMandatoryLevels.slice(0, lvlKey), ...associationNew.current.conditionalMandatoryLevels.slice(lvlKey + 1)])}
                        >
                          X
                        </button>
                      </div>
                    </div>
                )})}
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => onChange('conditionalMandatoryLevels', [...associationNew.current.conditionalMandatoryLevels, mandatoryLevelPlaceholder()])}
                    >
                    + Add level
                  </button>
                </div>
              </div>
              <div className="form-group col-md-1 align-self-center text-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  + Add
                </button>
              </div>
            </div>}
          </div>
        </form>
        <h5>Associations list:</h5>
        <AssociationsList
          list={get(associationNew, 'list', [])}
          onRemove={onRemove}
          businessRulesSet={businessRulesSet}
          connectors={connectors}
          properties={properties}
          taxonomies={taxonomies}
          groups={groups}
          tradeItemCategories={tradeItemCategories}
        />

        <hr className="w-100"/>
        <div className="text-center">
          <button
            className="btn btn-primary "
            onClick={e => createAssociation(e)}
            disabled={isEmpty(get(associationNew, 'list', []))}
          >
            Create
          </button>
        </div>
      </PageWrapper>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    taxonomies: selectors.getTaxonomiesList(state),
    properties: selectors.getFilteredPropertiesList(state),
    tradeItemCategories: selectors.getTradeItemCategoriesList(state),
    groups: selectors.getGroupsList(state),
    connectors: selectors.getConnectorsList(state),
    businessRulesSet: selectors.getBusinessRuleSetList(state),
    mandatoryLevels: selectors.getMandatoryLevels(state),
    tradeItemCategorySelected: selectors.getTradeItemCategorySelected(state),
    groupSelected: selectors.getGroupSelected(state),
    taxonomySelected: selectors.getTaxonomySelected(state),
    associationNew: selectors.getNewRetailersAssociation(state),
  }
}

export default withRouter(connect(mapStateToProps, actions)(NewPropertyAssociation))
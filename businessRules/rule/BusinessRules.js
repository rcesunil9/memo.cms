import React from "react"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import update from 'immutability-helper'
import Sticky from 'react-stickynode'
import Select from 'react-select'
import get from "lodash/get"
import * as selectors from "./selectors"
import * as actions from "./actions"
import PageWrapper from "../../common/components/layout/PageWrapper"
import Card from "../../common/components/layout/Card"
import createMappingToState from "../../common/selectors/createMappingToState"
import BusinessRule from "./BusinessRule"
import { initNewBusinessRule } from "./utils"
import withTradeItemCategoriesAndGroupsAndTaxonomies from "../withTradeItemCategoriesAndGroupsAndTaxonomies"


class BusinessRules extends React.Component {

  componentDidMount() {
    this.init()
  }

  init() {
    const { rule } = this.props
    const {
      getBusinessRules,
      getBusinessRulesValidators,
      getPropertiesByGroupAndTradeItemCategory,
      getValuesGroups } = this.props

    getBusinessRules()
    getBusinessRulesValidators()
    getValuesGroups()
    if(this.canFetchProperties(rule)) getPropertiesByGroupAndTradeItemCategory(rule.taxonomyId, rule.propertyGroupId, rule.tradeItemCategory.code)
  }

  canFetchProperties(rule) {
    console.log(rule)
    console.log(get(rule, "tradeItemCategory", null))
    return get(rule, "propertyGroupId", null) && get(rule, "tradeItemCategory", null) && get(rule, "taxonomyId", null)
  }

  render() {

    const {
      rulesListOrderedByName,
      isRulesFetching,
      editRule,
      tradeItemPropertiesOrderedByName,
      groups,
      taxonomies,
      tradeItemCategories,
      validators,
      valuesGroups } = this.props

    const {
      setEditRule,
      resetEditRule,
      getPropertiesByGroupAndTradeItemCategory,
      createBusinessRule,
      updateBusinessRule,
      deleteBusinessRule,
    } = this.props

    return (
      <PageWrapper>
        <div className="row mb-3">
          {/* Rules */}
          <div className="col-4">
            <Sticky top={70}>
              <Card title={`Rules`}>
                <Select
                  value={editRule}
                  onChange={rule => {
                    if(rule && rule.tradeItemCategory) {

                      getPropertiesByGroupAndTradeItemCategory(rule.taxonomyId, rule.propertyGroupId, rule.tradeItemCategory.code)
                      setEditRule(rule)
                    } else resetEditRule()
                  }}
                  getOptionLabel={rule => rule.name}
                  getOptionValue={rule => rule.id}
                  isLoading={isRulesFetching}
                  isClearable={true}
                  name="existing-business-rules"
                  options={rulesListOrderedByName}/>
                <br />
                <div><button
                  className="btn btn-link p-0 mb-2"
                  onClick={e => setEditRule(initNewBusinessRule())}>Create new rule</button></div>
                {get(editRule, "id") && <div><button
                  className="btn btn-link text-danger p-0"
                  onClick={e => {
                    e.preventDefault()
                    window.confirm(`Are you sure?`) && deleteBusinessRule(editRule.id)
                  }}>Delete rule</button></div>}
              </Card>
            </Sticky>
          </div>

          {/* Edit rules */}
          {editRule && <div className="col-8">
            <Card title={`${get(editRule, "id", null) ? 'Edit' : 'Create'} rule`}>
              <BusinessRule
                rule={editRule}
                onSave={rule => rule.id ? updateBusinessRule(rule.id, rule) : createBusinessRule(rule)}
                onChange={rule => {
                  if(
                    this.canFetchProperties(rule) && (
                      get(rule, "propertyGroupId") !== get(editRule, "propertyGroupId") || 
                      get(rule, "taxonomyId") !== get(editRule, "taxonomyId") || 
                      get(rule, "tradeItemCategory") !== get(editRule, "tradeItemCategory"))) {
                    getPropertiesByGroupAndTradeItemCategory(rule.taxonomyId, rule.propertyGroupId, rule.tradeItemCategory.code)
                    setEditRule(update(rule, {propertyName: {$set: null}}))
                  } else if (get(rule, "businessRuleTypeCode") !== get(editRule, "businessRuleTypeCode")) {
                    setEditRule(update(rule, {parameters: {$set: {}}}))
                  } else {
                    setEditRule(rule)
                  }
                }}
                onCancel={() => resetEditRule()}
                groups={groups}
                taxonomies={taxonomies}
                tradeItemCategories={tradeItemCategories}
                properties={tradeItemPropertiesOrderedByName}
                validators={validators}
                valuesGroups={valuesGroups}
              />

            </Card>
          </div>}
        </div>
      </PageWrapper>
    )
  }
}

const mapStateToProps = createMappingToState(selectors)

export default withRouter(connect(mapStateToProps, actions)(withTradeItemCategoriesAndGroupsAndTaxonomies(BusinessRules)))

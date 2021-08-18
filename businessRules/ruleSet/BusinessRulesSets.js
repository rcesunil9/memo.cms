import React from "react"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import Sticky from 'react-stickynode'
import Select from 'react-select'
import get from "lodash/get"
import * as selectors from "./selectors"
import * as actions from "./actions"
import PageWrapper from "../../common/components/layout/PageWrapper"
import Card from "../../common/components/layout/Card"
import createMappingToState from "../../common/selectors/createMappingToState"
import BusinessRuleSet from "./BusinessRuleSet"
import { initNewBusinessRuleSet } from "./utils"
import withTradeItemCategoriesAndGroupsAndTaxonomies from "../withTradeItemCategoriesAndGroupsAndTaxonomies"

class BusinessRulesSets extends React.Component {

  componentDidMount() {
    this.init()
  }

  init() {
    const {
      getBusinessRulesSets,
      getBusinessRules } = this.props

    getBusinessRulesSets()
    getBusinessRules()
  }

  render() {

    const {
      rulesListOrderedByName,
      rulesSetsListOrderedByName,
      rulesSetsListOrderedByNameFiltered,
      isRulesSetsFetching,
      editRuleSet,
      taxonomies,
      tradeItemCategories,
      groups } = this.props

    const {
      setEditRuleSet,
      resetEditRuleSet,
      updateBusinessRuleSet,
      createBusinessRuleSet,
      deleteBusinessRuleSet
    } = this.props

    return (
      <PageWrapper>
        <div className="row mb-3">
          {/* Rules */}
          <div className="col-4">
            <Sticky top={70}>
              <Card title={`Rule set`}>
                <Select
                  value={editRuleSet}
                  onChange={rule => rule ? setEditRuleSet(rule) : resetEditRuleSet()}
                  getOptionLabel={rule => rule.name}
                  getOptionValue={rule => rule.id}
                  isLoading={isRulesSetsFetching}
                  isClearable={true}
                  name="existing-business-rules-sets"
                  options={rulesSetsListOrderedByName}/>
                <br />
                <div><button
                  className="btn btn-link p-0 mb-2"
                  onClick={e => setEditRuleSet(initNewBusinessRuleSet())}>Create new rule set</button></div>
                {get(editRuleSet, "id") && <div><button
                  className="btn btn-link text-danger p-0"
                  onClick={e =>{
                    e.preventDefault()
                    window.confirm(`Are you sure?`) && deleteBusinessRuleSet(editRuleSet.id)
                  }}>Delete rule set</button></div>}
              </Card>
            </Sticky>
          </div>

          {/* Edit rules */}
          {editRuleSet && <div className="col-8">
            <Card title={`${get(editRuleSet, "id", null) ? 'Edit' : 'Create'} rule set`}>
              <BusinessRuleSet
                  ruleSet={editRuleSet}
                  onSave={ruleSet => ruleSet.id ? updateBusinessRuleSet(ruleSet.id, ruleSet) : createBusinessRuleSet(ruleSet)}
                  onChange={ruleSet => setEditRuleSet(ruleSet)}
                  onCancel={() => resetEditRuleSet()}
                  groups={groups}
                  taxonomies={taxonomies}
                  tradeItemCategories={tradeItemCategories}
                  rules={rulesListOrderedByName}
                  rulesSets={rulesSetsListOrderedByNameFiltered}
                />
            </Card>
          </div>}
        </div>
      </PageWrapper>
    )
  }
}

const mapStateToProps = createMappingToState(selectors)

export default withRouter(connect(mapStateToProps, actions)(withTradeItemCategoriesAndGroupsAndTaxonomies(BusinessRulesSets)))

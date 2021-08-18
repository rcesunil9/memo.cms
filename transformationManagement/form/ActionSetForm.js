import React from "react"
import { connect } from "react-redux"
import Select from "react-select"
import get from "lodash/get"
import find from "lodash/find"
import * as selectors from "../selectors/edit"
import * as actions from "../actions/edit"
import * as utils from "../utils"
import ActionForm from "./ActionForm"
import ActionsPlayground from "./ActionsPlayground"


class ActionSetForm extends React.Component {

  componentDidMount() {
    this.init()
  }

  init() {
    const { actionSet, tradeItemCategory, taxonomyId } = this.props
    const { getBusinessRulesSets, getTradeItemPropertiesUpAndDown } = this.props
    if(get(actionSet, "actionSet.propertyGroupId", null) && tradeItemCategory && taxonomyId) {
      getBusinessRulesSets(taxonomyId, actionSet.actionSet.propertyGroupId, tradeItemCategory.code)
      actions.getTradeItemPropertiesUpAndDown(taxonomyId, actionSet.actionSet.propertyGroupId, tradeItemCategory.code)
    }
  }

  render() {

    const {
      actionSet, 
      action,
      groups,
      areGroupsLoading,
      businessRulesSets,
      areBusinessRuleSetsLoading,
      businessRuleSelected,
      updateActionSet,
      updateActionSetGroup,
      editAction,
    } = this.props

    return (
      <React.Fragment>    
    
        {/* Actions row */}
        <div className="row">
    
          {/* Left side */}
          <div className="col-6">
    
            <h5>Action set edition ({get(actionSet, "actionSet.name")})</h5>
    
            {/* Name */}
            <div className="form-group">
              <label>Name *:</label>
              <input
                value={get(actionSet, "actionSet.name") || ""}
                onChange={e => updateActionSet("actionSet.name", e.target.value)}
                className="form-control" />
            </div>
            
            {/* Group */}
            <div className="form-group">
              <label>Group *:</label>
              <Select
                value={find(groups, s => s.id === get(actionSet, "actionSet.propertyGroupId")) || null}
                onChange={g => updateActionSetGroup(g)}
                getOptionLabel={b => b.name}
                getOptionValue={b => b.id}
                isLoading={areGroupsLoading}
                name="existing-groups"
                options={groups} />
            </div>


            {get(actionSet, "actionSet.propertyGroupId") && <div>
            
              {/* Business rule set */}
              <div className="form-group">
                <label>Business rule set:</label>
                <Select 
                  isClearable={true}
                  isLoading={areBusinessRuleSetsLoading}
                  getOptionLabel={b => b.name}
                  getOptionValue={b => b.id}
                  options={businessRulesSets}
                  onChange={b => updateActionSet("businessRuleSetId", get(b, "id", null))}
                  value={businessRuleSelected} />
              </div>

              <div>      
                {/* Add new */}
                <div className="form-group">
                  <button 
                    onClick={e => editAction(utils.getDefaultBuiltInAction())}
                    className="btn btn-link px-0" >+ Add new action</button>
                </div>

                {action && (
                  <ActionForm />
                  )}

              </div>
            </div>}

          </div>
    
          {/* Right side */}
          <div className="col-6">
            <ActionsPlayground />
          </div>

        </div>
    
      </React.Fragment>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    actionSet: selectors.getSelectedActionSet(state),
    groups: selectors.getGroups(state),
    tradeItemCategory: selectors.getTransformationSet(state).tradeItemCategory,
    taxonomyId: selectors.getTransformationSet(state).taxonomyId,
    areGroupsLoading: selectors.areGroupsLoading(state),
    businessRulesSets: selectors.getBusinessRuleSetsOrdered(state),
    businessRuleSelected: selectors.getBusinessRuleSetSelected(state),
    areBusinessRuleSetsLoading: selectors.areBusinessRuleSetsLoading(state),
    tradeItemProperties: selectors.getTradeItemPropertiesOrdered(state),
    tradeItemPropertySelected: selectors.getTradeItemPropertySelected(state),
    areTradeItemPropertiesLoading: selectors.areTradeItemPropertiesLoading(state),
    action: selectors.action(state),
    actionsDefinitions: selectors.getActionsDefinitionsOrdered(state),
    actionDefinition: selectors.getActionDefinition(state),
    isActionAddMode: selectors.isActionAddMode(state),
  }
}

export default connect(mapStateToProps, actions)(ActionSetForm)

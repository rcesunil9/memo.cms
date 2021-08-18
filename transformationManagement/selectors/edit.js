import { createSelector } from 'reselect'
import get from "lodash/get"
import find from "lodash/find"
import orderBy from "lodash/orderBy"
import indexOf from "lodash/indexOf"
import keyBy from "lodash/keyBy"
import concat from "lodash/concat"
import map from "lodash/map"
import filter from "lodash/filter"
import { getResults, getIsFetching } from "../../common/reducers/createList"

const taxonomies = (state) => state.transformationManagement.edit.taxonomies
const tradeItemCategories = (state) => state.transformationManagement.edit.tradeItemCategories
const groups = (state) => state.transformationManagement.edit.groups
const businessRuleSets = (state) => state.transformationManagement.edit.businessRuleSets
const actionsDefinitions = (state) => state.transformationManagement.edit.actionsDefinitions
const tradeItemProperties = (state) => state.transformationManagement.edit.tradeItemProperties
export const selectedTransformation = (state) => state.transformationManagement.edit.selectedTransformation
export const selectedActionSet = (state) => state.transformationManagement.edit.selectedActionSet
export const action = (state) => state.transformationManagement.edit.action
export const selectedActionIndex = state => state.transformationManagement.edit.selectedActionIndex
export const getPlaygroundTradeItemId = state => state.transformationManagement.edit.playgroundTradeItemId
export const getPlaygroundResult = state => state.transformationManagement.edit.playgroundResult

export const getTransformationSet = (state) => state.transformationManagement.edit.transformationSet
export const getTransformations = createSelector(getTransformationSet, transformationSet => transformationSet.transformations)

export const getSelectedTransformation = createSelector(
  [selectedTransformation, getTransformations],
  (transformationIndex, transformations) => transformationIndex === null ? null : transformations[transformationIndex]
)

export const getActionSets = createSelector(getSelectedTransformation, transformation => get(transformation, `orderedConditionalActionSets`, []))
export const getSelectedActionSet = createSelector(
  [selectedActionSet, getActionSets],
  (actionSetIndex, actionSets) => actionSetIndex === null || actionSets === null ? null : actionSets[actionSetIndex]
)

export const getTaxonomies = createSelector(taxonomies, getResults)
export const areTaxonomiesLoading = createSelector(taxonomies, getIsFetching)

export const getTradeItemCategories = createSelector(tradeItemCategories, getResults)
export const areTradeItemCategoriesLoading = createSelector(tradeItemCategories, getIsFetching)
  
export const getGroups = createSelector(groups, getResults)
export const areGroupsLoading = createSelector(groups, getIsFetching)
  
export const getBusinessRuleSets = createSelector(businessRuleSets, getResults)
export const getBusinessRuleSetsOrdered = createSelector(getBusinessRuleSets, br => orderBy(br, "name"))
export const areBusinessRuleSetsLoading = createSelector(businessRuleSets, getIsFetching)
  
export const getActionsDefinitions = createSelector(actionsDefinitions, getResults)
export const getActionsDefinitionsKeyedById = createSelector(getActionsDefinitions, d => keyBy(d, "id"))
export const getActionsDefinitionsOrdered = createSelector(getActionsDefinitions, d => orderBy(d, "name"))
export const areActionsDefinitionsLoading = createSelector(actionsDefinitions, getIsFetching)

export const getTradeItemProperties = createSelector(tradeItemProperties, getResults)
export const getMergedTradeItemProperties = createSelector(
  [getTradeItemProperties, getTransformations, getSelectedTransformation],
  (tradeItemProperties, transformations, transformation) => concat(tradeItemProperties, filter(map(transformations, t => { return {code: t.name} }), tr => transformation.name === null || (transformation.name !== tr.code)) )
)
export const getTradeItemPropertiesOrdered = createSelector(getMergedTradeItemProperties, props => orderBy(props, "code"))
export const areTradeItemPropertiesLoading = createSelector(tradeItemProperties, getIsFetching)

// transformation edit
export const getDefaultActionSet = createSelector(getSelectedTransformation, transformationSet => transformationSet.defaultActionSet)
export const getOrderedConditionalActionSets = createSelector(getSelectedTransformation, transformationSet => transformationSet.orderedConditionalActionSets)
export const getSelectedTransformationGroup = createSelector(
  getDefaultActionSet, 
  defaultActionSet => defaultActionSet ? defaultActionSet.propertyGroup : null
)

// action set edit
export const getBusinessRuleSetSelected = createSelector(
  [getBusinessRuleSets, getSelectedActionSet],
  (businessRulesSets, actionSet) => get(actionSet, "businessRuleSetId", null) ? find(businessRulesSets, br => br.id === actionSet.businessRuleSetId) : null
)
export const getTradeItemPropertySelected = createSelector(
  [getMergedTradeItemProperties, getSelectedActionSet],
  (tradeItemProperties, actionSet) => get(actionSet, "actionSet.sourcePropertyCode", null) ? find(tradeItemProperties, t => t.code === actionSet.actionSet.sourcePropertyCode) : null
)
export const getActions = createSelector(
  getSelectedActionSet,
  selectedActionSet => get(selectedActionSet, "actionSet.orderedParametrizedActions", [])
)
export const isActionAddMode = createSelector(
  [selectedActionIndex],
  (selectedActionIndex) => selectedActionIndex === null
)
export const getActionIndex = createSelector(
  [getActions, action],
  (actions, action) => indexOf(actions, action)
)
export const getActionDefinition = createSelector(
  [getActionsDefinitions, action],
  (actionsDefinitions, action) => action ? find(actionsDefinitions, d => d.id === action.builtInActionDefinitionId) : null
)
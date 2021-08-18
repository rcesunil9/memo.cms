import orderBy from "lodash/orderBy"
import filter from "lodash/filter"
import get from "lodash/get"
import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../../common/reducers/createList"
import { getResource } from "../../common/reducers/createResource"

const _getRulesList = state => state.businessRules.rulesList
const _getRulesSetsList = state => state.businessRules.rulesSetsList
const _getRuleSetEdit = state => state.businessRules.ruleSetEdit
const getEditRuleSet = createSelector(_getRuleSetEdit, ruleSet => getResource(ruleSet))

const getRulesSetsList = createSelector(_getRulesSetsList, list => getResults(list))
const getRulesList = createSelector(_getRulesList, list => getResults(list))

const getRulesListOrderedByName = createSelector(getRulesList, list => orderBy(list, "name", "asc"))
const getRulesSetsListOrderedByName = createSelector(getRulesSetsList, list => orderBy(list, "name", "asc"))

const getEditRuleSetTradeItemCategoryCode = createSelector(getEditRuleSet, ruleSet => get(ruleSet, "tradeItemCategory.code") || null)
const getEditRuleSetPropertyGroupId = createSelector(getEditRuleSet, ruleSet => get(ruleSet, "propertyGroupId") || null)
const getEditRuleSetTaxonomyId = createSelector(getEditRuleSet, ruleSet => get(ruleSet, "taxonomyId") || null)


export const rulesSetsListOrderedByName = createSelector(
  getRulesSetsList,
  list => orderBy(list, "name", "asc")
)

export const isRulesSetsFetching = createSelector(_getRulesSetsList, list => getIsFetching(list))

export const editRuleSet = createSelector(_getRuleSetEdit, ruleSet => getResource(ruleSet))

export const rulesListOrderedByName = createSelector(
  [getRulesListOrderedByName, getEditRuleSetTradeItemCategoryCode, getEditRuleSetTaxonomyId, getEditRuleSetPropertyGroupId],
  (ruleList, tradeItemCategoryCode, taxonomyId, propertyGroupId) => filter(ruleList, rule => 
    (!tradeItemCategoryCode || (rule.tradeItemCategory && rule.tradeItemCategory.code === tradeItemCategoryCode)) && 
    (!propertyGroupId || rule.propertyGroupId === propertyGroupId) &&
    (!taxonomyId || rule.taxonomyId === taxonomyId))
)

export const rulesSetsListOrderedByNameFiltered = createSelector(
  [getRulesSetsListOrderedByName, getEditRuleSetTradeItemCategoryCode, getEditRuleSetTaxonomyId, getEditRuleSetPropertyGroupId],
  (ruleSetList, tradeItemCategoryCode, taxonomyId, propertyGroupId) => filter(ruleSetList, ruleSet => 
    (!tradeItemCategoryCode || (ruleSet.tradeItemCategory && ruleSet.tradeItemCategory.code === tradeItemCategoryCode)) && 
    (!propertyGroupId || ruleSet.propertyGroupId === propertyGroupId) &&
    (!taxonomyId || ruleSet.taxonomyId === taxonomyId))
)
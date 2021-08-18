import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../../common/reducers/createList"
import { getResource } from "../../common/reducers/createResource"
import orderBy from "lodash/orderBy"

const _getRulesList = state => state.businessRules.rulesList
const _getValidators = state => state.businessRules.validators
const _getRuleEdit = state => state.businessRules.ruleEdit
const _getValuesGroups = state => state.businessRules.valuesGroups
const _getTradeItemProperties = createSelector(state => state.businessRules.tradeItemProperties.properties, list => getResults(list))

export const getRulesList = createSelector(_getRulesList, list => getResults(list))

export const rulesListOrderedByName = createSelector(getRulesList, list => orderBy(list, "name", "asc"))

export const validators = createSelector(_getValidators, list => getResults(list))

export const isRulesFetching = createSelector(_getRulesList, list => getIsFetching(list))

export const editRule = createSelector(_getRuleEdit, rule => getResource(rule))

export const valuesGroups = createSelector(_getValuesGroups, list => getResults(list))

export const tradeItemPropertiesOrderedByName = createSelector(_getTradeItemProperties, list => orderBy(list, "code", "asc"))
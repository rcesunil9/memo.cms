import { createSelector } from 'reselect'
import { getResults } from "../common/reducers/createList"

export const groups = createSelector(state => state.businessRules.tradeItemProperties.groups, list => getResults(list))

export const tradeItemCategories = createSelector(state => state.businessRules.tradeItemProperties.tradeItemCategories, list => getResults(list))

export const taxonomies = createSelector(state => state.businessRules.tradeItemProperties.taxonomies, list => getResults(list))

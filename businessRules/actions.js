import * as propertiesApi from '../common/services/tradeItemProperties'
import * as tradeItemCategoriesApi from '../common/services/tradeItemCategories'
import * as taxonomyApi from '../common/services/taxonomy'
import * as types from './types'
import call from "../common/actions/call"


// Get trade items properties scopes
export const getTradeItemCategories = () => dispatch => call(dispatch, tradeItemCategoriesApi.getTradeItemCategories, {
  REQUEST: types.APP_BUSINESS_RULES_TRADE_ITEM_CATEGORIES_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_TRADE_ITEM_CATEGORIES_LIST_FAILURE,
}).then(tradeItemcategories => dispatch({type: types.APP_BUSINESS_RULES_TRADE_ITEM_CATEGORIES_LIST_SUCCESS, results: tradeItemcategories}))

// Get trade items properties groups
export const getGroups = () => dispatch => call(dispatch, propertiesApi.getTradeItemPropertiesGroups, {
  REQUEST: types.APP_BUSINESS_RULES_GROUPS_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_GROUPS_LIST_FAILURE,
}).then(groups => dispatch({type: types.APP_BUSINESS_RULES_GROUPS_LIST_SUCCESS, results: groups}))

// Get taxonomies
export const getTaxonomies = () => dispatch => call(dispatch, taxonomyApi.getTaxonomies, {
  REQUEST: types.APP_BUSINESS_RULES_TAXONOMIES_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_TAXONOMIES_LIST_FAILURE,
}).then(taxonomies => dispatch({type: types.APP_BUSINESS_RULES_TAXONOMIES_LIST_SUCCESS, results: taxonomies}))

import * as api from '../../common/services/businessRules'
import * as propertiesApi from '../../common/services/tradeItemProperties'
import * as taxonomyApi from '../../common/services/taxonomy'
import * as tradeItemCategoriesApi from '../../common/services/tradeItemCategories'
import * as types from '../types'
import call from "../../common/actions/call"

// fetch business rules
export const getBusinessRules = () => dispatch => call(dispatch, api.getBusinessRules, {
  REQUEST: types.APP_BUSINESS_RULES_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_BUSINESS_RULES_LIST_SUCCESS, results: results}))

// fetch business rules validators
export const getBusinessRulesValidators = () => dispatch => call(dispatch, api.getBusinessRulesValidators, {
  REQUEST: types.APP_BUSINESS_RULES_VALIDATORS_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_VALIDATORS_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_BUSINESS_RULES_VALIDATORS_LIST_SUCCESS, results: results}))

// Get taxonomies
export const getTaxonomies = () => dispatch => call(dispatch, taxonomyApi.getTaxonomies, {
  REQUEST: types.APP_BUSINESS_RULES_TAXONOMIES_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_TAXONOMIES_LIST_FAILURE,
}).then(taxonomies => dispatch({type: types.APP_BUSINESS_RULES_TAXONOMIES_LIST_SUCCESS, results: taxonomies}))

// Get trade item categories
export const getTradeItemCategories = () => dispatch => call(dispatch, tradeItemCategoriesApi.getTradeItemCategories, {
  REQUEST: types.APP_BUSINESS_RULES_TRADE_ITEM_CATEGORIES_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_TRADE_ITEM_CATEGORIES_LIST_FAILURE,
}).then(tradeItemCategories => dispatch({type: types.APP_BUSINESS_RULES_TRADE_ITEM_CATEGORIES_LIST_SUCCESS, results: tradeItemCategories}))

// Get trade items properties groups
export const getGroups = () => dispatch => call(dispatch, propertiesApi.getTradeItemPropertiesGroups, {
  REQUEST: types.APP_BUSINESS_RULES_GROUPS_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_GROUPS_LIST_FAILURE,
}).then(groups => dispatch({type: types.APP_BUSINESS_RULES_GROUPS_LIST_SUCCESS, results: groups}))

// Get trade items properties by trade item category and group
export const getPropertiesByGroupAndTradeItemCategory = (taxonomyId, propertyGroupId, tradeItemCategoryCode) => dispatch => call(dispatch, () => propertiesApi.getTradeItemPropertiesByGroupIdAndTradeItemCategory(taxonomyId, propertyGroupId, tradeItemCategoryCode), {
  REQUEST: types.APP_BUSINESS_RULES_PROPERTIES_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_PROPERTIES_LIST_FAILURE,
}).then(properties => dispatch({type: types.APP_BUSINESS_RULES_PROPERTIES_LIST_SUCCESS, results: properties}))

// set edit rule
export const setEditRule = (rule) => dispatch => dispatch({type: types.APP_BUSINESS_RULES_EDIT_SUCCESS, resource: rule})

// reset edit rule
export const resetEditRule = () => dispatch => dispatch({type: types.APP_BUSINESS_RULES_EDIT_RESET})

// create a new businessRule
export const createBusinessRule = (businessRule) => dispatch => api.createBusinessRule(businessRule).then(res => {
  dispatch({type: types.APP_BUSINESS_RULES_LIST_SUCCESS, push: res.data})
  setEditRule(res.data)(dispatch)
})

// update a businessRule
export const updateBusinessRule = (id, businessRule) => dispatch => api.updateBusinessRule(id, businessRule).then(res => {
  getBusinessRules()(dispatch)
})

// delete businessRule
export const deleteBusinessRule = (id) => dispatch => api.deleteBusinessRule(id).then(res => {
  getBusinessRules()(dispatch)
  resetEditRule()(dispatch)
})

//////////////////////////////////////////////////////////////////////
//                           VALUES GROUPS                          //
//////////////////////////////////////////////////////////////////////

// get all of the values groups
export const getValuesGroups = () => dispatch => call(dispatch, propertiesApi.getTradeItemValueGroups, {
  REQUEST: types.APP_BUSINESS_RULES_VALUES_GROUPS_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_VALUES_GROUPS_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_BUSINESS_RULES_VALUES_GROUPS_LIST_SUCCESS, results: results}))
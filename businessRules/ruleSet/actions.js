import * as api from '../../common/services/businessRules'
import * as types from '../types'
import call from "../../common/actions/call"

// fetch business rules
export const getBusinessRules = () => dispatch => call(dispatch, api.getBusinessRules, {
  REQUEST: types.APP_BUSINESS_RULES_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_BUSINESS_RULES_LIST_SUCCESS, results: results}))

// fetch business rules sets
export const getBusinessRulesSets = () => dispatch => call(dispatch, api.getBusinessRulesSets, {
  REQUEST: types.APP_BUSINESS_RULES_SET_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_SET_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_BUSINESS_RULES_SET_LIST_SUCCESS, results: results}))

// set edit rule
export const setEditRuleSet = rule => dispatch => dispatch({type: types.APP_BUSINESS_RULES_SET_EDIT_SUCCESS, resource: rule})

// reset edit rule
export const resetEditRuleSet = () => dispatch => dispatch({type: types.APP_BUSINESS_RULES_SET_EDIT_RESET})

// create a new business Rule set
export const createBusinessRuleSet = (businessRuleSet) => dispatch => api.createBusinessRuleSet(businessRuleSet).then(res => {
  dispatch({type: types.APP_BUSINESS_RULES_SET_LIST_SUCCESS, push: res.data})
  setEditRuleSet(res.data)(dispatch)
})

// update a business Rule set
export const updateBusinessRuleSet = (id, businessRuleSet) => dispatch => api.updateBusinessRuleSet(id, businessRuleSet).then(res => {
  getBusinessRulesSets()(dispatch)
})

// delete businessRule
export const deleteBusinessRuleSet = id => dispatch => api.deleteBusinessRuleSet(id).then(res => {
  getBusinessRulesSets()(dispatch)
  resetEditRuleSet()(dispatch)
})

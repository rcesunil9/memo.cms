import { combineReducers } from "redux"
import dotProp from "dot-prop-immutable"
import createList from "../common/reducers/createList"
import createResource from "../common/reducers/createResource"
import createReducer from "../common/reducers/createReducer"
import * as types from "./types"

const triggers = createList({
  RESET: types.TRIGGERS_TRIGGERS_LIST_RESET,
  REQUEST: types.TRIGGERS_TRIGGERS_LIST_REQUEST,
  SUCCESS: types.TRIGGERS_TRIGGERS_LIST_SUCCESS,
  FAILURE: types.TRIGGERS_TRIGGERS_LIST_FAILURE,
  INVALIDATE: types.TRIGGERS_TRIGGERS_LIST_INVALIDATE,
  REMOVE: types.TRIGGERS_TRIGGERS_LIST_REMOVE
})

const actions = createList({
  RESET: types.TRIGGERS_ACTIONS_LIST_RESET,
  REQUEST: types.TRIGGERS_ACTIONS_LIST_REQUEST,
  SUCCESS: types.TRIGGERS_ACTIONS_LIST_SUCCESS,
  FAILURE: types.TRIGGERS_ACTIONS_LIST_FAILURE,
  INVALIDATE: types.TRIGGERS_ACTIONS_LIST_INVALIDATE,
  REMOVE: types.TRIGGERS_ACTIONS_LIST_REMOVE
})

const trigger = createResource({
  RESET: types.TRIGGERS_TRIGGER_RESET,
  REQUEST: types.TRIGGERS_TRIGGER_REQUEST,
  SUCCESS: types.TRIGGERS_TRIGGER_SUCCESS,
  FAILURE: types.TRIGGERS_TRIGGER_FAILURE,
  INVALIDATE: types.TRIGGERS_TRIGGER_INVALIDATE
})

const action = createResource({
  RESET: types.TRIGGERS_ACTION_RESET,
  REQUEST: types.TRIGGERS_ACTION_REQUEST,
  SUCCESS: types.TRIGGERS_ACTION_SUCCESS,
  FAILURE: types.TRIGGERS_ACTION_FAILURE,
  INVALIDATE: types.TRIGGERS_ACTION_INVALIDATE
})

const dependencies = createResource({
  RESET: types.TRIGGERS_DEPENDENCIES_RESET,
  REQUEST: types.TRIGGERS_DEPENDENCIES_REQUEST,
  SUCCESS: types.TRIGGERS_DEPENDENCIES_SUCCESS,
  FAILURE: types.TRIGGERS_DEPENDENCIES_FAILURE,
  INVALIDATE: types.TRIGGERS_DEPENDENCIES_INVALIDATE
})

export const getActionExecutionResultsFilters = () => { return {
  pageNumber: 0,
  pageSize: 50,
}}

const actionExecutionResultsList = createList({
  RESET: types.TRIGGERS_ACTION_EXECUTION_RESULT_RESET,
  REQUEST: types.TRIGGERS_ACTION_EXECUTION_RESULT_REQUEST,
  SUCCESS: types.TRIGGERS_ACTION_EXECUTION_RESULT_SUCCESS,
  FAILURE: types.TRIGGERS_ACTION_EXECUTION_RESULT_FAILURE,
  INVALIDATE: types.TRIGGERS_ACTION_EXECUTION_RESULT_INVALIDATE
})

const actionExecutionResults = combineReducers({
  list: actionExecutionResultsList,
  total: createReducer(0, {
    [types.TRIGGERS_ACTION_EXECUTION_RESULT_TOTAL_RECEIVE]: (state, action) => action.total || 0,
  }),
  filters: createReducer(getActionExecutionResultsFilters(), {
    [types.TRIGGERS_ACTION_EXECUTION_RESULT_SET_FILTERS]: (state, action) => action.filters || getActionExecutionResultsFilters(),
    [types.TRIGGERS_ACTION_EXECUTION_RESULT_SET_FILTER_VALUE]: (state, action) => dotProp.set(state, action.key, action.value)
  })
})

const actionExecutionResultDetail = createReducer(null, {
  [types.TRIGGERS_ACTION_EXECUTION_RESULT_DETAIL_RECEIVE]: (state, action) => action.actionExecutionResult || null,
  [types.TRIGGERS_ACTION_EXECUTION_RESULT_DETAIL_RESET]: (state, action) => null
})


const launchAction = combineReducers({
  displayInputParams: createReducer(false, {
    [types.TRIGGERS_ACTION_SHOW_PARAMS]: (state, action) => true,
    [types.TRIGGERS_ACTION_HIDE_PARAMS]: (state, action) => false
  }),
  values: createReducer({}, {
    [types.TRIGGERS_ACTION_PARAMS_SET_VALUE]: (state, action) => dotProp.set(state, action.key, action.value)
  }),
  
})

const triggerInputParams = createReducer(null, {[types.TRIGGERS_ACTION_INPUT_PARAMS_SET_VALUE]: (state, action) => action.inputParams || null})


export default combineReducers({ 
  triggers, 
  actions, 
  trigger, 
  action, 
  actionExecutionResults,
  actionExecutionResultDetail,
  dependencies,
  launchAction,
  triggerInputParams
})

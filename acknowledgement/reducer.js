import { combineReducers } from 'redux'
import dotProp from "dot-prop-immutable"
import createReducer from "../common/reducers/createReducer"
import createList from "../common/reducers/createList"
import * as types from './types'
import * as utils from './utils'

// Actions
//
const conflictsListActions = {
  RESET: types.APP_ACK_CONFLICTS_LIST_RESET,
  REQUEST: types.APP_ACK_CONFLICTS_LIST_REQUEST,
  SUCCESS: types.APP_ACK_CONFLICTS_LIST_SUCCESS,
  FAILURE: types.APP_ACK_CONFLICTS_LIST_FAILURE,
  INVALIDATE: types.APP_ACK_CONFLICTS_LIST_INVALIDATE,
  REMOVE: types.APP_ACK_CONFLICTS_LIST_REMOVE,
  UPDATE: types.APP_ACK_CONFLICTS_LIST_UPDATE,
}


const submissionsListActions = {
  RESET: types.APP_SUBMISSIONS_LIST_RESET,
  REQUEST: types.APP_SUBMISSIONS_LIST_REQUEST,
  SUCCESS: types.APP_SUBMISSIONS_LIST_SUCCESS,
  FAILURE: types.APP_SUBMISSIONS_LIST_FAILURE,
  INVALIDATE: types.APP_SUBMISSIONS_LIST_INVALIDATE,
  REMOVE: types.APP_SUBMISSIONS_LIST_REMOVE,
  UPDATE: types.APP_SUBMISSIONS_LIST_UPDATE,
}

// Reducers
//
const conflicts = combineReducers({
  conflicts: createList(conflictsListActions),
  total: createReducer(0, {[types.APP_ACK_CONFLICTS_TOTAL_RECEIVED]: (state, action) => action.total || 0}),
  filters: createReducer(utils.getConflictsDefaultFilters(), {
    [types.APP_ACK_CONFLICTS_FILTERS_RECEIVED]: (state, action) => action.filters || utils.getConflictsDefaultFilters(),
    [types.APP_ACK_CONFLICTS_FILTERS_VALUE_RECEIVED]: (state, action) => dotProp.set(state, action.key, action.value)
  }), 
})

const submissions = combineReducers({
  submissions: createList(submissionsListActions),
  total: createReducer(0, {[types.APP_SUBMISSIONS_TOTAL_RECEIVED]: (state, action) => action.total || 0}),
  filters: createReducer(utils.getSubmissionsDefaultFilters(), {
    [types.APP_SUBMISSIONS_FILTERS_RECEIVED]: (state, action) => action.filters || utils.getSubmissionsDefaultFilters(),
    [types.APP_SUBMISSIONS_FILTERS_VALUE_RECEIVED]: (state, action) => dotProp.set(state, action.key, action.value)
  }),
})

// Combine reducer to get default reducer
//
export default combineReducers({
  conflicts,
  submissions
})

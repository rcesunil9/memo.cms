import { combineReducers } from 'redux'
import dotProp from "dot-prop-immutable"
import createReducer from "../common/reducers/createReducer"
import createList from "../common/reducers/createList"
import * as types from './types'

export const getDefaultListingFilters = () => { return {
  pageNumber: 0,
  pageSize: 50
}}

// Actions
//
const listActions = {
  RESET: types.APP_TRANSPORT_MANAGEMENT_LIST_RESET,
  REQUEST: types.APP_TRANSPORT_MANAGEMENT_LIST_REQUEST,
  SUCCESS: types.APP_TRANSPORT_MANAGEMENT_LIST_SUCCESS,
  FAILURE: types.APP_TRANSPORT_MANAGEMENT_LIST_FAILURE,
  INVALIDATE: types.APP_TRANSPORT_MANAGEMENT_LIST_INVALIDATE,
  REMOVE: types.APP_TRANSPORT_MANAGEMENT_LIST_REMOVE,
}


const listing = combineReducers({
  results: createList(listActions),
  total: createReducer(0, {[types.APP_TRANSPORT_MANAGEMENT_LIST_TOTAL_RECEIVE]: (state, action) => action.total || 0}),
  filters: createReducer(getDefaultListingFilters(), {
    [types.APP_TRANSPORT_MANAGEMENT_LIST_FILTERS_RECEIVE]: (state, action) => action.filters || getDefaultListingFilters(),
    [types.APP_TRANSPORT_MANAGEMENT_LIST_FILTERS_VALUE_RECEIVE]: (state, action) => dotProp.set(state, action.key, action.value),
  })
})

const edit = combineReducers({
  transportConfiguration: createReducer({}, {
    [types.APP_TRANSPORT_MANAGEMENT_EDIT_CONFIGURATION_RECEIVE]: (state, action) => action.transportConfiguration || {},
    [types.APP_TRANSPORT_MANAGEMENT_EDIT_CONFIGURATION_RESET]: (state, action) => {return {}},
    [types.APP_TRANSPORT_MANAGEMENT_EDIT_CONFIGURATION_VALUE_RECEIVE]: (state, action) => dotProp.set(state, action.key, action.value),
  })
})

// Combine reducer to get default reducer
//
export default combineReducers({
  listing,
  edit,
})

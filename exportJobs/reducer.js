import { combineReducers } from 'redux'
import createReducer from "../common/reducers/createReducer"
import createList from "../common/reducers/createList"
import * as types from './types'
import * as utils from './utils'


// Actions
//
const listActions = {
  RESET: types.APP_PRE_COMPUTING_JOB_LIST_RESET,
  REQUEST: types.APP_PRE_COMPUTING_JOB_LIST_REQUEST,
  SUCCESS: types.APP_PRE_COMPUTING_JOB_LIST_SUCCESS,
  FAILURE: types.APP_PRE_COMPUTING_JOB_LIST_FAILURE,
  INVALIDATE: types.APP_PRE_COMPUTING_JOB_LIST_INVALIDATE,
  REMOVE: types.APP_PRE_COMPUTING_JOB_LIST_REMOVE,
}

// Reducers
//
const listing = combineReducers({
  jobs: createList(listActions),
  selectedIndex: createReducer(0, {[types.APP_PRE_COMPUTING_JOB_LIST_ITEM_SELECTED_RECEIVE]: (state, action) => action.selected || 0}),
  filters: createReducer(utils.getPreComputingJobsFilters(), {
    [types.APP_PRE_COMPUTING_JOB_LIST_FILTERS_RECEIVE]: (state, action) => action.filters || utils.getPreComputingJobsFilters(),
    [types.APP_PRE_COMPUTING_JOB_LIST_FILTERS_RESET]: (state, action) => utils.getPreComputingJobsFilters()
  }),
  autorefresh: createReducer(true, {
    [types.APP_PRE_COMPUTING_JOB_LIST_AUTOREFRESH_RECEIVE]: (state, action) => action.autorefresh || false,
    [types.APP_PRE_COMPUTING_JOB_LIST_AUTOREFRESH_TOGGLE_RECEIVE]: (state, action) => !state
  }),
})

const detail = createReducer(null, {
  [types.APP_PRE_COMPUTING_JOB_DETAIL_RECEIVE]: (state, action) => action.jobDetail || null,
})

// Combine reducer to get default reducer
//
export default combineReducers({
  listing,
  detail,
})

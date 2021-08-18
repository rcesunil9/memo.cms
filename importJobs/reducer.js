import { combineReducers } from 'redux'
import createReducer from "../common/reducers/createReducer"
import createList from "../common/reducers/createList"
import * as types from './types'
import * as utils from './utils'

// Defaults
//
const importJobsFilterState = {
  pageNumber: 0,
  pageSize: 10
}

// Actions
//
const listActions = {
  RESET: types.APP_IMPORT_JOBS_LIST_RESET,
  REQUEST: types.APP_IMPORT_JOBS_LIST_REQUEST,
  SUCCESS: types.APP_IMPORT_JOBS_LIST_SUCCESS,
  FAILURE: types.APP_IMPORT_JOBS_LIST_FAILURE,
  INVALIDATE: types.APP_IMPORT_JOBS_LIST_INVALIDATE,
  REMOVE: types.APP_IMPORT_JOBS_LIST_REMOVE,
}

const persistenceActions = {
  RESET: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_RESET,
  REQUEST: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_REQUEST,
  SUCCESS: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_SUCCESS,
  FAILURE: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_FAILURE,
  INVALIDATE: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_INVALIDATE,
  REMOVE: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_REMOVE,
}

const businessRuleActions = {
  RESET: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_RESET,
  REQUEST: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_REQUEST,
  SUCCESS: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_SUCCESS,
  FAILURE: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_FAILURE,
  INVALIDATE: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_INVALIDATE,
  REMOVE: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_REMOVE,
}

const mappingActions = {
  RESET: types.APP_IMPORT_JOBS_REPORT_MAPPING_LIST_RESET,
  REQUEST: types.APP_IMPORT_JOBS_REPORT_MAPPING_LIST_REQUEST,
  SUCCESS: types.APP_IMPORT_JOBS_REPORT_MAPPING_LIST_SUCCESS,
  FAILURE: types.APP_IMPORT_JOBS_REPORT_MAPPING_LIST_FAILURE,
  INVALIDATE: types.APP_IMPORT_JOBS_REPORT_MAPPING_LIST_INVALIDATE,
  REMOVE: types.APP_IMPORT_JOBS_REPORT_MAPPING_LIST_REMOVE,
}


// Reducers
//
const listing = combineReducers({
  importJobs: createList(listActions),
  total: createReducer(0, {[types.APP_IMPORT_JOBS_LIST_TOTAL_RECEIVE]: (state, action) => action.total || 0}),
  selectedIndex: createReducer(0, {[types.APP_IMPORT_JOBS_LIST_ITEM_SELECTED_RECEIVE]: (state, action) => action.selected || 0}),
  filters: createReducer(importJobsFilterState, {
    [types.APP_IMPORT_JOBS_LIST_FILTERS_RECEIVE]: (state, action) => action.filters || importJobsFilterState,
    [types.APP_IMPORT_JOBS_LIST_FILTERS_RESET]: (state, action) => importJobsFilterState
  }),
  autorefresh: createReducer(true, {
    [types.APP_IMPORT_JOBS_LIST_AUTOREFRESH_RECEIVE]: (state, action) => action.autorefresh || false,
    [types.APP_IMPORT_JOBS_LIST_AUTOREFRESH_TOGGLE_RECEIVE]: (state, action) => !state
  }),
})

const detail = createReducer(null, {
  [types.APP_IMPORT_JOB_DETAIL_RECEIVE]: (state, action) => action.jobDetail || null,
})

const persistence = combineReducers({
  list: createList(persistenceActions),
  total: createReducer(0, {[types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_TOTAL_RECEIVE]: (state, action) => action.total || 0}),
  pageFilter: createReducer(utils.getDefaultPageFilter(), {[types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_PAGE_FILTER_RECEIVE]: (state, action) => action.pageFilter || utils.getDefaultPageFilter()})
})

const businessRule = combineReducers({
  list: createList(businessRuleActions),
  total: createReducer(0, {[types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_TOTAL_RECEIVE]: (state, action) => action.total || 0}),
  pageFilter: createReducer(utils.getDefaultPageFilter(), {[types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_PAGE_FILTER_RECEIVE]: (state, action) => action.pageFilter || utils.getDefaultPageFilter()})
})

const mapping = combineReducers({
  list: createList(mappingActions),
  total: createReducer(0, {[types.APP_IMPORT_JOBS_REPORT_MAPPING_TOTAL_RECEIVE]: (state, action) => action.total || 0})
})

const report = combineReducers({
  groupSelected: createReducer('Mapping', {[types.APP_IMPORT_JOB_REPORT_GROUP_RECEIVE]: (state, action) => action.groupSelected || 'Mapping'}),
  contextId: createReducer(null, {[types.APP_IMPORT_JOB_REPORT_CONTEXT_ID_RECEIVE]: (state, action) => action.contextId || null}),
  mappingFilter: createReducer(utils.getDefaultMappingFilters(), {[types.APP_IMPORT_JOB_REPORT_MAPPING_FILTER_RECEIVE]: (state, action) => action.mappingFilter || utils.getDefaultMappingFilters()}),
  filterByTradeItem: createReducer(null, {[types.APP_IMPORT_JOB_REPORT_FILTER_BY_TRADE_ITEM_RECEIVE]: (state, action) => action.filterByTradeItem || null}),
  detailReport: createReducer(null, {[types.APP_IMPORT_JOB_REPORT_DETAIL_RECEIVE]: (state, action) => action.detailReport || null}),
  persistence,
  businessRule,
  mapping
})

// Combine reducer to get default reducer
//
export default combineReducers({
  listing,
  detail,
  report
})

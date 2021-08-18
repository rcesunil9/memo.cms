import * as api from '../common/services/import'
import * as businessRulesApi from '../common/services/businessRules'
import * as types from './types'
import * as selectors from './selectors'
import * as storage from '../common/services/storage'
import * as matrix from '../common/services/matrixValidation'
import * as business from '../common/services/businessRules'
import * as management from '../common/services/tradeItemManagement'
import update from "immutability-helper"
import call from "../common/actions/call"
import get from 'lodash/get'

// get paged import jobs
export const getImportJobs = (pageNumber, pageSize) => (dispatch, getState) => {
  if(selectors.isListFetching(getState())) return;
  return call(dispatch, () => api.getImportJobs(pageNumber, pageSize), {
    REQUEST: types.APP_IMPORT_JOBS_LIST_REQUEST,
    FAILURE: types.APP_IMPORT_JOBS_LIST_FAILURE,
  }).then(results => {
    dispatch({type: types.APP_IMPORT_JOBS_LIST_SUCCESS, results: get(results, 'results', [])})
    dispatch({type: types.APP_IMPORT_JOBS_LIST_TOTAL_RECEIVE, total: get(results, 'total', 0)})
  })
}

// reset filters
export const resetImportJobsFilters = () => dispatch => dispatch({type: types.APP_IMPORT_JOBS_LIST_FILTERS_RESET})

// reset jobs list
export const resetImportJobs = () => dispatch => {
  dispatch({type: types.APP_IMPORT_JOBS_LIST_RESET})
  dispatch({type: types.APP_IMPORT_JOBS_LIST_ITEM_SELECTED_RECEIVE})
  resetImportJobsFilters()(dispatch)
}

// set import jobs filters
export const setImportJobsFilters = filters => dispatch => dispatch({type: types.APP_IMPORT_JOBS_LIST_FILTERS_RECEIVE, filters})

// apply import jobs filters
export const applyImportJobsFilters = filters => (dispatch, getState) => {
  setImportJobsFilters(filters)(dispatch)
  getImportJobs(filters.pageNumber, filters.pageSize)(dispatch, getState)
}

// set autorefresh
export const setImportJobsAutorefresh = autorefresh => dispatch => dispatch({type: types.APP_IMPORT_JOBS_LIST_AUTOREFRESH_RECEIVE, autorefresh})

// toggle autorefresh
export const toggleImportJobsAutorefresh = () => dispatch => dispatch({type: types.APP_IMPORT_JOBS_LIST_AUTOREFRESH_TOGGLE_RECEIVE})

// get evaluation detail
export const getJobDetails = id => dispatch => businessRulesApi.getEvaluationDetails(id).then(res => dispatch({type: types.APP_IMPORT_JOB_DETAIL_RECEIVE, jobDetail: res.data}))
export const resetJobDetails = () => dispatch => dispatch({type: types.APP_IMPORT_JOB_DETAIL_RECEIVE, jobDetail: null})

export const setGroup = (group) => dispatch => dispatch({type: types.APP_IMPORT_JOB_REPORT_GROUP_RECEIVE, groupSelected: group})
export const setContextId = (id) => dispatch => dispatch({type: types.APP_IMPORT_JOB_REPORT_CONTEXT_ID_RECEIVE, contextId: id})
export const setMappingFilter = (mappingFilter) => (dispatch, getState) => {
  dispatch({type: types.APP_IMPORT_JOB_REPORT_MAPPING_FILTER_RECEIVE, mappingFilter: mappingFilter})
  getPagedMapping(selectors.getContextId(getState()), mappingFilter)(dispatch, getState)
}
export const setPersistencePageFilter = (pageFilter) => (dispatch, getState) => {
  dispatch({type: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_PAGE_FILTER_RECEIVE, pageFilter: pageFilter})
  getPagedPersistence(selectors.getContextId(getState()), pageFilter.pageNumber, pageFilter.pageSize)(dispatch)
}

export const setBusinessRulePageFilter = (pageFilter) => (dispatch, getState) => {
  dispatch({type: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_PAGE_FILTER_RECEIVE, pageFilter: pageFilter})
  getPagedBusinessRule(selectors.getContextId(getState()), pageFilter.pageNumber, pageFilter.pageSize)(dispatch)
}

export const setFilterByTradeItem = (filterByTradeItem) => (dispatch, getState) => {
  dispatch({type: types.APP_IMPORT_JOB_REPORT_FILTER_BY_TRADE_ITEM_RECEIVE, filterByTradeItem: filterByTradeItem})
  if (filterByTradeItem) {
    getPersistenceByTradeItem()(dispatch, getState)
    getBusinessRuleByTradeItem()(dispatch, getState)

    management.getByTradeItemId(filterByTradeItem).then(res => {
      if (res.data) {
        setMappingFilter(update(selectors.getMappingFilters(getState()), {
          gtin: {$set: get(res, 'data.gtin')},
          tradeItemManufacturerCode: {$set: get(res, 'data.tradeItemManufacturerCode')}
        }))(dispatch, getState)
      }
    })
  } else {
    getPagedPersistence(selectors.getContextId(getState()), 0, 10)(dispatch)
    getPagedBusinessRule(selectors.getContextId(getState()), 0, 10)(dispatch)
  }
}
export const setDetailReport = (detailReport) => dispatch => dispatch({type: types.APP_IMPORT_JOB_REPORT_DETAIL_RECEIVE, detailReport: detailReport})

// get paged persistence for report
export const getPagedPersistence = (contextId, pageNumber, pageSize) => (dispatch) => {
  return call(dispatch, () => storage.getPagedPersistenceResult(contextId, pageNumber, pageSize), {
  REQUEST: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_REQUEST,
  FAILURE: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_FAILURE,
}).then(results => {
  dispatch({type: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_SUCCESS, results: get(results, 'results', [])})
  dispatch({type: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_TOTAL_RECEIVE, total: get(results, 'total', 0)})
})
}

// get by trade item persistence for report
export const getPersistenceByTradeItem = () => (dispatch, getState) => {
  if(selectors.isPersistListFetching(getState())) return;
  return call(dispatch, () => storage.getPersistenceTradeItemById(selectors.getContextId(getState()), selectors.getFilterByTradeItem(getState())), {
    REQUEST: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_REQUEST,
    FAILURE: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_FAILURE,
  }).then(results => {
    dispatch({type: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_SUCCESS, results: results})
  })
}

// reset persistence
export const resetPagedPersistence = () => dispatch => {
  dispatch({type: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_LIST_RESET})
  dispatch({type: types.APP_IMPORT_JOBS_REPORT_PERSISTENCE_TOTAL_RECEIVE})
}

// get paged businessRule for report
export const getPagedBusinessRule = (contextId, pageNumber, pageSize) => (dispatch) => {
  return call(dispatch, () => business.getPagedBusinessRuleResult(contextId, pageNumber, pageSize), {
    REQUEST: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_REQUEST,
    FAILURE: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_FAILURE,
  }).then(results => {
    dispatch({type: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_SUCCESS, results: get(results, 'results', [])})
    dispatch({type: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_TOTAL_RECEIVE, total: get(results, 'total', 0)})
  })
}

// get by trade item businessRule for report
export const getBusinessRuleByTradeItem = () => (dispatch, getState) => {
  if(selectors.isBusinessRuleListFetching(getState())) return;
  return call(dispatch, () => business.getEvaluationByTradeItem(selectors.getContextId(getState()), selectors.getFilterByTradeItem(getState())), {
    REQUEST: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_REQUEST,
    FAILURE: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_FAILURE,
  }).then(results => {
    dispatch({type: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_SUCCESS, results: results})
  })
}

// reset businessRule
export const resetPagedBusinessRule = () => dispatch => {
  dispatch({type: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_LIST_RESET})
  dispatch({type: types.APP_IMPORT_JOBS_REPORT_BUSINESS_RULE_TOTAL_RECEIVE})
}

// get paged mapping for report
export const getPagedMapping = (contextId, mappingFilters) => (dispatch, getState) => {
  if(selectors.isMappingFetching(getState())) return;
  return call(dispatch, () => matrix.getPagedMappingFailedResult(contextId, mappingFilters), {
    REQUEST: types.APP_IMPORT_JOBS_REPORT_MAPPING_LIST_REQUEST,
    FAILURE: types.APP_IMPORT_JOBS_REPORT_MAPPING_LIST_FAILURE,
  }).then(results => {
    dispatch({type: types.APP_IMPORT_JOBS_REPORT_MAPPING_LIST_SUCCESS, results: get(results, 'results', [])})
    dispatch({type: types.APP_IMPORT_JOBS_REPORT_MAPPING_TOTAL_RECEIVE, total: get(results, 'total', 0)})
  })
}
// reset mapping
export const resetPagedMapping = () => dispatch => {
  dispatch({type: types.APP_IMPORT_JOBS_REPORT_MAPPING_LIST_RESET})
  dispatch({type: types.APP_IMPORT_JOBS_REPORT_MAPPING_TOTAL_RECEIVE})
}
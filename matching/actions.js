import get from "lodash/get"
import update from "immutability-helper"
import * as api from '../common/services/enrichment'
import * as manufacturersApi from '../common/services/manufacturer'
import * as retailersApi from '../common/services/retailer'
import * as tradeItemsApi from "../common/services/tradeItemIndexer"
import * as types from './types'
import * as selectors from "./selectors"
import call from "../common/actions/call"
import { getDefaultMatchingRowsFilters } from "./utils"
import fileDownload from 'js-file-download'

// get filtered matching rows
export const getMatchingRows = (filters) => dispatch => call(dispatch, () => api.getMatchingRows(filters), {
  REQUEST: types.APP_MATCHING_ROWS_REQUEST,
  FAILURE: types.APP_MATCHING_ROWS_FAILURE,
}).then(res => {
  dispatch({type: types.APP_MATCHING_ROWS_SUCCESS, results: get(res, "results", [])})
  dispatch({type: types.APP_MATCHING_ROWS_TOTAL_RECEIVE, total: get(res, "total", 0)})
})

// get all manufacturers
export const getManufacturers = () => dispatch => call(dispatch, manufacturersApi.getManufacturers, {
  REQUEST: types.APP_MATCHING_LIST_MANUFACTURERS_REQUEST,
  FAILURE: types.APP_MATCHING_LIST_MANUFACTURERS_FAILURE,
}).then(results => dispatch({type: types.APP_MATCHING_LIST_MANUFACTURERS_SUCCESS, results}))

// get paginated retailers
export const getRetailers = () => dispatch => call(dispatch, () => retailersApi.getRetailers({Skip: null, Take: null}), {
  REQUEST: types.APP_MATCHING_LIST_RETAILERS_REQUEST,
  FAILURE: types.APP_MATCHING_LIST_RETAILERS_FAILURE,
}).then(results => dispatch({type: types.APP_MATCHING_LIST_RETAILERS_SUCCESS, results: get(results, "results", [])}))

// get all retailers
export const getAllRetailers = () => dispatch => call(dispatch, () => retailersApi.getAllRetailers(), {
  REQUEST: types.APP_MATCHING_LIST_RETAILERS_REQUEST,
  FAILURE: types.APP_MATCHING_LIST_RETAILERS_FAILURE,
}).then(results => dispatch({type: types.APP_MATCHING_LIST_RETAILERS_SUCCESS, results: results}))

// set matching filters
export const setMatchingRowsFilters = (filters) => dispatch => dispatch({type: types.APP_MATCHING_ROWS_FILTERS_RECEIVE, filters})

// set the filters & update the matching rows list
export const updateMatchingFilters = (filters) => dispatch => {
  setMatchingRowsFilters(update(filters, {pageNumber: {$set: 0}}))(dispatch)
  getMatchingRows(filters)(dispatch)
}

// set the filters & update the matching rows list
export const goToPage = (pageNumber) => (dispatch: Function, getState: Function) => {
  const filters = update(selectors.getMatchingRowsFilters(getState()), {pageNumber: {$set: pageNumber}})
  setMatchingRowsFilters(filters)(dispatch)
  getMatchingRows(filters)(dispatch)
}

// reset filters
export const resetFilters = () => dispatch => updateMatchingFilters(getDefaultMatchingRowsFilters())(dispatch)

// refresh matching
export const refreshMatching = () => (dispatch: Function, getState: Function) => dispatch(getMatchingRows(selectors.getMatchingRowsFilters(getState())))

// ignore a requested trade item
export const ignore = (requestedTradeItemId) => dispatch => api.ignore(requestedTradeItemId).then(res => {
  return dispatch(refreshMatching())
})

// remove ignore on a requested trade item
export const unignore = (requestedTradeItemId) => dispatch => api.unignore(requestedTradeItemId).then(res  => {
  return dispatch(refreshMatching())
})

// match a requested trade item
export const match = (requestedTradeItemId, tradeItemId, languageCode) => dispatch => api.match(requestedTradeItemId, tradeItemId, languageCode).then(res => {
  return dispatch(refreshMatching())
})

// export csv
export const exportCsv = filters => dispatch => api.exportCsv(filters).then(res => {
  return dispatch(fileDownload(res.data, 'enrichment.csv'))
})

// toggle ignore on a requested trade item
export const toggleIgnore = (requestedTradeItem) => dispatch => requestedTradeItem.ignored ? dispatch(unignore(requestedTradeItem.id)) : dispatch(ignore(requestedTradeItem.id))

// set requested trade item
export const setRequestedTradeItem = (requestedTradeItem) => dispatch => dispatch({type: types.APP_MATCHING_MATCH_RECEIVE, requestedTradeItem})

// reset requested trade item
export const resetRequestedTradeItem = () => dispatch => dispatch({type: types.APP_MATCHING_MATCH_RECEIVE, requestedTradeItem: null})

// set trade items search filters
export const setTradeItemSearchFilters = filters => dispatch => dispatch({type: types.APP_MATCHING_MATCH_FILTERS_RECEIVE, filters})

// search trade items
export const searchTradeItems = (lang, value) => dispatch => {
  setTradeItemSearchFilters(value)(dispatch)
  return call(dispatch, () => tradeItemsApi.search(lang, {
    keyword: value,
    limit: 20,
    aggregate: true
  }), {
    REQUEST: types.APP_MATCHING_MATCH_TRADE_ITEMS_LIST_RESET,
    FAILURE: types.APP_MATCHING_MATCH_TRADE_ITEMS_LIST_FAILURE,
  }).then(res => {
    dispatch({type: types.APP_MATCHING_MATCH_TRADE_ITEMS_LIST_SUCCESS, results: res.results})
  })
}

// reset trade items list for matching
export const resetMatchingTradeItemsList = () => dispatch => dispatch({type: types.APP_MATCHING_MATCH_TRADE_ITEMS_LIST_RESET})

// set trade item selected form matching
export const setTradeItemForMatching = tradeItem => dispatch => dispatch({type: types.APP_MATCHING_MATCH_TRADE_ITEM_RECEIVE, tradeItem})

// reset trade item selected form matching
export const resetTradeItemForMatching = tradeItem => dispatch => dispatch({type: types.APP_MATCHING_MATCH_TRADE_ITEM_RECEIVE})

// boolean to know if we are creating a new trade item
export const setIsCreatingNewTradeItem = isCreating => dispatch => dispatch({type: types.APP_MATCHING_MATCH_IS_CREATING_NEW_RECEIVE, isCreating})

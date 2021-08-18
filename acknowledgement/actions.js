import get from "lodash/get"
import * as api from '../common/services/acknowledgement'
import * as types from './types'
import * as selectors from './selectors'
import call from "../common/actions/call"

// get conflicts
export const getConflicts = filters => dispatch => call(dispatch, () => api.getConflicts(filters), {
  REQUEST: types.APP_ACK_CONFLICTS_LIST_REQUEST,
  FAILURE: types.APP_ACK_CONFLICTS_LIST_FAILURE,
}).then(res => {
  dispatch({type: types.APP_ACK_CONFLICTS_LIST_SUCCESS, results: get(res, "results", [])})
  dispatch({type: types.APP_ACK_CONFLICTS_TOTAL_RECEIVED, total: get(res, "total", null)})
})

// update conflicts list filters
export const updateConflictsFiltersKey = (key, value) => (dispatch, getState) => {
  dispatch({type: types.APP_ACK_CONFLICTS_FILTERS_VALUE_RECEIVED, key, value})
  return dispatch(getConflicts(selectors.getConflictsFilters(getState())))
}

// update resolved state
export const markConflictAsResolved = conflictId => (dispatch, getState) => {
  const index = selectors.getConflictIndex(conflictId)(getState())
  if(index === -1) return;
  dispatch({type: types.APP_ACK_CONFLICTS_LIST_UPDATE, key: `${index}.isResolved`, value: true})
}

// keep our value
export const keepOurs = conflictId => (dispatch, getState) => {
  return api.forceConflict(conflictId).then(
    res => markConflictAsResolved(conflictId)(dispatch, getState)
  )
} 

// keep theirs
export const keepTheirs = conflictId => (dispatch, getState) => {
  return api.updateConflict(conflictId).then(
    res => markConflictAsResolved(conflictId)(dispatch, getState)
  )
}

// get submissions
export const getSubmissions = filters => dispatch => call(dispatch, () => api.getSubmissions(filters), {
  REQUEST: types.APP_SUBMISSIONS_LIST_REQUEST,
  FAILURE: types.APP_SUBMISSIONS_LIST_FAILURE,
}).then(res => {
  dispatch({type: types.APP_SUBMISSIONS_LIST_SUCCESS, results: get(res, "results", [])})
  dispatch({type: types.APP_SUBMISSIONS_TOTAL_RECEIVED, total: get(res, "total", null)})
})

// update submissions list filters
export const updateSubmissionsFiltersKey = (key, value) => (dispatch, getState) => {
  dispatch({type: types.APP_SUBMISSIONS_FILTERS_VALUE_RECEIVED, key, value})
  return dispatch(getSubmissions(selectors.getSubmissionsFilters(getState())))
}
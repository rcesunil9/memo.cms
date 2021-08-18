import * as api from '../common/services/preComputing'
import * as types from './types'
import * as selectors from './selectors'
import call from "../common/actions/call"
import * as businessRulesApi from '../common/services/businessRules'

// get paged pre computing jobs jobs
export const getPreComputingJobs = () => (dispatch, getState) => {
  if(selectors.isListFetching(getState())) return;
  return call(dispatch, () => api.getPreComputingJobs(selectors.getJobsFilters(getState())), {
    REQUEST: types.APP_PRE_COMPUTING_JOB_LIST_REQUEST,
    FAILURE: types.APP_PRE_COMPUTING_JOB_LIST_FAILURE,
  }).then(results => dispatch({type: types.APP_PRE_COMPUTING_JOB_LIST_SUCCESS, results: results}))
}

// reset filters
export const resetPreComputingJobsFilters = () => dispatch => dispatch({type: types.APP_PRE_COMPUTING_JOB_LIST_FILTERS_RESET})

// reset jobs list
export const resetPreComputingJobs = () => dispatch => {
  dispatch({type: types.APP_PRE_COMPUTING_JOB_LIST_RESET})
  dispatch({type: types.APP_PRE_COMPUTING_JOB_LIST_ITEM_SELECTED_RECEIVE})
  resetPreComputingJobsFilters()(dispatch)
}

// set pre computing jobs jobs filters
export const setPreComputingJobsFilters = filters => dispatch => dispatch({type: types.APP_PRE_COMPUTING_JOB_LIST_FILTERS_RECEIVE, filters})

// apply pre computing jobs jobs filters
export const applyPreComputingJobsFilters = filters => (dispatch, getState) => {
  dispatch(setPreComputingJobsFilters(filters))
  getPreComputingJobs()(dispatch, getState)
}

// set autorefresh
export const setPreComputingJobsAutorefresh = autorefresh => dispatch => dispatch({type: types.APP_PRE_COMPUTING_JOB_LIST_AUTOREFRESH_RECEIVE, autorefresh})

// toggle autorefresh
export const togglePreComputingJobsAutorefresh = () => dispatch => dispatch({type: types.APP_PRE_COMPUTING_JOB_LIST_AUTOREFRESH_TOGGLE_RECEIVE})

// get evaluation detail
export const getJobDetails = id => dispatch => businessRulesApi.getEvaluationDetails(id).then(res => dispatch({type: types.APP_PRE_COMPUTING_JOB_DETAIL_RECEIVE, jobDetail: res.data}))
export const resetJobDetails = () => dispatch => dispatch({type: types.APP_PRE_COMPUTING_JOB_DETAIL_RECEIVE, jobDetail: null})

// retry a job
export const retryJob = jobId => (dispatch, getState) => api.preComputeForJob(jobId).then(
  res => getPreComputingJobs()(dispatch, getState)
)
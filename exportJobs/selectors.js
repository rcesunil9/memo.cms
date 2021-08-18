import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../common/reducers/createList"
import get from "lodash/get"
import orderBy from "lodash/orderBy"
import find from 'lodash/find'

// Direct accessors to state
//
const _getJobs = (state) => state.exportJobs.listing.jobs
const _getSelectedIndex = (state) => state.exportJobs.listing.selectedIndex
export const getJobsFilters = (state) => state.exportJobs.listing.filters
export const getJobsAutorefresh = (state) => state.exportJobs.listing.autorefresh
export const getJobDetail = (state) => state.exportJobs.detail

// Computed selectors
//
export const getJobs = createSelector(
  _getJobs,
  list => getResults(list)
)

export const isListFetching = createSelector(
  _getJobs,
  list => getIsFetching(list)
)

export const getJobsOrderedByName = createSelector(
  getJobs,
  list => orderBy(list, "name", "asc")
)

export const getSelectedJob = createSelector(
  [getJobs, _getSelectedIndex],
  (list, index) => get(list, `[${index}]`, null)
)

export const getImportJobDetailsContextId = createSelector(
  getJobDetail,
  jobDetails => get(jobDetails, "contextId", null)
)

export const getImportJobDetailsEvaluationResults = createSelector(
  getJobDetail,
  jobDetails => get(jobDetails, "evaluationResult", null)
)

export const getImportJobByDetailContextId = createSelector(
  [getImportJobDetailsContextId, getJobs],
  (contextId, importJobs) => find(importJobs, ij => ij.id === contextId)
)
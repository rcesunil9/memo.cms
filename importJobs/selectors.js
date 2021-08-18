import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../common/reducers/createList"
import get from "lodash/get"
import orderBy from "lodash/orderBy"
import find from "lodash/find"

// Direct accessors to state
//
const _getImportJobs = (state) => state.importJobs.listing.importJobs
const _getPagedPersistence = (state) => state.importJobs.report.persistence.list
const _getPagedBusinessRule = (state) => state.importJobs.report.businessRule.list
const _getPagedMapping = (state) => state.importJobs.report.mapping.list
const _getSelectedIndex = (state) => state.importJobs.listing.selectedIndex
export const getImportJobsFilters = (state) => state.importJobs.listing.filters
export const getImportJobsTotal = (state) => state.importJobs.listing.total
export const getImportJobsAutorefresh = (state) => state.importJobs.listing.autorefresh
export const getImportJobDetail = (state) => state.importJobs.detail
export const getGroupSelected = (state) => state.importJobs.report.groupSelected
export const getContextId = (state) => state.importJobs.report.contextId
export const getMappingFilters = (state) => state.importJobs.report.mappingFilter
export const getFilterByTradeItem = (state) => state.importJobs.report.filterByTradeItem
export const getDetailReport = (state) => state.importJobs.report.detailReport
export const getPersistenceTotal = (state) => state.importJobs.report.persistence.total
export const getBusinessRuleTotal = (state) => state.importJobs.report.businessRule.total
export const getMappingTotal = (state) => state.importJobs.report.mapping.total
export const getPersistencePageFilter = (state) => state.importJobs.report.persistence.pageFilter
export const getBusinessRuleTotalPageFilter = (state) => state.importJobs.report.businessRule.pageFilter

// Computed selectors
//
export const getImportJobs = createSelector(
  _getImportJobs,
  list => getResults(list)
)

export const getPagedPersistence = createSelector(
  _getPagedPersistence,
  list => getResults(list)
)

export const getPagedBusinessRule = createSelector(
  _getPagedBusinessRule,
  list => getResults(list)
)

export const getPagedMapping = createSelector(
  _getPagedMapping,
  list => getResults(list)
)

export const isListFetching = createSelector(
  _getImportJobs,
  list => getIsFetching(list)
)

export const isPersistListFetching = createSelector(
  _getPagedPersistence,
  list => getIsFetching(list)
)

export const isBusinessRuleListFetching = createSelector(
  _getPagedBusinessRule,
  list => getIsFetching(list)
)

export const isMappingFetching = createSelector(
  _getPagedMapping,
  list => getIsFetching(list)
)

export const getImportJobsOrderedByName = createSelector(
  getImportJobs,
  list => orderBy(list, "name", "asc")
)

export const getSelectedListItem = createSelector(
  [getImportJobs, _getSelectedIndex],
  (list, index) => get(list, `[${index}]`, null)
)

export const getImportJobDetailsContextId = createSelector(
  getImportJobDetail,
  jobDetails => get(jobDetails, "contextId", null)
)

export const getImportJobDetailsEvaluationResults = createSelector(
  getImportJobDetail,
  jobDetails => get(jobDetails, "evaluationResult", null)
)

export const getImportJobByDetailContextId = createSelector(
  [getImportJobDetailsContextId, getImportJobs],
  (contextId, importJobs) => find(importJobs, ij => ij.id === contextId)
)
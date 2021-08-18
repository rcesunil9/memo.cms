import { createSelector } from 'reselect'
import findIndex from "lodash/findIndex"
import { getResults, getIsFetching } from "../common/reducers/createList"

// Conflicts
//
export const getConflicts = createSelector(state => state.acknowledgement.conflicts.conflicts, getResults) 
export const areConflictsFetching = createSelector(state => state.acknowledgement.conflicts.conflicts, getIsFetching) 
export const getTotalConflicts = state => state.acknowledgement.conflicts.total
export const getConflictsFilters = state => state.acknowledgement.conflicts.filters
export const getConflictIndex = conflictId => createSelector(
  [ getConflicts ], 
  conflicts => findIndex(conflicts, c => c.id === conflictId)
)

// Submissions
//
export const getSubmissions = createSelector(state => state.acknowledgement.submissions.submissions, getResults)
export const areSubmissionsFetching = createSelector(state => state.acknowledgement.submissions.submissions, getIsFetching)
export const getTotalSubmissions = state => state.acknowledgement.submissions.total
export const getSubmissionsFilters = state => state.acknowledgement.submissions.filters
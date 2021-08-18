import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../../common/reducers/createList"

const rows = (state) => state.transformationManagement.list.rows

export const getFilters = (state) => state.transformationManagement.list.filters
export const getTotal = (state) => state.transformationManagement.list.total

export const getRows = createSelector(rows, getResults)
export const isLoading = createSelector(rows, getIsFetching)

export const getTotalPages = createSelector(
    [getTotal, getFilters],
    (total, filters) => Math.ceil(total / filters.Take)
)
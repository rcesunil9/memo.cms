import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../common/reducers/createList"
// import { getResource } from "../common/reducers/createResource"
// import get from "lodash/get"
import orderBy from "lodash/orderBy"

// Direct accessors to state
//
const _getMatchingRows = (state) => state.matching.matchingRows.data
export const getTotal = (state) => state.matching.matchingRows.total
export const getMatchingRowsFilters = (state) => state.matching.matchingRows.filters
const _getManufacturers = (state) => state.matching.manufacturers.list
const _getRetailers = (state) => state.matching.retailers.list
export const getMatchingRequestedTradeItem = (state) => state.matching.matching.requestedTradeItem
export const getMatchingFilters = (state) => state.matching.matching.filters
const _getMatchingTradeItems = (state) => state.matching.matching.tradeItems
export const getMatchingSelectedTradeItem = (state) => state.matching.matching.tradeItemSelected
export const isCreating = (state) => state.matching.matching.isCreating

// Computed selectors
//
export const getMatchingRows = createSelector(
  _getMatchingRows,
  list => getResults(list)
)

export const isMatchingRowsFetching = createSelector(
  _getMatchingRows,
  list => getIsFetching(list)
)

export const getManufacturers = createSelector(
  _getManufacturers,
  list => getResults(list)
)

export const getRetailers = createSelector(
  _getRetailers,
  list => getResults(list)
)

export const getManufacturersForFilter = createSelector(
  getManufacturers,
  list => orderBy(list, "name", "asc")
)

export const getRetailersForFilter = createSelector(
  getRetailers,
  list => orderBy(list, "name", "asc")
)

export const getMatchingTradeItems = createSelector(
  _getMatchingTradeItems,
  list => getResults(list)
)

export const areTradeItemsFetching = createSelector(
  _getMatchingTradeItems,
  list => getIsFetching(list)
)

import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../common/reducers/createList"
import { getResource } from "../common/reducers/createResource"
import get from "lodash/get"
import orderBy from "lodash/orderBy"

// Direct accessors to state
//
const _getList = (state) => state._skeleton.listing.myList
const _getSelectedIndex = (state) => state._skeleton.listing.selectedIndex
const _getDependency1 = (state) => state._skeleton.dependencies.dependency1

// Computed selectors
//
export const getList = createSelector(
  _getList,
  list => getResults(list)
)

export const isListFetching = createSelector(
  _getList,
  list => getIsFetching(list)
)

export const getListOrderedByName = createSelector(
  getList,
  list => orderBy(list, "name", "asc")
)

export const getSelectedListItem = createSelector(
  [getList, _getSelectedIndex],
  (list, index) => get(list, `[${index}]`, null)
)

export const getDependency1 = createSelector(
  _getDependency1,
  dependency => getResource(dependency)
)
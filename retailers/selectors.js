import orderBy from "lodash/orderBy"
import get from "lodash/get"
import { createSelector } from "reselect"
import { getResults } from "../common/reducers/createList"
import { getResource } from "../common/reducers/createResource"

const getRetailerEdit = state => state.retailers.retailer
const _getRetailers = (state) => state.retailers.list.results
export const getRetailerToEdit = createSelector(getRetailerEdit, retailer => getResource(retailer))


export const getRetailers = createSelector(
  _getRetailers,
  list => getResults(list)
)

export const getRetailersOrderedByName = createSelector(
  getRetailers,
  list => orderBy(list, "name", "asc")
)

const getGroupEdit = state => state.retailers.group
export const getGroupToEdit = createSelector(getGroupEdit, group => getResource(group))

export const getGroups = createSelector(
  state => state.retailers.groupsList,
  groups => orderBy(getResults(groups), ["name"])
)

export const getManufacturers = createSelector(
  state => state.retailers.manufacturersList,
  manufacturers => orderBy(getResults(manufacturers), ["name"])
)

export const getExportActions = createSelector(state => state.retailers, retailerEdit => getResults(get(retailerEdit, "exportActions", [])))
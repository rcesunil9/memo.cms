import get from "lodash/get"
import orderBy from "lodash/orderBy"
import map from "lodash/map"
import { createSelector } from "reselect"
import { getResults, getIsFetching } from "../common/reducers/createList"
import { getResource } from "../common/reducers/createResource"

// Direct accessors to state
//
const getTriggers = state => state.triggers.triggers
const getTrigger = state => state.triggers.trigger
const getActions = state => state.triggers.actions
const getAction = state => state.triggers.action
const getDependencies = state => state.triggers.dependencies

// Computed selectors
//
export const getTriggersList = createSelector(getTriggers, getResults)
export const getTriggerObject = createSelector(getTrigger, getResource)
export const getActionsList = createSelector(getActions, getResults)
export const getOrderedActionsList = createSelector(getActionsList, list => orderBy(list, "name"))
export const getActionObject = createSelector(getAction, getResource)
export const getDependenciesObject = createSelector(getDependencies, getResource)
export const getBusinessRulesList = createSelector(getDependenciesObject, deps =>
  get(deps, "businessRules", [])
)
export const getLanguagesList = createSelector(getDependenciesObject, deps =>
  get(deps, "languages", [])
)
export const getRetailersList = createSelector(getDependenciesObject, deps =>
  get(deps, "retailers.results", [])
)
export const getExportFormats = createSelector(getDependenciesObject, deps =>
  get(deps, "exportFormats", [])
)
export const getTransportConfigurations = createSelector(getDependenciesObject, deps =>
  get(deps, "transportConfigurations", [])
)
export const getManufacturers = createSelector(getDependenciesObject, deps =>
  get(deps, "manufacturers", [])
)
export const getConnectors = createSelector(getDependenciesObject, deps =>
  get(deps, "connectors", [])
)
export const getTaxonomies = createSelector(getDependenciesObject, deps =>
  get(deps, "taxonomies", [])
)
export const getManufacturersEntities = createSelector(getDependenciesObject, deps =>
  get(deps, "manufacturersEntities", [])
)
export const getExportPreComputedTradeItemActions = createSelector(getDependenciesObject, deps =>
  get(deps, "exportPreComputedActions", [])
)
export const getTargetMarkets = createSelector(getDependenciesObject, deps =>
  get(deps, "targetMarkets", [])
)
export const getImageCategories = createSelector(getDependenciesObject, deps =>
  get(deps, "imageCategories", [])
)
export const getColorSpaces = createSelector(getDependenciesObject, deps =>
  get(deps, "colorSpaces", [])
)
export const getImageActions = createSelector(getDependenciesObject, deps =>
  get(deps, "imageExportActions", [])
)
export const getManufacturersForSelect = createSelector(
  getManufacturers,
  manufacturers => map(manufacturers, m => { return {label: m.name, value: m.id}})
)
export const getUsersList = createSelector(getDependenciesObject, deps => get(deps, "users", []))
export const getTradeItemCategoriesList = createSelector(getDependenciesObject, deps => get(deps, "tradeItemCategories", []))

// Action execution results
//
const getActionExecutionResultsList = state => state.triggers.actionExecutionResults.list

export const getActionExecutionResultsFilters = state => state.triggers.actionExecutionResults.filters

export const getActionExecutionResultsTotal = state => state.triggers.actionExecutionResults.total

export const getActionExecutionResults = createSelector(getActionExecutionResultsList, getResults)
export const areActionExecutionResultsFetching = createSelector(getActionExecutionResultsList, getIsFetching)

export const getActionExecutionResultDetail = state => state.triggers.actionExecutionResultDetail

export const displayInputParams = state => state.triggers.launchAction.displayInputParams

export const inputParamsValues = state => state.triggers.launchAction.values

export const triggerInputParams = state => state.triggers.triggerInputParams
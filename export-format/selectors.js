import { createSelector } from "reselect"
import concat from "lodash/concat"
import map from "lodash/map"
import { getResults } from "../common/reducers/createList"
import { getResource } from "../common/reducers/createResource"

// Direct accessors to state
//
const getFormat = state => state.exportFormat.format
const getFormats = state => state.exportFormat.formats
const getTaxonomies = state => state.exportFormat.taxonomies
const getTradeItemCategories = state => state.exportFormat.tradeItemCategories
const getBusinessRules = state => state.exportFormat.businessRules
const getBusinessRulesets = state => state.exportFormat.businessRulesets
const getPropertyGroups = state => state.exportFormat.propertyGroups
const getTransformationSets = state => state.exportFormat.transformationSets
const getTradeItemProperties = state => state.exportFormat.tradeItemProperties
const getTransformationsProperties = state => state.exportFormat.transformationsProperties
export const getExcelSheetMapping = state => state.exportFormat.excelSheetMappingSelected
export const getExcelSheetConfiguration = state => state.exportFormat.excelSheetConfigurationSelected

// Computed selectors
//
export const getFormatObject = createSelector(getFormat, getResource)
const getFormatsResults = createSelector(getFormats, getResults)
export const getFormatsList = createSelector(getFormatsResults, r => r.results)
export const getTaxonomiesList = createSelector(getTaxonomies, getResults)
export const getTradeItemCategoriesList = createSelector(getTradeItemCategories, getResults)
export const getBusinessRulesList = createSelector(getBusinessRules, getResults)
export const getBusinessRulesetsList = createSelector(getBusinessRulesets, getResults)
export const getPropertyGroupsList = createSelector(getPropertyGroups, getResults)
export const getTransformationSetsList = createSelector(getTransformationSets, getResults)
export const getTradeItemPropertiesList = createSelector(getTradeItemProperties, getResults)
export const getTransformationsPropertiesList = createSelector(getTransformationsProperties, getResults)


// Merged properties
export const getMergedTradeItemProperties = createSelector(
    [getTradeItemPropertiesList, getTransformationsPropertiesList],
    (tradeItemProperties, transformations) => concat(tradeItemProperties, map(transformations, name => { return {code: name} }))
  )
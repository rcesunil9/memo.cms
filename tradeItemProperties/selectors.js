import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../common/reducers/createList"
import filter from "lodash/filter"
import find from "lodash/find"
import chunk from "lodash/chunk"
import map from "lodash/map"
import size from "lodash/size"
import get from "lodash/get"
import orderBy from "lodash/orderBy"
import keyBy from 'lodash/keyBy'

const getTaxonomies = state => state.tradeItemProperties.taxonomies.results
const getTradeItemCategories = state => state.tradeItemProperties.tradeItemCategories.results
const getGroups = state => state.tradeItemProperties.groups.results
const getRetailers = state => state.tradeItemProperties.retailers
const getConnectors = state => state.tradeItemProperties.connectors
const getBusinessRuleSets = state => state.tradeItemProperties.businessRuleSets
const getProperties = state => state.tradeItemProperties.properties.results
const getValueGroups = state => state.tradeItemProperties.valueGroups.results
const getPropertyLanguages = state => state.tradeItemProperties.languages
const getCurrentValuesLanguage = state => state.tradeItemProperties.valueGroups.currentLanguage
export const getTaxonomySelected = state => state.tradeItemProperties.taxonomies.selected
export const getTradeItemCategorySelected = state => state.tradeItemProperties.tradeItemCategories.selected
export const getGroupSelected = state => state.tradeItemProperties.groups.selected
export const getPropertySelected = state => state.tradeItemProperties.properties.selected;
export const getPropertyNew = state => state.tradeItemProperties.properties.new;
export const getFilterValue = state => state.tradeItemProperties.properties.filterValue
export const getAddScope = state => state.tradeItemProperties.scopes.addScope
export const getAddGroup = state => state.tradeItemProperties.groups.addGroup
export const getSelectedProperty = state => state.tradeItemProperties.properties.selected
export const getEditedValueGroup = state => state.tradeItemProperties.valueGroups.edited
export const getNewValuesGroup = state => state.tradeItemProperties.valueGroups.newValuesGroup

export const getTaxonomiesList = createSelector(
  getTaxonomies,
  taxonomies => getResults(taxonomies)
)

export const getTradeItemCategoriesList = createSelector(
  getTradeItemCategories,
  tradeItemCategories => getResults(tradeItemCategories)
)

export const getGroupsList = createSelector(
  getGroups,
  groups => getResults(groups)
)

export const getRetailersList = createSelector(
  getRetailers,
  retailers => getResults(retailers)
)

export const getConnectorsList = createSelector(
  getConnectors,
  connectors => getResults(connectors)
)

export const getBusinessRuleSetList = createSelector(
  getBusinessRuleSets,
  br => getResults(br)
)

export const getPropertiesList = createSelector(
  getProperties,
  properties => getResults(properties)
)

export const getValueGroupsList = createSelector(
  getValueGroups,
  valueGroups => getResults(valueGroups)
)

export const getFilteredPropertiesList = createSelector(
  [getProperties, getFilterValue],
  (properties, filterValue) => orderBy(filterValue ? filter(getResults(properties), prop => prop.code.includes(filterValue)) : getResults(properties), "code")
)

export const getNumberOfFilteredProperties = createSelector(
  getFilteredPropertiesList,
  values => size(values)
)

export const getFilteredPropertiesListChunks = createSelector(
  [getFilteredPropertiesList, getNumberOfFilteredProperties],
  (values, count) => chunk(values, count / 2 + 1)
)

export const getLanguages = createSelector(
  getPropertyLanguages,
  languages => map(orderBy(getResults(languages), ["code"]), o => { return {value: o.id, label: o.code} })
)

export const getCurrentLanguage = createSelector(
  getPropertyLanguages,
  getCurrentValuesLanguage,
  (languages, code) => find(getResults(languages), ['code', code])
)

const propertyIsValid = property => property && property.code !== ''
  && property.propertyGroupIds.length > 0

export const newPropertyIsValid = createSelector(
  getPropertyNew, propertyIsValid
)

export const selectedPropertyIsValid = createSelector(
  getPropertySelected, propertyIsValid
)

// Retailers associations
//
const _getRetailersAssociations = state => state.tradeItemProperties.associations.list
const _getMandatoryLevels = state => state.tradeItemProperties.associations.mandatoryLevels
const _enrichmentMandatoryLevels = state => state.tradeItemProperties.associations.enrichmentMandatoryLevels
export const getRetailersAssociationsFilters = state => state.tradeItemProperties.associations.filters
export const getRetailersAssociationsTotal = state => state.tradeItemProperties.associations.total
export const getNewRetailersAssociation = state => state.tradeItemProperties.associations.newAssociation
export const getExpandedRow = state => state.tradeItemProperties.associations.expanded
export const getEditRetailersAssociation = state => state.tradeItemProperties.associations.editAssociation

export const getRetailersAssociations = createSelector(
  _getRetailersAssociations,
  associations => getResults(associations)
)

export const getMandatoryLevels = createSelector(
  _getMandatoryLevels,
  levels => getResults(levels)
)

export const getEnrichmentMandatoryLevels = createSelector(
  _enrichmentMandatoryLevels,
  levels => getResults(levels)
)

export const getBusinessRuleSetListById = createSelector(
  getBusinessRuleSetList,
  br => keyBy(br, "id")
)

// Aliases
//
const getAliasesBase = state => state.tradeItemProperties.aliases
export const getAliases = createSelector(getAliasesBase, base => getResults(get(base, "results", [])))
export const areAliasesFetching = createSelector(getAliasesBase, base => getIsFetching(get(base, "results", [])))
export const getAlias = createSelector(getAliasesBase, base => get(base, "alias", null))
export const getAliasGroups = createSelector(getAliasesBase, base => getResults(get(base, "groups", [])))
export const getAliasProperties = createSelector(getAliasesBase, base => getResults(get(base, "tradeItemProperties", [])))
export const areAliasPropertiesFetching = createSelector(getAliasesBase, base => getIsFetching(get(base, "tradeItemProperties")))
export const getRetailerSelected = createSelector(
  [getAlias, getRetailersList],
  (alias, retailers) => find(retailers, r => r.id === get(alias, "retailerId")) || null
)
export const getTradeItemProperty = createSelector(getAliasesBase, base => get(base, "tradeItemProperty", null))
export const getAliasGroupSelected = createSelector(getTradeItemProperty, tradeItemProperty => get(tradeItemProperty, "tradeItemPropertyGroup", null))
export const getAliasPropertySelected = createSelector(
  [getTradeItemProperty, getAliasProperties],
  (tradeItemProperty, properties) => find(properties, r => r.code === get(tradeItemProperty, "tradeItemPropertyCode")) || null
)
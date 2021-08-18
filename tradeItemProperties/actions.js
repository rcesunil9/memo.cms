import * as targetMarketApi from '../common/services/targetMarket'
import * as api from '../common/services/tradeItemProperties'
import * as tradeItemCategoryApi from '../common/services/tradeItemCategories'
import * as taxonomyApi from '../common/services/taxonomy'
import * as retailersApi from '../common/services/retailer'
import * as businessRulesApi from '../common/services/businessRules'
import { getAllConnectors } from '../common/services/subscription'
import * as types from './types'
import {getTaxonomySelected, getGroupSelected, getTradeItemCategorySelected, getRetailersAssociationsFilters} from './selectors'
import call from "../common/actions/call"
import map from 'lodash/map'
import get from 'lodash/get'
import fileDownload from 'js-file-download'


// Get trade items properties taxonomies
//
export const getTaxonomies = () => async dispatch => call(dispatch, taxonomyApi.getTaxonomies, {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMIES_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMIES_LIST_FAILURE,
}).then(taxonomies => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMIES_LIST_SUCCESS, results: taxonomies}))

// Get trade items properties trade item categories
//
export const getTradeItemCategories = () => async dispatch => call(dispatch, tradeItemCategoryApi.getTradeItemCategories, {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORIES_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORIES_LIST_FAILURE,
}).then(tradeItemCategories => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORIES_LIST_SUCCESS, results: tradeItemCategories}))

// Get trade items properties groups
//
export const getGroups = () => async dispatch => call(dispatch, api.getTradeItemPropertiesGroups, {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_GROUPS_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_GROUPS_LIST_FAILURE,
}).then(groups => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_GROUPS_LIST_SUCCESS, results: groups}))

// Select a taxonomy
//
export const selectTaxonomy = (taxonomy) => async dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMY_SELECTED_RECEIVE, taxonomy})

// Select a trade item category
//
export const selectTradeItemCategory = (tradeItemCategory) => async dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORY_SELECTED_RECEIVE, tradeItemCategory})

// Select a group
//
export const selectGroup = (group) => async dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_GROUP_SELECTED_RECEIVE, group})

// Get trade items properties by group
//
export const getPropertiesByGroup = (taxonomyId, propertyGroupCode) => async dispatch => call(dispatch, () => api.getTradeItemPropertiesByGroup(taxonomyId, propertyGroupCode), {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_LIST_FAILURE,
}).then(properties => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_LIST_SUCCESS, results: properties}))

// Get trade items properties by trade item category
//
export const getTradeItemPropertiesByTradeItemCategory = (taxonomyId, tradeItemCategoryCode) => async dispatch => call(dispatch, () => api.getTradeItemPropertiesByTradeItemCategory(taxonomyId, tradeItemCategoryCode), {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_LIST_FAILURE,
}).then(properties => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_LIST_SUCCESS, results: properties}))

// Get trade items properties by group and trade item category
//
export const getPropertiesByGroupAndTradeItemCategory = (taxonomyId, group, tradeItemCategoryCode) => async dispatch => call(dispatch, () => api.getTradeItemPropertiesByGroupCodeAndTradeItemCategory(taxonomyId, group, tradeItemCategoryCode), {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_LIST_FAILURE,
}).then(properties => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_LIST_SUCCESS, results: properties}))

// Get properties by group, trade item category, or both
//
export const getProperties = ({taxonomyId, propertyGroupCode, tradeItemCategoryCode}) => async (dispatch) => {

  if (!taxonomyId) {
    return dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_LIST_SUCCESS, results: []})
  }
  
  if(taxonomyId && propertyGroupCode && tradeItemCategoryCode) return dispatch(getPropertiesByGroupAndTradeItemCategory(taxonomyId, propertyGroupCode, tradeItemCategoryCode))
  else if(taxonomyId && propertyGroupCode) return dispatch(getPropertiesByGroup(taxonomyId, propertyGroupCode))
  else return dispatch(getTradeItemPropertiesByTradeItemCategory(taxonomyId, tradeItemCategoryCode))
}

// Set properties filter value
//
export const setFilterValue = (value) => async dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTY_FILTER_VALUE_RECEIVE, value})

// Put a fat property object into the selected state
//
export const setSelectedProperty = (property) => (dispatch) => dispatch({type: types.APP_TRADE_ITEMS_PROPERTY_SELECTED_RECEIVE, property})

// Load the given light property into the editor
//
export const selectProperty = (lightProperty) => async (dispatch) => {
  dispatch(setSelectedProperty(null))
  const property = await api.enrichLightProperty(lightProperty);
  dispatch(setSelectedProperty(property))
}

// Set the new property object
//
export const setNewProperty = (property) => (dispatch) => dispatch({type: types.APP_TRADE_ITEMS_PROPERTY_NEW_RECEIVE, property})

// Get value groups
//
export const getValueGroups = () => async dispatch => call(dispatch, api.getTradeItemValueGroups, {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUPS_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUPS_LIST_FAILURE,
}).then(groups => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUPS_LIST_SUCCESS, results: groups}))

// Set the new edited value group
//
export const setEditedValueGroup = (valueGroup) => (dispatch) => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUP_EDITED_RECEIVE, valueGroup})

// Fetch an existing values group and load it to the editor
//
export const editValueGroup = (valueGroupId) => async (dispatch) => {
  const valueGroup = (await api.getTradeItemValueGroup(valueGroupId)).data
  dispatch(setEditedValueGroup(valueGroup))
}

// Saves a new or edited value group
export const saveValueGroup = (valueGroup) => async (dispatch) => {
  if (valueGroup.id) {
    await api.updateTradeItemValueGroup(valueGroup)
  } else {
    await api.createTradeItemValueGroup(valueGroup)
  }
  dispatch(getValueGroups())
  dispatch(setEditedValueGroup(null))
}

// Get languages
//
export const getLanguages = () => (dispatch) => call(dispatch, targetMarketApi.getLanguages, {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_LANGUAGES_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_LANGUAGES_FAILURE,
}).then(results => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_LANGUAGES_SUCCESS, results}))

// Set current language
//
export const setCurrentLanguage = (language) => (dispatch) => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUP_LANGUAGE_SELECTED_RECEIVE, language})

const reloadProperties = () => (dispatch, getState) => {
  const state = getState()
  const propertyTaxonomy = getTaxonomySelected(state)
  const propertyTradeItemCategory = getTradeItemCategorySelected(state)
  const propertyGroup = getGroupSelected(state)

  var taxonomyId;
  var tradeItemCategoryCode;
  var propertyGroupName;
  if(propertyTaxonomy)
    taxonomyId = propertyTaxonomy.id
  if(propertyTradeItemCategory)
    tradeItemCategoryCode = propertyTradeItemCategory.code.code
  if(propertyGroup)
    propertyGroupName = propertyGroup.name

  getProperties({taxonomyId, propertyGroupName, tradeItemCategoryCode})
}

// Create property
//
export const createProperty = (property) => async (dispatch) => {
  await api.createProperty(property)
  dispatch(reloadProperties())
  dispatch(setNewProperty(null))
}

export const updateProperty = (property) => async (dispatch) => {
  await api.updateProperty(property)
  dispatch(reloadProperties())
}

export const deleteProperty = (property) => async (dispatch) => {
  await api.deleteProperty(property)
  dispatch(setSelectedProperty(null))
  dispatch(reloadProperties())
}

// new values group ready to import
export const receiveNewValuesGroup = values => dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUP_NEW_VALUES_GROUP_RECEIVE, values})
export const resetNewValuesGroup = () => dispatch => receiveNewValuesGroup(null)(dispatch)

// import new values group
export const importNewValuesGroup = valueGroup => dispatch => api.importTradeItemValueGroup(valueGroup).then(res => resetNewValuesGroup()(dispatch))


// Get aliases
//
export const getAliases = () => dispatch => call(dispatch, api.getAllAliases, {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_FAILURE,
}).then(aliases => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_SUCCESS, results: aliases}))

export const getAliasGroups = () => dispatch => call(dispatch, api.getTradeItemPropertiesGroups, {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_GROUP_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_GROUP_FAILURE,
}).then(groups => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_GROUP_SUCCESS, results: groups}))

export const resetAliasGroups = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_GROUP_RESET})

export const getRetailers = () => dispatch => call(dispatch, () => retailersApi.getRetailers({ Skip: 0, Take: 999 }), {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_RETAILERS_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_RETAILERS_FAILURE,
}).then(retailers => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_RETAILERS_SUCCESS, results: retailers.results}))

export const resetRetailers = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_RETAILERS_RESET})

export const getConnectors = () => dispatch => call(dispatch, () => getAllConnectors(), {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_CONNECTORS_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_CONNECTORS_FAILURE,
}).then(connectorsRes => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_CONNECTORS_SUCCESS, results: connectorsRes}))

export const resetConnectors = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_CONNECTORS_RESET})

export const getAliasProperties = propertyGroup => dispatch => call(dispatch, () => api.getTradeItemPropertiesByGroup(propertyGroup), {
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_PROPERTIES_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_PROPERTIES_FAILURE,
}).then(properties => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_PROPERTIES_SUCCESS, results: properties}))

export const resetAliasProperties = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_PROPERTIES_RESET})

export const getAlias = id => dispatch => api.getAlias(id).then(res => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIAS_RECEIVE, alias: res.data}))

export const setAliasValue = (key, value) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIAS_VALUE_RECEIVE, key, value})

export const setAliasTradeItemPropertyValue = (key, value) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTY_ALIAS_VALUE_RECEIVE, key, value})

export const setAliasTradeItemProperty = (tradeItemProperty) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTY_ALIAS_RECEIVE, tradeItemProperty})

export const resetAliasTradeItemProperty = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_PROPERTY_ALIAS_RESET})

export const addNewAliasProperty = tradeItemProperty => dispatch => {
  dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIAS_PUSH, tradeItemProperty})
  dispatch(resetAliasTradeItemProperty())
}

export const removeAliasProperty = index => dispatch => {
  dispatch({type: types.APP_TRADE_ITEMS_PROPERTIES_ALIAS_REMOVE, index})
}

export const saveAlias = alias => dispatch => {
  if(alias.id) api.updateAlias(alias)
  else api.createAlias(alias)
}

export const deleteAlias = id => dispatch => api.deleteAlias(id)


// Get languages
//
export const getBusinessRuleSets = () => (dispatch) => call(dispatch,() =>  businessRulesApi.getBusinessRulesSets(), {
  REQUEST: types.APP_BUSINESS_RULES_SET_LIST_REQUEST,
  FAILURE: types.APP_BUSINESS_RULES_SET_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_BUSINESS_RULES_SET_LIST_SUCCESS, results}))

// Retailers associations--------------------------------->
//
export const getRetailersAssociations = (filters) => dispatch => {
  setAssociationsFilters(filters)(dispatch)
  return call(dispatch, () => api.getPagedRetailersAssociations(filters), {
    REQUEST: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_REQUEST,
    FAILURE: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_FAILURE,
  }).then(res => {
    dispatch({type: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_SUCCESS, results: res.results})
    dispatch({type: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_TOTAL_RECEIVE, total: get(res, 'total', 0)})
  })
}

export const resetRetailersAssociations = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_RESET})

export const setAssociationsFilters = (filters) => (dispatch) => dispatch({type: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_FILTERS_SET, filters})

// Set the new association
//
export const setNewAssociation = (association) => (dispatch) => dispatch({type: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_NEW_RECEIVE, association})

// Get mandatory levels
//
export const getMandatoryLevels = () => dispatch => call(dispatch, api.getMandatoryLevels, {
  REQUEST: types.APP_TRADE_ITEMS_MANDATORY_LEVEL_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_MANDATORY_LEVEL_LIST_FAILURE,
}).then(levels => dispatch({type: types.APP_TRADE_ITEMS_MANDATORY_LEVEL_LIST_SUCCESS, results: levels}))

//create multiple associations
export const createButchAssociations = (associations) => (dispatch, getState) => {
  const butchRequests = map(associations, association => api.createRetailerAssociation(association))
  Promise.all(butchRequests).then(res => {
    setNewAssociation()(dispatch)
    getRetailersAssociations(getRetailersAssociationsFilters(getState()))(dispatch)
  })
}

// Update association by id
//
export const updateAssociation = (association, index) => dispatch => {
  api
    .updateRetailerAssociation(association.id, association)
    .then(res => {
      setEditAssociation()(dispatch)
      dispatch({type: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_UPDATE, key: index, value: association})
    })
}

// Delete association by id
//
export const deleteAssociationById = id => dispatch => api.deleteRetailerAssociation(id).then(
  res => dispatch({type: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_REMOVE, key: 'id', value: id})
)

// Set the edit association
//
export const setEditAssociation = (association) => (dispatch) => dispatch({type: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_EDIT_RECEIVE, association})

// Expand row to edit
//
export const setExpandedRow = (expanded) => (dispatch) => dispatch({type: types.APP_ASSOCIATIONS_LIST_EXPANDED_SET, expanded})

export const exportCsv = filters => dispatch => api.exportCsvRetailerAssociations(filters).then(res => {
  return dispatch(fileDownload(res.data, 'properties_associations.csv'))
})
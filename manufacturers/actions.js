import * as api from '../common/services/manufacturer'
import * as targetMarketApi from '../common/services/targetMarket'
import * as taxonomyApi from '../common/services/taxonomy'
import * as matrixMappingApi from '../common/services/matrixMapping'
import * as businessRulesApi from '../common/services/businessRules'
import * as triggersApi from "../common/services/triggers"
import * as retailerApi from "../common/services/retailer"
import { getAllUsers } from "../common/services/userManagement"
import * as types from './types'
import call from "../common/actions/call"
import map from "lodash/map"

// Get all manufacturers
//
export const getManufacturers = () => dispatch => call(dispatch, api.getManufacturers, {
  REQUEST: types.APP_MANUFACTURERS_LIST_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_LIST_SUCCESS, results}))

// Get manufacturer by its guid
//
export const getManufacturerById = (manufacturerId) => dispatch => call(dispatch, () => api.getManufacturerById(manufacturerId), {
  REQUEST: types.APP_MANUFACTURERS_EDIT_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_EDIT_FAILURE,
}).then(resource => dispatch({type: types.APP_MANUFACTURERS_EDIT_SUCCESS, resource}))

// Edit manufacturer
//
export const editManufacturer = (manufacturer) => dispatch => dispatch({type: types.APP_MANUFACTURERS_EDIT_SUCCESS, resource: manufacturer})

// Update manufacturer
//
export const saveManufacturerById = (id, manufacturer) => dispatch => api.saveManufacturerById(id, manufacturer)

// Create manufacturer
//
export const createManufacturer = (manufacturer) => dispatch => api.createManufacturer(manufacturer).then(
  res => res.data
)

// Delete manufacturer
//
export const deleteManufacturerById = (id) => dispatch => api.deleteManufacturerById(id)

// Reset manufacturer
//
export const resetManufacturer = () => dispatch => dispatch({type: types.APP_MANUFACTURERS_EDIT_RESET})

// Get all manufacturer entities
//
export const getManufacturerEntitiesByManufacturerId = manufacturerId => dispatch => call(dispatch, () => api.getManufacturerEntitiesByManufacturerId(manufacturerId), {
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITIES_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITIES_FAILURE,
}).then(results => {
  dispatch({type: types.APP_MANUFACTURERS_EDIT_ENTITIES_SUCCESS, results})
  return results
})

// Edit manufacturer entity
//
export const editManufacturerEntity = (manufacturerEntity) => dispatch => dispatch({type: types.APP_MANUFACTURERS_EDIT_ENTITY_SUCCESS, resource: manufacturerEntity})

// Reset manufacturer entity
//
export const resetManufacturerEntity = () => dispatch => dispatch({type: types.APP_MANUFACTURERS_EDIT_ENTITY_RESET})

// Update manufacturer entity
//
export const saveManufacturerEntityById = (id, manufacturerEntity) => dispatch => api.saveManufacturerEntityById(id, manufacturerEntity)

// Create manufacturer entity
//
export const createManufacturerEntity = (manufacturerEntity) => dispatch => api.createManufacturerEntity(manufacturerEntity).then(
  res => dispatch({type: types.APP_MANUFACTURERS_EDIT_ENTITIES_SUCCESS, push: Object.assign(manufacturerEntity, {}, {id: res.data})})
)

// Delete manufacturer entity
//
export const deleteManufacturerEntityById = (id) => dispatch => api.deleteManufacturerEntityById(id).then(
  res => dispatch({type: types.APP_MANUFACTURERS_EDIT_ENTITIES_REMOVE, key: 'id', value: id})
)

// Get target markets
//
export const getTargetMarkets = () => dispatch => call(dispatch, targetMarketApi.getTargetMarkets, {
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITY_TARGET_MARKETS_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITY_TARGET_MARKETS_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_EDIT_ENTITY_TARGET_MARKETS_SUCCESS, results}))

// Get taxonomies
//
export const getTaxonomies = () => dispatch => call(dispatch, taxonomyApi.getTaxonomies, {
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITY_TAXONOMIES_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITY_TAXONOMIES_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_EDIT_ENTITY_TAXONOMIES_SUCCESS, results}))

// Get retailers
//
export const getRetailers = () => dispatch => call(dispatch, retailerApi.getAllRetailers, {
  REQUEST: types.APP_MANUFACTURERS_RETAILERS_LIST_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_RETAILERS_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_RETAILERS_LIST_SUCCESS, results}))

// Get languages
//
export const getLanguages = () => dispatch => call(dispatch, targetMarketApi.getLanguages, {
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITY_LANGUAGES_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITY_LANGUAGES_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_EDIT_ENTITY_LANGUAGES_SUCCESS, results}))

// Get matrix mappings
//
export const getMatrixMappings = () => dispatch => call(dispatch, matrixMappingApi.getMatrixMappings, {
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITY_MATRIX_MAPPINGS_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITY_MATRIX_MAPPINGS_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_EDIT_ENTITY_MATRIX_MAPPINGS_SUCCESS, results: map(results, mapping => {return {id: mapping.id, name: mapping.mappingTitle}})}))

// fetch business rules sets
export const getBusinessRulesSets = () => dispatch => call(dispatch, businessRulesApi.getBusinessRulesSets, {
  REQUEST: types.APP_MANUFACTURERS_BUSINESS_RULES_LIST_RESET,
  FAILURE: types.APP_MANUFACTURERS_BUSINESS_RULES_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_BUSINESS_RULES_LIST_SUCCESS, results: results}))


// Get all export actions
//
export const getExportActions = () => dispatch => call(dispatch, triggersApi.getExportActions, {
  REQUEST: types.APP_MANUFACTURERS_EDIT_ACTIONS_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ACTIONS_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_EDIT_ACTIONS_SUCCESS, results}))
export const resetExportActions = () => dispatch => dispatch({type: types.APP_MANUFACTURERS_EDIT_ACTIONS_RESET})

// Get PDF actions
//
export const getPdfExportActions = () => dispatch => call(dispatch, triggersApi.getPreComputedExportActions, {
  REQUEST: types.APP_MANUFACTURERS_EDIT_ACTIONS_PDF_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ACTIONS_PDF_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_EDIT_ACTIONS_PDF_SUCCESS, results}))
export const resetPdfExportActions = () => dispatch => dispatch({type: types.APP_MANUFACTURERS_EDIT_ACTIONS_PDF_RESET})

// Get Image Categories
//
export const getImageCategories = () => dispatch => call(dispatch, api.getImageCategories, {
  REQUEST: types.APP_MANUFACTURERS_EDIT_IMAGE_CATEGORIES_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_EDIT_IMAGE_CATEGORIES_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_EDIT_IMAGE_CATEGORIES_SUCCESS, results}))

export const getUsers = () => dispatch => call(dispatch, getAllUsers, {
  REQUEST: types.APP_MANUFACTURERS_USERS_LIST_REQUEST,
  FAILURE: types.APP_MANUFACTURERS_USERS_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_MANUFACTURERS_USERS_LIST_SUCCESS, results}))
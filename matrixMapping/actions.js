import * as api from '../common/services/matrixMapping'
import * as propertiesApi from '../common/services/tradeItemProperties'
import * as taxonomyApi from '../common/services/taxonomy'
import * as tradeItemCategoriesApi from '../common/services/tradeItemCategories'
import * as types from './types'
import * as utils from "./utils"
import call from "../common/actions/call"
import * as selectors from "./selectors"


// get all existing matrix mappings
export const getExistingMappings = () => async dispatch => call(dispatch, api.getMatrixMappings, {
  REQUEST: types.APP_MATRIX_MAPPING_LIST_REQUEST,
  FAILURE: types.APP_MATRIX_MAPPING_LIST_FAILURE,
}).then(mappings => dispatch({type: types.APP_MATRIX_MAPPING_LIST_SUCCESS, results: mappings}))

// get a mapping by id
export const initMappingById = (mappingId) => async dispatch => api.getMappingById(mappingId).then(res => {
  setOriginalMapping(res.data)(dispatch)
  setSelectedMapping(res.data)(dispatch)
})

// when a mapping has been selected
export const setSelectedMapping = (mapping) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_SELECTED_RECEIVE, mapping})

// original mapping
export const setOriginalMapping = (mapping) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_ORIGINAL_MAPPING_RECEIVE, mapping})

// reset current mapping
export const resetMapping = () => async dispatch => {
  setOriginalMapping(null)(dispatch)
  setSelectedMapping(null)(dispatch)
  resetMatrixAnalysis()(dispatch)
}

// delete a mapping
export const deleteMappingById = (mappingId) => async dispatch => api.deleteMappingById(mappingId).then(res => {
  dispatch({type: types.APP_MATRIX_MAPPING_LIST_REMOVE, key: "id", value: mappingId})
  resetMapping()(dispatch)
})

// show duplicate mapping modal
export const showDuplicateView = (show) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_DUPLICATE_SHOW_RECEIVE, show})

// set duplicate name
export const setDuplicateName = (name) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_DUPLICATE_NAME_RECEIVE, name})

// update an existing mapping
export const updateNonStandardMapping = (id, mapping) => async dispatch => api.updateNonStandardMapping(id, mapping).then(res => {
  setOriginalMapping(mapping)(dispatch)
  setSelectedMapping(mapping)(dispatch)
})

// create a new mapping
export const createNonStandardMapping = (mapping) => async dispatch => api.createNonStandardMapping(mapping).then(res => {
  dispatch({type: types.APP_MATRIX_MAPPING_LIST_SUCCESS, push: res.data})
  setOriginalMapping(res.data)(dispatch)
  setSelectedMapping(res.data)(dispatch)
  return res.data
})

// update an existing mapping
export const updateStandardMapping = (id, mapping) => async dispatch => api.updateStandardMapping(id, mapping).then(res => {
  setOriginalMapping(mapping)(dispatch)
  setSelectedMapping(mapping)(dispatch)
})

// create a new mapping
export const createStandardMapping = (mapping) => async dispatch => api.createStandardMapping(mapping).then(res => {
  dispatch({type: types.APP_MATRIX_MAPPING_LIST_SUCCESS, push: res.data})
  setOriginalMapping(res.data)(dispatch)
  setSelectedMapping(res.data)(dispatch)
  return res.data
})

// select by mapping
export const setSelectedMappingGroupIndex = (groupIndex) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_GROUP_SELECTED_RECEIVE, groupIndex: groupIndex || 0})

// retrieve a matrix analysis
export const getNonStandardMatrixAnalysis = (matrixAnalysisId) => (dispatch) => api.getNonStandardMatrixAnalysis(matrixAnalysisId).then(res => dispatch({type: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_SUCCESS, resource: res.data}))

// retrieve a matrix analysis
export const getStandardMatrixAnalysis = () => (dispatch) => api.getStandardMatrixAnalysis().then(res => dispatch({type: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_SUCCESS, resource: res.data}))

// reset matrix analysis
export const resetMatrixAnalysis = () => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_SUCCESS, resource: null})

// show/hide matrix analysis detail mode
export const setMatrixAnalysisDetailMode = (show) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_SHOW_DETAIL, show: show})

// set tab selected
export const setTabSelectedForMapping = (tabIndex) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_COLUMN_MAPPING_TAB_SELECTED_RECEIVE, tabIndex})

// set filter for mapping names
export const setFilterForMappingNames = (filter) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_COLUMN_MAPPING_FILTER_BY_NAME_RECEIVE, filter})

// set automapping mode
export const setAutoMapping = (autoMapping) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_AUTO_MAPPING_REQUEST, autoMapping})

// update existing tab mapping
export const updateMappingColumns = (groupIndex, tabIndex, mappingColumns)  => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_UPDATE_TAB_MAPPING_RECEIVE, groupIndex, tabIndex, mappingColumns})

// create new mapping for sheet
export const pushMappingColumns = (groupIndex, sheetIndex, mappingColumns)  => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_PUSH_TAB_MAPPING_RECEIVE, groupIndex, sheetIndex, mappingColumns})

export const pushTransformationColumns = (groupIndex, sheetIndex, transformations)  => (dispatch) => dispatch({type: types.APP_MATRIX_MAPPING_PUSH_TAB_TRANSFORMATIONS_RECEIVE, groupIndex, sheetIndex, transformations})

export const setTransformationColumns = (groupIndex, tab)  => (dispatch) => dispatch({type: types.APP_MATRIX_MAPPING_SET_TAB_MAPPING_RECEIVE, groupIndex, tab})

// Get trade items properties by trade item category and group
export const getPropertiesByGroupAndTradeItemCategory = (taxonomyId, group, tradeItemCategoryCode) => async dispatch => call(dispatch, () => propertiesApi.getTradeItemPropertiesByGroupCodeAndTradeItemCategory(taxonomyId, group, tradeItemCategoryCode), {
  REQUEST: types.APP_MATRIX_MAPPING_PROPERTIES_LIST_REQUEST,
  FAILURE: types.APP_MATRIX_MAPPING_PROPERTIES_LIST_FAILURE,
}).then(properties => dispatch({type: types.APP_MATRIX_MAPPING_PROPERTIES_LIST_SUCCESS, results: properties}))

// create new matrix analysis mode
export const creatingNewMatrixAnalysis = (creating)  => async dispatch => {
  dispatch({type: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_CREATE, creating})
  uploadMatrixAnalysis(creating)(dispatch)
}

// set mapping discriminator
export const setMappingDiscriminator = (discriminator)  => dispatch => dispatch({type: types.APP_MATRIX_MAPPING_DISCRIMINATOR_SET, discriminator})

// create new matrix analysis
export const uploadNewFileForAnalysis = (data)  => async dispatch => api.uploadFile(data).then(res => res.data)

// set file upload receive
export const setFileUploadReceive = (data)  => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_FILE_UPLOAD_RECEIVE, data})

// set matrix under edition
export const setMatrixAnalysisUnderEdition = (resource)  => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_EDIT_SUCCESS, resource})

// save matrix analysis
export const saveStandardMatrixAnalysis = (matrix)  => (dispatch) => api.saveStandardMatrixAnalysis(matrix).then(res => {
  setMatrixAnalysisUnderEdition(null)(dispatch)
  return res.data
})

// save matrix analysis
export const saveNonStandardMatrixAnalysis = (matrix)  => (dispatch) => api.saveNonStandardMatrixAnalysis(matrix).then(res => {
  setMatrixAnalysisUnderEdition(null)(dispatch)
  return res.data
})

// fetch properties groups
export const getCreationPropertiesGroups = () => async dispatch => call(dispatch, () => propertiesApi.getTradeItemPropertiesGroups(), {
  REQUEST: types.APP_MATRIX_MAPPING_CREATE_GROUP_LIST_REQUEST,
  FAILURE: types.APP_MATRIX_MAPPING_CREATE_GROUP_LIST_FAILURE,
}).then(groups => dispatch({type: types.APP_MATRIX_MAPPING_CREATE_GROUP_LIST_SUCCESS, results: groups})).then(r => r.results)

// fetch properties trade item categories
export const getCreationTradeItemCategories = () => async dispatch => call(dispatch, () => tradeItemCategoriesApi.getTradeItemCategories(), {
  REQUEST: types.APP_MATRIX_MAPPING_CREATE_TRADE_ITEM_CATEGORY_LIST_REQUEST,
  FAILURE: types.APP_MATRIX_MAPPING_CREATE_TRADE_ITEM_CATEGORY_LIST_FAILURE,
}).then(tradeItemCategories => dispatch({type: types.APP_MATRIX_MAPPING_CREATE_TRADE_ITEM_CATEGORY_LIST_SUCCESS, results: tradeItemCategories})).then(r => r.results)

// fetch properties taxonomies
export const getCreationTaxonomies = () => async dispatch => call(dispatch, () => taxonomyApi.getTaxonomies(), {
  REQUEST: types.APP_MATRIX_MAPPING_CREATE_TAXONOMY_LIST_REQUEST,
  FAILURE: types.APP_MATRIX_MAPPING_CREATE_TAXONOMY_LIST_FAILURE,
}).then(taxonomies => dispatch({type: types.APP_MATRIX_MAPPING_CREATE_TAXONOMY_LIST_SUCCESS, results: taxonomies})).then(r => r.results)

// create a new mapping
export const creatingNewMapping = (show) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_CREATE_SHOW_RECEIVE, show})

// create a new mapping
export const uploadMatrixAnalysis = (show) => async dispatch => {
  dispatch({type: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_UPLOAD_FILE_START, show})
  if(!show) setFileUploadReceive(null)(dispatch)
}

// set mapping being created
export const setNewMapping = (mapping) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_CREATE_MAPPING_RECEIVE, mapping})

// trigger new matrix mapping view
export const startCreatingNewMapping = (matrixAnalysisId, discriminator)  => async dispatch => {
  creatingNewMapping(true)(dispatch)
  Promise.all([
    getCreationPropertiesGroups()(dispatch), 
    getCreationTaxonomies()(dispatch), 
    getCreationTradeItemCategories()(dispatch)])
      .then(values => {
        setNewMapping(utils.initNewMapping(matrixAnalysisId, discriminator, values[0]))(dispatch)
      }
  )
}

// creation done
export const createNewMapping = (mapping) => (dispatch) => {
  let apiUrl = null
  if (mapping.discriminator === 'StandardMappingViewModel') {
    apiUrl = createStandardMapping(mapping)(dispatch)
  } else apiUrl = createNonStandardMapping(mapping)(dispatch)
  apiUrl.then(newMapping => {
    creatingNewMapping(false)(dispatch)
    setMatrixAnalysisUnderEdition(null)(dispatch)
    creatingNewMatrixAnalysis(false)(dispatch)
    dispatch({type: types.APP_MATRIX_MAPPING_CREATE_GROUP_LIST_RESET})
    dispatch({type: types.APP_MATRIX_MAPPING_CREATE_TRADE_ITEM_CATEGORY_LIST_RESET})
  })
}

// set current property mapping
export const setPropertyMappingEdit = (resource) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_PROPERTY_MAPPING_SUCCESS, resource})

// set current property mapping add mode
export const setPropertyMappingEditMapName = (mapName) => async dispatch => dispatch({type: types.APP_MATRIX_MAPPING_PROPERTY_MAPPING_MAP_NAME_RECEIVE, mapName})

// set current property mapping
export const startPropertyMappingEdit = (resource) => async dispatch => {
  setPropertyMappingEdit(resource)(dispatch)
  dispatch({type: types.APP_MATRIX_MAPPING_PROPERTY_MAPPING_SHOW_RECEIVE, show: true})
}

// reset current property mapping
export const cancelPropertyMappingEdit = () => async dispatch => {
  dispatch({type: types.APP_MATRIX_MAPPING_PROPERTY_MAPPING_RESET})
  dispatch({type: types.APP_MATRIX_MAPPING_PROPERTY_MAPPING_SHOW_RECEIVE, show: false})
  setPropertyMappingEditMapName(null)(dispatch)
}

// update an existing property mapping
export const updatePropertyMapping = (groupIndex, tabIndex, propertyMappingIndex, propertyMapping) => async dispatch => {
    return dispatch({
    type: types.APP_MATRIX_MAPPING_UPDATE_TAB_MAPPING_PROPERTY_UPDATE_RECEIVE,
    groupIndex,
    tabIndex,
    propertyMappingIndex,
    propertyMapping
  })
}

// create a new property mapping
export const createPropertyMapping = (groupIndex, tabIndex, propertyMapping) => async dispatch => { 
  return dispatch({
    type: types.APP_MATRIX_MAPPING_UPDATE_TAB_MAPPING_PROPERTY_CREATE_RECEIVE,
    groupIndex,
    tabIndex: tabIndex === -1 ? 0 : tabIndex,
    propertyMapping
  })
}


// delete all properties mappings
export const deletePropertiesMappings = (groupIndex, tabIndex) => async dispatch => {
  dispatch({
  type: types.APP_MATRIX_MAPPING_UPDATE_TAB_MAPPING_PROPERTY_CLEAR_ALL_RECEIVE,
  groupIndex,
  tabIndex
})
}

// delete one property mapping
export const deletePropertyMapping = (groupIndex, tabIndex, propertyMappingIndex) => async dispatch => {
  dispatch({
    type: types.APP_MATRIX_MAPPING_UPDATE_TAB_MAPPING_PROPERTY_CLEAR_RECEIVE,
    groupIndex,
    tabIndex,
    propertyMappingIndex
  })
}

// Standard CRUD----------------->
//
// create a new standard property mapping
// create a new property mapping
export const createStandardPropertyMapping = (groupIndex, tabIndex, propertyMapping) => (dispatch, getState) => {
  if(tabIndex === -1) dispatch(pushTransformationColumns(groupIndex, selectors.getColumnsMappingTabSelectedIndex(getState()), []))
  return dispatch({
    type: types.APP_MATRIX_MAPPING_UPDATE_TAB_TRANSFORMATION_CREATE_RECEIVE,
    groupIndex,
    tabIndex: tabIndex === -1 ? 0 : tabIndex,
    propertyMapping
  })
}

// update an existing standard property mapping
export const updateStandardPropertyMapping = (groupIndex, tabIndex, propertyMappingIndex, propertyMapping) => (dispatch) => dispatch({
  type: types.APP_MATRIX_MAPPING_UPDATE_TAB_TRANSFORMATION_UPDATE_RECEIVE,
  groupIndex,
  tabIndex,
  propertyMappingIndex,
  propertyMapping
})

// delete all standard properties mappings
export const deleteStandardPropertiesMappings = (groupIndex, tabIndex) => (dispatch) => dispatch({
  type: types.APP_MATRIX_MAPPING_UPDATE_TAB_TRANSFORMATION_CLEAR_ALL_RECEIVE,
  groupIndex,
  tabIndex
})

// delete one standard property mapping
export const deleteStandardPropertyMapping = (groupIndex, tabIndex, propertyMappingIndex) => (dispatch) => dispatch({
  type: types.APP_MATRIX_MAPPING_UPDATE_TAB_TRANSFORMATION_CLEAR_RECEIVE,
  groupIndex,
  tabIndex,
  propertyMappingIndex
})


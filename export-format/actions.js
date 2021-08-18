import update from "immutability-helper"
import get from "lodash/get"
import map from "lodash/map"
import call from "../common/actions/call"
import dotProp from "dot-prop-immutable"
import { getByTaxonomyIdAndTradeItemCategoryCode } from "../common/services/businessRules"
import * as transformationManagementApi from "../common/services/transformationManagement"
import * as api from "../common/services/exportFormats"
import * as taxonomyApi from "../common/services/taxonomy"
import {
  getTradeItemPropertiesGroups,
  getTradeItemPropertiesLightByTaxonomyIdAndPropertyGroupCodeAndTradeItemCategoryCode
} from "../common/services/tradeItemProperties"
import {
  getTradeItemCategories
} from "../common/services/tradeItemCategories"
import * as types from "./types"
import * as selectors from "./selectors"

// Load formats
//
export const loadFormats = () => async dispatch => {
  const results = await call(dispatch, () => api.getFormats({ PageNumber: 0, PageSize: 999 }), {
    REQUEST: types.EXPORT_FORMAT_FORMATS_REQUEST,
    FAILURE: types.EXPORT_FORMAT_FORMATS_FAILURE
  })
  dispatch({ type: types.EXPORT_FORMAT_FORMATS_SUCCESS, results })
}

// Reset formats
//
export const resetFormats = () => ({ type: types.EXPORT_FORMAT_FORMATS_RESET })


// Load new format
//
export const loadNewFormat = () => ({
  type: types.EXPORT_FORMAT_FORMAT_SUCCESS,
  resource: {
    name: "",
    discriminator: "TemplateFormatConfigurationViewModel",
    orderedFormatConfigurations: []
  }
})

// Upload files
//
const uploadFiles = async (id, format) => {
  let updates = []
  for (let i = 0; i < format.orderedFormatConfigurations.length; i++) {
    const f = format.orderedFormatConfigurations[i]
    if (!(f.fileLocation instanceof File)) continue;
    const fileLocation = (await api.uploadExcel(id, f.id, f.fileLocation)).data
    updates.push([i, fileLocation])
  }
  return updates
}

// Create format
//
export const createFormat = format => async dispatch => {
  const r = await api.createFormat(dotProp.set(format, 'orderedFormatConfigurations', confs => map(confs, c => dotProp.set(c, 'fileLocation', null))))
  const res = r.data

  let newObj = update(format, { id: { $set: res } })

  const updates = await uploadFiles(res.id, format)
  for (const x of updates) {
    const [i, fileLocation] = x
    newObj = update(newObj, {
      orderedFormatConfigurations: { [i]: { fileLocation: { $set: fileLocation } } }
    })
  }

  dispatch(editFormat(newObj))
  return res.id
}

// Update format
//
export const updateFormat = format => async dispatch => {
  let newObj = format
  const updates = await uploadFiles(format.id, format)
  for (const x of updates) {
    const [i, fileLocation] = x
    newObj = update(newObj, {
      orderedFormatConfigurations: { [i]: { fileLocation: { $set: fileLocation } } }
    })
  }
  await api.updateFormat(format)
  return dispatch(editFormat(newObj))
}


// Duplicate format
//
export const duplicateFormat = format => async dispatch => {
  const data  = await dispatch(createFormat(update(format, {
    name: {$set: `${format.name} [TO CHANGE]`},
    id: {$set: null},
  })))
  return data.id
  
}


// Reset format
//
export const resetFormat = () => ({ type: types.EXPORT_FORMAT_FORMAT_RESET })

// Delete format by id
//
export const deleteFormatById = id => dispatch => api.deleteFormatById(id).then(
  res => dispatch({type: types.EXPORT_FORMAT_FORMATS_REMOVE, key: 'id', value: id})
)

// Edit format
//
export const editFormat = newObject => ({
  type: types.EXPORT_FORMAT_FORMAT_SUCCESS,
  resource: newObject
})

// Load taxonomies
//
export const loadTaxonomies = () => async (dispatch) => {
  const results = await call(dispatch, () => taxonomyApi.getTaxonomies(), {
    REQUEST: types.EXPORT_FORMAT_TAXONOMY_REQUEST,
    FAILURE: types.EXPORT_FORMAT_TAXONOMY_FAILURE
  })
  dispatch({ type: types.EXPORT_FORMAT_TAXONOMY_SUCCESS, results })
}

// Load trade item categories
//
export const loadTradeItemCategories = () => async (dispatch) => {
  const results = await call(dispatch, () => getTradeItemCategories(), {
    REQUEST: types.EXPORT_FORMAT_TRADE_ITEM_CATEGORY_REQUEST,
    FAILURE: types.EXPORT_FORMAT_TRADE_ITEM_CATEGORY_FAILURE
  })
  dispatch({ type: types.EXPORT_FORMAT_TRADE_ITEM_CATEGORY_SUCCESS, results })
}

// Load trade item properties
//
export const loadTradeItemProperties = () => async (dispatch, getState) => {
  const format = selectors.getFormatObject(getState())
  const taxonomyId = get(format, "taxonomyId", null)
  const tradeItemCategoryCode = get(format, "tradeItemCategory.code", null)
  const propertyGroupCode = get(format, "discriminator") === "ExcelFormatConfigurationViewModel" ? get(selectors.getExcelSheetMapping(getState()), "propertyGroupCode", null) : null
  if(!tradeItemCategoryCode || !propertyGroupCode || !taxonomyId) return;
  const results = await call(dispatch, () => getTradeItemPropertiesLightByTaxonomyIdAndPropertyGroupCodeAndTradeItemCategoryCode({taxonomyId, propertyGroupCode, tradeItemCategoryCode}), {
    REQUEST: types.EXPORT_FORMAT_TRADE_ITEM_PROPERTIES_REQUEST,
    FAILURE: types.EXPORT_FORMAT_TRADE_ITEM_PROPERTIES_FAILURE
  })
  dispatch({ type: types.EXPORT_FORMAT_TRADE_ITEM_PROPERTIES_SUCCESS, results })
}

// Load transformations properties
//
export const loadTransformationsProperties = () => async (dispatch, getState) => {
  const transformationSetId = get(selectors.getFormatObject(getState()), "transformationSetId", null)
  if(!transformationSetId) return;
  const results = await call(dispatch, () => transformationManagementApi.getTransformationNameByTransformationSetId(transformationSetId), {
    REQUEST: types.EXPORT_FORMAT_TRANSFORMATIONS_PROPERTIES_REQUEST,
    FAILURE: types.EXPORT_FORMAT_TRANSFORMATIONS_PROPERTIES_FAILURE
  })
  dispatch({ type: types.EXPORT_FORMAT_TRANSFORMATIONS_PROPERTIES_SUCCESS, results })
}

// Load transformations properties & trade item properties
//
export const loadProperties = () => async (dispatch, getState) => {
  loadTradeItemProperties()(dispatch, getState)
  loadTransformationsProperties()(dispatch, getState)
  loadBusinessRulesets()(dispatch, getState)
}


// // Load business rules
// //
// export const loadBusinessRules = () => async dispatch => {
//   const results = await call(dispatch, () => getBusinessRules(), {
//     REQUEST: types.EXPORT_FORMAT_BUSINESS_RULES_REQUEST,
//     FAILURE: types.EXPORT_FORMAT_BUSINESS_RULES_FAILURE
//   })
//   dispatch({ type: types.EXPORT_FORMAT_BUSINESS_RULES_SUCCESS, results })
// }

// Load business rule sets
//
export const loadBusinessRulesets = () => async (dispatch, getState) => {
  const tradeItemCategoryCode = get(selectors.getFormatObject(getState()), "tradeItemCategory.code", null)
  const taxonomyId = get(selectors.getFormatObject(getState()), "taxonomyId", null)
  if(!tradeItemCategoryCode || !taxonomyId) return;
  const results = await call(dispatch, () => getByTaxonomyIdAndTradeItemCategoryCode(taxonomyId, tradeItemCategoryCode), {
    REQUEST: types.EXPORT_FORMAT_BUSINESS_RULESETS_REQUEST,
    FAILURE: types.EXPORT_FORMAT_BUSINESS_RULESETS_FAILURE
  })
  dispatch({ type: types.EXPORT_FORMAT_BUSINESS_RULESETS_SUCCESS, results })
}

// Load property groups
//
export const loadPropertyGroups = () => async dispatch => {
  const results = await call(dispatch, () => getTradeItemPropertiesGroups(), {
    REQUEST: types.EXPORT_FORMAT_PROPERTY_GROUPS_REQUEST,
    FAILURE: types.EXPORT_FORMAT_PROPERTY_GROUPS_FAILURE
  })
  dispatch({ type: types.EXPORT_FORMAT_PROPERTY_GROUPS_SUCCESS, results })
}

// Load property groups
//
export const loadTransformationSetsByTradeItemCategoryCodeAndTaxonomyId = (taxonomyId, tradeItemCategoryCode) => dispatch => call(dispatch, () => transformationManagementApi.getTransformationSetsByTradeItemCategoryCode(taxonomyId, tradeItemCategoryCode), {
    REQUEST: types.EXPORT_FORMAT_TRANSFORMATION_SET_REQUEST,
    FAILURE: types.EXPORT_FORMAT_TRANSFORMATION_SET_FAILURE
  }).then(res => {
    dispatch({ type: types.EXPORT_FORMAT_TRANSFORMATION_SET_SUCCESS, results: res })
  })
  

// Load format
//
export const loadFormat = id => async dispatch => {
  const responseData = await call(dispatch, () => api.getFormatById(id), {
    REQUEST: types.EXPORT_FORMAT_FORMAT_REQUEST,
    FAILURE: types.EXPORT_FORMAT_FORMAT_FAILURE
  })
  if(responseData.tradeItemCategory && responseData.tradeItemCategory.code && responseData.taxonomyId) dispatch(loadTransformationSetsByTradeItemCategoryCodeAndTaxonomyId(responseData.taxonomyId, responseData.tradeItemCategory.code))
  return dispatch({
    type: types.EXPORT_FORMAT_FORMAT_SUCCESS,
    resource: responseData
  })
}

export const setExcelSheetMapping = sheetMapping => dispatch => dispatch({ type: types.EXPORT_FORMAT_TRANSFORMATION_EXCEL_SHEET_MAPPING, sheetMapping })
export const resetExcelSheetMapping = sheetMapping => dispatch => dispatch({ type: types.EXPORT_FORMAT_TRANSFORMATION_EXCEL_SHEET_MAPPING, sheetMapping: null })

export const setExcelSheetConfigurationMapping = sheetConfiguration => dispatch => dispatch({ type: types.EXPORT_FORMAT_TRANSFORMATION_EXCEL_SHEET_CONFIGURATION, sheetConfiguration })
export const resetExcelSheetConfigurationMapping = sheetConfiguration => dispatch => dispatch({ type: types.EXPORT_FORMAT_TRANSFORMATION_EXCEL_SHEET_CONFIGURATION, sheetConfiguration: null })
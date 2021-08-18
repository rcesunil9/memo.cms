import { combineReducers } from 'redux'
import update from 'immutability-helper'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import createReducer from "../common/reducers/createReducer"
import createList from "../common/reducers/createList"
import createResource from "../common/reducers/createResource"
import * as types from './types'

const mappingsActions = {
  RESET: types.APP_MATRIX_MAPPING_LIST_RESET,
  REQUEST: types.APP_MATRIX_MAPPING_LIST_REQUEST,
  SUCCESS: types.APP_MATRIX_MAPPING_LIST_SUCCESS,
  FAILURE: types.APP_MATRIX_MAPPING_LIST_FAILURE,
  INVALIDATE: types.APP_MATRIX_MAPPING_LIST_INVALIDATE,
  REMOVE: types.APP_MATRIX_MAPPING_LIST_REMOVE,
}

const listPropertiesActions = {
  RESET: types.APP_MATRIX_MAPPING_PROPERTIES_LIST_RESET,
  REQUEST: types.APP_MATRIX_MAPPING_PROPERTIES_LIST_REQUEST,
  SUCCESS: types.APP_MATRIX_MAPPING_PROPERTIES_LIST_SUCCESS,
  FAILURE: types.APP_MATRIX_MAPPING_PROPERTIES_LIST_FAILURE,
  INVALIDATE: types.APP_MATRIX_MAPPING_PROPERTIES_LIST_INVALIDATE,
  REMOVE: types.APP_MATRIX_MAPPING_PROPERTIES_LIST_REMOVE,
}

const createMappingGroupsActions = {
  RESET: types.APP_MATRIX_MAPPING_CREATE_GROUP_LIST_RESET,
  REQUEST: types.APP_MATRIX_MAPPING_CREATE_GROUP_LIST_REQUEST,
  SUCCESS: types.APP_MATRIX_MAPPING_CREATE_GROUP_LIST_SUCCESS,
  FAILURE: types.APP_MATRIX_MAPPING_CREATE_GROUP_LIST_FAILURE,
  INVALIDATE: types.APP_MATRIX_MAPPING_CREATE_GROUP_LIST_INVALIDATE,
  REMOVE: types.APP_MATRIX_MAPPING_CREATE_GROUP_LIST_REMOVE,
}

const createMappingTradeItemCategoriesActions = {
  RESET: types.APP_MATRIX_MAPPING_CREATE_TRADE_ITEM_CATEGORY_LIST_RESET,
  REQUEST: types.APP_MATRIX_MAPPING_CREATE_TRADE_ITEM_CATEGORY_LIST_REQUEST,
  SUCCESS: types.APP_MATRIX_MAPPING_CREATE_TRADE_ITEM_CATEGORY_LIST_SUCCESS,
  FAILURE: types.APP_MATRIX_MAPPING_CREATE_TRADE_ITEM_CATEGORY_LIST_FAILURE,
  INVALIDATE: types.APP_MATRIX_MAPPING_CREATE_TRADE_ITEM_CATEGORY_LIST_INVALIDATE,
  REMOVE: types.APP_MATRIX_MAPPING_CREATE_TRADE_ITEM_CATEGORY_LIST_REMOVE,
}

const createMappingTaxonomiesActions = {
  RESET: types.APP_MATRIX_MAPPING_CREATE_TAXONOMY_LIST_RESET,
  REQUEST: types.APP_MATRIX_MAPPING_CREATE_TAXONOMY_LIST_REQUEST,
  SUCCESS: types.APP_MATRIX_MAPPING_CREATE_TAXONOMY_LIST_SUCCESS,
  FAILURE: types.APP_MATRIX_MAPPING_CREATE_TAXONOMY_LIST_FAILURE,
  INVALIDATE: types.APP_MATRIX_MAPPING_CREATE_TAXONOMY_LIST_INVALIDATE,
  REMOVE: types.APP_MATRIX_MAPPING_CREATE_TAXONOMY_LIST_REMOVE,
}

const matrixAnalysisActions = {
  RESET: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_RESET,
  SUCCESS: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_SUCCESS,
}

const editMatrixAnalysisActions = {
  RESET: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_EDIT_RESET,
  SUCCESS: types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_EDIT_SUCCESS,
}

const propertyMappingActions = {
  RESET: types.APP_MATRIX_MAPPING_PROPERTY_MAPPING_RESET,
  SUCCESS: types.APP_MATRIX_MAPPING_PROPERTY_MAPPING_SUCCESS,
}

const existingMappings = combineReducers({
  mappings: createList(mappingsActions),
  originalMapping: createReducer(null, {[types.APP_MATRIX_MAPPING_ORIGINAL_MAPPING_RECEIVE]: (state, action) => action.mapping || null}),
  selected: createReducer(null, {
    [types.APP_MATRIX_MAPPING_SELECTED_RECEIVE]: (state, action) => action.mapping || null,
    [types.APP_MATRIX_MAPPING_UPDATE_TAB_MAPPING_RECEIVE]: (state, action) => {
      const idx = findIndex(get(state, 'mappingGroups', []), g => g.groupIndex === action.groupIndex)
      return update(state, {
        "mappingGroups": {
          [idx]: {
            "mappingTabs": {
              [action.tabIndex]: {
                "mappingColumns": { $set: action.mappingColumns }
              }
            }
          }
        }
    })},
    [types.APP_MATRIX_MAPPING_PUSH_TAB_MAPPING_RECEIVE]: (state, action) => {
      const idx = findIndex(get(state, 'mappingGroups', []), g => g.groupIndex === action.groupIndex)
      return update(state, {
        "mappingGroups": {
          [idx]: {
            "mappingTabs": {
              $push: [
                {
                  sheetIndex: action.sheetIndex,
                  mappingColumns: action.mappingColumns
                }
              ]
            }
          }
        }
    })},
    [types.APP_MATRIX_MAPPING_SET_TAB_MAPPING_RECEIVE]: (state, action) => {
      const idx = findIndex(get(state, 'mappingGroups', []), g => g.groupIndex === action.groupIndex)
      return update(state, {
        "mappingGroups": {
          [idx]: {
            "mappingTabs": {
              $set: action.tab
            }
          }
        }
      })
    },
    [types.APP_MATRIX_MAPPING_PUSH_TAB_TRANSFORMATIONS_RECEIVE]: (state, action) => update(state, {
      "mappingGroups": {
        [action.groupIndex]: {
          "mappingTabs": {
            $push: [
              {
                sheetIndex: action.sheetIndex,
                transformations: action.transformations
              }
            ]
          }
        }
      }
    }),
    // Non-standard mapping
    [types.APP_MATRIX_MAPPING_UPDATE_TAB_MAPPING_PROPERTY_CREATE_RECEIVE]: (state, action) => update(state, {
      "mappingGroups": {
        [action.groupIndex]: {
          "mappingTabs": {
            [action.tabIndex]: {
              "mappingColumns": { $push: [action.propertyMapping] }
            }
          }
        }
      }
    }),
    [types.APP_MATRIX_MAPPING_UPDATE_TAB_MAPPING_PROPERTY_UPDATE_RECEIVE]: (state, action) => update(state, {
      "mappingGroups": {
        [action.groupIndex]: {
          "mappingTabs": {
            [action.tabIndex]: {
              "mappingColumns": {
                [action.propertyMappingIndex]: { $set: action.propertyMapping }
              }
            }
          }
        }
      }
    }),
    [types.APP_MATRIX_MAPPING_UPDATE_TAB_MAPPING_PROPERTY_CLEAR_ALL_RECEIVE]: (state, action) => update(state, {
      "mappingGroups": {
        [action.groupIndex]: {
          "mappingTabs": {
            [action.tabIndex]: {
              "mappingColumns": {$set: []}
            }
          }
        }
      }
    }),
    [types.APP_MATRIX_MAPPING_UPDATE_TAB_MAPPING_PROPERTY_CLEAR_RECEIVE]: (state, action) => update(state, {
      "mappingGroups": {
        [action.groupIndex]: {
          "mappingTabs": {
            [action.tabIndex]: {
              "mappingColumns": {
                $splice: [[action.propertyMappingIndex, 1]]
              }
            }
          }
        }
      }
    }),
    // Standard mapping
    [types.APP_MATRIX_MAPPING_UPDATE_TAB_TRANSFORMATION_CREATE_RECEIVE]: (state, action) => update(state, {
      "mappingGroups": {
        [action.groupIndex]: {
          "mappingTabs": {
            [action.tabIndex]: {
              "transformations": { $push: [action.propertyMapping] }
            }
          }
        }
      }
    }),
    [types.APP_MATRIX_MAPPING_UPDATE_TAB_TRANSFORMATION_UPDATE_RECEIVE]: (state, action) => update(state, {
      "mappingGroups": {
        [action.groupIndex]: {
          "mappingTabs": {
            [action.tabIndex]: {
              "transformations": {
                [action.propertyMappingIndex]: { $set: action.propertyMapping }
              }
            }
          }
        }
      }
    }),
    [types.APP_MATRIX_MAPPING_UPDATE_TAB_TRANSFORMATION_CLEAR_ALL_RECEIVE]: (state, action) => update(state, {
      "mappingGroups": {
        [action.groupIndex]: {
          "mappingTabs": {
            [action.tabIndex]: {
              "transformations": {$set: []}
            }
          }
        }
      }
    }),
    [types.APP_MATRIX_MAPPING_UPDATE_TAB_TRANSFORMATION_CLEAR_RECEIVE]: (state, action) => update(state, {
      "mappingGroups": {
        [action.groupIndex]: {
          "mappingTabs": {
            [action.tabIndex]: {
              "transformations": {
                $splice: [[action.propertyMappingIndex, 1]]
              }
            }
          }
        }
      }
    }),
  }),
})

const createMapping = combineReducers({
  show: createReducer(false, {[types.APP_MATRIX_MAPPING_CREATE_SHOW_RECEIVE]: (state, action) => action.show}),
  mapping: createReducer(null, {[types.APP_MATRIX_MAPPING_CREATE_MAPPING_RECEIVE]: (state, action) => action.mapping}),
  groups: createList(createMappingGroupsActions),
  tradeItemCategories: createList(createMappingTradeItemCategoriesActions),
  taxonomies: createList(createMappingTaxonomiesActions),
})

const duplicateMapping = combineReducers({
  show: createReducer(false, {[types.APP_MATRIX_MAPPING_DUPLICATE_SHOW_RECEIVE]: (state, action) => action.show}),
  name: createReducer("", {[types.APP_MATRIX_MAPPING_DUPLICATE_NAME_RECEIVE]: (state, action) => action.name}),
})

const mappingGroups = combineReducers({
  selected: createReducer(0, {[types.APP_MATRIX_MAPPING_GROUP_SELECTED_RECEIVE]: (state, action) => action.groupIndex || 0}),
})

const matrixAnalysis = combineReducers({
  current: createResource(matrixAnalysisActions),
  showDetail: createReducer(false, {[types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_SHOW_DETAIL]: (state, action) => action.show}),
  matrixUnderEdition: createResource(editMatrixAnalysisActions),
  creating: createReducer(false, {[types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_CREATE]: (state, action) => action.creating}),
  uploadFile: createReducer(false, {[types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_UPLOAD_FILE_START]: (state, action) => action.show}),
  discriminator: createReducer(null, {[types.APP_MATRIX_MAPPING_DISCRIMINATOR_SET]: (state, action) => action.discriminator}),
  fileUploadData: createReducer(null, {[types.APP_MATRIX_MAPPING_MATRIX_ANALYSIS_FILE_UPLOAD_RECEIVE]: (state, action) => action.data}),
})

const columnsMapping = combineReducers({
  tabSelected: createReducer(null, {[types.APP_MATRIX_MAPPING_COLUMN_MAPPING_TAB_SELECTED_RECEIVE]: (state, action) => action.tabIndex}),
  filterByName: createReducer(null, {[types.APP_MATRIX_MAPPING_COLUMN_MAPPING_FILTER_BY_NAME_RECEIVE]: (state, action) => action.filter}),
  autoMapping: createReducer(false, {[types.APP_MATRIX_MAPPING_AUTO_MAPPING_REQUEST]: (state, action) => action.autoMapping}),
})

const tradeItemProperties = combineReducers({
  results: createList(listPropertiesActions),
})

const editPropertyMapping = combineReducers({
  propertyMapping: createResource(propertyMappingActions),
  selectedMapName: createReducer(null, {[types.APP_MATRIX_MAPPING_PROPERTY_MAPPING_MAP_NAME_RECEIVE]: (state, action) => action.mapName}),
  show: createReducer(false, {[types.APP_MATRIX_MAPPING_PROPERTY_MAPPING_SHOW_RECEIVE]: (state, action) => action.show}),
})

// Combine reducer to get default reducer
//
export default combineReducers({
  existingMappings,
  duplicateMapping,
  createMapping,
  mappingGroups,
  matrixAnalysis,
  columnsMapping,
  tradeItemProperties,
  editPropertyMapping
})

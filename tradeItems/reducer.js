import { combineReducers } from 'redux'
import dotProp from "dot-prop-immutable"
import createReducer from "../common/reducers/createReducer"
import createList from "../common/reducers/createList"
import * as types from './types'
import { getDefaultFilters } from './utils'

// List reducer
//
const listActions = {
  RESET: types.APP_TRADE_ITEMS_LIST_RESET,
  REQUEST: types.APP_TRADE_ITEMS_LIST_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_LIST_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_LIST_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_LIST_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_LIST_REMOVE,
}

const list = combineReducers({
  results: createList(listActions),
  total: createReducer(0, {[types.APP_TRADE_ITEMS_TOTAL_RECEIVE]: (state, action) => action.total || 0}),
  filters: createReducer(getDefaultFilters(), {[types.APP_TRADE_ITEMS_FILTERS_RECEIVE]: (state, action) => action.filters || getDefaultFilters()}),
  showFilters: createReducer(false, {[types.APP_TRADE_ITEMS_FILTERS_SHOW]: (state, action) => action.showFilters || false})
})

// Edit reducer
//
const languagesActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_LANGUAGES_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_LANGUAGES_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_LANGUAGES_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_LANGUAGES_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_LANGUAGES_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_EDIT_LANGUAGES_REMOVE,
}

const tradeItemPropertiesActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_PROPERTIES_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_PROPERTIES_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_PROPERTIES_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_PROPERTIES_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_PROPERTIES_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_PROPERTIES_REMOVE,
}

const manufacturersActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_MANUFACTURER_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_MANUFACTURER_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_MANUFACTURER_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_MANUFACTURER_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_MANUFACTURER_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_EDIT_MANUFACTURER_REMOVE,
}

const imageCategoriesActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_IMAGE_CATEGORIES_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_IMAGE_CATEGORIES_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_IMAGE_CATEGORIES_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_IMAGE_CATEGORIES_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_IMAGE_CATEGORIES_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_EDIT_IMAGE_CATEGORIES_REMOVE,
}

const imagePlungeAnglesActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_IMAGE_PLUNGE_ANGLES_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_IMAGE_PLUNGE_ANGLES_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_IMAGE_PLUNGE_ANGLES_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_IMAGE_PLUNGE_ANGLES_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_IMAGE_PLUNGE_ANGLES_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_EDIT_IMAGE_PLUNGE_ANGLES_REMOVE,
}

const imageFacingTypesActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_IMAGE_FACING_TYPES_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_IMAGE_FACING_TYPES_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_IMAGE_FACING_TYPES_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_IMAGE_FACING_TYPES_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_IMAGE_FACING_TYPES_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_EDIT_IMAGE_FACING_TYPES_REMOVE,
}

const documentsActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_REMOVE,
}

const groupsActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_GROUPS_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_GROUPS_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_GROUPS_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_GROUPS_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_GROUPS_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_EDIT_GROUPS_REMOVE,
}

const tradeItemCategoriesActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_CATEGORIES_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_CATEGORIES_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_CATEGORIES_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_CATEGORIES_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_CATEGORIES_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_CATEGORIES_REMOVE,
}

const targetMarketsActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_TARGET_MARKETS_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_TARGET_MARKETS_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_TARGET_MARKETS_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_TARGET_MARKETS_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_TARGET_MARKETS_INVALIDATE,
}


const retailersActions = {
  RESET: types.APP_TRADE_ITEMS_EDIT_RETAILERS_LIST_RESET,
  REQUEST: types.APP_TRADE_ITEMS_EDIT_RETAILERS_LIST_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_EDIT_RETAILERS_LIST_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_RETAILERS_LIST_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_EDIT_RETAILERS_LIST_INVALIDATE,
}
const edit = combineReducers({  
  tradeItem: createReducer(null, {
    [types.APP_TRADE_ITEMS_EDIT_SUCCESS]: (state, action) => action.tradeItem,
    [types.APP_TRADE_ITEMS_EDIT_RESET]: (state, action) => null,
    [types.APP_TRADE_ITEMS_EDIT_CHANGE_PROPERTY]: (state, action) => dotProp.set(state, action.key, action.value),
    [types.APP_TRADE_ITEMS_EDIT_MERGE_PROPERTY]: (state, action) => dotProp.merge(state, action.key, action.value),
    [types.APP_TRADE_ITEMS_EDIT_DELETE_PROPERTY]: (state, action) => dotProp.delete(state, action.key),
  }),
  groupSelected: createReducer(null, {[types.APP_TRADE_ITEMS_EDIT_GROUP_SELECTED_RECEIVE]: (state, action) => action.group}),
  languages: createList(languagesActions),
  manufacturers: createList(manufacturersActions),
  imageCategories: createList(imageCategoriesActions),
  imagePlungeAngles: createList(imagePlungeAnglesActions),
  imageFacingTypes: createList(imageFacingTypesActions),
  documents: createList(documentsActions),
  editImage: createReducer(null, {
    [types.APP_TRADE_ITEMS_IMAGE_EDIT_SUCCESS]: (state, action) => action.image,
    [types.APP_TRADE_ITEMS_IMAGE_EDIT_RESET]: (state, action) => null,
    [types.APP_TRADE_ITEMS_IMAGE_EDIT_CHANGE_PROPERTY]: (state, action) => dotProp.set(state, action.key, action.value),
    [types.APP_TRADE_ITEMS_IMAGE_EDIT_MERGE_PROPERTY]: (state, action) => dotProp.merge(state, action.key, action.value),
    [types.APP_TRADE_ITEMS_IMAGE_EDIT_DELETE_PROPERTY]: (state, action) => dotProp.delete(state, action.key),
  }),
  editDocument: createReducer(null, {[types.APP_TRADE_ITEMS_DOCUMENT_EDIT_RECEIVE]: (state, action) => action.document || null}),
  multipleImages: createReducer(null, {
    [types.APP_TRADE_ITEMS_UPLOAD_IMAGES_RECEIVE]: (state, action) => action.multipleImages || null,
    [types.APP_TRADE_ITEMS_UPLOAD_IMAGES_CHANGE]: (state, action) => dotProp.set(state, action.key, action.value),
    [types.APP_TRADE_ITEMS_UPLOAD_IMAGES_REMOVE]: (state, action) => dotProp.delete(state, action.key),
  }),
  multipleDocuments: createReducer(null, {
    [types.APP_TRADE_ITEMS_UPLOAD_DOCUMENTS_RECEIVE]: (state, action) => action.multipleDocuments || null,
    [types.APP_TRADE_ITEMS_UPLOAD_DOCUMENTS_CHANGE]: (state, action) => dotProp.set(state, action.key, action.value),
    [types.APP_TRADE_ITEMS_UPLOAD_DOCUMENTS_REMOVE]: (state, action) => dotProp.delete(state, action.key),
  }),
  languageSelected: createReducer(null, {[types.APP_TRADE_ITEMS_EDIT_MARKETING_LANGUAGE_SELECTED_RECEIVE]: (state, action) => action.language || 0}),
  marketingIndexSelected: createReducer(0, {[types.APP_TRADE_ITEMS_EDIT_MARKETING_INDEX_SELECTED_RECEIVE]: (state, action) => action.index || 0}),
  groups: createList(groupsActions),
  tradeItemCategories: createList(tradeItemCategoriesActions),
  targetMarkets: createList(targetMarketsActions),
  retailers: createList(retailersActions),
  tradeItemProperties: createList(tradeItemPropertiesActions)
})

// Combine reducer to get default reducer
//
export default combineReducers({
  list,
  edit
})

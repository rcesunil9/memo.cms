import map from "lodash/map"
import get from "lodash/get"
import findIndex from "lodash/findIndex"
import remove from "lodash/remove"
import keyBy from "lodash/keyBy"
import size from "lodash/size"
import forEach from "lodash/forEach"
import * as indexer from '../common/services/tradeItemIndexer'
import * as storage from '../common/services/storage'
import * as manufacturersApi from '../common/services/manufacturer'
import * as targetMarketsApi from '../common/services/targetMarket'
import * as propertiesApi from '../common/services/tradeItemProperties'
import * as tradeItemCategoriesApi from '../common/services/tradeItemCategories'
import * as preComputingApi from '../common/services/preComputing'
import * as importResourceApi from '../common/services/importResource'
import * as retailerApi from '../common/services/retailer'
import * as types from './types'
import * as selectors from "./selectors"
import * as url from '../common/utils/url'
import call from "../common/actions/call"
import { isGuid } from "../common/utils/code"

const unusedGroups = ['ENRICHMENT', 'ASSORTMENT', 'CHANNELMANAGEMENT', 'ATTRIBUTESCHANNELMANAGEMENT', 'VARIANT']

function searchPrecomputingStatus(res, dispatch) {
  const tradeItemIds = map(get(res, 'results'), r => get(r, 'tradeItemId'))
  if (tradeItemIds.length) {
    preComputingApi.getTradeItemsPrecomputingStatus(tradeItemIds)
      .then(precomputingRes => {
        if (!size(get(precomputingRes, 'data.tradeItemPreComputingStatus'))) dispatch(res.results)
        const keyedData = keyBy(get(precomputingRes, 'data.tradeItemPreComputingStatus') || [], 'tradeItemId')
        const newResults = map(res.results, r => ({...r, precomputingStatus: keyedData[r.tradeItemId] ? get(keyedData[r.tradeItemId], 'status') : null}))
        dispatch(newResults) 
      })
  }
}

// TODO: remove searchTradeItems if unneeded
// Search through trade items
// Use Elasticsearch indexer
export const searchTradeItems = (lang, filters) => dispatch => call(dispatch, () => indexer.search(lang, filters), {
  REQUEST: types.APP_TRADE_ITEMS_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_LIST_FAILURE,
}).then(res => {
  dispatch({type: types.APP_TRADE_ITEMS_LIST_SUCCESS, results: res.results})
  dispatch({type: types.APP_TRADE_ITEMS_FILTERS_RECEIVE, filters: Object.assign(filters, {}, {searchAfter: res.searchAfter})})
  dispatch({type: types.APP_TRADE_ITEMS_TOTAL_RECEIVE, total: res.total})
})

// Use Elasticsearch indexer
export const fullsearchTradeItems = (lang, filters) => (dispatch, getState) => {
  if(selectors.getTradeItemsFetching(getState())) return;
  url.updateUrl(filters)
  return call(dispatch, () => indexer.fullsearch(lang, filters), {
  REQUEST: types.APP_TRADE_ITEMS_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_LIST_FAILURE,
})
.then(res => {
  dispatch({type: types.APP_TRADE_ITEMS_LIST_SUCCESS, results: res.results})
  dispatch({type: types.APP_TRADE_ITEMS_FILTERS_RECEIVE, filters: Object.assign(filters, {}, {searchAfter: res.searchAfter})})
  dispatch({type: types.APP_TRADE_ITEMS_TOTAL_RECEIVE, total: res.total})
  return res
})
// get precomputing status
.then(res => searchPrecomputingStatus(res, newResults => dispatch({type: types.APP_TRADE_ITEMS_LIST_SUCCESS, results: newResults})))}


// index all products
export const indexAll = () => dispatch => indexer.indexAll()

// index by trade item id
export const indexByIdentifier = identifier => dispatch => {
  isGuid(identifier) ? indexer.indexByTradeItemId(identifier) : indexer.indexByGtin(identifier)
}

// reset trade items
export const resetTradeItems = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_LIST_RESET})

// Load more trade items
// Use Elasticsearch indexer
export const loadMoreTradeItems = (lang, filters) => dispatch => call(dispatch, () => indexer.search(lang, filters), {
  REQUEST: types.APP_TRADE_ITEMS_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_LIST_FAILURE,
}).then(res => {
  // dispatch({type: types.APP_TRADE_ITEMS_LIST_SUCCESS, push: res.results})
  dispatch({type: types.APP_TRADE_ITEMS_FILTERS_RECEIVE, filters: Object.assign(filters, {}, {searchAfter: res.searchAfter})})
  dispatch({type: types.APP_TRADE_ITEMS_TOTAL_RECEIVE, total: res.total})
  return res
})
// get precomputing status
.then(res => searchPrecomputingStatus(res, newResults => dispatch({type: types.APP_TRADE_ITEMS_LIST_SUCCESS, push: newResults})))

// Set current trade item under edition
export const setTradeItem = (tradeItem) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_SUCCESS, tradeItem})

// Change a trade item property
export const setTradeItemProperty = (key, value) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_CHANGE_PROPERTY, key, value})
export const mergeTradeItemProperty = (key, value) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_MERGE_PROPERTY, key, value})
export const deleteTradeItemProperty = key => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_DELETE_PROPERTY, key})

// save trade item
export const saveTradeItem = tradeItem => () => storage.saveTradeItem(tradeItem)

// create trade item
export const createTradeItem = tradeItem => () => storage.createTradeItem(tradeItem)

// delete trade item
export const deleteTradeItem = tradeItemId => () => storage.deleteTradeItem(tradeItemId)

// Get trade item by its guid
export const getTradeItemById = tradeItemId => async (dispatch, getState) => storage.getTradeItemById(tradeItemId).then(res => {
  dispatch({type: types.APP_TRADE_ITEMS_EDIT_SUCCESS, tradeItem: res.data})
  return selectors.getTradeItemToEdit(getState())
})

// Load manufacturers
export const getManufacturers = (filters) => dispatch => call(dispatch, manufacturersApi.getManufacturers, {
  REQUEST: types.APP_TRADE_ITEMS_EDIT_MANUFACTURER_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_MANUFACTURER_FAILURE,
}).then(res => dispatch({type: types.APP_TRADE_ITEMS_EDIT_MANUFACTURER_SUCCESS, results: map(res, m => {return {id: m.id, name: m.name}})}))

// reset man. 
export const resetManufacturers = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_MANUFACTURER_RESET})

// Load languages
export const getLanguages = (filters) => dispatch => call(dispatch, targetMarketsApi.getLanguages, {
  REQUEST: types.APP_TRADE_ITEMS_EDIT_LANGUAGES_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_LANGUAGES_FAILURE,
}).then(res => dispatch({type: types.APP_TRADE_ITEMS_EDIT_LANGUAGES_SUCCESS, results: res}))

// reset languages
export const resetLanguages = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_LANGUAGES_RESET})

// Load groups
export const getPropertiesGroups = () => async (dispatch, getState) => call(dispatch, () => propertiesApi.getTradeItemPropertiesGroups(), {
  REQUEST: types.APP_TRADE_ITEMS_EDIT_GROUPS_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_GROUPS_FAILURE,
}).then(groups => {
  const removedUnusedGroups = remove(groups, function(n) {
    return !unusedGroups.includes(n.name);
  });
  dispatch({type: types.APP_TRADE_ITEMS_EDIT_GROUPS_SUCCESS, results: removedUnusedGroups})
  return selectors.getGroups(getState())
})

// reset groups
export const resetPropertiesGroups = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_GROUPS_RESET})

// Load trade item categories
export const getTradeItemCategories = () => async (dispatch, getState) => call(dispatch, () => tradeItemCategoriesApi.getTradeItemCategories(), {
  REQUEST: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_CATEGORIES_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_CATEGORIES_FAILURE,
}).then(tradeItemCategories => {
  dispatch({type: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_CATEGORIES_SUCCESS, results: tradeItemCategories})
  return selectors.getTradeItemCategories(getState())
})

// reset trade item categories
export const resetTradeItemCategories = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_CATEGORIES_RESET})

// Load properties for given group and TradeItemCategory
export const getPropertiesByGroupAndTradeItemCategoryCode = (taxonomyId, group, tradeItemCategoryCode) => dispatch => {
  if(group && taxonomyId && tradeItemCategoryCode) call(dispatch, () => propertiesApi.getTradeItemPropertiesByGroupCodeAndTradeItemCategory(taxonomyId, group, tradeItemCategoryCode), {
    REQUEST: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_PROPERTIES_REQUEST,
    FAILURE: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_PROPERTIES_FAILURE,
  }).then(properties => dispatch({type: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_PROPERTIES_SUCCESS, results: properties}))
}

// reset groups
export const resetProperties = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_TRADE_ITEM_PROPERTIES_RESET})

// Edit tradeItem
export const editTradeItem = (tradeItem) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_SUCCESS, resource: tradeItem})

// Update tradeItem
export const saveTradeItemById = (id, tradeItem) => dispatch => storage.saveTradeItemById(id, tradeItem)

// Reset tradeItem
export const resetTradeItem = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_RESET})

// Set list filters
export const setFilters = (filters) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_FILTERS_RECEIVE, filters})

// Show filters modal
export const showFilters = (showFilters) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_FILTERS_SHOW, showFilters})

// Select group
export const setGroupSelected = (group) => (dispatch, getState) => {
  dispatch({type: types.APP_TRADE_ITEMS_EDIT_GROUP_SELECTED_RECEIVE, group});
  dispatch(getPropertiesByGroupAndTradeItemCategoryCode(
    get(selectors.getTradeItemToEdit(getState()), "taxonomyId", null),
    group, 
    get(selectors.getTradeItemToEdit(getState()), "tradeItemCategory.code", null)
  ));
}

// Get target markets
//
export const getTargetMarkets = () => dispatch => call(dispatch, targetMarketsApi.getTargetMarkets, {
  REQUEST: types.APP_TRADE_ITEMS_EDIT_TARGET_MARKETS_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_TARGET_MARKETS_FAILURE,
}).then(results => dispatch({type: types.APP_TRADE_ITEMS_EDIT_TARGET_MARKETS_SUCCESS, results}))

// reset target markets
export const resetTargetMarkets = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_TARGET_MARKETS_RESET})

// Get retailers
//
export const getRetailers = () => dispatch => call(dispatch, retailerApi.getAllRetailers, {
  REQUEST: types.APP_TRADE_ITEMS_EDIT_RETAILERS_LIST_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_RETAILERS_LIST_FAILURE,
}).then(results => dispatch({type: types.APP_TRADE_ITEMS_EDIT_RETAILERS_LIST_SUCCESS, results}))

// reset retailers
export const resetRetailers = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_RETAILERS_LIST_RESET})

// ========================================================================
// MARKETING
// ========================================================================
// Select language to target a specific translation
export const setMarketingLanguageSelected = (language) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_MARKETING_LANGUAGE_SELECTED_RECEIVE, language})

// Select index for marketing
export const setMarketingIndexSelected = (index) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_MARKETING_INDEX_SELECTED_RECEIVE, index})


// ========================================================================
// PRE COMPUTING
// ========================================================================

// Precompute trade item
export const preComputeTradeItem = tradeItemId => dispatch => preComputingApi.preComputeForTradeItem(tradeItemId)

// ========================================================================
// IMAGES
// ========================================================================

// set edit image
export const setEditImage = (image) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_IMAGE_EDIT_SUCCESS, image})
// reset edit image
export const resetEditImage = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_IMAGE_EDIT_RESET})
//set multiple image form
export const setMultipleImageForm = (multipleImages) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_UPLOAD_IMAGES_RECEIVE, multipleImages: multipleImages})
export const changeMultipleImageFormProperty = (key, value) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_UPLOAD_IMAGES_CHANGE, key, value})
export const removeMultipleImageFormItem = key => dispatch => dispatch({type: types.APP_TRADE_ITEMS_UPLOAD_IMAGES_REMOVE, key})

// Change a trade item property
export const setImageProperty = (key, value) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_IMAGE_EDIT_CHANGE_PROPERTY, key, value})
export const mergeImageProperty = (key, value) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_IMAGE_EDIT_MERGE_PROPERTY, key, value})
export const deleteImageProperty = key => dispatch => dispatch({type: types.APP_TRADE_ITEMS_IMAGE_EDIT_DELETE_PROPERTY, key})

// create a new image
export const createImage = (image) => dispatch => importResourceApi.createImage(image).then(res => {
  dispatch(mergeTradeItemProperty('imageResourceMetadatas', {values: get(res, 'data.0'), channels: []}))
  resetEditImage()(dispatch)
})

//upload multiple images
export const uploadButchImages = (multipleImages) => dispatch => {
  const butchRequests = map(multipleImages, image => importResourceApi.createImage(image))
  Promise.all(butchRequests).then(res => {
    map(res, image => mergeTradeItemProperty('imageResourceMetadatas', {values: get(image, 'data.0'), channels: []})(dispatch))
  })
  setMultipleImageForm()(dispatch)
}

//update Image by Id
export const updateImageById = (id, key, value) => async (dispatch, getState) => {
  const imageIndex = findIndex(get(selectors.getTradeItemToEdit(getState()), 'imageResourceMetadatas'), img  => img.values.id === id)
  await setTradeItemProperty(`imageResourceMetadatas.${imageIndex}.values.${key}`, value)(dispatch)
  await updateImage(get(selectors.getTradeItemToEdit(getState()), `imageResourceMetadatas.${imageIndex}.values`))(dispatch)
}

// update a image
export const updateImage = (image) => dispatch => {
  const params = {
    metadataId: get(image, 'id'),
    filename: get(image, 'filename'),
    index: get(image, 'index'),
    imageCategory: get(image, 'imageCategory'),
    plungeAngle: get(image, 'plungeAngle'),
    facingType: get(image, 'facingType'),
    notDefinitive: get(image, 'notDefinitive'),
    notExportable: get(image, 'notExportable'),
    languageCodes: get(image, 'languageCodes'),
    retailerCodes: get(image, 'retailerCodes')
  }
  return importResourceApi.updateImage(params).then(res => {
    resetEditImage()(dispatch)
  })
}

// delete image
export const deleteImage = (id) => (dispatch, getState) => importResourceApi.deleteResource(id).then(res => {
  const imageIndex = findIndex(get(selectors.getTradeItemToEdit(getState()), 'imageResourceMetadatas'), img  => img.values.id === id)
  deleteTradeItemProperty(`imageResourceMetadatas.${imageIndex}`)(dispatch)
})

// Load Image Categories
export const getImageCategories = () => dispatch => call(dispatch, importResourceApi.getImageCategories, {
  REQUEST: types.APP_TRADE_ITEMS_EDIT_IMAGE_CATEGORIES_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_IMAGE_CATEGORIES_FAILURE,
}).then(res => dispatch({type: types.APP_TRADE_ITEMS_EDIT_IMAGE_CATEGORIES_SUCCESS, results: res}))

export const getImagePlungeAngles = () => dispatch => call(dispatch, () => propertiesApi.getGroupsValuesByIds("e73d1614-ed09-4804-98eb-07c93b4967e3"), {
  REQUEST: types.APP_TRADE_ITEMS_EDIT_IMAGE_PLUNGE_ANGLES_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_IMAGE_PLUNGE_ANGLES_FAILURE,
}).then(res => dispatch({type: types.APP_TRADE_ITEMS_EDIT_IMAGE_PLUNGE_ANGLES_SUCCESS, results: res}))

export const getImageFacingTypes = () => dispatch => call(dispatch, () => propertiesApi.getGroupsValuesByIds("5bd1e5a8-1345-499a-9939-3ac662a56be2"), {
  REQUEST: types.APP_TRADE_ITEMS_EDIT_IMAGE_FACING_TYPES_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_IMAGE_FACING_TYPES_FAILURE,
}).then(res => dispatch({type: types.APP_TRADE_ITEMS_EDIT_IMAGE_FACING_TYPES_SUCCESS, results: res}))

// reset Image Categories
export const resetImageCategories = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_IMAGE_CATEGORIES_RESET})

// reorder Images
export const reorderImages = (reorder, list) => dispatch => {
  const { oldIndex, newIndex } = reorder;
  if (oldIndex > newIndex) {
    const newValue = newIndex !== 0 ? list[newIndex - 1].values.index + 1 : list[0].values.index;
    list[oldIndex].values.index = newValue;
    if (list[newIndex + 1].values.index - newValue < 2) {
      forEach(list, (item, index) => {
        if (index >= newIndex && index < oldIndex) {
          list[index].values.index += 1;
        }
      });
    }
  }
  if (oldIndex < newIndex) {
    const newValue = newIndex !== (list.length - 1) ? (list[newIndex + 1].values.index - 1) : list[newIndex].values.index;
    list[oldIndex].values.index = newValue;
    if (list[newIndex !== (list.length - 1) ? newIndex + 1 : newIndex].values.index - newValue < 2) {
      forEach(list, (item, index) => {
        if (index <= newIndex && index > oldIndex) {
          list[index].values.index -= 1;
        }
      });
    }
  }
  setTradeItemProperty('imageResourceMetadatas', list)(dispatch)
}

// ========================================================================
// DOCUMENTS
// ========================================================================

// Load Documents
export const getDocuments = (tradeItemId) => dispatch => call(dispatch,() =>  importResourceApi.getDocuments(tradeItemId), {
  REQUEST: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_REQUEST,
  FAILURE: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_FAILURE,
}).then(res => dispatch({type: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_SUCCESS, results: res}))

// reset Documents
export const resetDocuments = () => dispatch => dispatch({type: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_RESET})

export const setDocumentEdit = (document) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_DOCUMENT_EDIT_RECEIVE, document})

//set multiple documents form
export const setMultipleDocumentsForm = (multipleDocuments) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_UPLOAD_DOCUMENTS_RECEIVE, multipleDocuments: multipleDocuments})
export const changeMultipleDocumentFormProperty = (key, value) => dispatch => dispatch({type: types.APP_TRADE_ITEMS_UPLOAD_DOCUMENTS_CHANGE, key, value})
export const removeMultipleDocumentFormItem = key => dispatch => dispatch({type: types.APP_TRADE_ITEMS_UPLOAD_DOCUMENTS_REMOVE, key})

// delete document
export const deleteDocument = (id) => (dispatch, getState) => {
const docIndex = findIndex(selectors.getDocuments(getState()), d => d.id === id)
  return call(dispatch, () => importResourceApi.deleteResource(id), {
    REQUEST: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_REQUEST,
    FAILURE: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_FAILURE,
  }).then(res => {
    dispatch({type: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_REMOVE, key: 'id', value: id})
    dispatch({type: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_SUCCESS, push: []})
    deleteTradeItemProperty(`documentResourceMetadatas.${docIndex}`)(dispatch)
  })
}

//upload multiple documents
export const uploadButchDocuments = (multipleDocuments) => dispatch => {
  const butchRequests = map(multipleDocuments, doc => importResourceApi.createDocument(doc))
  Promise.all(butchRequests).then(res => {
    map(res, doc => {
      dispatch({type: types.APP_TRADE_ITEMS_EDIT_DOCUMENTS_SUCCESS, push: doc.data})
      mergeTradeItemProperty('documentResourceMetadatas', {values: doc.data, channels: []})(dispatch)
    })
  })
  setMultipleDocumentsForm()(dispatch)
}

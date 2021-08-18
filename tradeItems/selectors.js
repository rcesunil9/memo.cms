import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../common/reducers/createList"
import { getDefaultFilters as getFilters } from "./utils"
import keyBy from "lodash/keyBy"
import orderBy from "lodash/orderBy"
import get from "lodash/get"
import findIndex from "lodash/findIndex"
import reduce from "lodash/reduce"
import isEmpty from "lodash/isEmpty"
import isBoolean from "lodash/isBoolean"

//Calculate active filter amount
export const calculateActiveFilters = filters => reduce(filters, (acc, filter, key) => {
  //Remove searchAfter as filter
  if (key === 'searchAfter' || key === 'limit') {
    return acc += 0
  }
  //Check filter !== empty
  if (isEmpty(filter)) {
    //Check if filter value boolean && true
    if (isBoolean(filter) && filter) {
      return acc += 1
    } else return acc += 0
  }
  return acc += 1
}, 0)

const _getTradeItems = state => state.tradeItems.list.results
export const getTradeItemToEdit = state => state.tradeItems.edit.tradeItem
// const getLanguages = state => state.tradeItems.edit.languages
const _getManufacturers = state => state.tradeItems.edit.manufacturers
const _getGroups = state => state.tradeItems.edit.groups
const _getTradeItemCategories = state => state.tradeItems.edit.tradeItemCategories
const _getImageCategories = state => state.tradeItems.edit.imageCategories
const _getImagePlungeAngles = state => state.tradeItems.edit.imagePlungeAngles
const _getImageFacingTypes = state => state.tradeItems.edit.imageFacingTypes
const _getDocuments = state => state.tradeItems.edit.documents
const _getTargetMarkets = state => state.tradeItems.edit.targetMarkets
const _getRetailers = state => state.tradeItems.edit.retailers
export const getImageEdit = state => state.tradeItems.edit.editImage
export const getDocumentEdit = state => state.tradeItems.edit.editDocument
export const getMultipleImages = state => state.tradeItems.edit.multipleImages
export const getMultipleDocuments = state => state.tradeItems.edit.multipleDocuments
export const getLanguageSelected = state => state.tradeItems.edit.languageSelected
export const getMarketingIndexSelected = state => state.tradeItems.edit.marketingIndexSelected
export const getGroupSelected = state => state.tradeItems.edit.groupSelected
const _getTradeItemProperties = state => state.tradeItems.edit.tradeItemProperties
export const getTradeItemsTotal = state => state.tradeItems.list.total
export const getCurrentTradeItemsFilters = state => state.tradeItems.list.filters
export const showFiltersModal = state => state.tradeItems.list.showFilters
export const getDefaultFilters = () => getFilters()

export const getGroups = createSelector(_getGroups, getResults)
export const getTradeItemCategories = createSelector(_getTradeItemCategories, getResults)
export const getImageCategories = createSelector(_getImageCategories, getResults)
export const getImagePlungeAngles = createSelector(_getImagePlungeAngles, getResults)
export const getImageFacingTypes = createSelector(_getImageFacingTypes, getResults)
export const getDocuments = createSelector(_getDocuments, getResults)
export const getTargetMarkets = createSelector(_getTargetMarkets, getResults)
export const getRetailers = createSelector(_getRetailers, getResults)
export const getTradeItemProperties = createSelector(_getTradeItemProperties, getResults)
export const getTradeItems = createSelector(_getTradeItems, getResults)
export const getTradeItemsFetching = createSelector(_getTradeItems, getIsFetching)
export const getManufacturers = createSelector(_getManufacturers, getResults)
export const getActiveFiltersNumber = createSelector(getCurrentTradeItemsFilters, filters => calculateActiveFilters(filters))
export const isDocumentFetching = createSelector(_getDocuments, list => getIsFetching(list))

export const getTradeItemsById = createSelector(
  getTradeItems,
  tradeItems => keyBy(tradeItems, "tradeItemId")
)

export const getTradeItemPropertiesOrdered = createSelector(
  getTradeItemProperties,
  properties => orderBy(properties, "code", "asc")
)

export const getManufacturersOrdered = createSelector(
  getManufacturers,
  manufacturers => orderBy(manufacturers, "name", "asc")
)

export const getTradeItemImages = createSelector(
  getTradeItemToEdit,
  tradeItem => get(tradeItem, 'imageResourceMetadatas')
)

export const getTradeItemDocuments = createSelector(
  getTradeItemToEdit,
  tradeItem => get(tradeItem, 'documentResourceMetadatas')
)

export const getEditImageIndex = createSelector(
  [getImageEdit, getTradeItemImages],
  (editImage, images) => findIndex(images, i => get(i, 'values.id') === get(editImage, 'id'))
)

export const getEditImageChannels = createSelector(
  [getEditImageIndex, getTradeItemImages],
  (index, images) => get(images, `${index}.channels`, null)
)

export const getEditDocumentIndex = createSelector(
  [getDocumentEdit, getDocuments],
  (editDoc, docs) => findIndex(docs, i => get(i, 'id') === get(editDoc, 'id'))
)

export const getEditDocumentChannels = createSelector(
  [getEditDocumentIndex, getTradeItemDocuments],
  (index, docs) => get(docs, `${index}.channels`, null)
)
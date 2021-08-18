import { createSelector } from 'reselect'
import { getResults } from "../common/reducers/createList"
import { getResource } from "../common/reducers/createResource"
import orderBy from "lodash/orderBy"
import keyBy from "lodash/keyBy"
import map from "lodash/map"
import get from "lodash/get"

const getManufacturers = state => state.manufacturers.list
const getManufacturerEdit = state => state.manufacturers.edit.manufacturer
const getManufacturerEntities = state => state.manufacturers.edit.entities
const getManufacturerEntityEdit = state => state.manufacturers.edit.editEntity.manufacturerEntity
const getManufacturerMatrixMappings = state => state.manufacturers.edit.editEntity.matrixMappings
const getManufacturerTargetMarkets = state => state.manufacturers.edit.editEntity.targetMarkets
const getManufacturerTaxonomies = state => state.manufacturers.edit.editEntity.taxonomies
const getManufacturerRetailers = state => state.manufacturers.edit.editEntity.retailers
const _getBusinessRulesSets = state => state.manufacturers.edit.editEntity.businessRulesSets
const getManufacturerLanguages = state => state.manufacturers.edit.editEntity.languages
const getManufacturerImageCategories = state => state.manufacturers.edit.editEntity.imageCategories
const _getUsers = state => state.manufacturers.edit.users

export const getManufacturersOrderByName = createSelector(
  getManufacturers,
  manufacturers => orderBy(getResults(manufacturers), ["name"])
)

export const getManufacturersByIdOrderByName = createSelector(
  getManufacturersOrderByName,
  manufacturers => keyBy(manufacturers, "id")
)

export const getManufacturerEntitiesOrderByName = createSelector(
  getManufacturerEntities,
  manufaturerEntities => orderBy(getResults(manufaturerEntities), ["name"])
)

export const getManufacturerEntitiesByIdOrderByName = createSelector(
  getManufacturerEntitiesOrderByName,
  manufaturerEntities => keyBy(manufaturerEntities, "id")
)

export const getManufacturerToEdit = createSelector(
  getManufacturerEdit,
  manufacturer => getResource(manufacturer)
)

export const getManufacturerEntityToEdit = createSelector(
  getManufacturerEntityEdit,
  manufacturerEntity => getResource(manufacturerEntity)
)

export const getMatrixMappings = createSelector(
  getManufacturerMatrixMappings,
  mappings => map(orderBy(getResults(mappings), ["name"]), o => { return {value: o.id, label: o.name} })
)

export const getTargetMarkets = createSelector(
  getManufacturerTargetMarkets,
  targetMarkets => map(orderBy(getResults(targetMarkets), ["name"]), o => { return {value: o.id, label: o.name} })
)

export const getTaxonomies = createSelector(
  getManufacturerTaxonomies,
  taxonomies => map(orderBy(getResults(taxonomies), ["name"]), o => { return {value: o.id, label: o.name} })
)

export const getUsers = createSelector(
  _getUsers,
  users => map(orderBy(getResults(users), ["name"]), o => { return {value: o.id, label: o.name} })
)

export const retailers = createSelector(
  getManufacturerRetailers,
  r => orderBy(getResults(r), ["name"])
)

export const getLanguages = createSelector(
  getManufacturerLanguages,
  languages => map(orderBy(getResults(languages), ["code"]), o => { return {value: o.id, label: o.code} })
)

export const getImageCategories = createSelector(
  getManufacturerImageCategories,
  categories => map(orderBy(getResults(categories), ["name"]), o => { return {value: o, label: o}})
)

export const getDefaultManufacturerEntity = (manufacturerId, name) => ({
  id: '',
  name,
  manufacturerId,
  importSettings: {
    matrixMappingId: "",
    businessRulesIds: [],
    ftpConnectionSettings: { url: "", username: "", password: "", path: "" },
    defaultImportLanguageId: "",
    defaultImportTargetMarketId: "",
    imageRegex: "",
    imageTypeMappings: []
  }
})

export const getBusinessRulesSets = createSelector(
  _getBusinessRulesSets,
  brs => orderBy(getResults(brs), ["name"])
)

export const getExportActions = createSelector(state => state.manufacturers.edit, manufacturerEdit => getResults(get(manufacturerEdit, "exportActions", [])))
export const getPdfExportActions = createSelector(state => state.manufacturers.edit, manufacturerEdit => getResults(get(manufacturerEdit, "pdfExportActions", [])))
import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../common/reducers/createList"
import { getResource } from "../common/reducers/createResource"
import findLast from "lodash/findLast"
import map from "lodash/map"
import get from "lodash/get"
import fromPairs from "lodash/fromPairs"
import pick from "lodash/pick"
import filter from "lodash/filter"
import keyBy from "lodash/keyBy"
import size from "lodash/size"
import orderBy from "lodash/orderBy"
import findIndex from "lodash/findIndex"
import indexOf from "lodash/indexOf"
import isEqual from "lodash/isEqual"
import find from "lodash/find"
import flattenDeep from "lodash/flattenDeep"
import groupBy from "lodash/groupBy"
import isEmpty from "lodash/isEmpty"

const getExistingMappings = (state) => state.matrixMapping.existingMappings.mappings
export const getSelectedMapping = (state) => state.matrixMapping.existingMappings.selected
export const getOriginalMapping = (state) => state.matrixMapping.existingMappings.originalMapping
export const getSelectedGroupIndex = (state) => state.matrixMapping.mappingGroups.selected
const getMatrixAnalysis = (state) => state.matrixMapping.matrixAnalysis.current
const getMatrixAnalysisUnderEdition = (state) => state.matrixMapping.matrixAnalysis.matrixUnderEdition
export const getFileUploadData = (state) => state.matrixMapping.matrixAnalysis.fileUploadData
export const isMatrixAnalysisUploadDisplayed = (state) => state.matrixMapping.matrixAnalysis.uploadFile
export const isCreatingMatrixAnalysis = (state) => state.matrixMapping.matrixAnalysis.creating
export const getMappingDiscriminator = (state) => state.matrixMapping.matrixAnalysis.discriminator
export const isDuplicating = (state) => state.matrixMapping.duplicateMapping.show
export const getDuplicateName = (state) => state.matrixMapping.duplicateMapping.name
const getColumnsMapping = (state) => state.matrixMapping.columnsMapping
export const getColumnsMappingFilterByName = (state) => state.matrixMapping.columnsMapping.filterByName
export const isAutoMapping = (state) => state.matrixMapping.columnsMapping.autoMapping
export const getTradeItemProperties = (state) => state.matrixMapping.tradeItemProperties.results
export const getCreateMappingShow = (state) => state.matrixMapping.createMapping.show
export const getCreateMappingMapping = (state) => state.matrixMapping.createMapping.mapping
export const editPropertyMappingResource = (state) => state.matrixMapping.editPropertyMapping.propertyMapping
export const isEditingPropertyMapping = (state) => state.matrixMapping.editPropertyMapping.show
export const getEditPropertyMappingSelectedMapName = (state) => state.matrixMapping.editPropertyMapping.selectedMapName

export const getCreateMappingGroups = createSelector((state) => state.matrixMapping.createMapping.groups, _s => getResults(_s))
export const getCreateMappingTradeItemCategories = createSelector((state) => state.matrixMapping.createMapping.tradeItemCategories, _s => getResults(_s))
export const getCreateMappingTaxonomies = createSelector((state) => state.matrixMapping.createMapping.taxonomies, _s => getResults(_s))

// trade item properties result
export const getTradeItemPropertiesResults = createSelector(
  getTradeItemProperties,
  tradeItemProperties => getResults(tradeItemProperties)
)

// get all the existing mappings
export const getExistingMappingsForListing = createSelector(
  getExistingMappings,
  mappings => getResults(mappings)
)

// get mappings names
export const getExistingMappingsNames = createSelector(
  getExistingMappings,
  mappings => map(getResults(mappings), m => get(m, "mappingTitle"))
)

// existing mappings are being fetched or not
export const getExistingMappingsFetching = createSelector(
  getExistingMappings,
  mappings => getIsFetching(mappings)
)

// get selected mapping groups
export const getSelectedMappingGroups = createSelector(
  getSelectedMapping,
  mapping => get(mapping, "mappingGroups", [])
)

// get mapping discriminator
export const getSelectedMappingDiscriminator = createSelector(
  getSelectedMapping,
  mapping => get(mapping, "discriminator")
)

// get selected mapping groups for navigation
export const getMappingGroupsForNavigation = createSelector(
  [getSelectedMappingGroups, getOriginalMapping],
  (currentGroups, originalMapping) => orderBy(map(currentGroups, g => {
    return {
      groupIndex: g.groupIndex,
      groupName: g.groupName,
      hasChanged: !isEqual(find(get(originalMapping, "mappingGroups"), _g => _g.groupIndex === g.groupIndex), g)
    }
  }), "groupName")
)

// knows if the current mapping has changed
export const hasMappingChanged = createSelector(
  [getOriginalMapping, getSelectedMapping],
  (originalMapping, currentMapping) => !isEqual(originalMapping, currentMapping)
)

// get selected mapping group
export const getSelectedMappingGroup = createSelector(
  [getSelectedMappingGroups, getSelectedGroupIndex],
  (groups, groupIndex) => findLast(groups, group => group.groupIndex === groupIndex)
)

// get selected mapping group for navigation
export const getSelectedMappingGroupForNavigation = createSelector(
  getSelectedMappingGroup,
  group => pick(group, ['groupName', 'groupIndex'])
)

// get selected mapping matrix analysis id
export const getSelectedMappingMatrixAnalysisId = createSelector(
  getSelectedMapping,
  mapping => mapping.matrixAnalysisId
)

// get current matrix analysis
export const getCurrentMatrixAnalysis = createSelector(
  getMatrixAnalysis,
  matrixAnalysis => getResource(matrixAnalysis)
)

// get current matrix analysis
export const getCurrentMatrixAnalysisUnderEdition = createSelector(
  getMatrixAnalysisUnderEdition,
  matrixAnalysis => getResource(matrixAnalysis)
)

// get current matrix analysis sheets
export const getCurrentMatrixAnalysisSheets = createSelector(
  getCurrentMatrixAnalysis,
  matrixAnalysis => get(matrixAnalysis, "file.sheets", [])
)

// if the matrix analysis table is displayed
export const isMatrixAnalysisDetailMode = (state) => state.matrixMapping.matrixAnalysis.showDetail

// current matrix analysis sheet names by index
export const getCurrentMatrixAnalysisSheetsByIndex = createSelector(
  getCurrentMatrixAnalysisSheets,
  sheets => fromPairs(map(filter(sheets, s => !s.ignored), sheet => [sheet.sheetIndex, sheet]))
)

// current tabs for selected mapping
export const getCurrentTabsMapped = createSelector(
  getSelectedMappingGroup,
  group => get(group, "mappingTabs", [])
)

// current tabs for selected mapping by sheet index
export const getCurrentTabsMappedBySheetIndex = createSelector(
  getCurrentTabsMapped,
  tabs => keyBy(tabs, "sheetIndex")
)

// get tabs grouped for select
export const getGroupedTabSelectionForSelect = createSelector(
  [getCurrentTabsMappedBySheetIndex, getCurrentMatrixAnalysisSheetsByIndex],
  (currentTabBySheetIndex, sheetNameByIndex) => [
    {
      label: "mapped",
      options: map(filter(sheetNameByIndex, sheet => get(currentTabBySheetIndex, `[${sheet.sheetIndex}]`)), s => pick(s, ["sheetIndex", "sheetName"]))
    },
    {
      label: "not mapped",
      options: map(filter(sheetNameByIndex, sheet => !get(currentTabBySheetIndex, `[${sheet.sheetIndex}]`)), s => pick(s, ["sheetIndex", "sheetName"]))
    }
  ]
)

// total mapped
export const getCurrentTabsTotalMapped = createSelector(
  getGroupedTabSelectionForSelect,
  tabs => size(get(tabs, "[0].options", []))
)

// total not mapped
export const getCurrentTabsTotalNotMapped = createSelector(
  getGroupedTabSelectionForSelect,
  tabs => size(get(tabs, "[1].options", []))
)

// total mapped for all groups
export const getTabsTotalMappedByGroup = createSelector(
  getSelectedMappingGroups,
  groups => fromPairs(map(groups, group => [get(group, "groupIndex"), size(get(group, "mappingTabs"))]))
)

// current tab selected for mapping
export const getColumnsMappingTabSelected = createSelector(
  getColumnsMapping,
  columnsMapping => get(columnsMapping, "tabSelected")
)

// current tab selected for mapping
export const getColumnsMappingTabSelectedIndex = createSelector(
  getColumnsMappingTabSelected,
  tabSelected => get(tabSelected, "sheetIndex")
)

// current tab index for selected mapping
export const getCurrentTabIndex = createSelector(
  [getCurrentTabsMapped, getColumnsMappingTabSelectedIndex],
  (sheets, sheetIndex) => findIndex(sheets, s => s.sheetIndex === sheetIndex)
)

// get the actual current mapping
export const getCurrentColumnsMapping = createSelector(
  [getCurrentTabsMapped, getColumnsMappingTabSelectedIndex],
  (tabs, tabIndex) => get(findLast(tabs, tab => tab.sheetIndex === tabIndex), "mappingColumns")
)

// get the actual current mapping for  standard mapping
export const getCurrentStandardColumnsMapping = createSelector(
  [getCurrentTabsMapped, getColumnsMappingTabSelectedIndex],
  (tabs, tabIndex) => get(findLast(tabs, tab => tab.sheetIndex === tabIndex), "transformations")
)

// get all columns mappings names
export const getCurrentColumnsMappingNames = createSelector(
  [getCurrentTabsMapped, getColumnsMappingTabSelectedIndex],
  (tabs, tabIndex) => map(get(findLast(tabs, tab => tab.sheetIndex === tabIndex), "mappingColumns"), pm => pm.mapName)
)

// get the actual current mapping for standard and non standard mappings ordered by name
export const getCurrentColumnsMappingOrderedByName = createSelector(
  [getCurrentColumnsMapping, getCurrentStandardColumnsMapping, getColumnsMappingFilterByName, getSelectedMappingDiscriminator],
  (columnMappings,standardColumnMappings, filterByName, discriminator) => {
    if(discriminator === 'StandardMappingViewModel') {
      return size(filterByName) === 0 ? standardColumnMappings : filter(standardColumnMappings, m => m.propertyCode.includes(filterByName))
    } else return orderBy(size(filterByName) === 0 ? columnMappings : filter(columnMappings, m => m.mapName.includes(filterByName)), "mapName")
  }
)

// get columns for auto mapping
export const getColumnsForAutoMapping = createSelector(
  [getCurrentMatrixAnalysisSheets, getColumnsMappingTabSelectedIndex],
  (sheets, tabIndex) => get(findLast(sheets, s => s.sheetIndex === tabIndex), "columns")
)

// get current trade items properties codes
export const getTradeItemPropertiesCodes = createSelector(
  getTradeItemProperties,
  tradeItemProperties => map(tradeItemProperties, tradeItemProperty => pick(tradeItemProperty, ["code"]))
)

// get current trade items properties codes
export const getMappedColumnsByTabAndGroup = createSelector(
  getSelectedMappingGroups,
  groups => groupBy(flattenDeep(map(groups, group => map(get(group, "mappingTabs"), sheet => map(get(sheet, "mappingColumns", []), col => { return {
    groupIndex: group.groupIndex,
    groupName: group.groupName,
    sheetIndex: sheet.sheetIndex,
    ...col
  }})))), o => get(o, "fileColumnIdentifier"))
)

// is duplicate name requested valid
export const isDuplicateNameValid = createSelector(
  [getDuplicateName, getExistingMappingsNames],
  (name, mappingsNames) => indexOf(mappingsNames, name) === -1 && name.trim() !== ""
)

// get mapping title of the currently created mapping
export const getCreationMappingTitle = createSelector(
  getCreateMappingMapping,
  mapping => get(mapping, "mappingTitle", "")
)

// is creation name requested valid
export const isMappingCreationNameValid = createSelector(
  [getCreationMappingTitle, getExistingMappingsNames],
  (name, mappingsNames) => indexOf(mappingsNames, name) === -1 && name.trim() !== ""
)

// get currently edited property mapping
export const getEditPropertyMapping = createSelector(
  editPropertyMappingResource,
  propertyMapping => getResource(propertyMapping)
)

// is the current property mapping name valid
export const isCurrentMapNameValid = createSelector(
  [getCurrentColumnsMapping, getEditPropertyMapping, getEditPropertyMappingSelectedMapName],
  (columnMappings, pm, mapName) => isEmpty(findLast(columnMappings, m => m.mapName === get(pm, "mapName") && mapName !== m.mapName))
)

// current property mapping edit index
export const getCurrentPropertyMappingIndex = createSelector(
  [getCurrentColumnsMapping, getEditPropertyMappingSelectedMapName],
  (mappings, mapName) => findIndex(mappings, m => m.mapName === mapName)
)

// trade item properties not mapped
export const getTradeItemPropertiesNotMapped = createSelector(
  [getCurrentColumnsMapping, getTradeItemPropertiesResults, getEditPropertyMappingSelectedMapName],
  (mappings, tradeItemProperties, mapName) => filter(tradeItemProperties, p => !find(mappings, m => m.productIdentifier === p.code && m.mapName !== mapName))
)

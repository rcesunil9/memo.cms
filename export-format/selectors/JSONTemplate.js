import { createSelector } from "reselect"
import { getResults, getIsFetching } from "../../common/reducers/createList"

export const getTradeItemId = state => state.exportFormat.templateValidationJSON.tradeItemId
export const getExportAction = state => state.exportFormat.templateValidationJSON.exportAction
export const getExportActions = createSelector(state => state.exportFormat.templateValidationJSON.exportActions, getResults)
export const areExportActionsFetching = createSelector(state => state.exportFormat.templateValidationJSON.exportActions, getIsFetching)
export const getValidationResult = state => state.exportFormat.templateValidationJSON.validationResult
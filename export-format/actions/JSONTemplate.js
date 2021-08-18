import * as api from "../../common/services/exportFormatProcessing"
import * as actionsApi from "../../common/services/triggers"
import call from "../../common/actions/call"
import * as types from "../types"


export const getValidationExportActions = tradeItemCategoryCode => dispatch => call(dispatch, () => actionsApi.getExportActionsByTradeItemCategory(tradeItemCategoryCode) , {
    REQUEST: types.EXPORT_FORMAT_TRANSFORMATION_TEMPLATE_VALIDATION_JSON_EXPORT_ACTION_LIST_REQUEST,
    FAILURE: types.EXPORT_FORMAT_TRANSFORMATION_TEMPLATE_VALIDATION_JSON_EXPORT_ACTION_LIST_FAILURE,
  }).then(results =>  dispatch({type: types.EXPORT_FORMAT_TRANSFORMATION_TEMPLATE_VALIDATION_JSON_EXPORT_ACTION_LIST_SUCCESS, results}))

export const resetValidationExportActions = () => dispatch => dispatch({type: types.EXPORT_FORMAT_TRANSFORMATION_TEMPLATE_VALIDATION_JSON_EXPORT_ACTION_LIST_RESET})

export const setValidationTradeItemId = tradeItemId => dispatch => dispatch({type: types.EXPORT_FORMAT_TRANSFORMATION_TEMPLATE_VALIDATION_JSON_TRADE_ITEM_ID_RECEIVE, tradeItemId})

export const setValidationExportAction = exportAction => dispatch => dispatch({type: types.EXPORT_FORMAT_TRANSFORMATION_TEMPLATE_VALIDATION_JSON_EXPORT_ACTION_RECEIVE, exportAction})

export const resetValidationExportAction = () => dispatch => dispatch({type: types.EXPORT_FORMAT_TRANSFORMATION_TEMPLATE_VALIDATION_JSON_EXPORT_ACTION_RECEIVE, exportAction: null})

export const setValidationResult = validationResult => dispatch => dispatch({type: types.EXPORT_FORMAT_TRANSFORMATION_TEMPLATE_VALIDATION_JSON_VALIDATION_RESULT_RECEIVE, validationResult})

export const resetValidationResult = () => dispatch => dispatch({type: types.EXPORT_FORMAT_TRANSFORMATION_TEMPLATE_VALIDATION_JSON_VALIDATION_RESULT_RECEIVE, validationResult: null})

export const validateJSONFormatConfiguration = (formatConfigurationId, tradeItemId, actionId) => dispatch => api.validateJSONTemplate(formatConfigurationId, tradeItemId, actionId).then(
    res => dispatch(setValidationResult(res.data))
)
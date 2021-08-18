import * as api from '../../common/services/transformationManagement'
import * as processingApi from '../../common/services/transformationProcessing'
import * as propertiesApi from '../../common/services/tradeItemProperties'
import * as taxonomiesApi from '../../common/services/taxonomy'
import * as tradeItemCategoriesApi from '../../common/services/tradeItemCategories'
import * as businessRulesApi from '../../common/services/businessRules'
import * as types from '../types'
import call from "../../common/actions/call"
import * as editSelectors from '../selectors/edit'


// update transformation set
export const setTransformationSet = transformationSet => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_RECEIVE, transformationSet})
export const postTransformationSet = () => (dispatch, getState) => {
    const transformationSet = editSelectors.getTransformationSet(getState())
    return api.createTransformationSet(transformationSet)
        .then(res => res.data)
}
export const putTransformationSet = () => (dispatch, getState) => {
    const transformationSet = editSelectors.getTransformationSet(getState())
    return api.updateTransformationSet(transformationSet.id, transformationSet)
}
export const resetTransformationSet = () => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_RECEIVE, transformationSet: null})
export const updateTransformationSet = (key, value) => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_UPDATE, key, value})

export const updateTransformationSetTradeItemCategory = tradeItemCategoryCode => (dispatch,getState) => {
    dispatch(updateTransformationSet("tradeItemCategory", { code: tradeItemCategoryCode }))
    const transformationSet = editSelectors.getTransformationSet(getState())
    dispatch(getBusinessRulesSets(transformationSet.taxonomyId, tradeItemCategoryCode))
}

export const updateTransformationSetTaxonomyId = taxonomyId => (dispatch,getState) => {
    dispatch(updateTransformationSet("taxonomyId", taxonomyId ))
    const transformationSet = editSelectors.getTransformationSet(getState())
    dispatch(getBusinessRulesSets(taxonomyId, transformationSet.tradeItemCategory.code))
}

export const deleteTransformationSet = (id) => dispatch => api.deleteTransformationSet(id).then(
  res => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_LIST_REMOVE, key: 'id', value: id})
)

export const addNewTransformation = () => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_PUSH_NEW_TRANSFORMATION})
export const addNewActionSet = () => (dispatch, getState) => {
    const idx = editSelectors.selectedTransformation(getState())
    if(idx === null) return;
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_PUSH_NEW_ACTION_SET, transformationIndex: idx})
}

export const selectActionSet = actionSet => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_ACTION_SET_SELECTED, actionSet})
export const selectTransformation = transformation => dispatch => {
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_TRANSFORMATION_SELECTED, transformation})
    dispatch(selectActionSet(null))
    dispatch(resetEditAction())
}

export const updateTransformation = (key, value) => (dispatch, getState) => {
    const idx = editSelectors.selectedTransformation(getState())
    if(idx === null) return;
    dispatch(updateTransformationSet(`transformations.${idx}.${key}`, value))
}

export const updateActionSet = (key, value) => (dispatch, getState) => {
    const transformationIdx = editSelectors.selectedTransformation(getState())
    const actionSetIdx = editSelectors.selectedActionSet(getState())
    if(transformationIdx === null || actionSetIdx === null) return;
    dispatch(updateTransformationSet(`transformations.${transformationIdx}.orderedConditionalActionSets.${actionSetIdx}.${key}`, value))
}

export const updateActionSetGroup = value => (dispatch, getState) => {
    dispatch(updateActionSet(`actionSet.propertyGroupId`, value.id))
    const transformationSet = editSelectors.getTransformationSet(getState())
    dispatch(getTradeItemPropertiesUpAndDown(transformationSet.taxonomyId, value.id, transformationSet.tradeItemCategory.code))
}

// get transformation set
export const getTransformationSet = (id) => dispatch => api.getTransformationSet(id).then(res => res.data).then(transformationSet => {
    dispatch(setTransformationSet(transformationSet))
    // if(transformationSet.scope) dispatch(getBusinessRulesSets(null, transformationSet.scope))
})

// get taxonomies
export const getTaxonomies = () => dispatch => call(dispatch, taxonomiesApi.getTaxonomies, {
    REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TAXONOMIES_REQUEST,
    FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TAXONOMIES_FAILURE,
  }).then(results =>  dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TAXONOMIES_SUCCESS, results}))
export const resetTaxonomies = () => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TAXONOMIES_RESET})

// get trade item categories
export const getTradeItemCategories = () => dispatch => call(dispatch, tradeItemCategoriesApi.getTradeItemCategories, {
    REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRADE_ITEM_CATEGORIES_REQUEST,
    FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRADE_ITEM_CATEGORIES_FAILURE,
  }).then(results =>  dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRADE_ITEM_CATEGORIES_SUCCESS, results}))
export const resetTradeItemCategories = () => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRADE_ITEM_CATEGORIES_RESET})

// get groups
export const getPropertiesGroups = () => dispatch => call(dispatch, propertiesApi.getTradeItemPropertiesGroups, {
    REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_GROUPS_REQUEST,
    FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_GROUPS_FAILURE,
  }).then(results =>  dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_GROUPS_SUCCESS, results}))
export const resetPropertiesGroups = () => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_GROUPS_RESET})

// get actions definitions
export const getActionsDefinitions = () => dispatch => call(dispatch, api.getActionDefinitions, {
    REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_ACTIONS_DEF_SETS_REQUEST,
    FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_ACTIONS_DEF_SETS_FAILURE,
  }).then(results =>  dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_ACTIONS_DEF_SETS_SUCCESS, results}))
export const resetActionsDefinitions = () => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_ACTIONS_DEF_SETS_RESET})

// get business rule set for scope and group
export const getBusinessRulesSets = (taxonomyId, propertyGroupId, tradeItemCategoryCode) => dispatch => call(dispatch, () => businessRulesApi.getBusinessRulesSetsByTradeItemCategoryAndGroup(taxonomyId, propertyGroupId, tradeItemCategoryCode), {
    REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_BUSINESS_RULES_SETS_REQUEST,
    FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_BUSINESS_RULES_SETS_FAILURE,
  }).then(results =>  dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_BUSINESS_RULES_SETS_SUCCESS, results}))
export const resetBusinessRulesSets = () => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_BUSINESS_RULES_SETS_RESET})

// get trade item properties for scope and group
export const getTradeItemProperties = (taxonomyId, propertyGroupId, tradeItemCategoryCode) => dispatch => call(dispatch, () => propertiesApi.getTradeItemPropertiesLightByTaxonomyIdAndPropertyGroupIdAndTradeItemCategoryCode({taxonomyId, propertyGroupId, tradeItemCategoryCode}), {
      REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_REQUEST,
      FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_FAILURE,
    }).then(results =>  dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_SUCCESS, results}))
export const resetTradeItemProperties = () => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_RESET})

// get trade item properties for scope and group
export const getTradeItemPropertiesUpAndDown = (taxonomyId, propertyGroupId, tradeItemCategoryCode) => dispatch => call(dispatch, () => propertiesApi.getTradeItemPropertiesLightUpAndDownByTaxonomyIdAndPropertyGroupIdAndTradeItemCategoryCode({taxonomyId, propertyGroupId, tradeItemCategoryCode}), {
    REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_REQUEST,
    FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_FAILURE,
  }).then(results =>  dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_SUCCESS, results}))

// edit action
export const editAction = (action, actionIndex) => (dispatch, getState) => {
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_ACTION_RECEIVED, action})
    if(actionIndex)
        dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_ACTION_INDEX_SELECTED, actionIndex})
}
export const changeAction = action => (dispatch, getState) => {
    if(!editSelectors.isActionAddMode(getState())) dispatch(updateAction(action))
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_ACTION_RECEIVED, action})
}
export const editActionKey = (key, value) => (dispatch, getState) => {
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_UPDATE_ACTION_KEY_RECEIVED, key, value})
}
export const resetEditAction = () => dispatch => {
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_ACTION_RECEIVED, action:null})
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_ACTION_INDEX_SELECTED, actionIndex:null})
}
export const addAction = action => (dispatch, getState) => {
    const transformationIndex = editSelectors.selectedTransformation(getState())
    const actionSetIndex = editSelectors.selectedActionSet(getState())
    if(transformationIndex === null || actionSetIndex === null) return;
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_PUSH_ACTION_RECEIVED, action, transformationIndex, actionSetIndex})
    dispatch(resetEditAction())
}
export const updateAction = action => (dispatch, getState) => {
    const transformationIndex = editSelectors.selectedTransformation(getState())
    const actionSetIndex = editSelectors.selectedActionSet(getState())
    const actionIndex = editSelectors.selectedActionIndex(getState())
    if(transformationIndex === null || actionSetIndex === null || actionIndex === -1) return;
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_UPDATE_ACTION_RECEIVED, action, transformationIndex, actionSetIndex, actionIndex})
    dispatch(resetEditAction())
}
export const switchActions = (fromIndex, toIndex) => (dispatch, getState) => {
    const transformationIndex = editSelectors.selectedTransformation(getState())
    const actionSetIndex = editSelectors.selectedActionSet(getState())
    if(transformationIndex === null || actionSetIndex === null) return;
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_SWITCH_ACTIONS_RECEIVED, transformationIndex, actionSetIndex, fromIndex, toIndex})
}
export const switchActionsSets = (fromIndex, toIndex) => (dispatch, getState) => {
    const transformationIndex = editSelectors.selectedTransformation(getState())
    if(transformationIndex === null) return;
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_SWITCH_ACTION_SET_RECEIVED, transformationIndex, fromIndex, toIndex})
    dispatch(selectActionSet(null))
}
export const switchTransformations = (fromIndex, toIndex) => (dispatch, getState) => {
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_SWITCH_TRANSFORMATION_RECEIVED, fromIndex, toIndex})
    dispatch(selectTransformation(null))
}
export const deleteTransformation = transformationIndex => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_DELETE_TRANSFORMATION, transformationIndex})
export const deleteActionSet = actionSetIndex => (dispatch, getState) => {
    const transformationIndex = editSelectors.selectedTransformation(getState())
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_DELETE_ACTION_SET, transformationIndex, actionSetIndex})
}
export const deleteAction = actionIndex => (dispatch, getState) => {
    const transformationIndex = editSelectors.selectedTransformation(getState())
    const actionSetIndex = editSelectors.selectedActionSet(getState())
    dispatch(resetEditAction())
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_DELETE_ACTION, transformationIndex, actionSetIndex, actionIndex})
}

export const setPlaygroundTradeItemId = tradeItemId => dispatch => dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_PLAYGROUND_TRADE_ITEM_SELECTED, tradeItemId})

export const doPlayground = (tradeItemId, actionSet) => dispatch => processingApi.doPlaygroundProcess(tradeItemId, actionSet).then(res => {
    dispatch({type: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_PLAYGROUND_RESULT_RECEIVE, result: res.data})
})
import { combineReducers } from 'redux'
import dotProp from "dot-prop-immutable"
import move from 'lodash-move'
import isEmpty from "lodash/isEmpty"
import createReducer from "../common/reducers/createReducer"
import createList from "../common/reducers/createList"
import * as types from './types'
import * as utils from "./utils"


// edit reducer
//
const taxonomiesActions = {
  RESET: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TAXONOMIES_RESET,
  REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TAXONOMIES_REQUEST,
  SUCCESS: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TAXONOMIES_SUCCESS,
  FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TAXONOMIES_FAILURE,
  INVALIDATE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TAXONOMIES_INVALIDATE,
  REMOVE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TAXONOMIES_REMOVE,
}

const tradeItemCategoriesActions = {
  RESET: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRADE_ITEM_CATEGORIES_RESET,
  REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRADE_ITEM_CATEGORIES_REQUEST,
  SUCCESS: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRADE_ITEM_CATEGORIES_SUCCESS,
  FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRADE_ITEM_CATEGORIES_FAILURE,
  INVALIDATE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRADE_ITEM_CATEGORIES_INVALIDATE,
  REMOVE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRADE_ITEM_CATEGORIES_REMOVE,
}

const groupsActions = {
  RESET: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_GROUPS_RESET,
  REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_GROUPS_REQUEST,
  SUCCESS: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_GROUPS_SUCCESS,
  FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_GROUPS_FAILURE,
  INVALIDATE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_GROUPS_INVALIDATE,
  REMOVE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_GROUPS_REMOVE,
}

const businessRuleSetsActions = {
  RESET: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_BUSINESS_RULES_SETS_RESET,
  REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_BUSINESS_RULES_SETS_REQUEST,
  SUCCESS: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_BUSINESS_RULES_SETS_SUCCESS,
  FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_BUSINESS_RULES_SETS_FAILURE,
  INVALIDATE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_BUSINESS_RULES_SETS_INVALIDATE,
  REMOVE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_BUSINESS_RULES_SETS_REMOVE,
}

const actionsDefinitionsActions = {
  RESET: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_ACTIONS_DEF_SETS_RESET,
  REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_ACTIONS_DEF_SETS_REQUEST,
  SUCCESS: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_ACTIONS_DEF_SETS_SUCCESS,
  FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_ACTIONS_DEF_SETS_FAILURE,
  INVALIDATE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_ACTIONS_DEF_SETS_INVALIDATE,
  REMOVE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_ACTIONS_DEF_SETS_REMOVE,
}

const tradeItemPropertiesActions = {
  RESET: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_RESET,
  REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_REQUEST,
  SUCCESS: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_SUCCESS,
  FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_FAILURE,
  INVALIDATE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_INVALIDATE,
  REMOVE: types.APP_TRANSFORMATION_MGMT_SETS_EDIT_PROPERTIES_REMOVE,
}

const edit = combineReducers({
  taxonomies: createList(taxonomiesActions),
  tradeItemCategories: createList(tradeItemCategoriesActions),
  groups: createList(groupsActions),
  businessRuleSets: createList(businessRuleSetsActions),
  actionsDefinitions: createList(actionsDefinitionsActions),
  tradeItemProperties: createList(tradeItemPropertiesActions),
  transformationSet: createReducer(utils.getDefaultTransformationSet(), {
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_RECEIVE]: (state, action) => action.transformationSet || utils.getDefaultTransformationSet(),
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_UPDATE]: (state, action) => dotProp.set(state, action.key, action.value),
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_PUSH_NEW_TRANSFORMATION]: (state, action) => dotProp.set(state, 'transformations', list => isEmpty(list) ? [utils.getDefaultTransformation()] : [...list, utils.getDefaultTransformation()]),
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_SWITCH_TRANSFORMATION_RECEIVED]: (state, action) => {    
        return dotProp.set(
          state, 
          `transformations`, 
          move(
            dotProp.get(state, `transformations`),
            action.fromIndex,
            action.toIndex
          ))
    },
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_DELETE_TRANSFORMATION]: (state, action) => dotProp.delete(state, `transformations.${action.transformationIndex}`),
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_PUSH_NEW_ACTION_SET]: (state, action) => dotProp.set(state, `transformations.${action.transformationIndex}.orderedConditionalActionSets`, list => isEmpty(list) ? [utils.getDefaultActionSet()] : [...list, utils.getDefaultActionSet()]),
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_SWITCH_ACTION_SET_RECEIVED]: (state, action) => {    
        return dotProp.set(
          state, 
          `transformations.${action.transformationIndex}.orderedConditionalActionSets`, 
          move(
            dotProp.get(state, `transformations.${action.transformationIndex}.orderedConditionalActionSets`),
            action.fromIndex,
            action.toIndex
          ))
    },
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_DELETE_ACTION_SET]: (state, action) => dotProp.delete(state, `transformations.${action.transformationIndex}.orderedConditionalActionSets.${action.actionSetIndex}`),
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_PUSH_ACTION_RECEIVED]: (state, action) => dotProp.set(state, `transformations.${action.transformationIndex}.orderedConditionalActionSets.${action.actionSetIndex}.actionSet.orderedParametrizedActions`, list => isEmpty(list) ? [action.action] : [...list, action.action]),
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_UPDATE_ACTION_RECEIVED]: (state, action) => dotProp.set(state, `transformations.${action.transformationIndex}.orderedConditionalActionSets.${action.actionSetIndex}.actionSet.orderedParametrizedActions.${action.actionIndex}`, action.action),
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_SWITCH_ACTIONS_RECEIVED]: (state, action) => {    
        return dotProp.set(
          state, 
          `transformations.${action.transformationIndex}.orderedConditionalActionSets.${action.actionSetIndex}.actionSet.orderedParametrizedActions`, 
          move(
            dotProp.get(state, `transformations.${action.transformationIndex}.orderedConditionalActionSets.${action.actionSetIndex}.actionSet.orderedParametrizedActions`),
            action.fromIndex,
            action.toIndex
          ))
    },
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_DELETE_ACTION]: (state, action) => dotProp.delete(
      state, 
      `transformations.${action.transformationIndex}.orderedConditionalActionSets.${action.actionSetIndex}.actionSet.orderedParametrizedActions.${action.actionIndex}`
    ),
  }),
  selectedTransformation: createReducer(null, {
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_TRANSFORMATION_SELECTED]: (state, action) => action.transformation === null ? null : action.transformation,   
  }),
  selectedActionSet: createReducer(null, {
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_ACTION_SET_SELECTED]: (state, action) => action.actionSet === null ? null : action.actionSet,   
  }),
  action: createReducer(null, {
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_ACTION_RECEIVED]: (state, action) => action.action || null,
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_UPDATE_ACTION_KEY_RECEIVED]: (state, action) => dotProp.set(state, `${action.key}`, action.value),
  }),
  selectedActionIndex: createReducer(null, {
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_ACTION_INDEX_SELECTED]: (state, action) => action.actionIndex,   
  }),
  playgroundTradeItemId: createReducer(null, {
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_PLAYGROUND_TRADE_ITEM_SELECTED]: (state, action) => action.tradeItemId || null,   
  }),
  playgroundResult: createReducer(null, {
    [types.APP_TRANSFORMATION_MGMT_SETS_EDIT_TRANSFORMATION_SET_PLAYGROUND_RESULT_RECEIVE]: (state, action) => action.result || null,   
  }),
})


// list reducer
//
const transformationSetsActions = {
  RESET: types.APP_TRANSFORMATION_MGMT_SETS_LIST_RESET,
  REQUEST: types.APP_TRANSFORMATION_MGMT_SETS_LIST_REQUEST,
  SUCCESS: types.APP_TRANSFORMATION_MGMT_SETS_LIST_SUCCESS,
  FAILURE: types.APP_TRANSFORMATION_MGMT_SETS_LIST_FAILURE,
  INVALIDATE: types.APP_TRANSFORMATION_MGMT_SETS_LIST_INVALIDATE,
  REMOVE: types.APP_TRANSFORMATION_MGMT_SETS_LIST_REMOVE,
}

const list = combineReducers({
  rows: createList(transformationSetsActions),
  filters: createReducer(utils.getDefaultListFilters(), {[types.APP_TRANSFORMATION_MGMT_SETS_LIST_FILTERS_RECEIVE]: (state, action) => action.filters || utils.getDefaultListFilters()}),
  total: createReducer(0, {[types.APP_TRANSFORMATION_MGMT_SETS_LIST_TOTAL_RECEIVE]: (state, action) => action.total || 0}),
})


// Combine reducer to get default reducer
//
export default combineReducers({
  list,
  edit,
})

import dotProp from "dot-prop-immutable";
import { constant } from "lodash";
import { combineReducers } from "redux";
import createReducer from "../common/reducers/createReducer";
import createList from "../common/reducers/createList";
import * as types from "./types";
import { getDefaultAssociationsFilters } from "./utils";

// Taxonomies reducer
//
const listTaxonomiesActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMIES_LIST_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMIES_LIST_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMIES_LIST_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMIES_LIST_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMIES_LIST_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMIES_LIST_REMOVE
};

const taxonomies = combineReducers({
  results: createList(listTaxonomiesActions),
  selected: createReducer(null, {
    [types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMY_SELECTED_RECEIVE]: (
      state,
      action
    ) => action.taxonomy || null
  })
});

// Trade item categories reducer
//
const listTradeItemCategoriesActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORIES_LIST_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORIES_LIST_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORIES_LIST_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORIES_LIST_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORIES_LIST_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORIES_LIST_REMOVE
};

const tradeItemCategories = combineReducers({
  results: createList(listTradeItemCategoriesActions),
  selected: createReducer(null, {
    [types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORY_SELECTED_RECEIVE]: (
      state,
      action
    ) => action.tradeItemCategory || null
  })
});

// Groups reducer
//
const listGroupsActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_GROUPS_LIST_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_GROUPS_LIST_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_GROUPS_LIST_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_GROUPS_LIST_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_GROUPS_LIST_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_PROPERTIES_GROUPS_LIST_REMOVE
};

const groups = combineReducers({
  results: createList(listGroupsActions),
  selected: createReducer(null, {
    [types.APP_TRADE_ITEMS_PROPERTIES_GROUP_SELECTED_RECEIVE]: (
      state,
      action
    ) => action.group || null
  })
});

// Retailers reducer
//
const listRetailersActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_RETAILERS_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_RETAILERS_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_RETAILERS_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_RETAILERS_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_RETAILERS_INVALIDATE
};

// Connectors reducer
//
const listConnectorsActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_CONNECTORS_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_CONNECTORS_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_CONNECTORS_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_CONNECTORS_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_CONNECTORS_INVALIDATE
};

// Retailers reducer
//
const listBusinessRuleSetActions = {
  RESET: types.APP_BUSINESS_RULES_SET_LIST_RESET,
  REQUEST: types.APP_BUSINESS_RULES_SET_LIST_REQUEST,
  SUCCESS: types.APP_BUSINESS_RULES_SET_LIST_SUCCESS,
  FAILURE: types.APP_BUSINESS_RULES_SET_LIST_FAILURE,
  INVALIDATE: types.APP_BUSINESS_RULES_SET_LIST_INVALIDATE
};

// Properties reducer
//
const listPropertiesActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_LIST_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_LIST_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_LIST_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_LIST_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_LIST_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_PROPERTIES_LIST_REMOVE
};

const properties = combineReducers({
  results: createList(listPropertiesActions),
  selected: createReducer(null, {
    [types.APP_TRADE_ITEMS_PROPERTY_SELECTED_RECEIVE]: (state, action) =>
      action.property || null,
    [types.APP_TRADE_ITEMS_PROPERTIES_GROUP_SELECTED_RECEIVE]: constant(null),
    [types.APP_TRADE_ITEMS_PROPERTIES_TRADE_ITEM_CATEGORY_SELECTED_RECEIVE]: constant(null),
    [types.APP_TRADE_ITEMS_PROPERTIES_TAXONOMY_SELECTED_RECEIVE]: constant(null)
  }),
  new: createReducer(null, {
    [types.APP_TRADE_ITEMS_PROPERTY_NEW_RECEIVE]: (state, action) =>
      action.property
  }),
  filterValue: createReducer("", {
    [types.APP_TRADE_ITEMS_PROPERTY_FILTER_VALUE_RECEIVE]: (state, action) =>
      action.value || null
  })
});

// Value groups reducer
//
const listValueGroupsActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUPS_LIST_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUPS_LIST_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUPS_LIST_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUPS_LIST_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUPS_LIST_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUPS_LIST_REMOVE
};

const valueGroups = combineReducers({
  results: createList(listValueGroupsActions),
  edited: createReducer(null, {
    [types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUP_EDITED_RECEIVE]: (
      state,
      action
    ) => action.valueGroup
  }),
  currentLanguage: createReducer("fr-FR", {
    [types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUP_LANGUAGE_SELECTED_RECEIVE]: (
      state,
      action
    ) => action.language
  }),
  newValuesGroup: createReducer("", {
    [types.APP_TRADE_ITEMS_PROPERTIES_VALUE_GROUP_NEW_VALUES_GROUP_RECEIVE]: (
      state,
      action
    ) => action.values || ""
  })
});

// Languages reducer
//
const listLanguagesActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_LANGUAGES_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_LANGUAGES_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_LANGUAGES_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_LANGUAGES_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_LANGUAGES_INVALIDATE
};

// Aliases
//
const listAliasesActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_INVALIDATE
};

const listAliasPropertiesActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_PROPERTIES_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_PROPERTIES_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_PROPERTIES_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_PROPERTIES_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_PROPERTIES_INVALIDATE
};

const listAliasGroupActions = {
  RESET: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_GROUP_RESET,
  REQUEST: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_GROUP_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_GROUP_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_GROUP_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_PROPERTIES_ALIASES_GROUP_INVALIDATE
};

const aliases = combineReducers({
  results: createList(listAliasesActions),
  alias: createReducer(
    {},
    {
      [types.APP_TRADE_ITEMS_PROPERTIES_ALIAS_RECEIVE]: (state, action) =>
        action.alias || {},
      [types.APP_TRADE_ITEMS_PROPERTIES_ALIAS_VALUE_RECEIVE]: (state, action) =>
        dotProp.set(state, action.key, action.value),
      [types.APP_TRADE_ITEMS_PROPERTIES_ALIAS_PUSH]: (state, action) => {
        return {
          ...state,
          tradeItemProperties: [
            ...(state.tradeItemProperties || []),
            action.tradeItemProperty
          ]
        };
      },
      [types.APP_TRADE_ITEMS_PROPERTIES_ALIAS_REMOVE]: (state, action) =>
        dotProp.delete(state, `tradeItemProperties.${action.index}`)
    }
  ),
  tradeItemProperties: createList(listAliasPropertiesActions),
  groups: createList(listAliasGroupActions),
  tradeItemProperty: createReducer(null, {
    [types.APP_TRADE_ITEMS_PROPERTY_ALIAS_RECEIVE]: (state, action) =>
      action.tradeItemProperty || {},
    [types.APP_TRADE_ITEMS_PROPERTY_ALIAS_RESET]: (state, action) => null,
    [types.APP_TRADE_ITEMS_PROPERTY_ALIAS_VALUE_RECEIVE]: (state, action) =>
      dotProp.set(state, action.key, action.value)
  })
});

// Associations reducer
//
const listAssociationsActions = {
  RESET: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_RESET,
  REQUEST: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_FAILURE,
  INVALIDATE: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_INVALIDATE,
  REMOVE: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_REMOVE,
  UPDATE: types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_LIST_UPDATE
};

const listMandatoryLevelActions = {
  RESET: types.APP_TRADE_ITEMS_MANDATORY_LEVEL_LIST_RESET,
  REQUEST: types.APP_TRADE_ITEMS_MANDATORY_LEVEL_LIST_REQUEST,
  SUCCESS: types.APP_TRADE_ITEMS_MANDATORY_LEVEL_LIST_SUCCESS,
  FAILURE: types.APP_TRADE_ITEMS_MANDATORY_LEVEL_LIST_FAILURE,
  REMOVE: types.APP_TRADE_ITEMS_MANDATORY_LEVEL_LIST_REMOVE
};

const associations = combineReducers({
  list: createList(listAssociationsActions),
  total: createReducer(0, {
    [types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_TOTAL_RECEIVE]: (
      state,
      action
    ) => action.total || 0
  }),
  filters: createReducer(getDefaultAssociationsFilters(), {
    [types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_FILTERS_SET]: (
      state,
      action
    ) => action.filters || getDefaultAssociationsFilters()
  }),
  newAssociation: createReducer(null, {
    [types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_NEW_RECEIVE]: (
      state,
      action
    ) => action.association || null
  }),
  mandatoryLevels: createList(listMandatoryLevelActions),
  enrichmentMandatoryLevels: createList(listMandatoryLevelActions),
  expanded: createReducer(
    {},
    {
      [types.APP_ASSOCIATIONS_LIST_EXPANDED_SET]: (state, action) =>
        action.expanded || {}
    }
  ),
  editAssociation: createReducer(null, {
    [types.APP_TRADE_ITEMS_RETAILERS_ASSOCIATIONS_EDIT_RECEIVE]: (
      state,
      action
    ) => action.association || null
  })
});

// Combine reducer to get default reducer
//
export default combineReducers({
  taxonomies,
  tradeItemCategories,
  groups,
  retailers: createList(listRetailersActions),
  connectors: createList(listConnectorsActions),
  businessRuleSets: createList(listBusinessRuleSetActions),
  properties,
  associations,
  valueGroups,
  languages: createList(listLanguagesActions),
  aliases
});

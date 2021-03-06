import { combineReducers } from "redux";
import createList from "../common/reducers/createList";
import createResource from "../common/reducers/createResource";
import * as types from "./types";

// List reducer
//
const listActions = {
  RESET: types.APP_MANUFACTURERS_LIST_RESET,
  REQUEST: types.APP_MANUFACTURERS_LIST_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_LIST_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_LIST_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_LIST_INVALIDATE
};

const list = createList(listActions);

// Edit reducer
//
const editManufacturerActions = {
  RESET: types.APP_MANUFACTURERS_EDIT_RESET,
  REQUEST: types.APP_MANUFACTURERS_EDIT_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_EDIT_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_EDIT_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_EDIT_INVALIDATE
};

const listEntitiesActions = {
  RESET: types.APP_MANUFACTURERS_EDIT_ENTITIES_RESET,
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITIES_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_EDIT_ENTITIES_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITIES_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_EDIT_ENTITIES_INVALIDATE,
  REMOVE: types.APP_MANUFACTURERS_EDIT_ENTITIES_REMOVE
};

const editManufacturerEntityActions = {
  RESET: types.APP_MANUFACTURERS_EDIT_ENTITY_RESET,
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITY_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_EDIT_ENTITY_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITY_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_EDIT_ENTITY_INVALIDATE
};

const listMatrixMappingsActions = {
  RESET: types.APP_MANUFACTURERS_EDIT_ENTITY_MATRIX_MAPPINGS_RESET,
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITY_MATRIX_MAPPINGS_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_EDIT_ENTITY_MATRIX_MAPPINGS_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITY_MATRIX_MAPPINGS_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_EDIT_ENTITY_MATRIX_MAPPINGS_INVALIDATE
};

const listLanguagesActions = {
  RESET: types.APP_MANUFACTURERS_EDIT_ENTITY_LANGUAGES_RESET,
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITY_LANGUAGES_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_EDIT_ENTITY_LANGUAGES_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITY_LANGUAGES_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_EDIT_ENTITY_LANGUAGES_INVALIDATE
};

const listTargetMarketsActions = {
  RESET: types.APP_MANUFACTURERS_EDIT_ENTITY_TARGET_MARKETS_RESET,
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITY_TARGET_MARKETS_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_EDIT_ENTITY_TARGET_MARKETS_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITY_TARGET_MARKETS_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_EDIT_ENTITY_TARGET_MARKETS_INVALIDATE
};

const listTaxonomiesActions = {
  RESET: types.APP_MANUFACTURERS_EDIT_ENTITY_TAXONOMIES_RESET,
  REQUEST: types.APP_MANUFACTURERS_EDIT_ENTITY_TAXONOMIES_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_EDIT_ENTITY_TAXONOMIES_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ENTITY_TAXONOMIES_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_EDIT_ENTITY_TAXONOMIES_INVALIDATE
};

const businessRulesListActions = {
  RESET: types.APP_MANUFACTURERS_BUSINESS_RULES_LIST_RESET,
  REQUEST: types.APP_MANUFACTURERS_BUSINESS_RULES_LIST_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_BUSINESS_RULES_LIST_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_BUSINESS_RULES_LIST_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_BUSINESS_RULES_LIST_INVALIDATE,
  REMOVE: types.APP_MANUFACTURERS_BUSINESS_RULES_LIST_REMOVE
};

const exportActionsActions = {
  RESET: types.APP_MANUFACTURERS_EDIT_ACTIONS_RESET,
  REQUEST: types.APP_MANUFACTURERS_EDIT_ACTIONS_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_EDIT_ACTIONS_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ACTIONS_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_EDIT_ACTIONS_INVALIDATE
};

const exportActionsPdfActions = {
  RESET: types.APP_MANUFACTURERS_EDIT_ACTIONS_PDF_RESET,
  REQUEST: types.APP_MANUFACTURERS_EDIT_ACTIONS_PDF_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_EDIT_ACTIONS_PDF_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_EDIT_ACTIONS_PDF_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_EDIT_ACTIONS_PDF_INVALIDATE
};

const exportImageCategories = {
  RESET: types.APP_MANUFACTURERS_EDIT_IMAGE_CATEGORIES_RESET,
  REQUEST: types.APP_MANUFACTURERS_EDIT_IMAGE_CATEGORIES_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_EDIT_IMAGE_CATEGORIES_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_EDIT_IMAGE_CATEGORIES_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_EDIT_IMAGE_CATEGORIES_INVALIDATE
};

const retailerListActions = {
  RESET: types.APP_MANUFACTURERS_RETAILERS_LIST_RESET,
  REQUEST: types.APP_MANUFACTURERS_RETAILERS_LIST_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_RETAILERS_LIST_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_RETAILERS_LIST_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_RETAILERS_LIST_INVALIDATE,
  REMOVE: types.APP_MANUFACTURERS_RETAILERS_LIST_REMOVE
};

const usersListActions = {
  RESET: types.APP_MANUFACTURERS_USERS_LIST_RESET,
  REQUEST: types.APP_MANUFACTURERS_USERS_LIST_REQUEST,
  SUCCESS: types.APP_MANUFACTURERS_USERS_LIST_SUCCESS,
  FAILURE: types.APP_MANUFACTURERS_USERS_LIST_FAILURE,
  INVALIDATE: types.APP_MANUFACTURERS_USERS_LIST_INVALIDATE,
  REMOVE: types.APP_MANUFACTURERS_USERS_LIST_REMOVE
};

const editEntity = combineReducers({
  manufacturerEntity: createResource(editManufacturerEntityActions),
  matrixMappings: createList(listMatrixMappingsActions),
  targetMarkets: createList(listTargetMarketsActions),
  taxonomies: createList(listTaxonomiesActions),
  businessRulesSets: createList(businessRulesListActions),
  languages: createList(listLanguagesActions),
  imageCategories: createList(exportImageCategories),
  retailers: createList(retailerListActions)
});

const edit = combineReducers({
  manufacturer: createResource(editManufacturerActions),
  entities: createList(listEntitiesActions),
  editEntity,
  exportActions: createList(exportActionsActions),
  pdfExportActions: createList(exportActionsPdfActions),
  users: createList(usersListActions)
});

// Combine reducer to get default reducer
//
export default combineReducers({
  list,
  edit
});

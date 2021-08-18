import axios from "axios";
import pick from "lodash/pick";
import forEach from "lodash/forEach"
import * as env from "../../environment/index.js";

// Set the services URIs
//

const BASE_PROPERTY_RETAILER_ASSOCIATION = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/PropertyRetailerAssociation`;
const BASE_PROPERTY_GROUP = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/PropertyGroup`;

const makeURL = path => `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/TradeItemProperties/${path}`;
const GET_TRADE_ITEM_PROPERTY = makeURL("Get");
const GET_TRADE_ITEM_PROPETIES_BY_TRADE_ITEM_CATEGORY = makeURL("GetByPropertyCategory");
const GET_TRADE_ITEM_PROPETIES_BY_GROUP = makeURL(`GetByPropertyGroup`);
const GET_TRADE_ITEM_PROPETIES_BY_TRADEITEMCATEGORY_AND_GROUP = makeURL(
  `GetByPropertyCategoryAndGroup`
);
const GET_TRADE_ITEM_PROPETIES_BY_TRADEITEMCATEGORY_AND_GROUP_ID = makeURL(
  `GetByPropertyCategoryAndGroupId`
);
const GET_TRADE_ITEM_PROPETIES_LIGHT_BY_TRADE_ITEM_CATEGORY = makeURL(
  "GetLightByPropertyTradeItemCategory"
);
const GET_TRADE_ITEM_PROPETIES_LIGHT_BY_GROUP = makeURL(
  `GetLightByPropertyGroup`
);
const GET_TRADE_ITEM_PROPETIES_LIGHT_BY_TRADE_ITEM_CATEGORY_CODE_AND_GROUP_ID = makeURL(
  `GetLightByTradeItemCategoryAndPropertyGroupId`
);
const GET_TRADE_ITEM_PROPETIES_LIGHT_UP_AND_DOWN_BY_TRADE_ITEM_CATEGORY_CODE_AND_GROUP_ID = makeURL(
  `GetLightUpAndDownByTradeItemCategoryAndPropertyGroupId`);
const GET_TRADE_ITEM_PROPETIES_LIGHT_BY_TRADE_ITEM_CATEGORY_CODE_AND_GROUP_CODE = makeURL(
  `GetLightByPropertyCategoryAndGroup`
);
const CREATE_TRADE_ITEM_PROPERTY = type =>
  makeURL(`Create/${type}TradeItemProperty`);
const UPDATE_TRADE_ITEM_PROPERTY = type =>
  makeURL(`Update/${type}TradeItemProperty`);
const DELETE_TRADE_ITEM_PROPERTY = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/TradeItemProperties`;
const GET_TRADE_ITEM_CATEGORIES = makeURL(`GetTradeItemCategories`);

const GET_TRADE_ITEM_PROPETIES_GROUPS = `${BASE_PROPERTY_GROUP}`;

const GET_TRADE_ITEM_VALUE_GROUP = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/ValuesGroup/GetGroupValuesById`;
const GET_TRADE_ITEM_PROPERTIES_VALUE_GROUPS = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/ValuesGroup`;
const GET_VALUES_GROUPS_BY_IDS = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/ValuesGroup/GetGroupValuesByIds`;
const CREATE_TRADE_ITEM_PROPERTIES_VALUE_GROUPS = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/ValuesGroup`;
const UPDATE_TRADE_ITEM_PROPERTIES_VALUE_GROUPS = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/ValuesGroup`;
const IMPORT_TRADE_ITEM_PROPERTIES_VALUE_GROUPS = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/ValuesGroup/import`;
const BASE_ALIAS = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/PropertyAlias`;
const GET_ALL_ALIASES = `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/PropertyAlias/GetAll`;

const GET_PAGED_PROPERTY_RETAILER_ASSOCIATION = `${BASE_PROPERTY_RETAILER_ASSOCIATION}/GetPagedForList`;
const CREATE_ASSO_IN_MASS = `${BASE_PROPERTY_RETAILER_ASSOCIATION}/CreatePropertyRetailerAssociationsInMass`;
const GET_MANDATORY_LEVELS = `${BASE_PROPERTY_RETAILER_ASSOCIATION}/GetMandatoryLevels`;
const GET_ASSOCIATIONS_BY_PROPERTY_AND_RETAILERS = `${BASE_PROPERTY_RETAILER_ASSOCIATION}/GetByPropertyIdAndRetailerIds

`;

// Get trade item properties by trade item category
//
export const getTradeItemPropertiesByTradeItemCategory = (taxonomyId, tradeItemCategoryCode) =>
  axios.get(`${GET_TRADE_ITEM_PROPETIES_BY_TRADE_ITEM_CATEGORY}`, {
    params: {
      taxonomyId,
      tradeItemCategoryCode
    }
  });

// Get trade item properties by group
//
export const getTradeItemPropertiesByGroup = (taxonomyId, propertyGroupCode) =>
  axios.get(`${GET_TRADE_ITEM_PROPETIES_BY_GROUP}`, {
    params: {
      taxonomyId,
      propertyGroupCode
    }
  });

// Get trade item properties by group and trade item category
//
export const getTradeItemPropertiesByGroupCodeAndTradeItemCategory = (
  taxonomyId,
  propertyGroupCode,
  tradeItemCategoryCode
) =>
  axios.get(`${GET_TRADE_ITEM_PROPETIES_BY_TRADEITEMCATEGORY_AND_GROUP}`, {
    params: {
      taxonomyId,
      tradeItemCategoryCode,
      propertyGroupCode
    }
  });

// Get trade item properties by group and trade item category
//
export const getTradeItemPropertiesByGroupIdAndTradeItemCategory = (
  taxonomyId,
  propertyGroupId,
  tradeItemCategoryCode
) =>
  axios.get(`${GET_TRADE_ITEM_PROPETIES_BY_TRADEITEMCATEGORY_AND_GROUP_ID}`, {
    params: {
      taxonomyId,
      tradeItemCategoryCode,
      propertyGroupId
    }
  });

// Get a single full trade item property
//
const getTradeItemProperty = propertyId =>
  axios.get(`${GET_TRADE_ITEM_PROPERTY}/${propertyId}`);

 export const getTradeItemPropertiesLightByTaxonomyIdAndPropertyGroupCodeAndTradeItemCategoryCode = ({
    taxonomyId,
    propertyGroupCode,
    tradeItemCategoryCode
  }) => {
    const getUrl = () => {
      if (taxonomyId && propertyGroupCode && tradeItemCategoryCode)
        return GET_TRADE_ITEM_PROPETIES_LIGHT_BY_TRADE_ITEM_CATEGORY_CODE_AND_GROUP_CODE;
      return undefined;
    };
    let url = getUrl();
    if (!url)
      return Promise.reject(
        "Missing both propertyGroupCode and propertyTradeItemCategoryCode arguments"
      );
    return axios.get(url, { params: {taxonomyId, tradeItemCategoryCode, propertyGroupCode } });
  };

export const getTradeItemPropertiesLightByTaxonomyIdAndPropertyGroupIdAndTradeItemCategoryCode = ({
  taxonomyId,
  propertyGroupId,
  tradeItemCategoryCode
}) => {
  const getUrl = () => {
    if (taxonomyId && propertyGroupId && tradeItemCategoryCode)
      return GET_TRADE_ITEM_PROPETIES_LIGHT_BY_TRADE_ITEM_CATEGORY_CODE_AND_GROUP_ID;
    if (tradeItemCategoryCode) return GET_TRADE_ITEM_PROPETIES_LIGHT_BY_TRADE_ITEM_CATEGORY;
    if (propertyGroupId) return GET_TRADE_ITEM_PROPETIES_LIGHT_BY_GROUP;
    return undefined;
  };
  let url = getUrl();
  if (!url)
    return Promise.reject(
      "Missing both propertyGroupId and propertyTradeItemCategoryCode arguments"
    );
  return axios.get(url, { params: {taxonomyId, tradeItemCategoryCode, propertyGroupId } });
};

export const getTradeItemPropertiesLightUpAndDownByTaxonomyIdAndPropertyGroupIdAndTradeItemCategoryCode = ({
  taxonomyId,
  propertyGroupId,
  tradeItemCategoryCode
}) => {
  const getUrl = () => {
    if (taxonomyId && propertyGroupId && tradeItemCategoryCode)
      return GET_TRADE_ITEM_PROPETIES_LIGHT_UP_AND_DOWN_BY_TRADE_ITEM_CATEGORY_CODE_AND_GROUP_ID;
    return undefined;
  };
  let url = getUrl();
  if (!url)
    return Promise.reject(
      "Missing both propertyGroupId and propertyTradeItemCategoryCode arguments"
    );
  return axios.get(url, { params: {taxonomyId, tradeItemCategoryCode, propertyGroupId } });
};

// A workaround because we can't get a fat property body by ID with a single request.
export const enrichLightProperty = async lightProperty => {
  const property = (await getTradeItemProperty(lightProperty.id)).data;
  property.valuesGroupId = lightProperty.valuesGroupId;
  return property;
};

// Get all the trade item categories
//
export const getTradeItemCategories = () =>
  axios.get(`${GET_TRADE_ITEM_CATEGORIES}`);

// Get all the groups
//
export const getTradeItemPropertiesGroups = () =>
  axios.get(`${GET_TRADE_ITEM_PROPETIES_GROUPS}`);

// Get values groups
//
export const  getGroupsValuesByIds = groupValuesIds => 

  axios.get(`${GET_VALUES_GROUPS_BY_IDS}`, {
    params: {
      groupValuesIds
    }
  })
  .then(function (apiResult) {
    const result = [];
    forEach(apiResult.data[0].values, (item, index) => {
      result.push({ value : item.code, label : item.values["en-GB"] });
    });

    return { data : result };
  });

// Get all value groups
//
export const getTradeItemValueGroups = () =>
  axios.get(GET_TRADE_ITEM_PROPERTIES_VALUE_GROUPS);

// Get a single value group
//
export const getTradeItemValueGroup = id =>
  axios.get(`${GET_TRADE_ITEM_VALUE_GROUP}/${id}`);

// Create a value group
export const createTradeItemValueGroup = valueGroup =>
  axios.post(CREATE_TRADE_ITEM_PROPERTIES_VALUE_GROUPS, valueGroup);

// Import a value group
export const importTradeItemValueGroup = valueGroup =>
  axios.post(IMPORT_TRADE_ITEM_PROPERTIES_VALUE_GROUPS, valueGroup);

export const updateTradeItemValueGroup = valueGroup =>
  axios.put(UPDATE_TRADE_ITEM_PROPERTIES_VALUE_GROUPS, valueGroup);

// Aliases
//
export const getAllAliases = () => axios.get(GET_ALL_ALIASES);
export const getAlias = id =>
  axios.get(`${BASE_ALIAS}`, {
    params: { id }
  });
export const createAlias = alias => axios.post(`${BASE_ALIAS}`, alias);
export const updateAlias = alias =>
  axios.put(`${BASE_ALIAS}`, alias, {
    params: { id: alias.id }
  });
export const deleteAlias = id =>
  axios.delete(`${BASE_ALIAS}`, {
    params: { id }
  });

// Create a new property
//
const propertyBody = property => {
  const body = pick(property, [
    "code",
    "propertyGroupIds",
    "tradeItemCategoryIds",
    "taxonomyId",
    "cardinality",
    "nullable",
    "notApplicableAuthorized",
    "isReadOnly"
  ]);
  if (property.discriminator === "ListProductPropertyViewModel") {
    body.valuesGroupId = property.valuesGroupId;
  }
  if (property.discriminator === "NumericProductPropertyViewModel") {
    body.numericType = property.numericType;
  }
  if (property.discriminator === "StringProductPropertyViewModel") {
    body.localizable = property.localizable;
  }
  return body;
};

export const createProperty = property => {
  const body = propertyBody(property);
  const type = property.discriminator.replace("ProductPropertyViewModel", "");
  const url = CREATE_TRADE_ITEM_PROPERTY(type);
  return axios.post(url, body);
};

export const updateProperty = property => {
  const body = propertyBody(property);
  const type = property.discriminator.replace("ProductPropertyViewModel", "");
  const url = UPDATE_TRADE_ITEM_PROPERTY(type);
  return axios.put(url, body, { params: { tradeItemPropertyId: property.id } });
};

export const deleteProperty = property => {
  const url = DELETE_TRADE_ITEM_PROPERTY;
  return axios.delete(url, { params: { tradeItemPropertyId: property.id } });
};

// Property Retailer Association
//

// get all properties associations
//
export const getAllTradeItemPropertiesAssociations = () =>
  axios.get(`${BASE_PROPERTY_RETAILER_ASSOCIATION}`);

// Get property retailers associations
//
export const getPagedRetailersAssociations = filters =>
  axios.get(GET_PAGED_PROPERTY_RETAILER_ASSOCIATION, { params: filters });

// Get property retailers associations by property id and retailer codes
//
export const getRetailersAssociationsGetByPropertyIdAndRetailerCodes = filters =>
  axios.get(GET_ASSOCIATIONS_BY_PROPERTY_AND_RETAILERS, { params: filters });

// Create property retailers associations
//
export const createRetailerAssociation = association =>
  axios.post(BASE_PROPERTY_RETAILER_ASSOCIATION, association);

// Create associations in mass
export const createPropertyRetailerAssociationsInMass = (
  connectorIds,
  propertyIds,
  group,
  conditionalMandatoryLevels,
  enrichmentMandatoryLevel
) =>
  axios.post(CREATE_ASSO_IN_MASS, {
    connectorIds,
    propertyIds,
    group,
    tradeItemCategory: "013", //Toys
    conditionalMandatoryLevels,
    enrichmentMandatoryLevel
  });

// Update property retailers associations
//
export const updateRetailerAssociation = (id, association) =>
  axios.put(`${BASE_PROPERTY_RETAILER_ASSOCIATION}/${id}`, association);

// Update property retailers associations
//
export const deleteRetailerAssociation = id =>
  axios.delete(BASE_PROPERTY_RETAILER_ASSOCIATION, { params: { id } });

// Update property retailers associations
//
export const deleteRetailerAssociationInMass = (
  group,
  connectorsIds,
  propertiesIds
) =>
  axios.post(
    BASE_PROPERTY_RETAILER_ASSOCIATION + "/DeleteByConnectorIdsAndPropertyIds",
    {
      group: group,
      connectorIds: connectorsIds,
      propertyIds: propertiesIds
    }
  );

// Get mandatory levels
//
export const getMandatoryLevels = () => axios.get(GET_MANDATORY_LEVELS);

export const exportCsvRetailerAssociations = filters =>
  axios.get(`${BASE_PROPERTY_RETAILER_ASSOCIATION}/ExportCsv`, {
    params: filters
  });

export const getPropertiesAssociationsByConnectorIdsAndMandatoryLevel = (
  connectorIds,
  mandatoryLevel,
  propertyGroup
) =>
  axios.get(
    `${BASE_PROPERTY_RETAILER_ASSOCIATION}/GetByConnectorIdsAndMandatoryLevelAndPropertyGroup`,
    {
      params: {
        connectorIds,
        mandatoryLevel,
        propertyGroup
      }
    }
  );

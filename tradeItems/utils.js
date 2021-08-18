import get from "lodash/get"

export const getDefaultGroup = () => "MARKETING"

export const consistentStatuses = ['Consistent', 'NotConsistent']

const tradeItemKeyGroupMapping = {
  MARKETING: "marketing",
  ASSORTMENT: "children",
  CHANNELMANAGEMENT: "globalChannels",
  PRICING: "catalogPrices",
  LOGISTIC: "logistic",
  VARIANT: "variants",
  TRANSLATIONS: "marketing.0.translations",
  ENRICHMENT: null,
  IMAGES: "imageResourceMetadatas",
  DOCUMENTS: "documentResourceMetadatas",
  MEDIAINFORMATIONS: "mediaInformations"
}

export const getTradeItemKeyFromGroup = (group) => get(tradeItemKeyGroupMapping, group, null)

export const getTradeItemPropertyKey = (property, groupSelected, index) => {
  return index === null
    ? `${getTradeItemKeyFromGroup(groupSelected)}`
    : `${getTradeItemKeyFromGroup(groupSelected)}.${index}.values.${property.code}`
}

export const getTradeItemChannelKey = (groupSelected, index) => {
  return index === null
    ? `${getTradeItemKeyFromGroup(groupSelected)}`
    : `${getTradeItemKeyFromGroup(groupSelected)}.${index}.channels`
}

export const isPropertySingle = (property) => get(property, "cardinality") === "Single"

export const isFullTextProperty = (property) => {
  return property.code === "full_product_description" || property.code === "product_highlights"
}

export const getDefaultTradeItem = () => {
  return {
    tradeItemId: null,
    manufacturer: getDefaultManufacturer(),
    gtin: "",
    scope: null,
    tradeItemManufacturerCode: "",
    defaultLanguageCode: "",
    marketing: [],
    catalogPrices: [],
    logistic: [],
    children: [],
    imageResourceMetadatas: [],
    variants: [],
    globalChannels: [],
    mediaInformations: []
  }
}

export const getDefaultManufacturer = () => {
  return {
    manufacturerId: null,
    name: null
  }
}

export const getDefaultFilters = () => {
  return {
    keyword : null,
    manufacturers: null,
    gtin: null,
    tradeItemManufacturerCode: null,
    languageCode: null,
    releaseDateStart: null,
    releaseDateEnd: null,
    updatedDateStart: null,
    updatedDateEnd: null,
    consistencyStatus: null,
    hasImages: false,
    limit: 100,
    searchAfter: null,
  }
}

export const getDefaultImageForMultiple = (file, tradeItem) => {
  return {
    id: null,
    tradeItemId: get(tradeItem, "tradeItemId"),
    filename: get(file, "name"),
    file: file,
    index: null,
    imageCategory: "UNDEFINED",
    notDefinitive: false,
    notExportable: false,
    languageCodes: [],
    retailerCodes: []
  };
};

export const getDefaultDocumentForMultiple = (file, tradeItem) => {
  return {
    id: null,
    tradeItemId: get(tradeItem, "tradeItemId"),
    filename: get(file, "name"),
    file: file,
    index: null,
    languageCodes: [],
    retailerCodes: []
  };
};

export const getDefaultImage = tradeItem => {
  return {
    id: null,
    tradeItemId: get(tradeItem, "tradeItemId"),
    filename: null,
    file: null,
    index: null,
    imageCategory: null,
    notDefinitive: false,
    notExportable: false,
    languageCodes: [],
    retailerCodes: []
  };
};

export const getChannelPlaceholder = () => {
  return {
    startDate: null,
    endDate: null,
    retailerCodes: [],
    targetMarketIds: []
  }
}
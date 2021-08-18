import map from 'lodash/map'
import reverse from 'lodash/reverse'

export const tradeItemPropertyPlaceholder = () => ({
  values: [],
  id: "",
  code: "",
  propertyGroupIds: [],
  tradeItemCategoryIds: [],
  taxonomyId: "",
  cardinality: "Single",
  type: "String",
  discriminator: "ListProductPropertyViewModel"
})

export const tradeItemValueGroupPlaceholder = () => ({
  //"id": "31081086-a5c1-4bac-93eb-16c8dd4fd985",
  name: "",
  values: [{ code: "", 
    values: { "fr-FR": "" },
    synonyms: { "fr-FR": [] } 
  }]
})

export const getDefaultAssociationsFilters = () => { return {
  propertyIds: [],
  retailerIds: [],
  pageNumber: 0,
  pageSize: 9999,
}}

export const getAssociationFormPlaceholder = () => {
  return {
    current: retailerAssociationPlaceholder(),
    list: []
  }
}

export const retailerAssociationPlaceholder = () => {
  return {
    productPropertyId: '',
    retailerId: '',
    taxonomyId: '',
    tradeItemCategory: {
      code : ''
    },
    propertyGroupId: '',
    conditionalMandatoryLevels: [
      {
        mandatoryLevel: '',
        businessRuleSetId: ''
      }
    ]
  }
}

export const mandatoryLevelPlaceholder = () => {
  return {
    mandatoryLevel: '',
    businessRuleSetId: ''
  }
}

// Makes an option compatible with react-select component.
// Property is a trade item property object.
export const makeOption = property => ({ value: property.id, label: property.code })

export const makeOptionsFromStringArray = list => map(list, obj => ({ label: obj, value: obj }))

export const up = (list, i) => {
  if (i < 1) return list
  const a = list[i - 1]
  const b = list[i]
  return [...list.slice(0, i - 1), b, a, ...list.slice(i + 1)]
}
export const down = (list, i) => reverse(up(reverse(list), list.length - i - 1))
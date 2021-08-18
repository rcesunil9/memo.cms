import map from "lodash/map"
import filter from "lodash/filter"
import get from "lodash/get"
import isEmpty from "lodash/isEmpty"

export const initNewMapping = (matrixAnalysisId, discriminator, groups) => {
  return {
    id: "",
    matrixAnalysisId,
    mappingTitle: "",
    tradeItemCategory: {},
    taxonomyId: "",
    discriminator: discriminator,
    mappingGroups: map(groups, (group, i) => {
      return {
        "groupIndex": i,
        "groupName": group.name,
        "sheet": 0,
        "mappingTabs": []
      }
    })
  }
}

export const initNewPropertyMapping = () => {
  return {
    fileColumnIdentifier: null,
    fileColumnName: null,
    productIdentifier: null,
    mapName: "",
    mode: "Basic",
    code: null,
    transformer: null
  }
}

export const initNewStandardPropertyTransformation = () => {
  return {
    propertyCode: "",
    mode: "Basic",
    code: null,
    transformer: null
  }
}

export const isStandardMapping = (mapping) => get(mapping, 'discriminator', null) === 'StandardMappingViewModel'

export const mappingDiscriminatorKeyGroup = {
  StandardMappingLightViewModel: 'StandardMappingViewModel',
  NonStandardMappingLightViewModel: 'NonStandardMappingViewModel',
}

const checkList = (values) => {
  return isEmpty(filter(values, val => !isEmpty(val.fixedValueCode) && !isEmpty(val.mapping)))
}

export const checkTransformIsEmpty = (transform) => {
  if(isEmpty(transform)) return false;
  if(isEmpty(get(transform, 'type'))) return false;
  if(get(transform, 'value') === 'regex' && isEmpty(get(transform, 'extraValue'))) return false;
  if((isEmpty(get(transform, 'value')) && isEmpty(get(transform, 'extraValue'))) && (isEmpty(get(transform, 'values')) || checkList(get(transform, 'values')))) return false;
  else return true;
}
import get from "lodash/get"

export const getDefaultListFilters = () => { return {
  Skip: 0,
  Take: 20
}}

export const getDefaultTransformationSet = () => { return {
  name: null,
  transformations: [],
  taxonomyId: null,
  tradeItemCategory: {}
}}

export const getDefaultActionSetValue = () => { return {
  name: null,
  sourcePropertyCode: null,
  propertyGroupId: null,
  orderedParametrizedActions: [],
}}

export const getDefaultActionSet = () => { return {
  actionSet: getDefaultActionSetValue(),
  businessRuleSetId: null
}}

export const getDefaultTransformation = () => { return {
  name: null,
  defaultActionSet: getDefaultActionSet(),
  orderedConditionalActionSets: []
}}

export const getDefaultBuiltInAction = () => { return {
  discriminator: "BuiltInActionViewModel",
  builtInActionDefinitionId: null,
  parameterValues: []
}}

export const getDefaultTemplateAction = () => { return {
  discriminator: "TemplateActionViewModel",
  template: ""
}}

export const isBuiltInAction = (action) => get(action, "discriminator") === "BuiltInActionViewModel"
export const isTemplateAction = (action) => get(action, "discriminator") === "TemplateActionViewModel"

export const isActionExecutionConditionNone = (action) => get(action, "actionExecutionCondition") === "None"
export const isActionExecutionConditionCurrentValueNull = (action) => get(action, "actionExecutionCondition") === "IfCurrentValueIsNull"
export const isActionExecutionConditionCurrentValueNotNull = (action) => get(action, "actionExecutionCondition") === "IfCurrentValueIsNotNull"

export const move = (array, fromIndex, toIndex) => array.splice(toIndex, 0, array.splice(fromIndex, 1)[0])
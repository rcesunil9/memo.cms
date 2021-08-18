import React from "react"
import get from "lodash/get"
import map from "lodash/map"
import StringTransformer from "./StringTransformer"
import DateTransformer from "./DateTransformer"
import WeightTransformer from "./WeightTransformer"
import SizeTransformer from "./SizeTransformer"
import CurrencyTransformer from "./CurrencyTransformer"
import NumericValueTransformer from "./NumericValueTransformer"
import ListTransformer from "./ListTransformer"

export const getDefaultTransformer = () => {return {
  type: "",
  value: null,
  values: []
}}

export const TradeItemTransformationWrapper = ({tradeItemProperty, onChange, value}) => {
  const propertyType = get(tradeItemProperty, "type")
  switch (propertyType) {
    case "String":
      return <StringTransformer onChange={onChange} value={value}/>
    case "Date":
      return <DateTransformer onChange={onChange} value={value}/>
    case "Numeric":
      const numericType = get(tradeItemProperty, "numericType")
      switch (numericType) {
        case "Weight":
          return <WeightTransformer onChange={onChange} value={value}/>
        case "Size":
          return <SizeTransformer onChange={onChange} value={value}/>
        case "Price":
          return <CurrencyTransformer onChange={onChange} value={value}/>
        case "Value":
          return <NumericValueTransformer onChange={onChange} value={value}/>
        default:
          return `Numeric type not known: ${numericType}`
      }
    case "List":
      return <ListTransformer onChange={onChange} value={value} options={map(get(tradeItemProperty, "values", []), p => {return {
        value: p.code,
        label: get(p, "values.fr-FR", p.code)
      }})} />
    default:
      return `Property type not known: ${propertyType}`
  }
}

import map from "lodash/map"

export const getFormUi = (props) => {return {
}}

export const getFormSchema = (props) => {return {
  type: "object",
  required: ["code", "cardinality", "discriminator"],
  title: "",
  properties: {
    code: {type: "string", title: "Code"},
  }
}}

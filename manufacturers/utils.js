import update from "immutability-helper"
import find from "lodash/find"

export const inputChanger = (original, onChange) => e => {
  const k = e.target.name
  let v = e.target.value
  if (e.target.type === "checkbox") v = e.target.checked
  const n = update(original, { [k]: { $set: v } })
  onChange(n)
}

export const getSelectedOption = (val, options) => (val ? find(options, ["value", val]) : null)

export const optionChanger = (original, fieldName, onChange) => option => {
  const v = option.value
  const n = update(original, { [fieldName]: { $set: v } })
  onChange(n)
}

export const getNewImageType = () => { return {
  imageCategory: null,
  value: null,
}}
import get from "lodash/get"
import { date } from '../common/utils/date'

export const userPlaceholder = () => ({
  id: null,
  firstname: "",
  lastname: "",
  email: "",
  groupIds: [],
  discriminator: "SaveUserViewModel"
})

export const groupPlaceholder = () => ({
  id: null,
  name: "",
  rightIds: []
})

export const rightPlaceholder = () => ({
  id: null,
  name: "",
  code: "",
  description: ""
})

export const getUserTypeByDiscriminator = discriminator => {
  switch(discriminator) {
    case "SaveUserViewModel":
      return "Internal"
    case "ManufacturerUserViewModel":
      return "Manufacturer"
    case "RetailerUserViewModel":
      return "Retailer"
    default:
      return discriminator
  }
}

export const getUserDiscriminators = () => ["SaveUserViewModel", "ManufacturerUserViewModel", "RetailerUserViewModel"]

export const isManufacturerUser = user => get(user, "discriminator") === "ManufacturerUserViewModel"

export const isRetailerUser = user => get(user, "discriminator") === "RetailerUserViewModel"

export const getLastConnectionDate = user => {
  return get(user, "lastLoginTimestamp") ? date(get(user, "lastLoginTimestamp")).format('YYYY-MM-DD HH:mm') : ""
}
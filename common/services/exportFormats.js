import axios from "axios"
import * as env from "../../environment/index.js"

// Set the services URIs
const BASE_URI = `${env.CDM_FORMAT_MANAGEMENT_SERVICE_URI}/api/FormatConfiguration`
const GET_PAGED_LIGHT_URI = `${BASE_URI}/GetPagedLight`
const GET_BY_TRADE_ITEM_CATEGORY_LIGHT_URI = `${BASE_URI}/GetByTradeItemCategoryCodeLight`

// Get formats
// export const getFormats = ({ PageNumber, PageSize }) =>
//   axios.get(BASE_URI, { params: { PageNumber, PageSize } })


// Get formats light
export const getFormats = ({ PageNumber, PageSize }) =>
  axios.get(GET_PAGED_LIGHT_URI, { params: { PageNumber, PageSize } })

// Get by trade item category
export const getFormatsByTradeItemCategory = (tradeItemCategoryCode) =>
  axios.get(GET_BY_TRADE_ITEM_CATEGORY_LIGHT_URI, { params: { tradeItemCategoryCode } })

// Get format
export const getFormatById = id => axios.get(`${BASE_URI}/${id}`)

// Delete format
export const deleteFormatById = id => axios.delete(`${BASE_URI}/${id}`)

// Create format
export const createFormat = format => {
  switch (format.discriminator) {
    case "TemplateFormatConfigurationViewModel":
      return axios.post(`${BASE_URI}/template`, format)
    case "ExcelFormatConfigurationViewModel":
      return axios.post(`${BASE_URI}/excel`, format)
    case "ExcelIncludingTemplateConfigurationViewModel":
      return axios.post(`${BASE_URI}/excelIncludingTemplate`, format)
    default:
      throw new Error("Unknown format discriminator: " + format.discriminator)
  }
}

// Update format
export const updateFormat = format => {
  const id = format.id
  if (!id) throw new Error("Missing `id` field")
  switch (format.discriminator) {
    case "TemplateFormatConfigurationViewModel":
      return axios.put(`${BASE_URI}/template/${id}`, format)
    case "ExcelFormatConfigurationViewModel":
      return axios.put(`${BASE_URI}/excel/${id}`, format)
    case "ExcelIncludingTemplateConfigurationViewModel":
      return axios.put(`${BASE_URI}/excelIncludingTemplate/${id}`, format)
    default:
      throw new Error("Unknown format discriminator: " + format.discriminator)
  }
}

// Upload excel
export const uploadExcel = (formatConfigurationId, specificationId, file) => {
  const data = new FormData()
  data.append("file", file)
  return axios.post(`${BASE_URI}/excel/upload/${formatConfigurationId}/${specificationId}`, data)
}

//Fetch transformed trade item json
export const getStorageFile = (url) => axios.get(url, {
  headers: { sendToken: false }
})
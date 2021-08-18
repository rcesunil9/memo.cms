import axios from 'axios'
import get from "lodash/get"
import * as env from '../../environment/index.js'

//========================== BEGIN TransportConfiguration =====================================
// Set the services URIs
const BASE_TRANSPORT_CONFIGURATION_SERVICE_URI = `${env.CDM_TRANSPORT_MANAGEMENT_SERVICE_URI}/api/TransportConfiguration`
const GET_ALL_TRANSPORT_CONFIGURATION_URI = `${BASE_TRANSPORT_CONFIGURATION_SERVICE_URI}/GetAll`
const GET_PAGED_TRANSPORT_CONFIGURATION_URI = `${BASE_TRANSPORT_CONFIGURATION_SERVICE_URI}/GetPaged`


// Get matching rows
export const getAllTransportConfigurations = () => axios.get(`${GET_ALL_TRANSPORT_CONFIGURATION_URI}`)

// Get matching rows
// filters (pageNumber, pageSize)
export const getTransportConfigurations = filters => axios.get(`${GET_PAGED_TRANSPORT_CONFIGURATION_URI}`, {
  params: filters
})

// get by id
export const getTransportConfiguration = transportConfigurationId => axios.get(`${BASE_TRANSPORT_CONFIGURATION_SERVICE_URI}`, {
  params: {
    transportConfigurationId
  }
})

const getDiscriminatorURLSuffix = transportConfiguration => {
  switch(get(transportConfiguration, "discriminator")) {
    case "RestTransportConfigurationViewModel":
      return "Rest"
    case "FtpTransportConfigurationViewModel":
      return "Ftp"
    default:
      return false
  }
}

// update transport configuration
export const createTransportConfiguration = transportConfiguration => axios.post(`${BASE_TRANSPORT_CONFIGURATION_SERVICE_URI}/Create${getDiscriminatorURLSuffix(transportConfiguration)}TransportConfiguration`, transportConfiguration)

// update transport configuration
export const updateTransportConfiguration = (transportConfigurationId, transportConfiguration) => axios.put(`${BASE_TRANSPORT_CONFIGURATION_SERVICE_URI}/Update${getDiscriminatorURLSuffix(transportConfiguration)}TransportConfiguration`, transportConfiguration, {
  params: {
    transportConfigurationId
  }
})

export const deleteTransportConfiguration = transportConfigurationId => axios.delete(`${BASE_TRANSPORT_CONFIGURATION_SERVICE_URI}`, {
  params: {
    transportConfigurationId
  }
})
//========================== END TransportConfiguration =======================================

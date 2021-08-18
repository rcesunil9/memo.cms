import { createSelector } from 'reselect'
import { getResults, getIsFetching } from "../common/reducers/createList"


export const getTransportConfigurationTypes = () => [
  { value: "RestTransportConfigurationViewModel", label: "REST API" },
  { value: "FtpTransportConfigurationViewModel", label: "FTP" },
]

// Direct accessors to state
//
export const getTransportConfigurationListFilters = state => state.transport.listing.filters

export const getTransportConfigurationListTotal = state => state.transport.listing.total

export const getTransportConfigurationEdit = state => state.transport.edit.transportConfiguration

// Computed selectors
//
export const getTransportConfigurationList = createSelector(state => state.transport.listing.results, getResults)

export const isTransportConfigurationListFetching = createSelector(state => state.transport.listing.results, getIsFetching)
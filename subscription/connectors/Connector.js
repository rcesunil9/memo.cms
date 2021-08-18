import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import get from 'lodash/get'
import find from 'lodash/find'
import reduce from 'lodash/reduce'
import sortBy from 'lodash/sortBy'
import map from 'lodash/map'
import { getConnector, createConnector, updateConnector, deleteConnector, getOffers } from '../../common/services/subscription'
import { getAllRetailers } from '../../common/services/retailer'
import { getTargetMarkets } from '../../common/services/targetMarket'
import { CONNECTOR_STATUS, CONNECTOR_TYPE, CONNECTOR_SCOPE, CONNECTOR_VISIBILITY } from '../utils'
import LocalizableStrings, { getLocalizableStringValue } from 'app/common/components/lang/LocalizableStrings';
import SelectString from 'app/common/components/form/SelectString';
import DatePicker from "app/common/components/date/DatePicker"
import { date } from 'app/common/utils/date';

const Connector = ({
  connectorId,
  // functions
  onConnectorCreated,
  onConnectorUpdated,
  onConnectorDeleted
}) => {

    const [connector, setConnector] = useState({})
    const [retailers, setRetailers] = useState([])
    const [offers, setOffers] = useState([])
    const [targetMarkets, setTargetMarkets] = useState([])
    const currentConnectorId = get(connector, 'id')

    const save = useCallback(connectorToSave => {
      if (!currentConnectorId) {
        createConnector(connectorToSave)
          .then(res => {
            setConnector(oldConnector => { return {
              ...oldConnector,
              id: res.data
            }})
            return res
          })
          .then(res => onConnectorCreated && onConnectorCreated(res))
          .catch(res => alert('Error'))
      } else {
        updateConnector(connectorToSave)
          .then(res => onConnectorUpdated && onConnectorUpdated(res))
          .catch(res => alert('Error'))
      }
    }, [currentConnectorId, onConnectorCreated, onConnectorUpdated])

    // get the subscription id needed
    useEffect(() => {
      let promise = null
      if(connectorId) promise = getConnector(connectorId)
      else setConnector({})
      if(promise) promise.then(res => setConnector(get(res, 'data') || null))
    }, [connectorId])

    // load external dependencies
    useEffect(() => {
      getAllRetailers().then(res => setRetailers(get(res, 'data')))
      getTargetMarkets().then(res => setTargetMarkets(get(res, 'data')))
      getOffers().then(res => {
        setOffers(
          sortBy(reduce(get(res, 'data'), (results, offer) => { return [ ...results, {id: get(offer, 'id'), name: getLocalizableStringValue(get(offer, 'name'), 'fr-FR')} ] }, []), ['name'])
        )
      })
    }, [])

    // memoized values
    const currentConnectorRetailerId = get(connector, 'retailerId')
    const currentConnectorTargetMarketId = get(connector, 'targetMarketId')
    const currentOfferIds = get(connector, 'offerIds')
    const releaseDate = get(connector, "releaseDate") || null
    const discontinuedDate = get(connector, "discontinuedDate") || null
    const currentRetailer = useMemo(() => find(retailers, o => o.id === currentConnectorRetailerId), [retailers, currentConnectorRetailerId])
    const currentTargetMarket = useMemo(() => find(targetMarkets, o => o.id === currentConnectorTargetMarketId), [targetMarkets, currentConnectorTargetMarketId])
    const currentOffers = useMemo(() => map(currentOfferIds, offerId => find(offers, o => get(o, 'id') === offerId)), [offers, currentOfferIds])
    const currentReleaseDate = useMemo(() => releaseDate === null ? releaseDate : date(releaseDate), [releaseDate])
    const currentDiscontinuedDate = useMemo(() => discontinuedDate === null ? discontinuedDate : date(discontinuedDate), [discontinuedDate])

    return (
      <>
        {currentConnectorId && (
          <>
            <label className="control-label">ID</label>
            <input className="form-control disabled" value={currentConnectorId}/>
            <br/>
          </>
        )}

        {/* name */}
        <LocalizableStrings
          integrated
          localizableStrings={['name']}
          labels={{
            name: 'Name',
          }}
          input={connector}
          onChange={(property, value) => {
            setConnector({
              ...connector,
              [property]: value
            })
          }}
          />
          <br/>  
        
        {/* retailerId */}
        <label className="control-label">Retailer {currentRetailer && <Link className="pl-2" to={`/retailer/${get(currentRetailer, 'id')}`}>View</Link>}</label>
        <Select
          value={currentRetailer}
          onChange={retailer => {
            setConnector({
              ...connector,
              retailerId: retailer ? get(retailer, 'id') : null
            })
          }}
          name="currentRetailer"
          getOptionLabel={o => get(o, 'name')}
          getOptionValue={o => get(o, 'id')}
          options={retailers}
          />
        <br/>

        {/* targetMarketId */}
        <label className="control-label">Target market</label>
        <Select
          value={currentTargetMarket}
          onChange={tm => {
            setConnector({
              ...connector,
              targetMarketId: tm ? get(tm, 'id') : null
            })
          }}
          name="currentTargetMarket"
          getOptionLabel={o => get(o, 'name')}
          getOptionValue={o => get(o, 'id')}
          options={targetMarkets}
          />
        <br/>

        {/* offerIds */}
        <label className="control-label">Offers</label>
        <Select
          isMulti
          closeMenuOnSelect={false}
          value={currentOffers}
          onChange={values => {
            setConnector({
              ...connector,
              offerIds: values ? map(values, o => get(o, 'id')) : []
            })
          }}
          name="currentOffer"
          getOptionLabel={o => get(o, 'name')}
          getOptionValue={o => get(o, 'id')}
          options={offers}
          />
        <br/>

        {/* type */}
        <label className="control-label">Type</label>
        <SelectString
          value={get(connector, 'type')}
          onChange={type => {
            setConnector({
              ...connector,
              type
            })
          }}
          name="currentType"
          options={CONNECTOR_TYPE}
          />
        <br/>

        {/* Scopes */}
        <label className="control-label">Scopes</label>
        <SelectString
          isMulti
          value={get(connector, 'scopes')}
          closeMenuOnSelect={false}
          onChange={scopes => {
            setConnector({
              ...connector,
              scopes: scopes || []
            })
          }}
          name="currentScope"
          options={CONNECTOR_SCOPE}
          />
        <br/>

        {/* status */}
        <label className="control-label">Status</label>
        <SelectString
          value={get(connector, 'status')}
          onChange={status => {
            setConnector({
              ...connector,
              status
            })
          }}
          name="currentStatus"
          options={CONNECTOR_STATUS}
          />
        <br/>

        {/* visibility */}
        <label className="control-label">Visibility</label>
        <SelectString
          value={get(connector, 'visibility')}
          onChange={visibility => {
            setConnector({
              ...connector,
              visibility: visibility !== null ? visibility : null
            })
          }}
          name="currentVisibility"
          options={CONNECTOR_VISIBILITY}
          />
        <br/>

        {/* releaseDate */}
        <label className="control-label">Release date</label>
        <DatePicker
          onChange={d => setConnector({
            ...connector,
            releaseDate: d ? d.format('YYYY-MM-DD') : null
          })}
          value={currentReleaseDate}
          />
        <br/>

        {/* discontinuedDate */}
        <label className="control-label">Discontinued date</label>
        <DatePicker
          onChange={d => setConnector({
            ...connector,
            discontinuedDate: d ? d.format('YYYY-MM-DD') : null
          })}
          value={currentDiscontinuedDate}
          />
        <br/>

        {/* sentByManufacturer */}
        <label className="control-label">Sent by manufacturer himself?&nbsp;&nbsp;</label>
        <input
            name="sentByManufacturer"
            type="checkbox"
            checked={!!get(connector, 'sentByManufacturer')}
            onChange={e => setConnector({
              ...connector,
              sentByManufacturer: !!e.currentTarget.checked
            })}
            />
        <br/>

        <div className="row">
          <div className="col-12 text-right">
            <button className="btn btn-primary" onClick={() => save(connector)}>
              {currentConnectorId ? 'Save' : 'Create'}
            </button>
            {currentConnectorId && (
              <button 
                className="btn btn-danger ml-2" 
                onClick={() => {
                  window.confirm(`Are you sure?`) &&
                  deleteConnector(currentConnectorId)
                    .then(res => onConnectorDeleted && onConnectorDeleted(currentConnectorId))
                    .catch(err => alert('Error'))
                }}
                >
                Delete connector
              </button>
            )}
          </div>
        </div>

      </>
    )

}

export default Connector
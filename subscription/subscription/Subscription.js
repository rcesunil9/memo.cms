import React, { useEffect, useState, useCallback, useMemo } from 'react'
import dotProp from "dot-prop-immutable"
import Select from 'react-select'
import get from 'lodash/get'
import find from 'lodash/find'
import { getSubscription, createSubscription, updateSubscription, getOffers, getSubscriptionByManufacturerId, deleteSubscription } from '../../common/services/subscription'
import { getManufacturers } from '../../common/services/manufacturer'


const Subscription = ({
  subscriptionId,
  manufacturerId,
  // functions
  onSubscriptionCreated,
  onSubscriptionUpdated,
  onSubscriptionDeleted
}) => {

    const [subscription, setSubscription] = useState({ manufacturerId })
    const [offers, setOffers] = useState([])
    const [manufacturers, setManufacturers] = useState([])
    const currentSubscriptionId = get(subscription, 'id')

    const save = useCallback(subscriptionToSave => {
      const s = Object.assign({numberOfTradeItem: {min: null, max: null}}, subscriptionToSave)
      if (!currentSubscriptionId) {
        createSubscription(s)
          .then(res => {
            setSubscription(oldSubscription => { return {
              ...oldSubscription,
              id: res.data
            }})
            return res
          })
          .then(res => onSubscriptionCreated && onSubscriptionCreated(res))
          .catch(res => alert('Error'))
      } else {
        updateSubscription(s)
          .then(res => onSubscriptionUpdated && onSubscriptionUpdated(res))
          .catch(res => alert('Error'))
      }
    }, [currentSubscriptionId, onSubscriptionCreated, onSubscriptionUpdated])

    // get the subscription id needed
    useEffect(() => {
      let promise = null
      if(subscriptionId) promise = getSubscription(subscriptionId).then(res => get(res, 'data') || null)
      else if(manufacturerId) promise = getSubscriptionByManufacturerId(manufacturerId).then(res => {
        return get(res, 'data') ? res.data : { manufacturerId }
      })
      else setSubscription({})

      if(promise) promise.then(subsc => setSubscription(subsc))
    }, [subscriptionId, manufacturerId])

    // load external dependencies
    // manufacturers & offers
    useEffect(() => {
      getOffers().then(res => setOffers(get(res, 'data')))
      getManufacturers().then(res => setManufacturers(get(res, 'data')))
    }, [])

    // memoized values
    const currentSubscriptionManufacturerId = get(subscription, 'manufacturerId')
    const currentSubscriptionOfferId = get(subscription, 'offerId')
    const currentManufacturer = useMemo(() => find(manufacturers, o => manufacturerId === o.id || o.id === currentSubscriptionManufacturerId), [manufacturers, currentSubscriptionManufacturerId, manufacturerId])
    const currentOffer = useMemo(() => find(offers, o => get(o, 'id') === currentSubscriptionOfferId), [offers, currentSubscriptionOfferId])

    return (
      <>
        {currentSubscriptionId && (
          <>
            <label className="control-label">ID</label>
            <input className="form-control disabled" value={currentSubscriptionId}/>
            <br/>
          </>
        )}
        
        {/* manufacturerId */}
        <label className="control-label">Manufacturer</label>
        <Select
          isDisabled={!!manufacturerId}
          value={currentManufacturer}
          onChange={manufacturer => {
            setSubscription({
              ...subscription,
              manufacturerId: manufacturer ? get(manufacturer, 'id') : null
            })
          }}
          name="currentManufacturer"
          getOptionLabel={o => get(o, 'name')}
          getOptionValue={o => get(o, 'id')}
          options={manufacturers}
          />
        <br/>
        
        {/* offerId */}
        <label className="control-label">Offer</label>
        <Select
          value={currentOffer}
          onChange={offer => {
            setSubscription({
              ...subscription,
              offerId: offer ? get(offer, 'id') : null
            })
          }}
          name="currentOffer"
          getOptionLabel={o => get(o, 'name.values[0].value')}
          getOptionValue={o => get(o, 'id')}
          options={offers}
          />
        <br/>

        {/* numberOfTradeItem */}
        <div className="row">
          {/* min */}
          <div className="col-6">
            <label className="control-label">Min. nb of trade items</label>
                <input
                  value={get(subscription, "numberOfTradeItem.min")}
                  onChange={e => setSubscription(dotProp.set(subscription, "numberOfTradeItem.min", e.currentTarget.value ? parseInt(e.currentTarget.value) : null))}
                  type="number"
                  className="form-control" 
                  />
            </div>
          {/* max */}
          <div className="col-6">
            <label className="control-label">Max. nb of trade items</label>
                <input
                  value={get(subscription, "numberOfTradeItem.max")}
                  onChange={e => setSubscription(dotProp.set(subscription, "numberOfTradeItem.max", e.currentTarget.value ? parseInt(e.currentTarget.value) : null))}
                  type="number"
                  className="form-control" 
                  />
          </div>
        </div>
        <br/>

        {/* numberOfConnector */}
        <label className="control-label">Number of connectors</label>
        <input
          value={get(subscription, "numberOfConnector")}
          onChange={e => setSubscription(dotProp.set(subscription, "numberOfConnector", e.currentTarget.value ? parseInt(e.currentTarget.value) : null))}
          type="number"
          className="form-control" 
          />
        <br/>

        <div className="row">
          <div className="col-12 text-right">
            <button className="btn btn-primary" onClick={() => save(subscription)}>
              {currentSubscriptionId ? 'Save' : 'Create'}
            </button>
            {currentSubscriptionId && (
              <button className="btn btn-danger ml-2" onClick={() => {               
                  deleteSubscription(currentSubscriptionId)
                    .then(res => {
                      setSubscription({})
                      return onSubscriptionDeleted && onSubscriptionDeleted(currentSubscriptionId)
                      })
                    .catch(err => alert('Error'))
                }}>
                Delete subscription
              </button>
            )}
          </div>
        </div>

      </>
    )

}

export default Subscription
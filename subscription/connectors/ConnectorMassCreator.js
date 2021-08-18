import React, { useEffect, useState, useMemo, useReducer } from 'react'
import Select from 'react-select'
import get from 'lodash/get'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import find from 'lodash/find'
import sortBy from 'lodash/sortBy'
import isEmpty from 'lodash/isEmpty'
import size from 'lodash/size'
import { getAllRetailers } from '../../common/services/retailer'
import { getTargetMarkets } from '../../common/services/targetMarket'
import { createConnectorsInMass, dryDeleteConnectorsInMass, deleteConnectorsInMass, getOffers } from '../../common/services/subscription'
import PageWrapper from "../../common/components/layout/PageWrapper"
import { CONNECTOR_STATUS, CONNECTOR_TYPE, CONNECTOR_SCOPE, CONNECTOR_VISIBILITY } from '../utils'
import Loader from '../../common/components/loaders/Loader'
import { getLocalizableStringValue } from 'app/common/components/lang/LocalizableStrings';
import SelectString from 'app/common/components/form/SelectString';
import DatePicker from "app/common/components/date/DatePicker"


const multiSelectStyles = {
    height: "calc(100vh - 130px)",
    width: "100%"
}

const initialState = {
    retailerIds: [],
    targetMarketIds: [],
    offerIds: [],
    scopes: [],
    sentByManufacturer: false
}

function reducer(state, action) {
    switch (action.type) {
        case 'set':
            return {
                ...state,
                [action.key]: action.value
            }
        default:
            return state
    }
}

const ConnectorMassCreator = () => {

    const [loading, setLoading] = useState(false)
    const [retailers, setRetailers] = useState([])
    const [targetMarkets, setTargetMarkets] = useState([])
    const [offers, setOffers] = useState([])
    const [values, dispatch] = useReducer(reducer, initialState)

    // memoized value
    const currentRetailerIds = get(values, 'retailerIds') 
    const currentTargetMarketIds = get(values, 'targetMarketIds')
    const currentType = get(values, 'type')
    const offerIds = get(values, 'offerIds')
    const currentOffers = useMemo(() => map(offerIds, offerId => find(offers, o => get(o, 'id') === offerId)), [offers, offerIds])
    const canCreate = useMemo(() => currentType !== null && !isEmpty(currentRetailerIds) && !isEmpty(currentTargetMarketIds), [currentRetailerIds, currentTargetMarketIds, currentType])
    const canDelete = useMemo(() => currentType !== null || !isEmpty(currentRetailerIds) || !isEmpty(currentTargetMarketIds), [currentRetailerIds, currentTargetMarketIds, currentType])

    // create connectors in mass
    const create = () => {
        if(!window.confirm(`Are you sure?`)) return

        setLoading(true)
        createConnectorsInMass(values)
            .then(res => {
                setLoading(false)
                alert(`${size(res.data)} connectors created!`)
                window.location.reload()
            })
            .catch(res => {
                setLoading(false)
                alert(`Error on creating connectors.`)
            })
    }

    // remove connectors with dry run
    const remove = () => {
        if(!window.confirm(`Are you sure?`)) return

        setLoading(true)
        dryDeleteConnectorsInMass(currentRetailerIds, currentTargetMarketIds)
            .then(res => {
                if(!window.confirm(`You are about to delete ${size(res.data)} connectors. Are you sure?`)) {
                    setLoading(false) 
                    return
                }
                deleteConnectorsInMass(currentRetailerIds, currentTargetMarketIds)
                    .then(res2 => {
                        setLoading(false) 
                        alert(`${size(res2.data)} connectors deleted.`)
                        window.location.reload()
                    })
                    .catch(res2 => {
                        setLoading(false)
                        alert(`Error on deleting connectors.`)
                    })
                
            })
            .catch(res => {
                setLoading(false)
                alert(`Error on creating connectors.`)
            })
    }

    // load external dependencies
    useEffect(() => {
      getAllRetailers().then(res => setRetailers(sortBy(get(res, 'data'), ['name'])))
      getTargetMarkets().then(res => setTargetMarkets(sortBy(get(res, 'data'), ['name'])))
      getOffers().then(res => {
        setOffers(
          sortBy(reduce(get(res, 'data'), (results, offer) => { return [ ...results, {id: get(offer, 'id'), name: getLocalizableStringValue(get(offer, 'name'), 'fr-FR')} ] }, []), ['name'])
        )
      })
    }, [])

    return (

        <PageWrapper>

            <div className="row">

                {/* retailerIds */}
                <div className="col-2">
                    <h4>Retailers</h4>
                    <select 
                        style={multiSelectStyles}
                        onChange={e => dispatch({type: 'set', key: 'retailerIds', value: reduce(e.currentTarget.options, (results, value) => {
                            if(!value.selected) return results
                            return [
                                ...results,
                                value.value
                            ]
                        }, [])})}
                        multiple
                        >
                        {map(retailers, ((o, k) => (
                            <option
                                key={`c-ret-${k}`}
                                value={o.id}
                                >
                                {get(o, 'name')}
                                </option>
                        )))}
                    </select>
                </div>

                {/* targetMarketIds */}
                <div className="col-2">
                    <h4>Target markets</h4>
                    <select 
                        style={multiSelectStyles}
                        onChange={e => dispatch({type: 'set', key: 'targetMarketIds', value: reduce(e.currentTarget.options, (results, value) => {
                            if(!value.selected) return results
                            return [
                                ...results,
                                value.value
                            ]
                        }, [])})}
                        multiple
                        >
                        {map(targetMarkets, ((o, k) => (
                            <option
                                key={`c-tm-${k}`}
                                value={o.id}
                                >
                                {get(o, 'name')}
                                </option>
                        )))}
                    </select>
                </div>

                {/* Values */}
                <div className="col-3">
                    
                    {/* offerIds */}
                    <label className="control-label">Offers</label>
                    <Select
                        isMulti
                        closeMenuOnSelect={false}
                        value={currentOffers}
                        onChange={values => dispatch({type: 'set', key: 'offerIds', value: values ? map(values, o => get(o, 'id')) : []})}
                        name="currentOffer"
                        getOptionLabel={o => get(o, 'name')}
                        getOptionValue={o => get(o, 'id')}
                        options={offers}
                        />
                    <br/>

                    {/* type */}
                    <label className="control-label">Type</label>
                    <SelectString                    
                        value={get(values, 'type')}
                        onChange={value => dispatch({ type: 'set', key: 'type', value })}
                        name="currentType"
                        options={CONNECTOR_TYPE}
                        />
                    <br/>

                    {/* Scopes */}
                    <label className="control-label">Scopes</label>
                    <SelectString
                        isMulti
                        value={get(values, 'scopes')}
                        closeMenuOnSelect={false}
                        onChange={value => dispatch({ type: 'set', key: 'scopes', value })}
                        name="currentScope"
                        options={CONNECTOR_SCOPE}
                        />
                    <br/>

                    {/* status */}
                    <label className="control-label">Status</label>
                    <SelectString
                        value={get(values, 'status')}
                        onChange={value => dispatch({ type: 'set', key: 'status', value })}
                        name="currentStatus"
                        options={CONNECTOR_STATUS}
                        />
                    <br/>

                    {/* visibility */}
                    <label className="control-label">Visibility</label>
                    <SelectString
                        value={get(values, 'visibility')}
                        onChange={value => dispatch({ type: 'set', key: 'visibility', value })}
                        name="currentVisibility"
                        options={CONNECTOR_VISIBILITY}
                        />
                    <br/>

                    {/* releaseDate */}
                    <label className="control-label">Release date</label>
                    <DatePicker
                        onChange={value => dispatch({ type: 'set', key: 'releaseDate', value })}
                        value={get(values, 'releaseDate')}
                        />
                    <br/>

                    {/* discontinuedDate */}
                    <label className="control-label">Discontinued date</label>
                    <DatePicker
                        onChange={value => dispatch({ type: 'set', key: 'discontinuedDate', value })}
                        value={get(values, 'discontinuedDate')}
                        />
                    <br/>

                    {/* sentByManufacturer */}
                    <label className="control-label">Sent by manufacturer himself?&nbsp;&nbsp;</label>
                    <input
                        name="sentByManufacturer"
                        type="checkbox"
                        onChange={e => dispatch({ type: 'set', key: 'sentByManufacturer', value: !!e.currentTarget.checked })}
                        checked={!!get(values, 'sentByManufacturer')}
                        />
                    <br/>

                </div>

                {/* Actions */}
                <div className="col-2">
                    <h4>Actions</h4>

                    {loading && <div className="text-center pb-2"><Loader /></div>}

                    {/* Create */}
                    {!loading && (
                        <>
                            <button
                                onClick={e => create()}
                                className={`btn btn-primary btn-block ${canCreate ? '' : 'disabled'}`}
                                >
                                Create connectors
                                </button>

                            <br/>
                        
                            {/* Delete */}
                            <button
                                onClick={e => remove()}
                                className={`btn btn-danger btn-block ${canDelete ? '' : 'disabled'}`}
                                >
                                Delete connectors
                                </button>
                        </>
                    )}

                </div>

            </div>

        </PageWrapper>
    )

}

export default ConnectorMassCreator
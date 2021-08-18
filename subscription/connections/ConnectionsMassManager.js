import React, { useEffect, useState, useMemo, useRef } from 'react'
import get from 'lodash/get'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import sortBy from 'lodash/sortBy'
import isEmpty from 'lodash/isEmpty'
import size from 'lodash/size'
import indexOf from 'lodash/indexOf'
import { getManufacturers } from '../../common/services/manufacturer'
import { createConnectionsInMass, dryDeleteConnectionsInMass, deleteConnectionsInMass, getAllConnectors, getConnectionsByConnectorIds } from '../../common/services/subscription'
import PageWrapper from "../../common/components/layout/PageWrapper"
import { CONNECTOR_STATUS } from '../utils'
import Loader from '../../common/components/loaders/Loader'
import SelectString from 'app/common/components/form/SelectString';
import DatePicker from "app/common/components/date/DatePicker"
import { date } from 'app/common/utils/date';

const multiSelectStyles = {
    height: "calc(100vh - 130px)",
    width: "100%"
}

const ConnectionsMassManager = () => {

    const [loading, setLoading] = useState(false)
    const [manufacturers, setManufacturers] = useState([])
    const [connectors, setConnectors] = useState([])
    const [selectedManufacturers, setSelectedManufacturers] = useState([])
    const [selectedConnectors, setSelectedConnectors] = useState([])
    const [releaseDate, setReleaseDate] = useState(null)
    const [status, setStatus] = useState(null)
    const manufacturersSelect = useRef(null);

    // create connections in mass
    const create = () => {
        if(!window.confirm(`Are you sure? (${size(selectedManufacturers) * size(selectedConnectors)} connections expected)`)) return

        setLoading(true)
        createConnectionsInMass(selectedManufacturers, selectedConnectors, status, releaseDate)
            .then(res => {
                setLoading(false)
                alert(`${size(res.data)} connections created!`)
                window.location.reload()
            })
            .catch(res => {
                setLoading(false)
                alert(`Error on creating connections.`)
            })
    }

    // remove connections with dry run
    const remove = () => {
        if(!window.confirm(`Are you sure?`)) return

        setLoading(true)
        dryDeleteConnectionsInMass(selectedManufacturers, selectedConnectors)
            .then(res => {
                if(!window.confirm(`You are about to delete ${size(res.data)} connections. Are you sure?`)) {
                    setLoading(false) 
                    return
                }
                deleteConnectionsInMass(selectedManufacturers, selectedConnectors)
                    .then(res2 => {
                        setLoading(false) 
                        alert(`${size(res2.data)} connections deleted.`)
                        window.location.reload()
                    })
                    .catch(res2 => {
                        setLoading(false)
                        alert(`Error on deleting connections.`)
                    })
                
            })
            .catch(res => {
                setLoading(false)
                alert(`Error on creating connections.`)
            })
    }

    // load external dependencies
    // manufacturers
    useEffect(() => {
      getManufacturers().then(res => setManufacturers(sortBy(get(res, 'data'), ['name'])))
      getAllConnectors().then(res => {
        setConnectors(
            sortBy(reduce(get(res, 'data'), (results, connector) => { return [...results, {id: get(connector, 'id'), name: get(connector, 'name'), type: get(connector, 'type')}] }, []), 'name')
        )
      })
    }, [])

    // memoized value
    const canCreate = useMemo(() => !isEmpty(selectedManufacturers) && !isEmpty(selectedConnectors), [selectedManufacturers, selectedConnectors])
    const canDelete = useMemo(() => !isEmpty(selectedManufacturers) || !isEmpty(selectedConnectors), [selectedManufacturers, selectedConnectors])
    const currentReleaseDate = useMemo(() => releaseDate === null ? releaseDate : date(releaseDate), [releaseDate])

    return (
        <PageWrapper>

            <div className="row">

                {/* manufacturerIds */}
                <div className="col-2">
                    <h4>Manufacturers</h4>
                    <select
                        style={multiSelectStyles}
                        ref={manufacturersSelect}
                        onChange={e => setSelectedManufacturers(reduce(e.currentTarget.options, (results, value) => {
                            if(!value.selected) return results
                            return [
                                ...results,
                                value.value
                            ]
                        }, []))}
                        multiple
                        >
                        {map(manufacturers, ((o, k) => (
                            <option
                                key={`c-man-${k}`}
                                value={o.id}
                                >
                                {get(o, 'name')}
                                </option>
                        )))}
                    </select>
                </div>

                {/* connectorIds */}
                <div className="col-2">
                    <h4>Connectors</h4>
                    <select 
                        style={multiSelectStyles}
                        onChange={e => setSelectedConnectors(reduce(e.currentTarget.options, (results, value) => {
                            if(!value.selected) return results
                            return [
                                ...results,
                                value.value
                            ]
                        }, []))}
                        multiple
                        >
                        {map(connectors, ((o, k) => (
                            <option
                                key={`c-ret-${k}`}
                                value={o.id}
                                >
                                {get(o, 'name')}
                                </option>
                        )))}
                    </select>
                </div>

                {/* Helpers */}
                <div className="col-2">

                    {/* Status */}
                    <h4>Status</h4>
                    <SelectString
                        value={status}
                        onChange={status => setStatus(status)}
                        name="currentStatus"
                        options={CONNECTOR_STATUS}
                        />
                    
                    {/* Release date */}
                    <br/>
                    <h4>Release date</h4>
                    <DatePicker
                        onChange={d => setReleaseDate(d ? d.format('YYYY-MM-DD') : null)}
                        value={currentReleaseDate}
                        />

                    {/* Manufacturer selection */}
                    <br/>
                    <h4>Connections duplication</h4>
                    <button 
                        className="btn btn-block btn-light btn-outline-primary"
                        onClick={() => {
                            if (!selectedConnectors.length) return
                            getConnectionsByConnectorIds(selectedConnectors).then(res => {
                                const changeManufacturerIds = map(res.data, connection => connection.manufacturerId)
                                setSelectedManufacturers(changeManufacturerIds)
                                map(manufacturersSelect.current.options, o => {
                                    if (indexOf(changeManufacturerIds, o.value) !== -1) o.selected = true;
                                    else o.selected = false;
                                });
                            })
                        }}
                        >
                            Select manufacturers
                        </button>

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
                                Create connections
                                </button>

                            <br/>
                        
                            {/* Delete */}
                            <button
                                onClick={e => remove()}
                                className={`btn btn-danger btn-block ${canDelete ? '' : 'disabled'}`}
                                >
                                Delete connections
                                </button>
                        </>
                    )}

                </div>

            </div>

        </PageWrapper>
    )

}

export default ConnectionsMassManager
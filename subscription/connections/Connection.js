import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import get from 'lodash/get'
import find from 'lodash/find'
import sortBy from 'lodash/sortBy'
import { getConnection, createConnection, updateConnection, deleteConnection, getAllConnectors } from '../../common/services/subscription'
import { getManufacturers } from '../../common/services/manufacturer'
import { CONNECTION_STATUS } from '../utils'
import SelectString from 'app/common/components/form/SelectString';
import DatePicker from "app/common/components/date/DatePicker"
import { date } from 'app/common/utils/date';

const Connection = ({
  connectionId,
  // functions
  onConnectionCreated,
  onConnectionUpdated,
  onConnectionDeleted
}) => {

    const [connection, setConnection] = useState({})
    const [manufacturers, setManufacturers] = useState([])
    const [connectors, setConnectors] = useState([])
    const currentConnectionId = get(connection, 'id')

    const save = useCallback(connectionToSave => {
      if (!currentConnectionId) {
        createConnection(connectionToSave)
          .then(res => {
            setConnection(oldConnection => { return {
              ...oldConnection,
              id: res.data
            }})
            return res
          })
          .then(res => onConnectionCreated && onConnectionCreated(res))
          .catch(res => alert('Error'))
      } else {
        updateConnection(connectionToSave)
          .then(res => onConnectionUpdated && onConnectionUpdated(res))
          .catch(res => alert('Error'))
      }
    }, [currentConnectionId, onConnectionCreated, onConnectionUpdated])

    // get the subscription id needed
    useEffect(() => {
      let promise = null
      if(connectionId) promise = getConnection(connectionId)
      else setConnection({})
      if(promise) promise.then(res => setConnection(get(res, 'data') || null))
    }, [connectionId])

    // load external dependencies
    // manufacturers & offers
    useEffect(() => {
      getManufacturers().then(res => setManufacturers(get(res, 'data')))
      getAllConnectors().then(res => {
        setConnectors(
          sortBy(get(res, 'data'), 'name')
        )
      })
    }, [])

    // memoized values
    const currentConnectionManufacturerId = get(connection, 'manufacturerId')
    const currentConnectionConnectorId = get(connection, 'connectorId')
    const releaseDate = get(connection, "releaseDate") || null
    const currentManufacturer = useMemo(() => find(manufacturers, o => o.id === currentConnectionManufacturerId), [manufacturers, currentConnectionManufacturerId])
    const currentConnector = useMemo(() => find(connectors, o => o.id === currentConnectionConnectorId), [connectors, currentConnectionConnectorId])
    const currentReleaseDate = useMemo(() => releaseDate === null ? releaseDate : date(releaseDate), [releaseDate])
    
    return (
      <>
        {currentConnectionId && (
          <>
            <label className="control-label">ID</label>
            <input className="form-control disabled" value={currentConnectionId}/>
            <br/>
          </>
        )}
        
        {/* manufacturerId */}
        <label className="control-label">Manufacturer {currentManufacturer && <Link className="pl-2" to={`/manufacturer/${get(currentManufacturer, 'id')}`}>View</Link>}</label>
        <Select
          value={currentManufacturer}
          onChange={manufacturer => {
            setConnection({
              ...connection,
              manufacturerId: manufacturer ? get(manufacturer, 'id') : null
            })
          }}
          name="currentManufacturer"
          getOptionLabel={o => get(o, 'name')}
          getOptionValue={o => get(o, 'id')}
          options={manufacturers}
          />
        <br/>
        
        {/* connectorId */}
        <label className="control-label">Connector {currentConnector && <Link className="pl-2" to={`/subscription/connector/${currentConnectionConnectorId}`}>View</Link>}</label>
        <Select
          value={currentConnector}
          onChange={connector => {
            setConnection({
              ...connection,
              connectorId: connector ? get(connector, 'id') : null
            })
          }}
          name="currentConnector"
          getOptionLabel={o => get(o, 'name')}
          getOptionValue={o => get(o, 'id')}
          options={connectors}
          />
        <br/>

        {/* status */}
        <label className="control-label">Status</label>
        <SelectString
          value={get(connection, 'status')}
          onChange={status => {
            setConnection({
              ...connection,
              status
            })
          }}
          name="currentStatus"
          options={CONNECTION_STATUS}
          />
        <br/>

        {/* releaseDate */}
        <label className="control-label">Release date</label>
        <DatePicker
          value={currentReleaseDate}
          onChange={d => setConnection({
            ...connection,
            releaseDate: d ? d.format('YYYY-MM-DD') : null
          })}
          />
        <br/>

        <div className="row">
          <div className="col-12 text-right">
            <button className="btn btn-primary" onClick={() => save(connection)}>
              {currentConnectionId ? 'Save' : 'Create'}
            </button>
            {currentConnectionId && (
              <button 
                className="btn btn-danger ml-2" 
                onClick={() => {
                  window.confirm(`Are you sure?`) &&
                  deleteConnection(currentConnectionId)
                    .then(res => onConnectionDeleted && onConnectionDeleted(currentConnectionId))
                    .catch(err => alert('Error'))
                }}
                >
                Delete connection
              </button>
            )}
          </div>
        </div>

      </>
    )

}

export default Connection
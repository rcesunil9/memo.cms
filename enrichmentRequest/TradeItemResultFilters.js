import React, { useState, useEffect, useMemo } from 'react'
import Select from 'react-select'
import get from 'lodash/get'
import find from 'lodash/find'
import SelectString from "../common/components/form/SelectString"
import { MATCHING_STATUS } from './utils';
import { getManufacturers } from 'app/common/services/manufacturer';

const TradeItemResultFilters = ({
    filters,
    // functions
    dispatch,
}) => {

    const [manufacturers, setManufacturers] = useState([])

    // memoized values
    const selectedManufacturer = useMemo(() => filters.manufacturerId ? find(manufacturers, m => get(m, 'id') === filters.manufacturerId) : null, [manufacturers, filters.manufacturerId])

    // on component mounted
    useEffect(() => {
        getManufacturers()
            .then(res => setManufacturers(get(res, 'data') || []))
    }, [])

    return (
        <>
            <div className='row'>

                {/* Gtin */}
                <div className='col-md-2'>
                    <label className="form-label">Gtin</label>
                    <input
                        className="form-control"
                        value={filters.gtin || ""}
                        onChange={e => dispatch({ type: 'setFilter', key: 'gtin', value: e.target.value || null })}
                        />
                </div>

                {/* manufacturerReference */}
                <div className='col-md-2'>
                    <label className="form-label">Manufacturer reference</label>
                    <input
                        className="form-control"
                        value={filters.manufacturerReference || ""}
                        onChange={e => dispatch({ type: 'setFilter', key: 'manufacturerReference', value: e.target.value || null })}
                        />
                </div>
                
                {/* manufacturerId */}
                <div className='col-md-2'>
                    <label className="form-label">Manufacturer</label>
                    <Select
                        isClearable={true}
                        value={selectedManufacturer}
                        onChange={o => dispatch({ type: 'setFilter', key: 'manufacturerId', value: o ? get(o, 'id') : null })}
                        getOptionValue={o => get(o, 'id')}
                        getOptionLabel={o => get(o, 'name')}
                        options={manufacturers}
                        />
                </div>

                {/* matchingStatus */}
                <div className='col-md-2'>
                    <label className="form-label">Matching status</label>
                    <SelectString
                        isClearable={true}
                        value={filters.matchingStatus}
                        onChange={values => dispatch({ type: 'setFilter', key: 'matchingStatus', value: values || [] })}
                        simpleValue
                        isMulti
                        options={MATCHING_STATUS}
                        closeMenuOnSelect={false}
                        />
                </div>

                {/* Enrichment status */}
                {/* <div className='col-md-2'>
                    <label className="form-label">Export status</label>
                    <SelectString
                        isClearable={true}
                        value={filters.exportStatus}
                        onChange={value => dispatch({ type: 'setFilter', key: 'exportStatus', value })}
                        simpleValue
                        options={EXPORT_STATUS}
                        />
                </div> */}

                {/* Actions */}
                <div className='col-md-2'>
                    <label className="form-label">&nbsp;</label>

                    {/* Clear filter */}
                    <button
                        className="btn btn-secondary d-block"
                        onClick={e => dispatch({ type: 'resetFilters' })}
                        >
                        Clear filters
                        </button>
                </div>

            </div>
        </>
    )

}

export default TradeItemResultFilters

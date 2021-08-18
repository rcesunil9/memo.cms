import React, { useEffect, useState, useMemo } from 'react'
import Select from 'react-select'
import get from 'lodash/get'
import find from 'lodash/find'
import { ANALYSIS_STATUS, ENRICHMENT_STATUS } from './utils';
import SelectString from "../common/components/form/SelectString"
import { getAllRetailers } from 'app/common/services/retailer';

const EnrichmentRequestFilters = ({
    filters,
    // functions
    dispatch,
}) => {
    const [retailers, setRetailers] = useState([])

    useEffect(() => {
        getAllRetailers()
            .then(res => setRetailers(get(res, 'data') || []))

    }, [])

    const memoizedSelectedRetailer = useMemo(() => find(retailers, r => get(r, 'id') === filters.retailerId), [filters.retailerId, retailers])

    return (
        <>
            <div className="row">

                {/* Retailer */}
                <div className="col-3">
                    <label className="form-label">Retailer</label>
                    <Select
                        isClearable={true}
                        options={retailers}
                        getOptionLabel={o => get(o, 'name')}
                        getOptionValue={o => get(o, 'id')}
                        value={memoizedSelectedRetailer}
                        onChange={value => dispatch({ type: 'setFilter', key: 'retailerId', value: value ? get(value, 'id') : null })}
                        />
                </div>

                {/* Enrichment status */}
                <div className="col-3">
                    <label className="form-label">Enrichment Status</label>
                    <SelectString
                        isClearable={true}
                        options={ENRICHMENT_STATUS}
                        value={filters.enrichmentStatus}
                        onChange={value => dispatch({ type: 'setFilter', key: 'enrichmentStatus', value })}
                        />
                </div>

                {/* Analysis status */}
                <div className="col-3">
                    <label className="form-label">Analysis Status</label>
                    <SelectString
                        isClearable={true}
                        options={ANALYSIS_STATUS}
                        value={filters.analysisStatus}
                        onChange={values => dispatch({ type: 'setFilter', key: 'analysisStatus', value: values || [] })}
                        isMulti
                        />
                </div>

                {/* Actions */}
                <div className="col-3">
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

export default EnrichmentRequestFilters

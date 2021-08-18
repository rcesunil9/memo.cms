import React, { useState, useMemo, useEffect } from 'react'
import get from 'lodash/get'
import find from 'lodash/find'
import Select from 'react-select'
import SelectString from "../common/components/form/SelectString"
import { TYPE_REJECTION_STATUS, TYPE_VALIDATION_TYPE } from './utils'
import { getPreComputedExportActions } from 'app/common/services/triggers'


export default ({ filters, dispatch}) => {
    const [exportActions, setExportActions] = useState([])

    useEffect(() => {
        getPreComputedExportActions().then(res => setExportActions(get(res, 'data') || []))

    }, [])

    const memoizedSelectedAction = useMemo(() => find(exportActions, r => get(r, 'id') === filters.exportActionId) || null, [filters.exportActionId, exportActions])

    return (
        <div className='row mb-4'>

            {/* Export Action  */}
            <div className='col-3'>
                <label className='control-label d-block'>Export Action</label>
                <Select
                    isClearable={true}
                    options={exportActions}
                    getOptionLabel={o => get(o, 'name')}
                    getOptionValue={o => get(o, 'id')}
                    value={memoizedSelectedAction}
                    onChange={value => dispatch({ type: 'setFilter', key: 'exportActionId', value: value ? get(value, 'id') : null })}
                    />
            </div>

            {/* Rejection Status  */}
            <div className='col-3'>
                <label className='control-label d-block'>Rejection Status</label>
                <SelectString
                    isClearable={true}
                    options={TYPE_REJECTION_STATUS}
                    value={filters.rejectionStatus}
                    onChange={value => dispatch({ type: 'setFilter', key: 'rejectionStatus', value })}
                    />
            </div>

            {/* Validation Type  */}
            <div className='col-3'>
                <label className='control-label d-block'>Validation Status</label>
                <SelectString
                    isClearable={true}
                    options={TYPE_VALIDATION_TYPE}
                    value={filters.validationType}
                    onChange={value => dispatch({ type: 'setFilter', key: 'validationType', value })}
                    />
            </div>

            {/* Actions  */}
            <div className='col-3'>
                <label className='control-label d-block'>&nbsp;</label>
                <button onClick={e => dispatch({ type: 'resetFilters' })} className='float-right btn btn-secondary'>Reset filters</button>
            </div>


        </div>
    )

}

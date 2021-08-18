import React, { useReducer, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import { filteredDataReducer, getFilteredDataInitialState } from 'app/common/reducers/filteredDataReducer'
import { getFormatProcessingRejections } from 'app/common/services/exportFormatProcessing'
import PageWrapper from 'app/common/components/layout/PageWrapper'
import SmartDatatable from 'app/common/components/datatable/SmartDatatable'
import { REJECTION_DEFAULT_FILTERS } from './utils'
import FormatProcessingRejectionsFilters from './FormatProcessingRejectionsFilters'

const FormatProcessingRejections = ({ defaultFilters }) => {    // initial state
    const [searchState, dispatch] = useReducer(filteredDataReducer, getFilteredDataInitialState({...REJECTION_DEFAULT_FILTERS, ...(defaultFilters || {})}))
    
    // memoized search function
    const search = useCallback(() => {
        dispatch({type: 'setLoading', value: false})
        getFormatProcessingRejections(searchState.pageNumber, searchState.pageSize, searchState.filters)
            .then(res => {
                dispatch({type: 'setLoading', value: false})
                dispatch({
                    type: 'setResults',
                    results: get(res, 'data.results'),
                    total: get(res, 'data.total'),
                })
            })
            .catch(() => dispatch({type: 'setLoading', value: false}))
    }, [searchState.pageNumber, searchState.pageSize, searchState.filters])

    // search updates
    useEffect(() => {
        search()
    }, [search])

    return (
        <>

            <FormatProcessingRejectionsFilters filters={searchState.filters} dispatch={dispatch}/>

            <SmartDatatable
                columns={[
                {
                    Header: 'Status',
                    id: 'status',
                    className: 'text-center',
                    accessor: request => (
                        <span className={`badge badge-${request.rejectionStatus === 'Error' ? 'danger' : (request.rejectionStatus === 'Warning' ? 'warning' : 'secondary')}`}
                            onClick={e => dispatch({ type: 'setFilter', key: 'rejectionStatus', value: get(request, 'rejectionStatus')})}
                            >                                
                            {get(request, 'rejectionStatus')} 
                            </span>
                    )
                },                
                {
                    Header: 'Creation',
                    id: 'creationTimestamp',
                    className: 'text-center',
                    accessor: request => get(request, 'creationTimestamp')
                },
                {
                    Header: 'Format Configuration',
                    accessor: 'formatConfigurationName',
                    className: 'text-center'
                },
                {
                    Header: 'Export Action',
                    accessor: 'exportActionName',
                    className: 'text-center'
                },
                {
                    Header: 'Validation Type',
                    id: 'validationType',
                    className: 'text-center',
                    accessor: request => (
                        <span className={`badge badge-light`}
                            onClick={e => dispatch({ type: 'setFilter', key: 'validationType', value: get(request, 'validationType')})}
                            >                                
                            {get(request, 'validationType')} 
                            </span>
                    )
                },
                {
                    Header: 'Actions',
                    id: 'actions',
                    className: 'text-center',
                    fixed: 'right',
                    accessor: request => <Link className='btn btn-sm btn-light' to={`/format-processing-rejection/${get(request, 'id')}`}>Detail</Link>
                },
                ]}
                manual
                sortable={false}
                onPageSizeChange={size => dispatch({ type: 'setPageSize', value: size })}
                onPageChange={page => dispatch({ type: 'setPageNumber', value: page })}
                pageSizeOptions={[20, 50, 100]}
                page={searchState.pageNumber}
                pages={Math.round(searchState.total / searchState.pageSize)}
                pageSize={searchState.pageSize}
                data={searchState.results}
                showPaginationTop={true}
                showPaginationBottom={false}
                className="-striped -highlight"
                />

        </>
    )

}


const FormatProcessingRejectionsView = ({ defaultFilters }) => {
    return (
        <PageWrapper>
            <h3 className='mb-5'>Format Processing Rejections</h3>
            <FormatProcessingRejections defaultFilters={defaultFilters}/>
        </PageWrapper>
    )
}

export { FormatProcessingRejections }

export default FormatProcessingRejectionsView

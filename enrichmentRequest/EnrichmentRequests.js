import React, { useReducer, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import PageWrapper from 'app/common/components/layout/PageWrapper'
import Card from 'app/common/components/layout/Card'
import SmartDatatable from 'app/common/components/datatable/SmartDatatable'
import { filteredDataReducer, getFilteredDataInitialState } from 'app/common/reducers/filteredDataReducer'
import { getPagedEnrichmentRequests } from 'app/common/services/enrichmentRequest'
import EnrichmentRequestFilters from './EnrichmentRequestFilters'
import { ENRICHMENT_REQUEST_FILTERS } from './utils'

const EnrichmentRequests = () => {
    // initial state
    const [searchState, dispatch] = useReducer(filteredDataReducer, getFilteredDataInitialState(ENRICHMENT_REQUEST_FILTERS))
    
    // memoized search function
    const search = useCallback(() => {
        dispatch({type: 'setLoading', value: false})
        getPagedEnrichmentRequests(searchState.pageNumber, searchState.pageSize, searchState.filters)
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

        <PageWrapper>

            <Card sm className="mb-3 p-1">
                <EnrichmentRequestFilters
                    filters={searchState.filters}
                    dispatch={dispatch}
                    />
            </Card>

            <Card sm className="mb-3 p-1" title="Enrichment requests">

                <SmartDatatable
                    columns={[
                    {
                        Header: 'Enrichment status',
                        id: 'status',
                        className: 'text-center',
                        accessor: request => (
                            <span className={`badge badge-${get(request, 'enrichmentStatus') === 'Complete' ? 'success' : 'danger'}`}
                                onClick={e => dispatch({ type: 'setFilter', key: 'enrichmentStatus', value: get(request, 'enrichmentStatus')})}
                                >                                
                                {get(request, 'enrichmentStatus')} 
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
                        Header: 'Retailer',
                        accessor: 'retailerName',
                        className: 'text-center'
                    },
                    {
                        Header: 'User',
                        accessor: 'userName',
                        className: 'text-center'
                    },
                    {
                        Header: 'Analysis',
                        id: 'analysisStatus',
                        className: 'text-center',
                        accessor: request => (
                            <span className={`badge badge-${get(request, 'analysisStatus') === 'Analysed' ? 'success' : (get(request, 'analysisStatus') === 'AnalysisFailed' ? 'danger' : 'info') }`}
                                onClick={e => dispatch({ type: 'setFilter', key: 'analysisStatus', value: [get(request, 'analysisStatus')]})}
                                >                                
                               {get(request, 'analysisStatus')} 
                                </span>
                        )
                    },
                    {
                        Header: 'Requested',
                        accessor: 'totalRequestedTradeItems',
                        className: 'text-center',
                    },
                    {
                        Header: 'Analysed',
                        accessor: 'totalMatchedTradeItems',
                        className: 'text-center',
                    },
                    {
                        Header: 'Complete',
                        accessor: 'totalCompleteTradeItems',
                        className: 'text-center',
                    },
                    {
                        Header: 'Not Complete',
                        accessor: 'totalNotCompleteTradeItems',
                        className: 'text-center',
                    },
                    {
                        Header: 'Exported',
                        accessor: 'totalExportedTradeItems',
                        className: 'text-center',
                    },
                    {
                        Header: 'Not Exported',
                        accessor: 'totalNonExportableTradeItems',
                        className: 'text-center',
                    },
                    {
                        Header: 'Not Existing',
                        accessor: 'totalNotExistingTradeItems',
                        className: 'text-center',
                    },
                    {
                        Header: 'Actions',
                        id: 'actions',
                        className: 'text-center',
                        fixed: 'right',
                        accessor: request => <Link to={`/enrichment-request/${get(request, 'id')}`}>Détail</Link>
                    },
                    ]}
                    manual
                    sortable={false}
                    onPageSizeChange={size => dispatch({ type: 'setPageSize', value: size })}
                    onPageChange={page => dispatch({ type: 'setPageNumber', value: page })}
                    pageSizeOptions={[20]}
                    page={searchState.pageNumber}
                    pages={Math.round(searchState.total / searchState.pageSize)}
                    pageSize={searchState.pageSize}
                    data={searchState.results}
                    showPaginationTop={true}
                    showPaginationBottom={false}
                    className="-striped -highlight"
                    />

            </Card>

        </PageWrapper>

    )

}

export default EnrichmentRequests

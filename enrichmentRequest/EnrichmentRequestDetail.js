import React, { useReducer, useEffect, useCallback } from 'react'
import { withRouter, Link } from 'react-router-dom'
import get from 'lodash/get'
import PageWrapper from 'app/common/components/layout/PageWrapper'
import Card from 'app/common/components/layout/Card'
import SmartDatatable from 'app/common/components/datatable/SmartDatatable'
import { filteredDataReducer, getFilteredDataInitialState } from 'app/common/reducers/filteredDataReducer'
import { getPagedEnrichmentRequestDetail } from 'app/common/services/enrichmentRequest'
import TradeItemResultFilters from './TradeItemResultFilters'
import { ENRICHMENT_TRADE_ITEM_RESULTS_FILTERS } from './utils'

const EnrichmentRequestDetail = ({
    match
}) => {
    // initial state
    const [searchState, dispatch] = useReducer(filteredDataReducer, getFilteredDataInitialState(ENRICHMENT_TRADE_ITEM_RESULTS_FILTERS))
    
    // memoized search function
    const search = useCallback(() => {
        dispatch({type: 'setLoading', value: false})
        getPagedEnrichmentRequestDetail(match.params.id, searchState.pageNumber, searchState.pageSize, searchState.filters)
            .then(res => {
                dispatch({type: 'setLoading', value: false})
                dispatch({
                    type: 'setResults',
                    results: get(res, 'data.results'),
                    total: get(res, 'data.total'),
                })
            })
            .catch(() => dispatch({type: 'setLoading', value: false}))
    }, [searchState.pageNumber, searchState.pageSize, searchState.filters, match.params.id])

    // search updates
    useEffect(() => {
        search()
    }, [search])
    // {
    //     Header: 'Export status',
    //     id: 'status',
    //     className: 'text-center',
    //     accessor: request => (
    //         <span className={`badge badge-${get(request, 'exportStatus') === 'Exported' ? 'success' : 'danger'}`}
    //             onClick={e => dispatch({ type: 'setFilter', key: 'exportStatus', value: get(request, 'exportStatus')})}
    //             >                                
    //             {get(request, 'exportStatus')} 
    //             </span>
    //     )
    // },
    return (

        <PageWrapper>

            <Card sm className="mb-3 p-1">
                <TradeItemResultFilters
                    filters={searchState.filters}
                    dispatch={dispatch}
                    />
            </Card>

            <Card sm className="mb-3 p-1" title="Trade item requested">

                <SmartDatatable
                    columns={[
                    {
                        Header: 'Matching status',
                        id: 'matchingStatus',
                        className: 'text-center',
                        accessor: request => (
                            <span className={`badge badge-${get(request, 'matchingStatus') === 'Complete' ? 'success' : 'danger' }`}
                                onClick={e => dispatch({ type: 'setFilter', key: 'matchingStatus', value: [get(request, 'matchingStatus')]})}
                                >                                
                               {get(request, 'matchingStatus')} 
                                </span>
                        )
                    },
                    {
                        Header: 'Update',
                        id: 'updateTimestamp',
                        className: 'text-center',
                        accessor: request => get(request, 'updateTimestamp')
                    },
                    {
                        Header: 'Gtin',
                        accessor: 'gtin',
                        className: 'text-center'
                    },
                    {
                        Header: 'Man. Ref.',
                        accessor: 'manufacturerReference',
                        className: 'text-center'
                    },
                    {
                        Header: 'Manufacturer',
                        id: 'manufacturerName',
                        className: 'text-center',
                        accessor: request => get(request, 'manufacturerName') || <i>Manufacturer not existing</i>
                    },
                    {
                        Header: 'Actions',
                        id: 'actions',
                        className: 'text-center',
                        fixed: 'right',
                        accessor: request => request.tradeItemId && <Link target='_blank' to={`/trade-item/${request.tradeItemId}`}>Go to product</Link>
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

export default withRouter(EnrichmentRequestDetail)

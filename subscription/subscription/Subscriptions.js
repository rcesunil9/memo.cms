import React, { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import PageWrapper from "../../common/components/layout/PageWrapper"
import { getSubscriptions } from '../../common/services/subscription'
import SmartDatatable from "../../common/components/datatable/SmartDatatable"
import { filterStringValueLowerCase } from '../../common/utils/filterString'
import usePaginatedData from '../../common/hooks/usePaginatedData'
import ActionsBar from "../../common/components/layout/ActionsBar"

const Subscriptions = () => {

    const [subscriptions, fetchSubscription] = usePaginatedData()

    // fetch subscriptions
    const fetch = useCallback((pageNumber, pageSize) => {

      const subscriptionsPromise = getSubscriptions(pageNumber, pageSize)
      
      return fetchSubscription(subscriptionsPromise, pageNumber, pageSize)

    }, [fetchSubscription])

    useEffect(() => {

      fetch(0, 20)

    }, [fetch])

    return (
      <div className="container-fluid">

        {/* Actions */}
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">Subscriptions</h2>
          </div>
          <div className="col-8 text-right">
              <Link to={`/subscription/subscription`} className="btn btn-success mr-2">
                + Create new subscription
              </Link>
          </div>
        </ActionsBar>

        <PageWrapper>

          <SmartDatatable
            manual
            sortable={false}
            onPageSizeChange={size => fetch(subscriptions.pageNumber, size)}
            onPageChange={page => fetch(page, subscriptions.pageSize)}
            pageSizeOptions={[20, 50, 100, 200, 500]}
            page={subscriptions.pageNumber}
            pages={Math.ceil(subscriptions.total / subscriptions.pageSize)}
            pageSize={subscriptions.pageSize}
            data={subscriptions.data}
            showPaginationTop={true}
            filterable
            defaultFilterMethod={filterStringValueLowerCase}
            columns={[
              { Header: "ID", accessor: "id" },
              { 
                Header: 'Manufacturer',
                id: 'manufacturerName',
                accessor: s => <Link to={`/manufacturer/${get(s, 'manufacturerId')}`}>{get(s, 'manufacturerName')}</Link>
              },
              { 
                Header: 'Offer',
                id: 'offerName',
                accessor: s => <Link to={`/subscription/offer/${get(s, 'offerId')}`}>{get(s, 'offerName.values[0].value')}</Link>
              },
              { Header: "Min. nb of trade items", accessor: "numberOfTradeItem.min", className: "text-center" },
              { Header: "Max. nb of trade items", accessor: "numberOfTradeItem.max", className: "text-center" },
              { Header: "Nb of connectors", accessor: "numberOfConnector", className: "text-center" },
              {
                Header: "Actions",
                id: "actions",
                className: "text-center",
                filterable: false,
                accessor: item => <Link to={`/subscription/subscription/${item.id}`}>Edit</Link>
              }
            ]}
          />



          </PageWrapper>

      </div>
    )

}

export default Subscriptions
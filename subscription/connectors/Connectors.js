import React, { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import PageWrapper from "../../common/components/layout/PageWrapper"
import { getConnectors } from '../../common/services/subscription'
import SmartDatatable from "../../common/components/datatable/SmartDatatable"
import { filterStringValueLowerCase } from '../../common/utils/filterString'
import usePaginatedData from '../../common/hooks/usePaginatedData'
import ActionsBar from "../../common/components/layout/ActionsBar"

const Connectors = () => {

    const [connectors, fetchConnectors] = usePaginatedData()

    // fetch subscriptions
    const fetch = useCallback((pageNumber, pageSize) => {

      const promise = getConnectors(pageNumber, pageSize)
      
      return fetchConnectors(promise, pageNumber, pageSize)

    }, [fetchConnectors])

    useEffect(() => {

      fetch(0, 20)

    }, [fetch])

    return (

      <div className="container-fluid">

        {/* Actions */}
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">Connectors</h2>
          </div>
          <div className="col-8 text-right">
              <Link to={`/subscription/connector`} className="btn btn-success mr-2">
                + Create new connector
              </Link>
          </div>
        </ActionsBar>

        <PageWrapper>
        
          <SmartDatatable
            manual
            sortable={false}
            onPageSizeChange={size => fetch(connectors.pageNumber, size)}
            onPageChange={page => fetch(page, connectors.pageSize)}
            pageSizeOptions={[20, 50, 100, 200, 500]}
            page={connectors.pageNumber}
            pages={Math.ceil(connectors.total / connectors.pageSize)}
            pageSize={connectors.pageSize}
            data={connectors.data}
            showPaginationTop={true}
            filterable
            defaultFilterMethod={filterStringValueLowerCase}
            columns={[
              { Header: "ID", accessor: "id" },
              { 
                Header: "Name", 
                accessor: "name",
              },
              { 
                Header: "Type", 
                accessor: "type",
              },
              { 
                Header: 'Retailer',
                id: 'retailerName',
                accessor: s => <Link to={`/retailer/${get(s, 'retailerId')}`}>{get(s, 'retailerName')}</Link>
              },
              { 
                Header: 'Target market',
                className: "text-center",
                accessor: 'targetMarketName',
              },
              { 
                Header: 'Status',
                accessor: 'status',
                className: "text-center",
              },
              { 
                Header: 'Visibility',
                accessor: 'visibility',
                className: "text-center",
              },
              { 
                Header: 'Sent by manu.',
                id: 'sentByManufacturer',
                className: "text-center",
                accessor: connector => !!get(connector, 'sentByManufacturer') ? <i className="icon-check text-success" /> : <i className="icon-close text-danger" />
              },
              { 
                Header: 'Release date',
                accessor: 'releaseDate',
              },
              {
                Header: "Actions",
                id: "actions",
                className: "text-center",
                filterable: false,
                accessor: item => <Link to={`/subscription/connector/${item.id}`}>Edit</Link>
              }
            ]}
          />



        </PageWrapper>
      </div>
    )

}

export default Connectors
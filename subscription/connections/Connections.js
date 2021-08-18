import React, { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import PageWrapper from "../../common/components/layout/PageWrapper"
import { getConnections } from '../../common/services/subscription'
import SmartDatatable from "../../common/components/datatable/SmartDatatable"
import { filterStringValueLowerCase } from '../../common/utils/filterString'
import usePaginatedData from '../../common/hooks/usePaginatedData'
import ActionsBar from "../../common/components/layout/ActionsBar"

const Connections = () => {

    const [connections, fetchConnections] = usePaginatedData()

    // fetch subscriptions
    const fetch = useCallback((pageNumber, pageSize) => {

      const promise = getConnections(pageNumber, pageSize)
      
      return fetchConnections(promise, pageNumber, pageSize)

    }, [fetchConnections])

    useEffect(() => {

      fetch(0, 20)

    }, [fetch])

    return (

      <div className="container-fluid">

        {/* Actions */}
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">Connections</h2>
          </div>
          <div className="col-8 text-right">
              <Link to={`/subscription/connection`} className="btn btn-success mr-2">
                + Create new connection
              </Link>
          </div>
        </ActionsBar>

        <PageWrapper>
        
          <SmartDatatable
            manual
            sortable={false}
            onPageSizeChange={size => fetch(connections.pageNumber, size)}
            onPageChange={page => fetch(page, connections.pageSize)}
            pageSizeOptions={[20, 50, 100, 200, 500]}
            page={connections.pageNumber}
            pages={Math.ceil(connections.total / connections.pageSize)}
            pageSize={connections.pageSize}
            data={connections.data}
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
                Header: 'Connector',
                id: 'connectorName',
                accessor: s => <Link to={`/connector/${get(s, 'connectorId')}`}>{get(s, 'connectorName')}</Link>
              },
              { 
                Header: 'Status',
                accessor: 'status',
                className: "text-center",
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
                accessor: item => <Link to={`/subscription/connection/${item.id}`}>Edit</Link>
              }
            ]}
          />



        </PageWrapper>
      </div>
    )

}

export default Connections
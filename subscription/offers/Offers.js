import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import PageWrapper from "../../common/components/layout/PageWrapper"
import { getOffers } from '../../common/services/subscription'
import SmartDatatable from "../../common/components/datatable/SmartDatatable"
import { filterStringValueLowerCase } from '../../common/utils/filterString'
import ActionsBar from "../../common/components/layout/ActionsBar"

const Offers = () => {

    const [offers, setOffers] = useState([])

    useEffect(() => {

        getOffers().then(res => setOffers(get(res, 'data')))

    }, [setOffers])

    return (

      <div className="container-fluid">

        {/* Actions */}
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">Offers</h2>
          </div>
          <div className="col-8 text-right">
              <Link to={`/subscription/offer`} className="btn btn-success mr-2">
                + Create new offer
              </Link>
          </div>
        </ActionsBar>

        <PageWrapper>
          
          <SmartDatatable
            showPaginationTop={true}
            filterable
            defaultFilterMethod={filterStringValueLowerCase}
            data={offers}
            columns={[
              { Header: "ID", accessor: "id" },
              { Header: "Order", className: 'text-center', accessor: "order" },
              { 
                Header: "Name",
                id: "name",
                accessor: o => get(o, "name.values[0].value") 
              },
              { 
                Header: "Description", 
                id: "description",
                accessor: o => get(o, "description.values[0].value") 
              },
              {
                Header: "Actions",
                id: "actions",
                className: "text-center",
                filterable: false,
                accessor: item => <Link to={`/subscription/offer/${item.id}`}>Edit</Link>
              }
            ]}
            defaultSorted={[{ id: "order", desc: true }]}
          />

        </PageWrapper>

      </div>
    )

}

export default Offers
import React from "react"
import { Link } from 'react-router-dom'
import get from "lodash/get"
import map from "lodash/map"
import size from "lodash/size"
import split from "lodash/split"
import FlagIcon from "../common/components/lang/FlagIcon"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import { TradeItemPreComputingStatusElement } from "app/preComputing/TradeItemPreComputingStatus"

class TradeItemsDatatable extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.tradeItems !== this.props.tradeItems
      || nextProps.tradeItems.length !== this.props.tradeItems.length
  }


  render() {
    const { tradeItems, loading } = this.props

    return (
        <SmartDatatable
          data={tradeItems}
          sortable={false}
          showPagination={false}
          loading={loading}
          columns={[
            {
                Header: "Id",
                accessor: "tradeItemId",
                width: 50,
            },
            {
                Header: "Manufacturer",
                accessor: "manufacturerName",
            },{
              Header: "Image",
                id: "image",
                className: 'text-center',
                accessor: d => {
                  if (get(d, 'tradeItemThumbnailImagePath')){
                    return <img height="50" alt={get(d, 'title')} src={get(d, 'tradeItemThumbnailImagePath')} />
                  }
                }
            },
            {
                Header: "Title",
                id: "title",
                accessor: d => <Link to={ `/trade-item/${d.tradeItemId}` }>{d.title}</Link>
            },
            {
                Header: "GTIN",
                accessor: "gtin"
            },
            {
                Header: "Manufacturer code",
                accessor: "tradeItemManufacturerCode"
            },
            {
                Header: "Languages available",
                id: "languagesAvailable",
                className: 'text-center',
                accessor: d => map(get(d, "languagesAvailable", []), l => <span key={`ti-lang-${d.tradeItemId}-${l}`} className="ml-2"><FlagIcon code={(split(l, '-')[1] || l).toLowerCase()} /></span>)
            },
            {
                Header: "Precomputing",
                id: "precomputingStatus",
                className: 'text-center',
                accessor: d => (
                  <TradeItemPreComputingStatusElement tradeItemStatus={get(d, 'precomputingStatus')} />
                )
            },
            {
              Header: "Actions",
              id: "actions",
              accessor: d => (
                <div className="text-center">
                  <Link to={ `/trade-item/${d.tradeItemId}` }>Edit</Link>
                </div>
              )
            }
          ]}
          pageSize={size(tradeItems)}
          className="-striped -highlight" />
    )
  }
}
export default TradeItemsDatatable

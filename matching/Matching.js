import React from "react"
import { connect } from "react-redux"
import { Link, withRouter } from 'react-router-dom'
import Sticky from 'react-stickynode'
import update from "immutability-helper"
import get from "lodash/get"
import PageWrapper from "../common/components/layout/PageWrapper"
import Modal from "../common/components/layout/Modal"
import Card from "../common/components/layout/Card"
import SmartDatatable from "../common/components/datatable/SmartDatatable"
import * as selectors from "./selectors"
import * as actions from "./actions"
import MatchingFilters from "./MatchingFilters"
import DoMatching from "./DoMatching"

class Matching extends React.Component {

  componentDidMount() {
    this.reset()
  }

  componentWillUnmount() {
    this.exit()
  }

  exit() {
    const {resetRequestedTradeItem, resetTradeItemForMatching} = this.props
    resetTradeItemForMatching()
    resetRequestedTradeItem()
  }

  reset() {
    const { filters } = this.props
    const { getMatchingRows, getManufacturers, getAllRetailers } = this.props
    getMatchingRows(filters)
    getManufacturers()
    getAllRetailers()
  }

  render() {

    const { matchingRows, loading, filters, manufacturers, retailers, total, requestedTradeItem } = this.props
    const { resetRequestedTradeItem, updateMatchingFilters, goToPage, resetFilters, toggleIgnore, setRequestedTradeItem, exportCsv } = this.props

    return (
      <React.Fragment>
        {/* Filters */}
        <div className="row">
          <div className="col">
            <Sticky top={40} innerZ={100}>
              <Card sm className="border-bottom">
                <MatchingFilters
                  onChange={filters => updateMatchingFilters(filters)}
                  onReset={() => resetFilters()}
                  filters={filters}
                  manufacturers={manufacturers}
                  retailers={retailers} />
                  <div className="form-group mb-0 mt-3 d-inline-block col-3">
                      <button
                          onClick={e => exportCsv(filters)}
                          className="btn btn-primary">
                          Export
                      </button>
                  </div>
                </Card>
            </Sticky>
          </div>
        </div>

        <PageWrapper className="p-0">
          {/* Total */}
          <div className="row mb-3">
            <div className="col">
              <Card sm className="border"><p className="m-0 lead"><strong>{`${total}`}</strong> result(s) found.</p></Card>
            </div>
          </div>

          {/* Matching data */}
          <div className="row mb-3">
            <div className="col">
              <SmartDatatable
                manual
                style={{zIndex: 0}}
                data={matchingRows}
                loading={loading}
                sortable={true}
                showPaginationTop={true}
                onPageSizeChange={size => updateMatchingFilters(update(filters, {pageSize: {$set: size}}))}
                onPageChange={page => goToPage(page)}
                onSortedChange={(newSorted, column, shiftKey) => updateMatchingFilters(update(filters, {orderBy: {$set: get(newSorted, "[0].id", null)}, orderDirection: {$set: get(newSorted, "[0].desc", null) ? "descending" : "ascending"}}))}
                sorted={filters.orderBy ? [{id: filters.orderBy, desc: filters.orderDirection === "descending"}] : []}
                pageSizeOptions={[50, 100, 200, 500, 1000]}
                page={filters.pageNumber}
                pages={total > 0 ? Math.ceil(total / filters.pageSize) : 0}
                pageSize={filters.pageSize}
                className="-striped -highlight text-center"
                columns={[
                  {
                      Header: "Retailer",
                      accessor: "externalRetailerId",
                  },
                  {
                      Header: "Title",
                      id: "title",
                      accessor: d => d.tradeItemId ? <Link className={`${d.matched ? "text-white" : ""}`} to={`/trade-item/${d.tradeItemId}`}>{d.title}</Link> : d.title
                  },
                  {
                      Header: "Language",
                      accessor: "languageCode",
                  },
                  {
                      Header: "GTIN",
                      accessor: "gtin",
                  },
                  {
                      Header: "SKU",
                      accessor: "tradeItemRetailerCode",
                  },
                  {
                      Header: "Manufacturer",
                      accessor: "retailerManufacturerName",
                  },
                  {
                      Header: "Ignored",
                      id: "ignored",
                      accessor: d => <input type="checkbox" checked={d.ignored} onChange={e => toggleIgnore(d)} />
                  },
                ]}
                getTrProps={(state, rowInfo, column) => {
                  return (rowInfo && {
                    className: rowInfo.original.matched ? "bg-success text-white" : "",
                    onDoubleClick: e => {
                      if(!rowInfo.original.matched) {
                        // open up matching view
                        setRequestedTradeItem(rowInfo.original)
                      }
                    }
                  }) || {};
                }}/>
            </div>
          </div>
        </PageWrapper>
        {requestedTradeItem && <Modal onClose={() => resetRequestedTradeItem()} title={`Matching ${requestedTradeItem.gtin}`}>
          <DoMatching
            onMatchingDone={(requestedTradeItem, tradeItemCreated) => updateMatchingFilters(filters)} />
        </Modal>}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      matchingRows: selectors.getMatchingRows(state),
      loading: selectors.isMatchingRowsFetching(state),
      total: selectors.getTotal(state),
      filters: selectors.getMatchingRowsFilters(state),
      manufacturers: selectors.getManufacturersForFilter(state),
      retailers: selectors.getRetailersForFilter(state),
      requestedTradeItem: selectors.getMatchingRequestedTradeItem(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(Matching))

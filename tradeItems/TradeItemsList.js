import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import debounce from "lodash/debounce"
import size from "lodash/size"
import merge from "lodash/merge"
import * as selectors from "./selectors"
import * as actions from "./actions"
import * as url from "../common/utils/url"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as localeSelectors from "../i18n/selectors"
import TradeItemsDatatable from "./TradeItemsDatatable"
import Card from '../common/components/layout/Card'
import Filter from './forms/Filter'

class IndexByTradeItemId extends React.Component {

  constructor(props) {
    super(props)
    this.state = { tradeItemId: "" }
  }

  render() {

    const { tradeItemId } = this.state

    const { indexByIdentifier, ...otherProps } = this.props

    return (
      <div {...otherProps}>
        <input 
          placeholder="GTIN, trade item id"
          value={tradeItemId || ""}
          onChange={e => this.setState({tradeItemId: e.target.value})}
          className="form-control d-inline-block"
          />
        <button 
          onClick={e => indexByIdentifier(tradeItemId)}
          className="btn btn-secondary  d-inline-block"
          >Index trade item</button>
      </div>
    )
  }


}


class TradeItemsList extends React.Component {

  componentDidMount() {
    this.doFilteredSearch = debounce(this.doFilteredSearch.bind(this), 500)
    const { fullsearchTradeItems, activeLanguage } = this.props
    const urlParams = url.paramObject()
    fullsearchTradeItems(activeLanguage, merge(selectors.getDefaultFilters(), urlParams))
  }

  componentWillUnmount() {
    const { resetManufacturers } = this.props
    resetManufacturers()
  }

  doFilteredSearch() {
    const { activeLanguage, filters, fullsearchTradeItems } = this.props
    fullsearchTradeItems(activeLanguage, filters)
  }

  render() {
    const { tradeItems, total, filters, fetching, activeLanguage, showFiltersModal, activeFiltersNumber, manufacturers } = this.props
    const { loadMoreTradeItems, setFilters, indexAll, indexByIdentifier, showFilters, getManufacturers } = this.props

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <Link to={`/trade-item`} className="btn btn-success">+ Create new trade item</Link>
            <button 
              onClick={e => {
                if(window.confirm("Are you sure?")) indexAll()
              }}
              className="btn btn-primary ml-2"
              >Index all</button>
            <IndexByTradeItemId 
              className="d-inline-block form-inline ml-2" 
              indexByIdentifier={indexByIdentifier}
              />
          </div>
        </div>
        <Card sm className="mb-3 p-1" title="Search by keyword">
          <Filter
            filters={filters}
            showFiltersModal={showFiltersModal}
            showFilters={showFilters}
            activeLanguage={activeLanguage}
            setFilters={setFilters}
            activeFiltersNumber={activeFiltersNumber}
            fetching={fetching}
            total={total}
            manufacturers={manufacturers}
            getManufacturers={getManufacturers}
            doFilteredSearch={this.doFilteredSearch}
          />
        </Card>
        <div className="row">
          <div className="col">
            <TradeItemsDatatable
              tradeItems={tradeItems}
              loading={fetching}
              filters={filters}
              setFilters={setFilters}
              doFilteredSearch={this.doFilteredSearch}
            />
          </div>
        </div>
        {/* Load more (elasticsearch specific for perf, no pagination bc of sharding) */}
        <div className="row py-6">
          <div className="col text-center">
            {(size(tradeItems) < total) && <button
              onClick={e => loadMoreTradeItems(activeLanguage, filters)}
              className={`btn btn-primary px-6 ${fetching ? "disabled" : ""}`}>{`${fetching ? "Fetching..." : "Load more"}`}</button>}
          </div>
        </div>
      </PageWrapper>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      tradeItems: selectors.getTradeItems(state),
      fetching: selectors.getTradeItemsFetching(state),
      total: selectors.getTradeItemsTotal(state),
      filters: selectors.getCurrentTradeItemsFilters(state),
      showFiltersModal: selectors.showFiltersModal(state),
      activeFiltersNumber: selectors.getActiveFiltersNumber(state),
      activeLanguage: localeSelectors.getActiveLanguage(state),
      manufacturers: selectors.getManufacturers(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(TradeItemsList))

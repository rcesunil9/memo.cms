import React from "react"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import get from "lodash/get"
import map from "lodash/map"
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'
import * as selectors from "./selectors"
import * as actions from "./actions"
import * as localeSelectors from "../i18n/selectors"
import * as utils from "./utils"
import Loading from "../common/components/loaders/Loading"
import Modal from "../common/components/layout/Modal"

// creation of trade item
import TradeItemEdit from "../tradeItems/TradeItemEdit"

class DoMatching extends React.Component {

  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
    this.exit()
  }

  init() {
    const { requestedTradeItem, debounceValue } = this.props
    this.search = debounce(this.search.bind(this), debounceValue)
    if(requestedTradeItem) {
      this.search(get(requestedTradeItem, "title", ""))
    }
  }

  search(filters) {
    const { activeLanguage } = this.props
    const { searchTradeItems } = this.props
    searchTradeItems(activeLanguage, filters)
  }

  exit() {
    const {resetRequestedTradeItem, resetTradeItemForMatching, resetMatchingTradeItemsList} = this.props
    resetTradeItemForMatching()
    resetRequestedTradeItem()
    resetMatchingTradeItemsList()
  }

  render() {
    const { filters, tradeItems, requestedTradeItem, areTradeItemsFetching, selectedTradeItem, isCreating } = this.props
    const { match, setTradeItemSearchFilters, setTradeItemForMatching, setIsCreatingNewTradeItem, onMatchingDone } = this.props

    return (
      <React.Fragment>
        {/* Create new trade item */}
        <div className="row">
          <div className="col">
            <button
              onClick={e => setIsCreatingNewTradeItem(true)}
              className="btn btn-lg btn-primary btn-block">Create new trade item</button>
            <hr />
          </div>
        </div>

        {/* Keyword filter */}
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>Database lookup:</label>
              <input
                value={filters}
                onChange={e => {
                  setTradeItemSearchFilters(e.target.value)
                  this.search(e.target.value)
                }}
                className="form-control" />
              {get(requestedTradeItem, "title") !== filters && <small className="form-text text-muted">Original title: {get(requestedTradeItem, "title")}</small>}
              {areTradeItemsFetching && <div className={`text-center p-2`}><Loading /></div>}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="row">
          <div className="col">
            <div className="form-group">
              {isEmpty(tradeItems) && <p className="text-center p-2 font-weight-bold">No results</p>}
              {!isEmpty(tradeItems) && <p className="text-center p-2 font-weight-bold">Click to select a product to be matched</p>}
              {map(tradeItems, (ti, idx) => <div className="list-group" key={`matching-found-tradeitem-${idx}`}>
                <button
                  onClick={e => setTradeItemForMatching(ti)}
                  className={`list-group-item list-group-item-action ${selectedTradeItem === ti ? "active" : ""}`}>
                  {ti.title}
                </button>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions cancel/save */}
        <div className="row">
          <div className="col text-right">
            <button
              onClick={() => this.exit()}
              className="btn btn-secondary mr-2">Cancel</button>
            <button
              onClick={() => selectedTradeItem && match(get(requestedTradeItem, "id"), selectedTradeItem.tradeItemId)}
              className={`btn btn-primary ${selectedTradeItem ? "" : "disabled"}`}>Match</button>
          </div>
        </div>

        {/* Is creating */}
        {isCreating && <Modal size={"lg"} title={`Create new trade item`} onClose={() => setIsCreatingNewTradeItem(false)}>
          <div className="row">
            <div className="col-3">
              <h5>Data received</h5>
              <pre className="bg-light p-2">{JSON.stringify(requestedTradeItem, null, 2)}</pre>
            </div>
            <div className="col">
              <TradeItemEdit
                onSave={(tradeItem) => {
                  setIsCreatingNewTradeItem(false)
                  this.exit()
                  onMatchingDone && onMatchingDone(requestedTradeItem, tradeItem)
                }}
                initialValue={utils.getTradeItemFromMatching(requestedTradeItem)} />
            </div>
          </div>
        </Modal>}

      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      filters: selectors.getMatchingFilters(state),
      tradeItems: selectors.getMatchingTradeItems(state),
      requestedTradeItem: selectors.getMatchingRequestedTradeItem(state),
      areTradeItemsFetching: selectors.areTradeItemsFetching(state),
      activeLanguage: localeSelectors.getActiveLanguage(state),
      debounceValue: 200,
      selectedTradeItem: selectors.getMatchingSelectedTradeItem(state),
      isCreating: selectors.isCreating(state)
    }
}

export default withRouter(connect(mapStateToProps, actions)(DoMatching))

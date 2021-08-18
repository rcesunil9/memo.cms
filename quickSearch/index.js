import React from 'react'
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { HotKeys } from 'react-hotkeys'
import * as actions from "./actions"
import * as selectors from "./selectors"
import * as localeSelectors from "../i18n/selectors"
import debounce from 'lodash/debounce'
import map from 'lodash/map'

const SearchOverlay = ({children, displayed, onClick}) => (
  <div
    onClick={onClick}
    style={{
    position: "fixed",
    backgroundColor: "rgba(0,0,0,.85)",
    zIndex: 3000,
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    display: displayed ? "inline-block" : "none"
  }}>{children}</div>
)

class QuickSearch extends React.Component {

  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.search = debounce(this.search.bind(this), props.debounceValue)
  }

  onSubmit(e) {
    e.preventDefault()
  }

  search() {
    const { quickSearch, isDisplayed, toggleDisplay, value, activeLanguage } = this.props
    if(!isDisplayed) toggleDisplay()
    quickSearch(activeLanguage, value)
  }

  onChange(e) {
    this.props.setQuickSearchValue(e.target.value)
    this.search()
  }

  render() {
      const { isDisplayed, value, tradeItems, resetQuickSearch } = this.props

      return (
        <form className="" onSubmit={this.onSubmit}>
            <div
              className={`global-search input-group text-dark ${isDisplayed ? "full" : ""}`}
              style={{zIndex: 3001}}>
              <div className="input-group-prepend">
                <i className="icon-magnifier text-muted position-absolute"
                   style={{
                    zIndex: 3002,
                    top: 11,
                    left: 10,
                    fontSize: 12}}/>
              </div>

              <HotKeys keyMap={{escape: 'esc'}} handlers={{'escape': (event) => resetQuickSearch()}}>
                <input
                  className={`react-autosuggest__input`}
                  value={value || ""}
                  onChange={this.onChange}/>
              </HotKeys>

            </div>

            <SearchOverlay displayed={isDisplayed} onClick={e => resetQuickSearch()}>
              <div className="container pt-7 text-center">
                <h2 className="font-weight-light">Trade items</h2>
                <ul className="list list-unstyled py-5">
                  {map(tradeItems, tradeItem => <li className="global-search-result py-2" key={`qs-${tradeItem.tradeItemId}`}>
                    <Link to={`/trade-item/${tradeItem.tradeItemId}`}>{tradeItem.manufacturerName} - {tradeItem.title}</Link>
                  </li>)}
                </ul>
              </div>
            </SearchOverlay>

          </form>)
  }

}

const mapStateToProps = (state) => {
    return {
      isDisplayed: selectors.isDisplayed(state),
      value: selectors.getQuickSearchValue(state),
      tradeItems: selectors.getTradeItemsById(state),
      debounceValue: 500,
      activeLanguage: localeSelectors.getActiveLanguage(state),
    }
}

export default connect(mapStateToProps, actions)(QuickSearch)

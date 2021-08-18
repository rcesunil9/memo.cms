import React from "react"
import { connect } from "react-redux"
import get from "lodash/get"
import { withRouter, Link } from 'react-router-dom'
import * as selectors from "./selectors"
import * as actions from "./actions"
import * as utils from "./utils"
import Card from "../common/components/layout/Card"
import GroupsMenu from "./GroupsMenu"
import Sticky from 'react-stickynode'
import ImageManagement from './forms/ImageManagement'
import DocumentManagement from './forms/DocumentManagement'
import PropertiesEdit from './PropertiesEdit'
import TradeItemPreComputingStatus from '../preComputing/TradeItemPreComputingStatus'

// forms
import GeneralInformation from "./forms/GeneralInformation"

export const GroupForm = ({groupSelected}) => {
  switch(groupSelected) {
    case "IMAGES":
      return <ImageManagement/>
    case "DOCUMENTS":
      return <DocumentManagement/>
    default:
      return <PropertiesEdit/>
  }
}

class TradeItemEdit extends React.Component {

  componentDidMount() {
    this.init()
  }

  componentWillUpdate(nextProps) {
    if(this.props.id !== nextProps.id) {
      this.reset()
      if(nextProps.id) this.init(nextProps.id)
    }
  }

  componentWillUnmount() {
    this.reset()
  }

  async init(id) {
    let tradeId
    if (id) {
      tradeId = id
    } else if (!id) {
      tradeId = this.props.id
    }
    const {initialValue} = this.props
    const {getTradeItemById, setGroupSelected, getPropertiesGroups, getManufacturers, setTradeItem, getTargetMarkets, getRetailers, getTradeItemCategories} = this.props
    if (tradeId) {
      await getTradeItemById(tradeId)
    } else {
      setTradeItem(initialValue || utils.getDefaultTradeItem())
    }
    getTradeItemCategories()
    getManufacturers()
    getPropertiesGroups()
    setGroupSelected(utils.getDefaultGroup())
    getTargetMarkets()
    getRetailers()
  }

  reset() {
    const {
      resetTradeItems,
      resetManufacturers,
      resetLanguages,
      resetPropertiesGroups,
      resetTradeItem,
      resetProperties,
      resetTradeItemCategories,
      resetTargetMarkets,
      resetRetailers
    } = this.props

    resetTradeItems()
    resetManufacturers()
    resetLanguages()
    resetPropertiesGroups()
    resetProperties()
    resetTradeItem()
    resetTradeItemCategories()
    resetTargetMarkets()
    resetRetailers()
  }

  render() {
    const { tradeItem, groupSelected, groups, tradeItemCategories, manufacturers, history, id } = this.props
    const { setGroupSelected, setTradeItem, getPropertiesByGroupAndTradeItemCategoryCode, saveTradeItem, createTradeItem , deleteTradeItem, preComputeTradeItem } = this.props

    return (
      <React.Fragment>

        <div className="row">
          {/* Actions + Groups nav */}
          <div className="col-12">
            <Sticky top={60} innerZ={1}>
                <div className="row mb-3">
                  <div className="col-4">
                    <button
                      onClick={e => {
                        e.preventDefault()
                        if (get(tradeItem, 'tradeItemId')) saveTradeItem(tradeItem)
                        else createTradeItem(tradeItem).then(res => window.location.href = `/trade-item/${get(res, 'data.tradeItemId')}`)
                        //     .then(
                        //       res => onSave && onSave(tradeItem)
                        //     ).catch(err => onSave && onSave(null))
                        // }}
                      }}
                      className="btn btn-primary">Save
                    </button>
                    <button
                      onClick={e => {
                        e.preventDefault()
                        if(window.confirm(`Are you sure?`)) {
                          deleteTradeItem(get(tradeItem, 'tradeItemId'))
                            .then(res => {
                              history.goBack()
                            })
                            .catch(err => alert(err))
                        }
                      }}
                      className="btn btn-danger ml-2">Delete
                    </button>
                    <Link to={`/trade-item`} className="btn btn-light ml-2">Create new trade item</Link>
                    {get(tradeItem, 'tradeItemId', null) &&
                    <button onClick={e => preComputeTradeItem(tradeItem.tradeItemId)}
                            className="btn btn-light ml-2"><i className="icon-energy"/> Pre-compute
                    </button>}

                    {id && <TradeItemPreComputingStatus
                      style={{ position: 'absolute', top: '-26px' }}
                      tradeItemId={id} 
                      name='edit-trade-item'
                      />}

                  </div>
                  <div className="col-8">
                    <GroupsMenu
                      groups={groups}
                      groupSelected={groupSelected}
                      setGroupSelected={setGroupSelected}/>
                  </div>
                </div>
            </Sticky>
          </div>

          {/* Actions + General info */}
          <div className="col-4">
            {/* Actions */}
            <Sticky top={140}>
            {/* General info */}
            <div className="row">
              <div className="col">
                <Card title={`General information`}>
                  <GeneralInformation
                    onChange={tradeItem => setTradeItem(tradeItem)}
                    tradeItem={tradeItem}
                    tradeItemId={get(tradeItem, "tradeItemId")}
                    tradeItemCategoryCode={get(tradeItem, "tradeItemCategory.code")}
                    gtin={get(tradeItem, "gtin")}
                    tradeItemManufacturerCode={get(tradeItem, "tradeItemManufacturerCode")}
                    defaultLanguageCode={get(tradeItem, "defaultLanguageCode")}
                    tradeItemCategories={tradeItemCategories}
                    manufacturerId={get(tradeItem, "manufacturerId", null)}
                    manufacturers={manufacturers}
                    onTradeItemCategoryChanged={s => {
                      getPropertiesByGroupAndTradeItemCategoryCode(tradeItem.taxonomyId, groupSelected, s)
                    }} />
                </Card>
              </div>
            </div>
            </Sticky>
          </div>

          <div className="col-8">
            {/* Properties */}
            <div className="row">
              <div className="col">
                <Card title={`Values`}>
                  <GroupForm
                    groupSelected={groupSelected}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
    return {
      tradeItem: selectors.getTradeItemToEdit(state),
      groupSelected: selectors.getGroupSelected(state),
      groups: selectors.getGroups(state),
      tradeItemCategories: selectors.getTradeItemCategories(state),
      manufacturers: selectors.getManufacturers(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(TradeItemEdit))

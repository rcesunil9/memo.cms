import React from "react"
import { connect } from "react-redux"
import get from "lodash/get"
import map from "lodash/map"
import filter from "lodash/filter"
import includes from "lodash/includes"
import reverse from "lodash/reverse"
import isEmpty from "lodash/isEmpty"
import * as selectors from "./selectors"
import * as actions from "./actions"
import * as utils from "./utils"
import DateProperty from "./forms/DateProperty"
import ListProperty from "./forms/ListProperty"
import NumericProperty from "./forms/NumericProperty"
import StringProperty from "./forms/StringProperty"
import TextProperty from "./forms/TextProperty"
import Channel from './forms/Channel'

const PropertyFormFactory = props => {
  switch (get(props.property, "type", null)) {
    case "Date":
      return <DateProperty {...props} />;
    case "List":
      return <ListProperty {...props} />;
    case "Numeric":
      return <NumericProperty {...props} />;
    case "String":
      return utils.isFullTextProperty(props.property) ? <TextProperty {...props} /> : <StringProperty {...props} />;
    default:
      console.error(`Property form not found for: ${get(props.property, "type", null)}`)
      return null
  }
}

const mainPropertiesList = ['title', 'short_product_description', 'brand', 'product_line']

const mainPropertiesObject = {
  title: "Title",
  short_product_description: 'Description',
  brand: 'Brand',
  product_line: 'Product line'
}

const PropertiesEdit = ({
  tradeItem,
  groupSelected,
  properties,
  targetMarkets,
  retailers,
  // actions
  setTradeItemProperty,
  mergeTradeItemProperty,
  deleteTradeItemProperty, }) => (

  <React.Fragment>

    {/* Map through trade item values */}
    {!isEmpty(properties) && map(get(tradeItem, utils.getTradeItemKeyFromGroup(groupSelected), []), (tiValue, tIndex) => {
      const mainPropertiesValues = reverse(filter(properties, (v) => includes(mainPropertiesList, v.code) ))
      return <div className={`row py-4 ${(groupSelected === 'Pricing' || groupSelected === 'Translations') ? 'border mb-1 mt-1' : 'border-bottom'}`} key={`trade-item-index-${tIndex}`}>

        {/* Main properties */}
        {groupSelected === 'MARKETING' && <div className="col-12">
          <div className="row">
            {map(mainPropertiesValues, (prop, index) => {
              return <div className="col-3 control-label text-center" key={`trade-item-property-main-label-${tIndex}-${index}`}>{mainPropertiesObject[prop.code]}</div>
            })}
          </div>
          <div className="row mt-1">
            {map(mainPropertiesValues, (prop, index) => {
              const tradeItemKey = utils.getTradeItemPropertyKey(prop, groupSelected, tIndex)
              return (
                <div className="col-3 control-label text-center" key={`trade-item-property-main-${tIndex}-${index}`}>
                  <PropertyFormFactory
                    name={tradeItemKey}
                    onChange={value => setTradeItemProperty(tradeItemKey, value)}
                    value={get(tradeItem, tradeItemKey, null)}
                    property={prop}
                    />
                </div>
              )
            })}
          </div>
          <hr className="w-100"/>
        </div>}

        {/* Price Actions */}
        {(groupSelected === 'PRICING' || groupSelected === 'TRANSLATIONS') && <div className="col-12">
          <button
            className="btn btn-md btn-danger"
            onClick={e => {
              e.preventDefault()
              window.confirm(`Are you sure to delete this?`) && deleteTradeItemProperty(`${utils.getTradeItemKeyFromGroup(groupSelected)}.${tIndex}`)
            }}
          >Delete
          </button>
          <hr className="w-100"/>
        </div>}

        {get(tiValue, 'channels', null) && <div className="col-12">
          <label className="control-label">Channels</label>
          <div className="col-6">
            <Channel
              channels={get(tiValue, 'channels', [])}
              targetMarkets={targetMarkets}
              retailers={retailers}
              onChange={value => setTradeItemProperty(utils.getTradeItemChannelKey(groupSelected, tIndex), value)}
            />
          </div>
          <hr className="w-100"/>
        </div>}

        {map(properties, (p, k) => (
          <div className="col-6" key={`trade-item-property-${tIndex}-${k}`}>
            {(() => {
              const isPropSingle = utils.isPropertySingle(p)
              const tradeItemKey = utils.getTradeItemPropertyKey(p, groupSelected, tIndex)
              
              return (
                <div className="form-group">
                  <label>{get(p, "code")}</label>
                  {
                      isPropSingle ?

                      <PropertyFormFactory
                        name={tradeItemKey}
                        isMulti={!isPropSingle}
                        onChange={value => setTradeItemProperty(tradeItemKey, value)}
                        value={get(tradeItem, tradeItemKey, null)}
                        property={p} />

                      :

                      <div className="mb-3">

                        {/* List case */}
                        {p.type === "List" && (
                          <div className="row mb-3" key={`trade-item-property-${tIndex}-${k}`}>
                            <div className="col">
                              <PropertyFormFactory
                                name={tradeItemKey}
                                isMulti={!isPropSingle}
                                onChange={v => setTradeItemProperty(`${tradeItemKey}`, v)}
                                value={get(tradeItem, `${tradeItemKey}`, null)}
                                property={p} />
                            </div>
                          </div>
                        )}

                        {/* Regular property case */}
                        {p.type !== "List" && (
                        
                          <React.Fragment>

                            {/* Iterate through values */}
                            {map(get(tradeItem, tradeItemKey, []), (value, valueIndex) => (
                              <div className="row mb-3" key={`trade-item-property-${tIndex}-${k}-${valueIndex}`}>
                                <div className="col">
                                  <PropertyFormFactory
                                    name={tradeItemKey}
                                    isMulti={!isPropSingle}
                                    onChange={v => setTradeItemProperty(`${tradeItemKey}.${valueIndex}`, v)}
                                    value={get(tradeItem, `${tradeItemKey}.${valueIndex}`, null)}
                                    property={p} />
                                </div>
                                {p.type !== "List" && <div className="col-2">
                                  <button
                                    onClick={e => deleteTradeItemProperty(`${tradeItemKey}.${valueIndex}`)}
                                    className="btn btn-danger btn-sm">x</button>
                                </div>}
                              </div>
                            ))}

                            {/* Add new item */}
                            <button
                              onClick={e => mergeTradeItemProperty(`${tradeItemKey}`, [""])}
                              className="btn btn-link btn-sm p-0">Add new item</button>

                          </React.Fragment>

                        )}                          
                    </div>
                  }
                </div>
              )
            })()}
          </div>
        ))}

        </div>

    })}

  </React.Fragment>
)

const mapStateToProps = (state) => {
    return {
      tradeItem: selectors.getTradeItemToEdit(state),
      targetMarkets: selectors.getTargetMarkets(state),
      retailers: selectors.getRetailers(state),
      groupSelected: selectors.getGroupSelected(state),
      properties: selectors.getTradeItemPropertiesOrdered(state),
    }
}

export default connect(mapStateToProps, actions)(PropertiesEdit)

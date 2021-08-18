import React from "react"
import dotProp from "dot-prop-immutable"
import Select from "react-select"
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
import { Link } from 'react-router-dom'
import get from 'lodash/get'
import find from 'lodash/find'

const GeneralInformation = ({tradeItem, tradeItemId, tradeItemCategoryCode, gtin, manufacturerId, manufacturers, tradeItemManufacturerCode, defaultLanguageCode, tradeItemCategories, onChange, onTradeItemCategoryChanged}) => {
  return (
  <React.Fragment>

    {/* Id */}
    <div className="form-group">
      <label>Id:</label>
      <input
        value={tradeItemId || ""}
        disabled
        type="text"
        className="form-control" />
    </div>

    {/* Trade Item Category */}
    <div className="form-group">
      <label>Trade Item Category *</label>
      <Select
            options={tradeItemCategories}
            value={find(tradeItemCategories, s => s.code.code === tradeItemCategoryCode) || null}
            name={"tradeItemCategoryCode"}
            getOptionLabel={o => `${o.code.code} - ${o.name} (${o.unspsc})`}
            getOptionValue={o => o.code.code}
            onChange={v => {
              onChange(dotProp.set(tradeItem, "tradeItemCategory.code", v.code.code))
              onTradeItemCategoryChanged(v.code.code)
            }}
        />
    </div>

    {/* Gtin */}
    <div className="form-group">
      <label>Gtin *</label>
      <input
        value={gtin || ""}
        onChange={e => onChange(dotProp.set(tradeItem, "gtin", e.target.value))}
        type="text"
        className="form-control" />
    </div>

    {/* Manufacturer code */}
    <div className="form-group">
      <label>Trade item manufacturer code *</label>
      <input
        value={tradeItemManufacturerCode || ""}
        onChange={e => onChange(dotProp.set(tradeItem, "tradeItemManufacturerCode", e.target.value))}
        type="text"
        className="form-control" />
    </div>

    {/* Default language code */}
    <div className="form-group">
      <label>Default language code *</label>
      <input
        value={defaultLanguageCode || ""}
        onChange={e => onChange(dotProp.set(tradeItem, "defaultLanguageCode", e.target.value))}
        type="text"
        className="form-control" />
    </div>

    {/* Manufacturer */}
    <div className="form-group">
      <label>Manufacturer *</label>
      {/* {get(manufacturer, 'manufacturerId') && <Link to={`/trade-items?manufacturers=${manufacturer.name}`} className="btn btn-link p-0 ml-1">&#8594; View all products</Link>} */}
      <Select
        value={find(
          manufacturers || [],
          entity => manufacturerId === entity.id
        )}
        onChange={mf => onChange(dotProp.set(tradeItem, "manufacturerId", mf ? mf.id : null))}
        isClearable={true}
        getOptionLabel={o => o.name}
        getOptionValue={o => o.id}
        options={manufacturers || []} />
    </div>

    {/* Similar products */}
    <div className="form-group">
      <label>Show products with the same:</label>
      <div>
        {get(tradeItem, 'marketing.0.values.brand') &&
        <Link to={`/trade-items?keyword=${get(tradeItem, 'marketing.0.values.brand')}`}
              className="btn btn-secondary">Brand</Link>
        }
        {get(tradeItem, 'marketing.0.values.licenses') &&
        <Link to={`/trade-items?keyword=${get(tradeItem, 'marketing.0.values.licenses')}`}
              className="btn btn-secondary ml-2">Licenses</Link>
        }
      </div>
    </div>
  </React.Fragment>
)}

export default onlyUpdateForKeys(['tradeItemId', 'tradeItemCategoryCode','tradeItemCategories', 'gtin', 'tradeItemManufacturerCode', 'manufacturerId', 'manufacturers', 'defaultLanguageCode'])(GeneralInformation);
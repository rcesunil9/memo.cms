import React from 'react'
import get from 'lodash/get'
import update from 'immutability-helper'
import map from 'lodash/map'
import filter from 'lodash/filter'
import indexOf from 'lodash/indexOf'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import Tabs from '../../common/components/tabs/Tabs'
import Tab from '../../common/components/tabs/Tab'
import Select from 'react-select'
import { getChannelPlaceholder } from '../utils'
import { date } from '../../common/utils/date'
import DatePicker from '../../common/components/date/DatePicker'

const Channel = (props) => {
  const {channels, targetMarkets, retailers, onChange} = props

  const add = () => onChange([...channels, getChannelPlaceholder()])
  const change = (k, v, index) => onChange(update(channels, {[index]: {[k]: {$set: v}}}))
  let defaultTab = 0
  const remove = index => {
    if (size(channels) > index + 1)
      defaultTab = index - 1
    else defaultTab = 0
    onChange(update(channels, {$set: [...channels.slice(0, index), ...channels.slice(index + 1)]}))
  }

  return (
    <React.Fragment>
      <div className="mb-1">
        <button
          onClick={e => {
            e.preventDefault()
            add()
          }}
          className="btn btn-link btn-sm p-0">+ Add channel
        </button>
      </div>

      {!isEmpty(channels) && <Tabs activeTab={{id: `${defaultTab}`}}>
        {map(channels, (item, index) => {
            return <Tab id={`${index}`} title={index} key={index}>
              <div className="row">

                {/* Start date */}
                <div className="form-group col-6">
                  <label className="control-label">Start date</label>
                  <DatePicker
                    onChange={d => change('startDate', d, index)}
                    value={item.startDate ? date(item.startDate): null}/> 
                </div>

                {/* End date */}
                <div className="form-group col-6">
                  <label className="control-label">End date</label>
                  <DatePicker
                    onChange={d => change('endDate', d, index)}
                    value={item.endDate ? date(item.endDate) : null}/>
                </div>

                {/* Target markets ids */}
                <div className="form-group col-6">
                  <label className="control-label">Target markets</label>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    value={filter(
                      targetMarkets,
                      r => indexOf(get(item, 'targetMarketIds', []), r.id) !== -1
                    )}
                    onChange={v => change('targetMarketIds', map(v, _v => get(_v, 'id', null)), index)}
                    isClearable={true}
                    getOptionLabel={o => o.name}
                    getOptionValue={o => o.id}
                    options={targetMarkets}
                  />
                </div>

                {/* Retailers ids */}
                <div className="form-group col-6">
                  <label className="control-label">Retailers</label>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    value={filter(
                      retailers,
                      r => indexOf(get(item, 'retailerIds', []), r.id) !== -1
                    )}
                    onChange={v => change('retailerIds', map(v, _v => get(_v, 'id', null)), index)}
                    isClearable={true}
                    getOptionLabel={o => o.name}
                    getOptionValue={o => o.id}
                    options={retailers}
                  />
                </div>
              </div>

              <button
                onClick={e => {
                  e.preventDefault()
                  remove(index)
                }}
                className="btn btn-sm btn-danger float-right"
              >
                Remove
              </button>
            </Tab>
          }
        )}
      </Tabs>}
    </React.Fragment>
  )
}

export default Channel
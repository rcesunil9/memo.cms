import React from "react"
import Select from "react-select"
import get from 'lodash/get'
import find from 'lodash/find'
import { connect } from 'react-redux'
import * as selectors from '../selectors'
import dotProp from 'dot-prop-immutable'
import * as actions from '../actions'
import { getNewSynchronizeImagesAction } from "../utils"


class SynchronizeImagesActionViewModel extends React.Component {

  componentDidMount() {
    this.init()
  }

  async init() {
    const { model } = this.props
    const { setAction, getManufacturersEntities } = this.props
    if(!get(model, "id", null)) setAction(getNewSynchronizeImagesAction())
    getManufacturersEntities()
  }

  render() {
    const props = this.props
    const { model, manufacturersEntities } = props
    const { onChange } = props

    const change = (k, v) => onChange(dotProp.set(model, k, v))

    return (
      <React.Fragment>

        {/* Manufacturer */}
        <div className="form-group">
          <label className="control-label">Manufacturer entity*</label>
          <Select
            options={manufacturersEntities}
            value={find(manufacturersEntities, manufacturerEntity => get(model, "manufacturerEntityId") === manufacturerEntity.id)}
            onChange={option => change('manufacturerEntityId', option.id)}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.id}
          />
        </div>

        {/* Full directory Images*/}
        <div className="form-group">
          <label>Only full directory images</label>
          <input
            onChange={e => change('onlyFullDirectoryImages', e.target.checked)}
            checked={get(model, "onlyFullDirectoryImages", true)}
            className="form-control"
            type="checkbox"/>
        </div>
      </React.Fragment>
    )

  }

}




const mapStateToProps = (state) => {
  return {
    manufacturersEntities: selectors.getManufacturersEntities(state),
  }
}

export default connect(mapStateToProps, actions)(SynchronizeImagesActionViewModel)

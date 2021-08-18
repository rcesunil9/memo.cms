import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import get from "lodash/get"
import map from "lodash/map"
import Select from "react-select"
import * as selectors from "./selectors"
import * as actions from "./actions"
import ActionsBar from "../common/components/layout/ActionsBar"
import Card from "../common/components/layout/Card"
import SelectString from "../common/components/form/SelectString"


class AliasEdit extends React.Component {

  componentDidMount() {

    const { match } = this.props
    const { getAlias, getAliasGroups, getRetailers } = this.props
    const id = get(match, "params.id", null)

    if(id) getAlias(id)
    getAliasGroups()
    getRetailers()
  }

  componentWillUnmount(){
    const { resetAliasGroups, resetRetailers, resetAliasProperties, resetAliasTradeItemProperty } = this.props
    resetAliasGroups()
    resetRetailers()
    resetAliasProperties()
    resetAliasTradeItemProperty()
  }

  delete(id) {
    const { deleteAlias, history } = this.props
    if(!window.confirm(`Are you sure?`)) return
    return deleteAlias(id).then(data => {
      history.push(`/trade-items-properties-aliases`)
    })
  }

  render() {

    const { match, alias, retailers, groups, properties, retailerSelected, tradeItemProperty, groupSelected, aliasPropertySelected, propertiesFetching } = this.props

    const { setAliasValue, setAliasTradeItemPropertyValue, setAliasTradeItemProperty, getAliasProperties, addNewAliasProperty, removeAliasProperty, saveAlias } = this.props

    const id = get(match, "params.id", null)

    return (
      <div className="container-fluid">

        {/* Actions */}
        <ActionsBar>
            <div className="col-4">
              <h2 className="h4 pt-1 m-0 font-weight-light">{ get(alias, "aliasName") }</h2>
            </div>
            <div className="col-8 text-right">
              <Link to={`/trade-items-properties-aliases`} className="btn btn-light mr-2">Go back to list</Link>
              {id && <Link to={`/trade-items-properties-alias`} className="btn btn-success mr-2">+ Create new alias</Link>}
              {id && <button className="btn btn-danger" onClick={() => this.delete(id)}>Delete alias</button>}
              <button
                onClick={e => saveAlias(alias)}
                className="btn btn-primary ml-2">Save</button>
            </div>
        </ActionsBar>

        {/* Edit */}
        <div className="row py-3">
          <div className="col-5">
            <Card>
              
                {/* Alias name */}
                <div className="form-group">
                    <label>Alias name *</label>
                    <input 
                        value={get(alias, "aliasName") || ""}
                        onChange={e => setAliasValue("aliasName", e.target.value)}
                        className="form-control" />
                </div>
              
                {/* Retailer */}
                <div className="form-group">
                    <label>Retailer *</label>
                    <Select
                        value={retailerSelected}
                        onChange={v => setAliasValue("retailerId", v.id)}
                        name="retailer-alias"
                        isClearable={true}
                        placeholder="Retailers..."
                        getOptionLabel={o => o.name}
                        getOptionValue={o => o.id}
                        options={retailers} />
                </div>

                {/* Add property */}
                <button 
                    onClick={e => setAliasTradeItemProperty({})}
                    className="btn btn-link p-0 mb-4">+ Add trade item property</button>

                {/* PRoperty create */}
                {tradeItemProperty !== null && <div className="form-group">
                    <SelectString
                        value={groupSelected}
                        onChange={v => {                            
                            setAliasTradeItemPropertyValue("tradeItemPropertyGroup", v)
                            getAliasProperties(v)
                        }}
                        name="trade-item-property-group"
                        placeholder="Trade item property group"
                        options={groups} />
                        
                    <Select
                        className="mt-2"
                        loading={propertiesFetching}
                        value={aliasPropertySelected}
                        onChange={v => setAliasTradeItemPropertyValue("tradeItemPropertyCode", v.code)}
                        name="retailer-alias"
                        isClearable={true}
                        placeholder="Trade item property"
                        getOptionLabel={o => o.code}
                        getOptionValue={o => o.id}
                        options={properties} />

                    <button 
                        onClick={e => addNewAliasProperty(tradeItemProperty)}
                        className="btn btn-primary mt-2">Add</button>    
                        
                </div>}
                

                {/* Properties */}
                <h5>Trade item properties</h5>
                {map(get(alias, "tradeItemProperties", []), (property, k) => (
                    <div key={`property-${k}`}>
                        {get(property, "tradeItemPropertyCode")} ({get(property, "tradeItemPropertyGroup")})
                        <button 
                            onClick={e => removeAliasProperty(k)}
                            className="btn btn-link text-danger p-0 ml-3">Delete</button>
                    </div>
                ))}

            </Card>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        alias: selectors.getAlias(state),
        retailers: selectors.getRetailersList(state),
        groups: selectors.getAliasGroups(state),
        properties: selectors.getAliasProperties(state),
        propertiesFetching: selectors.areAliasPropertiesFetching(state),
        retailerSelected: selectors.getRetailerSelected(state),
        tradeItemProperty: selectors.getTradeItemProperty(state),
        groupSelected: selectors.getAliasGroupSelected(state),
        aliasPropertySelected: selectors.getAliasPropertySelected(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(AliasEdit))

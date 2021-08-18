import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import get from "lodash/get"
import find from "lodash/find"
import Select from "react-select"
import * as actions from "./actions"
import * as selectors from "./selectors"
import PageWrapper from "../common/components/layout/PageWrapper"
import ActionsBar from "../common/components/layout/ActionsBar"
import Card from "../common/components/layout/Card"
import TransportDynamicForm from "./form/TransportDynamicForm"


class TransportConfigurationEdit extends React.Component {

    componentDidMount() {

        const { match } = this.props

        const { getTransportConfiguration } = this.props

        if(match.params.id) getTransportConfiguration(match.params.id)
    }

    componentDidUpdate(prevProps) {
        if(this.props.match.params.id !== prevProps.match.params.id) {
            this.props.resetTransportConfiguration()
            if(this.props.match.params.id) this.props.getTransportConfiguration(this.props.match.params.id)
        }
    }

    componentWillUnmount() {
        this.props.resetTransportConfiguration()
    }

  delete = () => {
    if (!window.confirm("Are you sure to delete this configuration?")) return
    const { match, history, deleteTransportConfiguration } = this.props
    const id = match.params.id
    deleteTransportConfiguration(id)
    history.push("/transport-configurations")
  }

    render() {

        const { match, history, transportConfiguration, transportConfigurationTypes } = this.props

        const { createTransportConfiguration, updateTransportConfiguration, setTransportConfigurationEditValue } = this.props

        const id = get(match, "params.id", null)

        return (
            <div className="container-fluid">
                {/* Actions */}
                <ActionsBar>
                    <div className="col-4">
                        <h2 className="h4 pt-1 m-0 font-weight-light">{id ? get(transportConfiguration, "name") : "New transformations set"}</h2>
                    </div>
                    <div className="col-8 text-right">
                        <Link to={`/transport-configurations`} className="btn btn-light mr-2">
                        Go back to list
                        </Link>
                        {id && (
                        <Link to={`/transport-configuration`} className="btn btn-success mr-2">
                            + Create new transport configuration
                        </Link>
                        )}
                        {id && (
                        <button className="btn btn-danger mr-2" onClick={this.delete}>
                            Delete
                        </button>
                        )}
                        {!id && (
                        <button 
                            onClick={e => createTransportConfiguration(transportConfiguration).then(_id => history.push(`/transport-configuration/${_id}`))}
                            className="btn btn-primary">
                            Create
                        </button>
                        )}
                        {id && (
                        <button 
                            onClick={e => updateTransportConfiguration(id, transportConfiguration)}
                            className="btn btn-primary">
                            Save
                        </button>
                        )}
                    </div>
                </ActionsBar>
    
                {/* Content */}
                <PageWrapper>
                    <div className="row">
                        <div className="col-3">
                            <Card>
                                
                                {/* Name */}
                                <div className="form-group">
                                    <label className="control-label">Name *</label>
                                    <input 
                                        onChange={e => setTransportConfigurationEditValue("name", e.target.value)}
                                        value={get(transportConfiguration, "name") || ""}
                                        className="form-control" />
                                </div>
                                
                                {/* Type */}
                                <div className="form-group">
                                    <label className="control-label">Type *</label>
                                    <Select
                                        value={find(transportConfigurationTypes, option => option.value === transportConfiguration.discriminator)}
                                        options={transportConfigurationTypes} 
                                        onChange={option => setTransportConfigurationEditValue("discriminator", option.value)}
                                        />
                                </div>

                            </Card>
                        </div>
                        <div className="col-9">
                            <Card>
                                <TransportDynamicForm 
                                    transportConfiguration={transportConfiguration}
                                    onChange={setTransportConfigurationEditValue}
                                    />
                            </Card>
                        </div>
                    </div>
                </PageWrapper>
            </div>
        )

    }

}

const mapStateToProps = (state) => {
    return {
        transportConfiguration: selectors.getTransportConfigurationEdit(state),
        transportConfigurationTypes: selectors.getTransportConfigurationTypes(),
    }
}

export default withRouter(connect(mapStateToProps, actions)(TransportConfigurationEdit))
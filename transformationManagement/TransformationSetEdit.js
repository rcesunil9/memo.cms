import React from "react"
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import get from "lodash/get"
import * as selectors from "./selectors/edit"
import * as actions from "./actions/edit"
import PageWrapper from "../common/components/layout/PageWrapper"
import ActionsBar from "../common/components/layout/ActionsBar"
import Card from "../common/components/layout/Card"
import TransformationSetForm from "./form/TransformationSetForm"


class TransformationSetEdit extends React.Component {

  componentDidMount() {
    this.init()
  }

  componentWillUpdate(nextProps) {
    if(this.props.match.params.id !== nextProps.match.params.id) {
        this.reset()
        if(nextProps.match.params.id) this.props.getTransformationSet(nextProps.match.params.id)
    }
  }

  componentWillUnmount() {
   const {
        resetTaxonomies,
        resetTradeItemCategories,
        resetPropertiesGroups,
        resetActionsDefinitions,
        resetBusinessRulesSets,
        resetTradeItemProperties,
        resetEditAction,
    } = this.props

    resetTaxonomies()
    resetTradeItemCategories()
    resetPropertiesGroups()
    resetActionsDefinitions()
    resetBusinessRulesSets()
    resetTradeItemProperties()
    resetEditAction()
  }

  reset() {
      const { resetTransformationSet } = this.props
      resetTransformationSet()
  }

  init() {
    const { match } = this.props
    const { getTransformationSet } = this.props
    const id = match.params.id
    if(id) getTransformationSet(id)
    else this.reset()
    this.loadDependencies()
  }

  delete = () => {
    if (!window.confirm("Are you sure to delete this transformation?")) return
    const { match, history, deleteTransformationSet } = this.props
    const id = match.params.id
    deleteTransformationSet(id)
    history.push("/tools/export-transformations")
  }

  loadDependencies() {
    const { 
        getTaxonomies,
        getTradeItemCategories,
        getPropertiesGroups,
        getActionsDefinitions,        
    } = this.props
    getTaxonomies()
    getTradeItemCategories()
    getPropertiesGroups()
    getActionsDefinitions()
  }

  render() {
    const { transformationSet, match, history } = this.props
    const { postTransformationSet, putTransformationSet } = this.props
    const id = match.params.id

    return (
        <div className="container-fluid">
            {/* Actions */}
            <ActionsBar>
                <div className="col-4">
                    <h2 className="h4 pt-1 m-0 font-weight-light">{id ? get(transformationSet, "name") : "New transformations set"}</h2>
                </div>
                <div className="col-8 text-right">
                    <Link to={`/tools/export-transformations`} className="btn btn-light mr-2">
                    Go back to list
                    </Link>
                    {id && (
                    <Link to={`/tools/export-transformation`} className="btn btn-success mr-2">
                        + Create new transformations set
                    </Link>
                    )}
                    {id && (
                    <button className="btn btn-danger mr-2" onClick={this.delete}>
                        Delete
                    </button>
                    )}
                    {!id && (
                    <button 
                        onClick={e => postTransformationSet().then(_id => history.push(`/tools/export-transformation/${_id}`))}
                        className="btn btn-primary">
                        Create
                    </button>
                    )}
                    {id && (
                    <button 
                        onClick={e => putTransformationSet()}
                        className="btn btn-primary">
                        Save
                    </button>
                    )}
                </div>
            </ActionsBar>

            {/* Content */}
            <PageWrapper>
                <Card>
                    <TransformationSetForm />
                </Card>
            </PageWrapper>
        </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        transformationSet: selectors.getTransformationSet(state),
    }
}

export default withRouter(connect(mapStateToProps, actions)(TransformationSetEdit))

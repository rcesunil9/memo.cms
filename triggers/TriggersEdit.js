import React from "react"
import { connect } from "react-redux"
import { Link, withRouter } from "react-router-dom"
import ActionsBar from "../common/components/layout/ActionsBar"
import Card from "../common/components/layout/Card"
import PageWrapper from "../common/components/layout/PageWrapper"
import get from 'lodash/get'
import * as actions from "./actions"
import * as selectors from "./selectors"
import TriggerForm from "./TriggerForm"
import { keyed } from "./utils"

class TriggersEdit extends React.Component {
  componentDidMount() {
    const { match, loadTrigger, loadNewTrigger, loadActions, loadExportTradeItemWithImagesDependencies } = this.props
    const id = match.params.id
    if (id) {
      loadTrigger(id)
    } else {
      loadNewTrigger()
    }
    loadExportTradeItemWithImagesDependencies()
    loadActions()
  }

  componentWillUnmount() {
    const { resetTrigger, resetTriggersDependencies, setTriggerInputParameter } = this.props
    resetTriggersDependencies()
    resetTrigger()
    setTriggerInputParameter()
  }

  save = async () => {
    const { match, history, trigger, createTrigger, updateTrigger } = this.props
    const id = match.params.id

    if (id) {
      updateTrigger(trigger)
    } else {
      const newId = await createTrigger(trigger)
      history.push("/trigger/" + newId)
    }
  }

  delete = async () => {
    const { match, history, deleteTrigger } = this.props
    const id = match.params.id

    if (!window.confirm("Are you sure to delete this trigger?")) return
    await deleteTrigger(id)
    history.push("/triggers")
  }

  render() {
    const { trigger, actions, editTrigger, exportPreComputedTradeItemActions, triggerInputParams, setTriggerInputParameter, launchTrigger } = this.props

    if (!trigger) return null
    const id = trigger.id

    return (
      <div className="container-fluid">
        {/* Actions */}
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">{id ? trigger.name : "New trigger"}</h2>
          </div>
          <div className="col-8 text-right">
            <Link to={`/triggers`} className="btn btn-light mr-2">
              Go back to list
            </Link>
            {id && (
              <Link to={`/trigger`} className="btn btn-success mr-2">
                + Create new trigger
              </Link>
            )}
            {id && (
              <button className="btn btn-danger mr-2" onClick={this.delete}>
                Delete trigger
              </button>
            )}
            {(id && get(trigger,'discriminator') === 'PeriodicTriggerViewModel') &&
            <button
              onClick={e => {
                e.preventDefault()
                window.confirm(`Are you sure?`) && launchTrigger(id)
              }}
              className="btn btn-secondary">
              <i className="icon-energy" /> Launch trigger</button>}
          </div>
        </ActionsBar>

        {/* Content */}
        <PageWrapper>
          <Card>
            <TriggerForm
              trigger={trigger}
              actions={actions}
              exportActions={exportPreComputedTradeItemActions}
              triggerInputParams={triggerInputParams}
              setTriggerInputParameter={setTriggerInputParameter}
              onChange={editTrigger}
              onSave={this.save}
            />
          </Card>
        </PageWrapper>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    trigger: selectors.getTriggerObject(state),
    actions: selectors.getOrderedActionsList(state),
    exportPreComputedTradeItemActions: selectors.getExportPreComputedTradeItemActions(state),
    triggerInputParams: selectors.triggerInputParams(state)
  }
}

export default withRouter(
  keyed(
    connect(
      mapStateToProps,
      actions
    )(TriggersEdit)
  )
)

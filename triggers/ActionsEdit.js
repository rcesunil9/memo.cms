import React from "react"
import { connect } from "react-redux"
import { Link, withRouter } from "react-router-dom"
import ActionsBar from "../common/components/layout/ActionsBar"
import Card from "../common/components/layout/Card"
import PageWrapper from "../common/components/layout/PageWrapper"
import ActionForm from "./ActionForm"
import * as actions from "./actions"
import * as selectors from "./selectors"
import { keyed } from "./utils"

class ActionsEdit extends React.Component {
  componentDidMount() {
    this.init()
  }

  async init() {
    const { match, loadAction, loadNewAction } = this.props
    const id = match.params.id
    if (id) {
      await loadAction(id)
    } else {
      loadNewAction()
    }
  }

  componentWillUnmount() {
    const { resetAction } = this.props
    resetAction()
  }

  save = async () => {
    const { match, history, action, createAction, updateAction } = this.props
    const id = match.params.id
    
    if (!id) {
      createAction(action).then(id => {
        if(id) history.push(`/action/${id}`)
      })
    } else {
      updateAction(action)
    }
  }

  delete = async () => {
    const { match, history, deleteAction } = this.props
    const id = match.params.id

    if (!window.confirm("Are you sure to delete this action?")) return
    await deleteAction(id)
    history.push("/actions")
  }

  render() {
    const { action, editAction, businessRules, languages, retailers, users, tradeItemCategories } = this.props

    if (!action) return null
    const id = action.id

    return (
      <div className="container-fluid">
        {/* Actions */}
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">{id ? action.name : "New action"}</h2>
          </div>
          <div className="col-8 text-right">
            <Link to={`/actions`} className="btn btn-light mr-2">
              Go back to list
            </Link>
            {id && (
              <Link to={`/action`} className="btn btn-success mr-2">
                + Create new action
              </Link>
            )}
            {id && (
              <button className="btn btn-danger" onClick={this.delete}>
                Delete action
              </button>
            )}
          </div>
        </ActionsBar>

        {/* Content */}
        <PageWrapper>
          <div className="row">
            <div className="col-6">
              <Card>
                <ActionForm
                  action={action}
                  onChange={editAction}
                  onSave={this.save}
                  {...{ businessRules, languages, retailers, users, tradeItemCategories }}
                />
              </Card>
            </div>
          </div>
        </PageWrapper>
      </div>
    )
  }
}

const props = state => ({
  action: selectors.getActionObject(state),
  businessRules: selectors.getBusinessRulesList(state),
  languages: selectors.getLanguagesList(state),
  retailers: selectors.getRetailersList(state),
  users: selectors.getUsersList(state),
  tradeItemCategories: selectors.getTradeItemCategoriesList(state)
})

export default withRouter(
  keyed(
    connect(
      props,
      actions
    )(ActionsEdit)
  )
)

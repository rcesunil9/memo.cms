import get from "lodash/get"
import find from "lodash/find"
import React from "react"
import { connect } from "react-redux"
import { Link, withRouter } from "react-router-dom"
import ActionsBar from "../common/components/layout/ActionsBar"
import Card from "../common/components/layout/Card"
import Modal from "../common/components/layout/Modal"
import PageWrapper from "../common/components/layout/PageWrapper"
import GroupForm from "./GroupForm"
import RetailerForm from "./RetailerForm"
import * as actions from "./actions"
import * as selectors from "./selectors"
import { groupPlaceholder, retailerPlaceholder } from "./utils"
import EnrichmentConfigurations from "./EnrichmentConfigurations";

class RetailerEdit extends React.Component {

  componentWillUnmount() {
    this.props.resetRetailer()
    this.props.resetExportActions()
  }

  componentDidMount() {
    this.props.getManufacturers()
    this.props.getGroups()
    this.props.getExportActions()

    const id = this.props.match.params.id
    if (id) {
      this.props.getRetailer(id)
    } else {
      this.props.editRetailer(retailerPlaceholder())
    }
  }

  async save() {
    const { createRetailer, updateRetailer, history, match, retailer } = this.props
    const exists = match.params.id
    if (exists) {
      updateRetailer(retailer)
      return
    }
    await createRetailer(retailer)
    history.push("/retailer/" + this.props.retailer.id)
  }

  async delete() {
    const { retailer, deleteRetailer, history } = this.props
    if (!window.confirm(`Are you sure to delete ${get(retailer, "name")}?`)) return
    await deleteRetailer(retailer.id)
    history.push("/retailers")
  }

  async saveGroup() {
    const { saveGroup, resetGroup, getGroups } = this.props
    const s = saveGroup()
    resetGroup()
    await s
    getGroups()
  }

  render() {
    const {
      retailer,
      match,
      history,
      manufacturers,
      groups,
      group,
      exportActions,
      // functions
      editRetailer,
      editGroup,
      resetGroup
    } = this.props

    const id = match.params.id

    const openNewGroup = () => editGroup(groupPlaceholder())

    return (
      <div className="container-fluid">
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">{get(retailer, "name")}</h2>
          </div>
          <div className="col-8 text-right">
            <Link to={`/retailers`} className="btn btn-light mr-2">
              Go back to list
            </Link>
            {id && (
              <Link to={`/retailer`} className="btn btn-success mr-2">
                + Create new retailer
              </Link>
            )}
            {id && (
              <button className="btn btn-danger" onClick={() => this.delete()}>
                Delete retailer
              </button>
            )}
          </div>
        </ActionsBar>

        <PageWrapper>
          <div className="row">
            <div className="col-6">
              {retailer && (
                <Card>
                  <RetailerForm
                    exportActions={exportActions}
                    retailer={retailer}
                    groups={groups}
                    manufacturers={manufacturers}
                    onChange={editRetailer}
                    onCancel={() => history.push("/retailers")}
                    onSave={() => this.save()}
                    onDelete={null}
                    onNewGroupClick={openNewGroup}
                    onEditGroupClick={() => editGroup(find(groups, ["id", retailer.groupId]))}
                  />
                </Card>
              )}
            </div>

            {/* enrichment configurations */}
            <div className="col-6">
              {retailer && (
                <Card>
                  <EnrichmentConfigurations retailerId={get(retailer, "id")} />
                </Card>
              )}
            </div>
          </div>
          {group && (
            <Modal title={group.id ? "Edit " + group.name : "New group"} onClose={resetGroup}>
              <GroupForm
                group={group}
                onChange={editGroup}
                onCancel={resetGroup}
                onSave={() => this.saveGroup()}
              />
            </Modal>
          )}
        </PageWrapper>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    manufacturers: selectors.getManufacturers(state),
    groups: selectors.getGroups(state),
    retailer: selectors.getRetailerToEdit(state),
    group: selectors.getGroupToEdit(state),
    exportActions: selectors.getExportActions(state),
  }
}

// This wrapper makes the form unmount when navigation state changes.
// Otherwise we would have to dispatch the reset action also when navigating
// from "Edit retailer" to "Create retailer".
const keyed = Component =>
  class Keyed extends React.Component {
    render() {
      return <Component key={this.props.match.params.id || "new"} {...this.props} />
    }
  }

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(keyed(RetailerEdit))
)

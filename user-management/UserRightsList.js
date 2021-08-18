import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Card from "../common/components/layout/Card"
import PageWrapper from "../common/components/layout/PageWrapper"
import UserRightEdit from "./UserRightEdit"
import UserRightsTable from "./UserRightsTable"
import * as actions from "./actions"
import * as selectors from "./selectors"
import { rightPlaceholder } from "./utils"

class UserRightsList extends React.Component {
  componentDidMount() {
    const { loadRights } = this.props
    loadRights()
  }

  componentWillUnmount() {
    const { resetRight } = this.props
    resetRight()
  }

  save = async () => {
    const { right, updateRight, createRight, loadRights } = this.props
    if (right.id) {
      await updateRight(right)
    } else {
      await createRight(right)
    }
    loadRights()
  }

  delete = async right => {
    const { deleteRight, loadRights } = this.props
    if (!window.confirm(`Are you sure to delete ${right.name}?`)) return
    await deleteRight(right.id)
    loadRights()
  }

  render() {
    const { loadRight, right, editRight, rights } = this.props
    const cancel = () => editRight(null)

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <button
              className="btn btn-success"
              type="button"
              onClick={() => editRight(rightPlaceholder())}
            >
              + Create new right
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <UserRightsTable
              list={rights}
              onEditClick={right => loadRight(right.id)}
              onDeleteClick={right => this.delete(right)}
            />
          </div>
          <div className="col-6">
            {right && (
              <Card title={right.id ? right.name : "New Right"}>
                <UserRightEdit
                  right={right}
                  rights={rights}
                  onChange={editRight}
                  onSave={this.save}
                  onCancel={cancel}
                />
              </Card>
            )}
          </div>
        </div>
      </PageWrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    rights: selectors.getRightsList(state),
    right: selectors.getRightObject(state)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(UserRightsList)
)

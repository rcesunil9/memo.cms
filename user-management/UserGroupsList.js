import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Card from "../common/components/layout/Card"
import PageWrapper from "../common/components/layout/PageWrapper"
import GroupEdit from "./GroupEdit"
import GroupsTable from "./GroupsTable"
import * as actions from "./actions"
import * as selectors from "./selectors"
import { groupPlaceholder } from "./utils"

class UserGroupsList extends React.Component {
  componentDidMount() {
    const { loadGroups, loadRights } = this.props
    loadGroups()
    loadRights()
  }

  componentWillUnmount() {
    const { resetGroup } = this.props
    resetGroup()
  }

  save = async () => {
    const { group, updateGroup, createGroup, loadGroups } = this.props
    if (group.id) {
      await updateGroup(group)
    } else {
      await createGroup(group)
    }
    loadGroups()
  }

  delete = async group => {
    const { deleteGroup, loadGroups } = this.props
    if (!window.confirm(`Are you sure to delete ${group.name}?`)) return
    await deleteGroup(group.id)
    loadGroups()
  }

  render() {
    const { groups, loadGroup, group, editGroup, rights } = this.props
    const cancel = () => editGroup(null)

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <button
              className="btn btn-success"
              type="button"
              onClick={() => editGroup(groupPlaceholder())}
            >
              + Create new group
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <GroupsTable
              list={groups}
              onEditClick={group => loadGroup(group.id)}
              onDeleteClick={group => this.delete(group)}
            />
          </div>
          <div className="col-6">
            {group && (
              <Card title={group.id ? group.name : "New Group"}>
                <GroupEdit
                  group={group}
                  rights={rights}
                  onChange={editGroup}
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
    groups: selectors.getGroupsList(state),
    group: selectors.getGroupObject(state),
    rights: selectors.getRightsList(state)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(UserGroupsList)
)

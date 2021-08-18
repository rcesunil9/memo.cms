import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import Modal from "../common/components/layout/Modal"
import PageWrapper from "../common/components/layout/PageWrapper"
import * as actions from "./actions"
import * as selectors from "./selectors"
import UserEdit from "./UserEdit"
import UsersTable from "./UsersTable"
import { userPlaceholder } from "./utils"

class UsersList extends React.Component {

  componentDidMount() {
    const { loadUsers, loadGroups, loadRetailers, loadManufacturers } = this.props
    loadUsers()
    loadGroups()
    loadRetailers()
    loadManufacturers()
  }

  componentWillUnmount() {
    const { resetUser } = this.props
    resetUser()
  }

  save = async () => {
    const { user, updateUser, createUser, loadUsers } = this.props
    if (user.id) {
      await updateUser(user)
    } else {
      await createUser(user)
    }
    loadUsers()
  }

  delete = async user => {
    const { deleteUser, loadUsers } = this.props
    if (!window.confirm(`Are you sure to delete ${user.firstname} ${user.lastname}?`)) return
    await deleteUser(user.id)
    loadUsers()
  }

  render() {
    const {
      users,
      loadUser,
      user,
      groups,
      editUser,
      password,
      manufacturers,
      retailers,
      showUserPassword,
      changePassword
    } = this.props
    const cancel = () => editUser(null)
    const nbsp = " "
    const fullname = () => `${user.firstname}${nbsp}${user.lastname}`

    return (
      <PageWrapper>
        <div className="row mb-3">
          <div className="col">
            <button
              className="btn btn-success"
              type="button"
              onClick={() => editUser(userPlaceholder())}
              >
              + Create new user
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <UsersTable
              list={users}
              onEditClick={user => loadUser(user.id)}
              onDeleteClick={user => this.delete(user)}
            />
          </div>
          <div className="col-6">
            {user && (
              <Modal title={user.id ? `${fullname()}` : "New user"} onClose={cancel}>
                <UserEdit
                  user={user}
                  groups={groups}
                  manufacturers={manufacturers}
                  retailers={retailers}
                  onChange={editUser}
                  onSave={this.save}
                  onCancel={cancel}
                  onMakePasswordClick={() => changePassword(user.id)}
                />
              </Modal>
            )}
          </div>
        </div>
        {password && (
          <Modal title={`Password for ${fullname()}`} onClose={() => showUserPassword(null)}>
            <p className="lead">{password}</p>
            <div className="form-group text-right">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => showUserPassword(null)}
              >
                OK
              </button>
            </div>
          </Modal>
        )}
      </PageWrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    users: selectors.getUsersList(state),
    user: selectors.getUserObject(state),
    groups: selectors.getGroupsList(state),
    password: selectors.getPassword(state),
    manufacturers: selectors.getManufacturers(state),
    retailers: selectors.getRetailers(state),
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(UsersList)
)

import React from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import * as actions from './actions'
import * as selectors from "./selectors"

const mapStateToProps = (state) => {
    return {
      user: selectors.getAuthenticatedUser(state)
    }
}

export default function withAuth(WrappedComponent) {
  return withRouter(connect(mapStateToProps, actions)(
    class extends React.Component {

      componentWillMount() {
        if(this.isAccessRefused()) this.redirectToLoginPage()
        const user = localStorage.getItem('user')
        if(user) this.props.setAuthenticatedUser(JSON.parse(user))
      }

      componentWillUpdate() {
        if(this.isAccessRefused()) this.redirectToLoginPage()
      }

      isAccessRefused() { return !this.isAccessGranted() }

      isAccessGranted() {
        const token = localStorage.getItem('token')
        return token && token !== '' && token !== 'null' && token !== null && token !== "undefined"
      }

      redirectToLoginPage() {
        this.props.history.push('/login')
      }

      render() {
        return this.isAccessGranted() && <WrappedComponent {...this.props} />
      }
  }))
}

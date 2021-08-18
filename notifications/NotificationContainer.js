import React from "react"
import { connect } from "react-redux"
import * as selectors from "./selectors"
import * as actions from "./actions"
import Notification from "./Notification"
import withAPICallsNotifications from "./withAPICallsNotifications"

const style = {
  position: "fixed",
  bottom: "1em",
  left: "1em",
  minWidth: "20rem",
  maxWidth: "40rem",
  zIndex: 6000 // hmmmm...
}

const NotificationContainer = props => {
  const { notifications, removeNotification } = props
  return (
    <div style={style}>
      {notifications.map((n, i) => (
        <Notification key={i} notification={n} onDismiss={() => removeNotification(n)} />
      ))}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    notifications: selectors.getNotifications(state)
  }
}

export default connect(
  mapStateToProps,
  actions
)(withAPICallsNotifications(NotificationContainer))

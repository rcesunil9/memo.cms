import React from "react"
import { Levels } from "./actions"

const classes = {
  [Levels.NOTIFY_DEFAULT]: "alert-secondary",
  [Levels.NOTIFY_SUCCESS]: "alert-success",
  [Levels.NOTIFY_INFO]: "alert-info",
  [Levels.NOTIFY_WARNING]: "alert-warning",
  [Levels.NOTIFY_ERROR]: "alert-danger"
}

const getClassName = level => classes[level] || "alert-light"

const Notification = props => {
  const { level, message, title, dismissible } = props.notification
  const onDismiss = props.onDismiss

  const className = "alert bg-white border-bottom-0 border-right-0 border-left-0 " + getClassName(level)
  const style = {boxShadow: "0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)"}
  return (
    <div className={className} role="alert" style={style}>
      {dismissible && (
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={onDismiss}>
          <span aria-hidden="true">&times;</span>
        </button>
      )}
      {title && <h4 className="alert-heading">{title}</h4>}
      {message && <p className="mb-0">{message}</p>}
    </div>
  )
}

export default Notification

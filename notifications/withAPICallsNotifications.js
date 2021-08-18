import axios from "axios"
import get from "lodash/get"
import React from "react"
import { Levels } from "./actions"

const messages = {
  2: {
    put: "Updated!",
    post: "Created!",
    delete: "Deleted."
  },
  4: {
    put: "Update failed.",
    post: "Creation failed",
    delete: "Delete failed"
  },
  5: {
    put: "Unexpected error on update, please contact the administrator.",
    post: "Unexpected error on creation, please contact the administrator.",
    delete: "Unexpected error on delete, please contact the administrator."
  }
}

// Returns a notification object for the given response.
// Returns null is there is no appropriate notification.
const makeNotification = res => {
  const n = Math.floor(get(res, "status", 500) / 100)
  const method = get(res, "config.method", "")
  let message = get(messages, `${n}.${method}`)
  if (!message) return null
  let level = Levels.NOTIFY_SUCCESS
  let timeout = 5000

  if ((n === 4 || n === 5) && get(res, "data.ErrorCode")) {
    // Assume either both fields present or both missing
    message = `${message} – ${res.data.ErrorCode}: ${res.data.ErrorMessage}`
    level = Levels.NOTIFY_ERROR
    timeout = -1
  }
  return {
    level,
    message,
    dismissible: timeout === -1, // To prevent misclicks
    timeout
  }
}

export default Component => {
  return class withAPICallsNotifications extends React.Component {
    notify(response) {
      const notification = makeNotification(response)
      if (!notification) return
      this.props.notify(notification)
    }

    componentDidMount() {
      this.interceptor = axios.interceptors.response.use(
        response => {
          this.notify(response)
          return response
        },
        error => {
          this.notify(error.response)
          return Promise.reject(error)
        }
      )
    }

    componentWillUnmount() {
      axios.interceptors.response.eject(this.interceptor)
    }

    render() {
      return <Component {...this.props} />
    }
  }
}

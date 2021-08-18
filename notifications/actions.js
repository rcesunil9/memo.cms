import * as types from "./types"

export const Levels = {
  NOTIFY_DEFAULT: 1,
  NOTIFY_SUCCESS: 2,
  NOTIFY_INFO: 3,
  NOTIFY_WARNING: 4,
  NOTIFY_ERROR: 5
}

const addNotification = notification => ({ type: types.NOTIFICATIONS_ADD, notification })

export const removeNotification = notification => ({
  type: types.NOTIFICATIONS_REMOVE,
  notification
})

// - level
// - message: string
// - title (optional): string
// - dismissible (optional, default “false”): Boolean
// - timeout (optional, default “-1”): numeric (ms)
export const notify = notification => dispatch => {
  const { timeout = -1 } = notification
  dispatch(addNotification(notification))
  if (timeout > 0) {
    setTimeout(() => dispatch(removeNotification(notification)), timeout)
  }
}

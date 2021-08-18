import { logout as doAuthLogout } from "../auth/actions"
import * as types from "./types"

// logout
//
export const logout = () => doAuthLogout()

// Toggle
//
export const toggleSidebar = () => ({ type: types.APP_SIDEBAR_TOGGLE })

// Toggle submenu
//
export const toggleSubmenu = index => ({ type: types.APP_SUBMENU_TOGGLE, index })

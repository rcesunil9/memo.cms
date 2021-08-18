import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import CdmShortLogo from "../common/components/logo/CdmShortLogo";
import QuickSearch from "../quickSearch";
import * as actions from "./actions";
import Menu from "./Menu";
import * as selectors from "./selectors";
import Toggle from "./Toggle";
import { CMS_V2_DOMAIN } from "app/environment";

const Nav = ({
  logout,
  match,
  menu,
  sidebarOpen,
  toggleSubmenu,
  toggleSidebar
}) => (
  <nav
    className="navbar navbar-expand-lg navbar-dark fixed-top pr-0 pt-0 pb-0"
    id="mainNav"
    style={{ height: "40px" }}
  >
    <Link className="navbar-brand" to="/">
      <CdmShortLogo size={14} /> &nbsp;Cedemo CMS
    </Link>
    <button
      className="navbar-toggler navbar-toggler-right"
      type="button"
      data-toggle="collapse"
      data-target="#navbarResponsive"
      aria-controls="navbarResponsive"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse">
      <ul className="navbar-nav navbar-sidenav pt-3">
        <Menu
          {...{ menu, match, sidebarOpen }}
          onToggle={index =>
            sidebarOpen ? toggleSubmenu(index) : toggleSidebar()
          }
        />
        {/* <li className="nav-item  text-center" id="sidenavToggler" style={toggleContainerStyle}>
        </li> */}
      </ul>

      <ul className="navbar-nav sidenav-toggler">
        <li className="nav-item  text-center pt-2">
          <button
            style={{ borderRadius: "4rem" }}
            className="btn btn-sm btn-secondary d-inline-block mx-1"
            onClick={logout}
          >
            <i className="icon-logout" />
          </button>
          <Toggle open={sidebarOpen} toggle={toggleSidebar} />
        </li>
      </ul>

      <ul className="navbar-nav ml-auto pl-2" style={{ paddingRight: "5px" }}>
        <li className="nav-item">
          <button
            style={{ borderRadius: "4rem" }}
            className="btn btn-sm btn-secondary d-inline-block mx-1"
            onClick={() =>
              (window.location.href = `${CMS_V2_DOMAIN}/users-messages`)
            }
          >
            <i className="icon-envelope" style={{ fontSize: "1.6rem" }} />
          </button>
        </li>
        <li className="nav-item">
          <QuickSearch />
        </li>
      </ul>
    </div>
  </nav>
);

const mapStateToProps = state => {
  return {
    history: state.history,
    menu: selectors.getMenu(state),
    user: state.auth.user,
    sidebarOpen: selectors.isNavigationOpen(state)
  };
};

export default withRouter(connect(mapStateToProps, actions)(Nav));

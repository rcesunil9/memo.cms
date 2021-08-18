import React, { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const SmallStyledLink = styled(Link)`
  color: #d0d5ed;
  font-weight: bold;
  display: block;
  padding-top: .3rem !important;
  padding-bottom: .3rem !important;
  &:hover {
    color: #fff;
  }

`


const Menu = ({ menu, onToggle, sidebarOpen, match }) => {
  const Entry = sidebarOpen ? Item : ItemSmall
  const Sub = sidebarOpen ? Submenu : SubmenuSmall

  const isActive = item => match && match.url === item.to && item.collapsed

  return menu.map((item, index) => {
    const hasChildren = item.children && item.children.length > 0
    if (!hasChildren) {
      return <Entry key={index} item={item} active={isActive(item)} />
    }
    return <Sub key={index} match={match} item={item} onToggle={() => onToggle(index)} />
  })
}

const Item = ({ item, active }) => {
  return (
    <li className={`nav-item ${active ? "active" : ""}`} title={`${item.title}`}>
      <Link className={`nav-link ${item.collapsed ? "collapsed" : ""}`} to={`${item.to}`}>
        {item.icon && <i className={item.icon + " mr-2"} />}
        <span className="nav-link-text font-weight-bold">{`${item.title}`}</span>
      </Link>
    </li>
  )
}

const ItemSmall = ({ item, active, style = {} }) => {
  return (
    <li className={`nav-item ${active ? "active" : ""}`} title={`${item.title}`}>
      <Link
        className={`nav-link ${item.collapsed ? "collapsed" : ""}`}
        to={`${item.to}`}
        style={style}
      >
        {item.icon && <i className={item.icon + " ml-2"} />}
        <span className="nav-link-text" style={{backgroundColor: 'yellow', height: '50px'}}> {`${item.title}`}</span>
      </Link>
    </li>
  )
}

const Submenu = ({ item, onToggle, match }) => {
  const subActive = menuItem => match && match.url === menuItem.to
  const active = item.collapsed && item.children.some(subActive)
  return (
    <li className={`nav-item ${active ? "active" : ""}`} title={`${item.title}`}>
      <span
        className={`nav-link nav-link-collapse ${item.collapsed ? "collapsed" : ""}`}
        onClick={onToggle}
      >
        {item.icon && <i className={item.icon + " mr-2"} />}
        <span className="nav-link-text font-weight-bold">{`${item.title}`}</span>
      </span>
      <ul className={`sidenav-second-level ${item.collapsed ? "collapse" : ""}`}>
        {item.children.map((item, subindex) => {
          return <Item key={`${item.title}-${subindex}`} item={item} active={subActive(item)} />
        })}
      </ul>
    </li>
  )
}

const hoverableMenuStyle = {
  position: 'absolute',
  display: 'inline-block',
  left: '55px',
  minWidth: '200px',
  padding: '10px 8px',
  textAlign: 'center',
  borderTopRightRadius: '3px',
  borderBottomRightRadius: '3px',
  boxShadow: "0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)",
}

const SubmenuSmall = ({ item, match, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false)
  // const subActive = menuItem => match && match.url === menuItem.to
  // const active = item.children.some(subActive)

  return (
    <li
      onMouseEnter={e => setIsHovered(true)}
      onMouseLeave={e => setIsHovered(false)}
      className={`nav-item`} 
      title={`${item.title}`}
      >
        {isHovered && <ul 
          className="list-unstyled m-0 bg-secondary" 
          style={hoverableMenuStyle}
          >
          {item.children.map((item, subindex) => {
            return (
              <li 
                key={`${item.title}-${subindex}`} 
                title={`${item.title}`}
                >
                <SmallStyledLink
                  to={`${item.to}`}
                  >
                  {item.icon && <i className={item.icon + " ml-2"} />}
                  <span style={{ padding: '15px 0 !important' }}> {`${item.title}`}</span>
                </SmallStyledLink>
              </li>
            )
          })}
        </ul>}

        <span
          style={{ padding: "1em" }}
          className={`nav-link nav-link-collapse ${item.collapsed ? "collapsed" : ""}`}
        >
          {item.icon && <i className={item.icon + " ml-2"} />}
          <span className="nav-link-text">{`${item.title}`}</span>
        </span>
    </li>
  )}

export default Menu

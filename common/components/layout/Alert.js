import React from "react"

const Alert = ({title, type, children}) => (
  <div className={`alert alert-${type}`} role="alert">
    {title && <h4 className="alert-heading">{title}</h4>}
    {children}
  </div>
)

export default Alert

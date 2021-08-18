import React from "react"

const Card  = ({children, className, sm, title, ...otherProps}) => (
  <div className={`card ${className || ""}`} {...otherProps}>
    <div className={`card-body ${sm ? "p-3" : ""}`}>
      {title && <h4 className="mb-4">{title}</h4>}
      {children}
    </div>
  </div>
)

export default Card

import React from "react"

const PageWrapper = ({title, className, children}) => (
  <div className={`container-fluid p-5 ${className || ""}`}>{children}</div>
)

export default PageWrapper;

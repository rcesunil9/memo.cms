import React from "react"

const Datatable = ({children, className}) => (
  <table className={`table table table-hover table-striped datatable ${className ? className : ""}`}>
    {children}
  </table>
)

export default Datatable

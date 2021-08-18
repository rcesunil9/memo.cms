import React from "react"

export const makeOption = object => ({ value: object.id, label: object.name })
export const Row = props => <div className="row">{props.children}</div>
export const Col = props => <div className={"col " + props.className}>{props.children}</div>

export const groupPlaceholder = () => ({ id: "", name: "" })
export const retailerPlaceholder = () => ({
  id: "",
  name: "",
  code: "",
  groupId: "",
  authorizedManufacturerIds: []
})
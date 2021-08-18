import React from "react"
import map from "lodash/map"


const GroupsMenu = ({groups, groupSelected, setGroupSelected}) => (
  <div className="btn-group d-flex justify-content-center" role="group" aria-label="Basic example">
    
    {map(groups, (group, groupKey) => (
      <button
        key={`trade-item-group-${groupKey}`}
        onClick={e => setGroupSelected(group.name)}
        type="button"
        className={`btn btn-light ${group.name === groupSelected ? "active" : ""}`}>{group.name}</button>
    ))}

  </div>
)

export default GroupsMenu

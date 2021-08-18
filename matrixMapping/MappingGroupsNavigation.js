import React from "react"
import map from "lodash/map"
import get from "lodash/get"

const MappingGroupsNavigation = ({mappingGroups, groupSelected, onSelect, totalTabsMappedByGroupIndex}) => (
  <ul className="nav nav-tabs">
    {map(mappingGroups, mappingGroup => <li
      key={`mappingGroup-${mappingGroup.groupIndex}`}
      className="nav-item">
      <span
        className={`nav-link ${groupSelected.groupIndex === mappingGroup.groupIndex ? 'active' : ''}`}
        onClick={e => onSelect(mappingGroup.groupIndex)}>
        {mappingGroup.groupName}
        {get(totalTabsMappedByGroupIndex, `${mappingGroup.groupIndex}`) > 0 && <span>
          &nbsp; &nbsp;
          <span className={`badge badge-${mappingGroup.hasChanged ? "warning" : "info"}`}>{get(totalTabsMappedByGroupIndex, `${mappingGroup.groupIndex}`)}</span></span>}
      </span>
    </li>)}
  </ul>
)

export default MappingGroupsNavigation

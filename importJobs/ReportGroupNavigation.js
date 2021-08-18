import React from "react"
import map from "lodash/map"

const ReportGroupsNavigation = ({groups, groupSelected, onSelect, persistenceTotal, businessRuleTotal, mappingTotal }) => {

  const groupTotal = (group) => {
    switch (group) {
      case "Business Rules":
        return businessRuleTotal
      case "Persistence":
        return persistenceTotal
      case "Mapping":
        return mappingTotal
      default:
        return mappingTotal
    }
  }

  return <ul className="nav nav-tabs">
    {map(groups, (group, index) => <li
      key={`group-${index}`}
      className="nav-item">
      <span
        className={`nav-link ${group === groupSelected ? 'active' : ''}`}
        style={{cursor: "pointer"}}
        onClick={e => {
          onSelect(group)
        }
        }>
        {group}
        {groupTotal(group) > 0 && <span>
          &nbsp; &nbsp;
          <span className="badge badge-info">{groupTotal(group)}</span></span>}
      </span>
    </li>)}
  </ul>
}

export default ReportGroupsNavigation

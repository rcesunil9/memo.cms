import React from "react"
import map from "lodash/map"

const PropertiesTable = ({properties}) => map(properties, (property, index) => (
  <div key={`property-${property.code}-${index}`}>
    <strong>{property.code}</strong> (<button className="btn btn-link p-0">Edit</button>)
  </div>
))

export default PropertiesTable

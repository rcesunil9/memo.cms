import React from "react"
import map from "lodash/map"
import get from "lodash/get"

const PropertiesMosaic = ({tradeItemProperties, onSelect}) => map(tradeItemProperties, (p, k) => (
    <div
        key={`properties-mosaic-${k}`} 
        style={{cursor: "pointer"}}
        onClick={e => onSelect(p)}
        className="col-xs-6 col-sm-4 col-md-4 p-1">

        <div className="w-100 bg-light p-2 border">
            <p className="m-0">{get(p, "code")}</p>
            <small className="m-0 d-block">{get(p, "cardinality")} - {get(p, "discriminator")}</small>
            <small className="m-0 d-block">{get(p, "propertyGroups", []).join()}</small>
            <small className="m-0 d-block">{get(p, "propertyScopes", []).join()}</small>
        </div>

    </div>
))

export default PropertiesMosaic
import React from "react"
import map from "lodash/map"
import StringParam from "./StringParam"
import NumberParam from "./NumberParam"
import DateParam from "./DateParam"
import BooleanParam from "./BooleanParam"
import DictionaryParam from "./DictionaryParam"


const Param = ({
    type,
    name,
    isMandatory,
    value,
    // functions
    onChange
}) => {

    switch(type) {
        case "String":
        case "TradeItemId": // todo add custom trade item selector
            return <StringParam name={name} isMandatory={isMandatory} value={value} onChange={onChange} />
        case "Number":
            return <NumberParam name={name} isMandatory={isMandatory} value={value} onChange={onChange} />
        case "Date":
            return <DateParam name={name} isMandatory={isMandatory} value={value} onChange={onChange} />
        case "Boolean":
            return <BooleanParam name={name} isMandatory={isMandatory} value={value} onChange={onChange} />
        case "Dictionary":
            return <DictionaryParam name={name} isMandatory={isMandatory} value={value} onChange={onChange} />
        default:
            return <p>Parameter type not known: {type}</p>
    }
}

const ParamFactory = ({
    type,
    name,
    isMandatory,
    value,
    isMultiple,
    isArray,
    // functions
    onChange
}) => {
    const multiple = isMultiple || isArray

    console.log(value)

    if(multiple) {
        return (
            <div>
                <label>{name} {`${isMandatory ? "*" : ""}`}:</label>
                {map(value || [], (v, idx) => (
                    <div className="row" key={`param-v-${name}-${idx}`}>
                        <div className="col-10">
                            <Param
                                type={type}
                                name={name}
                                isMandatory={isMandatory}
                                value={v}
                                onChange={newValue => {
                                    return onChange([
                                        ...value.slice(0, idx),
                                        newValue,
                                        ...value.slice(idx + 1)
                                    ])
                                }}
                                />
                        </div>
                        <div className="col-2">
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={e => {
                                    onChange([
                                        ...value.slice(0, idx),
                                        ...value.slice(idx + 1)
                                    ])
                                }}
                                >Remove</button>
                        </div>
                    </div>
                ))}
                <button
                    className="btn btn-dark btn-sm mt-2"
                    onClick={e => onChange([...(value || []), null])}
                    >Add</button>
            </div>
        )
    } else {
        return <div>
            <label>{name} {`${isMandatory ? "*" : ""}`}:{name === 'DateDiscriminator' && ' (Current, Next, All)'}</label>
            <Param 
                    type={type}
                    name={name}
                    isMandatory={isMandatory}
                    value={value}
                    onChange={onChange} />
        </div>
    }
}

export default ParamFactory
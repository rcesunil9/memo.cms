import React from "react"
import map from "lodash/map"

const MappingEntry = React.memo(
    ({ source, target, onChange }) => {
        return (
            <div className="row">
                <div className="col-6">
                    <input
                        placeholder="Source"
                        className="form-control"
                        value={source || ""}
                        onChange={e =>
                            onChange({
                                source: e.currentTarget.value
                                    ? e.currentTarget.value
                                    : null
                            })
                        }
                    />
                </div>
                <div className="col-6">
                    <input
                        placeholder="Target"
                        className="form-control"
                        value={target || ""}
                        onChange={e =>
                            onChange({
                                target: e.currentTarget.value
                                    ? e.currentTarget.value
                                    : null
                            })
                        }
                    />
                </div>
            </div>
        );
    }
);

export const getNewMappping = () => {
    return {
        source: "",
        target: ""
    };
};

export const convert = (arr) => {
    var result = {};

    arr.forEach(element => {
        result[element.source] = element.target;
    });
    return result;
};

const DictionaryParam = ({
    value,
    // functions 
    onChange
}) => {

    const mappings = [];

    for(var obj in value)
        mappings.push({source: obj, target: value[obj]});

    return (<React.Fragment>
        <div className="form-group">
            
            {/* <button
                className="btn btn-secondary mt-2 mb-3"
                onClick={e => {
                    e.preventDefault();
                    mappings.push(getNewMappping())
                    onChange(convert(mappings));
                }}
            >
                + Add new mapping entry
            </button> */}

            {map(
                mappings,
                (mappingEntry, mappingEntryIdx) => (
                    <div
                        key={`mapping-entry-${mappingEntryIdx}`}
                        className="form-row align-items-center mb-3"
                    >
                        <div className="col-sm-10">
                            <MappingEntry
                                onChange={o => {
                                    onChange(convert([
                                        ...mappings.slice(0, mappingEntryIdx),
                                        { ...mappingEntry, ...o },
                                        ...mappings.slice(mappingEntryIdx + 1)
                                        ])
                                    );
                                }}
                                {...mappingEntry}
                            />
                        </div>
                        <div className="col-sm-2">
                            <button
                                onClick={e => {
                                    e.preventDefault();
                                    onChange(convert([
                                        ...mappings.slice(
                                            0,
                                            mappingEntryIdx
                                        ),
                                        ...mappings.slice(
                                            mappingEntryIdx + 1
                                        )
                                    ]));
                                }}
                                className="btn btn-sm btn-danger"
                            >
                                Remove
                </button>
                        </div>
                    </div>
                )
            )}
            <button
                className="btn btn-secondary mt-2 mb-3"
                onClick={e => {
                    e.preventDefault();
                    mappings.push(getNewMappping())
                    onChange(convert(mappings));
                }}
            >
                + Add new mapping entry
            </button>
        </div>
    </React.Fragment>)
}

export default DictionaryParam

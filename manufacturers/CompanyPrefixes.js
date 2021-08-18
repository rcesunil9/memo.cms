import React, { useMemo } from 'react'
import get from 'lodash/get'
import map from 'lodash/map'
import CreatableSelect from 'react-select/creatable';

const CompanyPrefixes = ({
    value,
    onUpdate
}) => {

    const parsedValues = useMemo(() => map(value, v => ({ label: v, value: v })), [value])

    return (
        <CreatableSelect
            isMulti
            onChange={values => onUpdate(map(values, v => get(v, 'value')))}
            value={parsedValues}
            options={parsedValues}
            />
    )

}

export default CompanyPrefixes

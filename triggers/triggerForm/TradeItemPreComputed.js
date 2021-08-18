import React from "react";
import get from "lodash/get";
import find from "lodash/find";
import dotProp from "dot-prop-immutable";
import { RequiredSelectInputWrap } from '../../common/components/form/RequiredSelecInputWrap'

const TradeItemPreComputed = ({ model, exportActions, onChange }) => {
  const change = (k, v) => onChange(dotProp.set(model, k, v));

  return (
    <React.Fragment>
      <div className="form-group">
        <label className="control-label">Export action*</label>
        <RequiredSelectInputWrap
          getOptionLabel={o => o.name}
          getOptionValue={o => o.id}
          options={exportActions}
          required
          value={find(
            exportActions,
            ea => ea.id === get(model, "exportPreComputedTradeItemActionId")
          )}
          onChange={val =>
            change("exportPreComputedTradeItemActionId", get(val, "id") || null)
          }
        />
      </div>
    </React.Fragment>
  );
};

export default TradeItemPreComputed;

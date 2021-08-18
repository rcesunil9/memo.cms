import React, { useState, useCallback } from "react";
import DatePicker from "app/common/components/date/DatePicker";
import { pollByManufacturerEntityId } from "app/common/services/importResource";

function ResourcePolling({ manufacturerEntityId }) {
  const [startPollingTimestamp, setStartPollingTimesta] = useState(null);
  const [endPollingTimestamp, setEndPollingTimesta] = useState(null);

  const doPolling = useCallback(() => {
    pollByManufacturerEntityId(
      manufacturerEntityId,
      startPollingTimestamp,
      endPollingTimestamp
    )
      .then(res => {
        alert("Success!");
      })
      .catch(err => alert("Error: " + err));
  }, [manufacturerEntityId, startPollingTimestamp, endPollingTimestamp]);

  return (
    <>
      <div className="row">
        {/* startPollingTimestamp */}
        <div className="col">
          <label className="control-label">Start polling timestamp</label>
          <DatePicker
            onChange={d =>
              setStartPollingTimesta(d ? d.format("YYYY-MM-DD hh:mm:ss") : null)
            }
            dateFormat="YYYY-MM-DD"
            timeFormat="hh:mm:ss"
            value={startPollingTimestamp}
          />
        </div>
        {/* endollingTimestamp */}
        <div className="col">
          <label className="control-label">End polling timestamp</label>
          <DatePicker
            onChange={d =>
              setEndPollingTimesta(d ? d.format("YYYY-MM-DD hh:mm:ss") : null)
            }
            dateFormat="YYYY-MM-DD"
            timeFormat="hh:mm:ss"
            value={endPollingTimestamp}
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col text-right">
          <button className="btn btn-primary" onClick={e => doPolling()}>
            Launch
          </button>
        </div>
      </div>
    </>
  );
}

export default ResourcePolling;

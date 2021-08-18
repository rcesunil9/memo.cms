import React, { useState, useCallback } from "react";
import Modal from "app/common/components/layout/Modal";
import DatePicker from "app/common/components/date/DatePicker";
import { importVideosResources } from "app/common/services/importResource";

function LegacyVideoImport() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const importVideos = useCallback(() => {
    importVideosResources(startDate, endDate)
      .then(res => {
        alert(`Success!`);
      })
      .catch(err => alert(`Error: ${err}`));
  }, [startDate, endDate]);

  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={e => {
          setStartDate(null);
          setEndDate(null);
          setShowModal(true);
        }}
      >
        Trigger videos import
      </button>

      {showModal && (
        <Modal
          title="Import videos from legacy"
          onClose={() => setShowModal(false)}
        >
          <div className="row">
            {/* startDate */}
            <div className="col">
              <label className="control-label">Start date *</label>
              <DatePicker
                onChange={d =>
                  setStartDate(d ? d.format("YYYY-MM-DD hh:mm:ss") : null)
                }
                value={startDate}
              />
            </div>
            {/* endDate */}
            <div className="col">
              <label className="control-label">End date</label>
              <DatePicker
                onChange={d =>
                  setEndDate(d ? d.format("YYYY-MM-DD hh:mm:ss") : null)
                }
                value={endDate}
              />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col text-right">
              <button className="btn btn-primary" onClick={e => importVideos()}>
                Launch
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default LegacyVideoImport;

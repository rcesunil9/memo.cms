import React from "react";
import { inputChanger } from "../utils";

function SendMessageSummaryActionViewModel({ model, onChange }) {
  const input = inputChanger(model, onChange);

  return (
    <>
      {/* EmailBodyTemplate	[string] */}
      <div className="form-group">
        <label className="control-label">Email Title*</label>
        <input
          className="form-control"
          name="emailTitleTemplate"
          value={model.emailTitleTemplate || ""}
          onChange={input}
        />
      </div>

      {/* EmailBodyTemplate	[string] */}
      <div className="form-group">
        <label className="control-label">Email Body*</label>
        <textarea
          rows={15}
          className="form-control"
          name="emailBodyTemplate"
          value={model.emailBodyTemplate || ""}
          onChange={input}
        />
      </div>
    </>
  );
}

export default SendMessageSummaryActionViewModel;

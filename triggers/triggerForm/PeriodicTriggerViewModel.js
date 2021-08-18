import React from "react"
import get from "lodash/get"
import { inputChanger } from "../utils"

const PeriodicTriggerViewModel = ({ model, onChange }) => {
  const change = inputChanger(model, onChange)

  return (
    <React.Fragment>
      {/* cronExpression	string */}
      <div className="form-group">
        <label className="control-label">Cron expression*</label>
        <br/>
        <a href="http://www.cronmaker.com/" target="blank">Want to create a cron?</a>
        <input
          className="form-control"
          name="cronExpression"
          value={get(model, "cronExpression") || ""}
          onChange={change}
        />
      </div>
    </React.Fragment>
  )
}

export default PeriodicTriggerViewModel

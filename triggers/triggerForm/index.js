import React from "react"
import NewFileOnFTPTriggerViewModel from "./NewFileOnFTPTriggerViewModel"
import PeriodicTriggerViewModel from "./PeriodicTriggerViewModel"
import TradeItemPreComputed from './TradeItemPreComputed'

const forms = { NewFileOnFTPTriggerViewModel, PeriodicTriggerViewModel, TradeItemPreComputed }

const Empty = () => <div />

export default triggerType => {
  return forms[triggerType] || Empty
}

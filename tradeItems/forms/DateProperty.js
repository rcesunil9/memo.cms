import React from "react"
import DatePicker from "../../common/components/date/DatePicker"
import {date} from "../../common/utils/date"
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'

class DateProperty extends React.Component {

  componentDidMount() {
    const {value, onChange} = this.props;
    var p = date(value).toDate();
    p.setUTCHours(0);
    onChange(date(p))
}

  render() {
    const {value, onChange} = this.props;
    return (
      <React.Fragment>
        <DatePicker
          onChange={d => {
            onChange(d)
          }}
          dateFormat="YYYY-MM-DD"
          utc={true}
          timeFormat={false}
          value={date(value)} />
      </React.Fragment>
    )
  }
} 

export default onlyUpdateForKeys(['value', 'name'])(DateProperty);

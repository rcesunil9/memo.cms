import React from "react"

class Toggle extends React.Component {

  componentDidMount() {
    this.toggle()
  }

  componentDidUpdate() {
    this.toggle()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.open !== this.props.open
  }

  toggle() {
    const { open } = this.props
    if (open) {
      document.body.classList.remove("sidenav-toggled")
    } else {
      document.body.classList.add("sidenav-toggled")
    }
  }

  render() {
    const { open, toggle } = this.props
    return (
      <button style={{borderRadius: '4rem', verticalAlign: 'top'}} className="btn btn-sm btn-secondary d-inline-block mx-1" onClick={toggle}>
        <i className={open ? "icon-arrow-left" : "icon-arrow-right"} />
      </button>
    )
  }
}

export default Toggle

import React from "react";

class Tab extends React.Component {
  componentDidMount() {
    this.props.addTab({
      id: this.props.id,
      title: this.props.title
    });
  }

  componentWillUnmount() {
    this.props.removeTab(this.props.id)
  }

  render() {
    return this.props.activeTab.id === this.props.id && this.props.children;
  }
}

export default Tab;

import React, { Component } from "react";
import Tab from "./Tab";
import styled from "styled-components";

const ReactTabs = styled.div`
  display: flex;
  background-color: #efefef;
  margin-bottom: 10px;
`;

const TabsContainer = styled.div`
  background-color: #353a40;
`;

const ListTabs = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 0;
  list-style: none;
  margin: 0;
`;

const TabTitleItem = styled.li`
  cursor: pointer;
  padding: 10px 15px;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  background-color: ${props => (props.isActiveTab ? "#212529" : "none")};
  :hover {
    background-color: #212529;
  }
`;

const TabContent = styled.div`
  padding: 10px;
`;

const TabAnchorItem = styled.a``;

const ActiveTabBorder = styled.div``;

class Tabs extends Component {
  static Tab = Tab;

  state = {
    tabs: [],
    prevActiveTab: {},
    activeTab: this.props.activeTab,
    tabsElements: []
  };

  addTab = newTab => {
    let isNewTabFound;

    for (let i in this.state.tabs) {
      let tab = this.state.tabs[i];

      if (tab.id === newTab.id) {
        isNewTabFound = true;
        break;
      }
    }

    if (!isNewTabFound) {
      this.setState((prevState, props) => {
        return {
          tabs: prevState.tabs.concat(newTab)
        };
      });
    }
  };

  removeTab = tabId => {
    this.setState((prevState, props) => {
      return {
        tabs: prevState.tabs.filter(tab => tab.id !== tabId)
      };
    });
  };

  onClick = tab => event => {
    this.setState((prevState, props) => {
      return {
        prevActiveTab: prevState.activeTab,
        activeTab: tab
      };
    });
    if(this.props.onTabClick) {
      this.props.onTabClick(tab)
    }
  };

  render() {
    return (
      <ReactTabs>
        <TabsContainer>
          <ListTabs>
            {this.state.tabs.map((tab, index) => (
              <TabTitleItem
                key={index}
                onClick={this.onClick(tab)}
                id={tab.id}
                innerRef={tabElement => {
                  if (!this.state.tabsElements[tab.id]) {
                    this.setState((prevState, props) => {
                      const tabsElements = prevState.tabsElements;
                      tabsElements[tab.id] = tabElement;

                      return {
                        tabsElements
                      };
                    });
                  }
                }}
                isActiveTab={this.state.activeTab.id === tab.id}
              >
                <TabAnchorItem>{tab.title}</TabAnchorItem>
              </TabTitleItem>
            ))}
          </ListTabs>

          <ActiveTabBorder
            activeTabElement={this.state.tabsElements[this.state.activeTab.id]}
          />
        </TabsContainer>
        <TabContent>
          {React.Children.map(this.props.children, child =>
            React.cloneElement(child, {
              activeTab: this.state.activeTab,
              addTab: this.addTab,
              removeTab: this.removeTab
            })
          )}
        </TabContent>
      </ReactTabs>
    );
  }
}

export default Tabs;

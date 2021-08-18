import * as types from "./types";
import update from "immutability-helper";
import get from "lodash/get";
import map from "lodash/map";

const menu = [
  {
    title: "Dashboard",
    icon: "icon-pie-chart",
    to: "/dashboard",
    collapsed: true,
    children: [      
      {
        title: "Import jobs",
        to: "/tools/import-jobs",
        collapsed: true,
        children: []
      },
      {
        title: "Resource import jobs",
        to: "/resource-import-jobs",
        collapsed: true,
        children: []
      },
      {
        title: "Pre computing jobs",
        to: "/tools/export-jobs",
        collapsed: true,
        children: []
      }
    ]
  },
  {
    title: "Organisations",
    icon: "icon-organization",
    to: "/manufacturers",
    collapsed: true,
    children: [
      {
        title: "Manufacturers",
        to: "/manufacturers",
        collapsed: true,
        children: []
      },
      {
        title: "Retailers",
        to: "/retailers",
        collapsed: true,
        children: []
      }
    ]
  },
  {
    title: "Tools",
    icon: "icon-briefcase",
    to: "/tools/matrix-mapping",
    collapsed: true,
    children: [
      {
        title: "Matrix mapping",
        to: "/tools/matrix-mapping",
        collapsed: true,
        children: []
      },
      {
        title: "Business rules",
        to: "/tools/business-rules",
        collapsed: true,
        children: []
      },
      {
        title: "Business rules sets",
        to: "/tools/business-rules-sets",
        collapsed: true,
        children: []
      },
      {
        title: "Export transformations sets",
        to: "/tools/export-transformations",
        collapsed: true,
        children: []
      },
      {
        title: "Export formats",
        to: "/tools/export-formats",
        collapsed: true,
        children: []
      },
      {
        title: "Format rejections",
        to: "/format-processing-rejections",
        collapsed: true,
        children: []
      },
      {
        title: "Export transport configurations",
        to: "/transport-configurations",
        collapsed: true,
        children: []
      },
      {
        title: "Enrichment requests",
        to: "/enrichment-requests",
        collapsed: true,
        children: []
      },
      {
        title: "Matching",
        to: "/tools/matching",
        collapsed: true,
        children: []
      },
      {
        title: "Acknowlegement",
        to: "/acknowledgement/conflicts",
        collapsed: true,
        children: []
      },
      {
        title: "REST submissions",
        to: "/acknowledgement/submissions",
        collapsed: true,
        children: []
      }
    ]
  },
  {
    title: "Catalog",
    icon: "icon-book-open",
    to: "/trade-items",
    collapsed: true,
    children: []
  },
  {
    title: "Trade item properties",
    icon: "icon-tag",
    to: "/trade-items-properties",
    collapsed: true,
    children: [
      {
        title: "Trade item properties",
        to: "/trade-items-properties/view-all",
        collapsed: true,
        children: []
      },
      {
        title: "Aliases",
        to: "/trade-items-properties-aliases",
        collapsed: true,
        children: []
      },
      {
        title: "Properties mass tool",
        to: "/trade-items-properties-mass-tool",
        collapsed: true,
        children: []
      }
    ]
  },
  {
    title: "Users",
    icon: "icon-people",
    to: "/user-management/users",
    collapsed: true,
    children: [
      {
        title: "Users",
        to: "/user-management/users",
        collapsed: true,
        children: []
      },
      {
        title: "Groups",
        to: "/user-management/groups",
        collapsed: true,
        children: []
      },
      {
        title: "Rights",
        to: "/user-management/rights",
        collapsed: true,
        children: []
      }
    ]
  },
  {
    title: "Subscription",
    icon: "icon-envelope-letter",
    to: "/subscription/offers",
    collapsed: true,
    children: [
      {
        title: "Offers",
        to: "/subscription/offers",
        collapsed: true,
        children: []
      },
      {
        title: "Subscriptions",
        to: "/subscription/subscriptions",
        collapsed: true,
        children: []
      },
      {
        title: "Connectors",
        to: "/subscription/connectors",
        collapsed: true,
        children: []
      },
      {
        title: "Connections",
        to: "/subscription/connections",
        collapsed: true,
        children: []
      },
      {
        title: "Connections mass tool",
        to: "/subscription/mass-connections",
        collapsed: true,
        children: []
      },
      {
        title: "Connectors mass tool",
        to: "/subscription/mass-connectors",
        collapsed: true,
        children: []
      }
    ]
  },
  {
    title: "Actions",
    icon: "icon-rocket",
    to: "/actions",
    collapsed: true,
    children: [
      {
        title: "Actions",
        to: "/actions",
        collapsed: true,
        children: []
      },
      {
        title: "Launched actions",
        to: "/action-execution-results",
        collapsed: true,
        children: []
      }
    ]
  },
  {
    title: "Triggers",
    icon: "icon-shuffle",
    to: "/triggers",
    collapsed: true,
    children: [
      {
        title: "Triggers",
        to: "/triggers",
        collapsed: true,
        children: []
      }
    ]
  },
  {
    title: "Settings",
    icon: "icon-settings",
    to: "/release-notes",
    collapsed: true,
    children: [
      {
        title: "Templates",
        to: "/templates",
        collapsed: true,
        children: []
      },
      {
        title: "Collections",
        to: "/collections",
        collapsed: true,
        children: []
      }
    ]
  },
  {
    title: "Releases",
    icon: "icon-calendar",
    to: "/release-notes",
    collapsed: true,
    children: []
  }
];

const getInitialMenuState = () => {
  const navigation = localStorage.getItem("navigation");
  const open = navigation ? get(JSON.parse(navigation), "open", true) : true;
  return { menu, open };
};

const openItem = (menu, index) => {
  const open = items =>
    map(items, (section, i) =>
      update(section, { collapsed: { $set: i !== index } })
    );
  return update(menu, { $apply: open });
};

const closeItem = (menu, index) => {
  return update(menu, { [index]: { collapsed: { $set: true } } });
};

const toggleItem = (menu, index) => {
  return menu[index].collapsed ? openItem(menu, index) : closeItem(menu, index);
};

const menuReducer = (state = getInitialMenuState(), action) => {
  switch (action.type) {
    case types.APP_SIDEBAR_TOGGLE:
      localStorage.setItem("navigation", JSON.stringify({ open: !state.open }));
      return { menu: state.menu, open: !state.open };
    case types.APP_SUBMENU_TOGGLE:
      return { ...state, menu: toggleItem(state.menu, action.index) };
    default:
      return state;
  }
};

export default menuReducer;

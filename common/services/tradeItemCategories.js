import axios from "axios";
import * as env from "../../environment/index.js";

// Set the services URIs
//
const makeURL = path =>
  `${env.CDM_TRADE_ITEM_PROPERTIES_URI}/api/TradeItemCategory${path}`;
const GET_TRADE_ITEM_CATEGORIES = makeURL("/GetAll");


// Get trade item properties by scope
// scopes: LicencedProducts, Toys...
//
export const getTradeItemCategories = () =>
  axios.get(`${GET_TRADE_ITEM_CATEGORIES}`);

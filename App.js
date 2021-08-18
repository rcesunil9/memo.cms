import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { Provider } from "react-redux";
import { initialize } from "react-localize-redux";
import "react-virtualized/styles.css";
import * as env from "./environment";
import withAuth from "./auth/withAuth";
import DefaultView from "./DefaultView";
import PageNotFound from "./common/components/layout/PageNotFound";
import ScrollToTop from "./common/components/layout/ScrollToTop";
import Login from "./auth/Login";
import ManufacturersList from "./manufacturers/ManufacturersList";
import ManufacturersEdit from "./manufacturers/ManufacturersEdit";
import RetailersList from "./retailers/RetailersList";
import RetailersEdit from "./retailers/RetailersEdit";
import TradeItemsList from "./tradeItems/TradeItemsList";
import TradeItemEditRouted from "./tradeItems/TradeItemEditRouted";
import TradeItemsProperties from "./tradeItemProperties/TradeItemsProperties";
import NewPropertyAssociation from "./tradeItemProperties/NewPropertyAssociation";
import PreComputedTradeItemsList from "./preComputing/PreComputedTradeItemsList";
import Aliases from "./tradeItemProperties/Aliases";
import AliasEdit from "./tradeItemProperties/AliasEdit";
import UsersList from "./user-management/UsersList";
import UserGroupsList from "./user-management/UserGroupsList";
import UserRightsList from "./user-management/UserRightsList";
import MatrixMapping from "./matrixMapping/MatrixMapping";
import BusinessRules from "./businessRules/rule/BusinessRules";
import BusinessRulesSets from "./businessRules/ruleSet/BusinessRulesSets";
import ImportJobs from "./importJobs/ImportJobs";
import ImportJobReport from "./importJobs/ImportJobReport";
import ExportJobs from "./exportJobs/ExportJobs";
import TransformationSetsList from "./transformationManagement/TransformationSetsList";
import TransformationSetEdit from "./transformationManagement/TransformationSetEdit";
import Matching from "./matching/Matching";
import TriggersList from "./triggers/TriggersList";
import TriggersEdit from "./triggers/TriggersEdit";
import ActionsList from "./triggers/ActionsList";
import ActionsEdit from "./triggers/ActionsEdit";
import ActionExecutionResultsList from "./triggers/ActionExecutionResultsList";
import ExportFormatsList from "./export-format/ExportFormatsList";
import ExportFormatsEdit from "./export-format/ExportFormatsEdit";
import Conflicts from "./acknowledgement/Conflicts";
import Submissions from "./acknowledgement/Submissions";
import Submission from "./acknowledgement/Submission";
import Ceremony from "./common/components/misc/Ceremony";
import Dashboard from "./Dashboard";
import TransportConfigurationsList from "./transport/TransportConfigurationsList";
import TransportConfigurationEdit from "./transport/TransportConfigurationEdit";
import ReleaseNotes from "./releaseNotes";
import EnrichmentConfiguration from "./retailers/EnrichmentConfiguration";
import Offers from "./subscription/offers/Offers";
import Offer from "./subscription/offers/Offer";
import Subscriptions from "./subscription/subscription/Subscriptions";
import RoutedSubscription from "./subscription/subscription/RoutedSubscription";
import Connectors from "./subscription/connectors/Connectors";
import RoutedConnector from "./subscription/connectors/RoutedConnector";
import ConnectorMassCreator from "./subscription/connectors/ConnectorMassCreator";
import Connections from "./subscription/connections/Connections";
import RoutedConnection from "./subscription/connections/RoutedConnection";
import ConnectionsMassManager from "./subscription/connections/ConnectionsMassManager";
import EnrichmentRequests from "./enrichmentRequest/EnrichmentRequests";
import EnrichmentRequestDetail from "./enrichmentRequest/EnrichmentRequestDetail";
import ExportPreComputedTradeItemActionDetail from "./triggers/details/ExportPreComputedTradeItemActionDetail";
import ExportJobDetails from "./exportJobs/ExportJobDetails";
import FormatProcessingRejection from "./formatProcessing/FormatProcessingRejection";
import FormatProcessingRejectionsView from "./formatProcessing/FormatProcessingRejectionsView";
import TradeItemPropertiesMassTool from "./tradeItemProperties/TradeItemPropertiesMassTool";
import ResourceImportJobView from "./importJobs/ResourceImportJobView";
import ResourceImportJobsView from "./importJobs/ResourceImportJobsView";
import CollectionsView from "./collection/CollectionsView";
import CollectionView from "./collection/CollectionView";
import TemplateView from "./template/TemplateView";
import TemplatesView from "./template/TemplatesView";
// import Loadable from 'react-loadable'
// Loadable components
// const Loading = () => (<div></div>)

// const PageNotFound = Loadable({
//   loader : () => import('./PageNotFound'),
//   loading: Loading
// })

const App = ({ store }) => {
  store.dispatch(
    initialize(env.CDM_AVAILABLE_LANG, {
      defaultLanguage: env.CDM_DEFAULT_LANG
    })
  );
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop>
          <Switch>
            <Redirect from="/" exact to="/dashboard" />
            <Route path="/login" component={Login} />
            <DefaultView
              path="/dashboard"
              exact
              component={withAuth(Dashboard)}
            />
            <DefaultView
              path="/manufacturers"
              exact
              component={withAuth(ManufacturersList)}
            />
            <DefaultView
              path="/manufacturer/:id?"
              exact
              component={withAuth(ManufacturersEdit)}
            />
            <DefaultView
              path="/retailers"
              exact
              component={withAuth(RetailersList)}
            />
            <DefaultView
              path="/retailer/:id?"
              exact
              component={withAuth(RetailersEdit)}
            />
            <DefaultView
              path="/enrichment-configuration/:id?"
              exact
              component={withAuth(EnrichmentConfiguration)}
            />
            <DefaultView
              path="/trade-items"
              exact
              component={withAuth(TradeItemsList)}
            />
            <DefaultView
              path="/trade-item/:id?"
              exact
              component={withAuth(TradeItemEditRouted)}
            />
            <DefaultView
              path="/trade-items-properties/:id?"
              exact
              component={withAuth(TradeItemsProperties)}
            />
            <DefaultView
              path="/trade-items-properties-new-association"
              exact
              component={withAuth(NewPropertyAssociation)}
            />
            <DefaultView
              path="/trade-items-properties-mass-tool"
              exact
              component={withAuth(TradeItemPropertiesMassTool)}
            />
            <DefaultView
              path="/trade-items-properties-aliases"
              exact
              component={withAuth(Aliases)}
            />
            <DefaultView
              path="/trade-items-properties-alias/:id?"
              exact
              component={withAuth(AliasEdit)}
            />
            <DefaultView
              path="/pre-computed-trade-items/:id?"
              exact
              component={withAuth(PreComputedTradeItemsList)}
            />
            <DefaultView
              path="/pre-computing-job-detail/:id/:exportPreComputedTradeItemActionId?"
              exact
              component={withAuth(ExportJobDetails)}
            />
            <DefaultView
              path="/tools/matrix-mapping"
              exact
              component={withAuth(MatrixMapping)}
            />
            <DefaultView
              path="/tools/business-rules"
              exact
              component={withAuth(BusinessRules)}
            />
            <DefaultView
              path="/tools/business-rules-sets"
              exact
              component={withAuth(BusinessRulesSets)}
            />
            <DefaultView
              path="/tools/import-jobs/:pageNumber?/:pageSize?"
              exact
              component={withAuth(ImportJobs)}
            />
            <DefaultView
              path="/tools/import-job/:id?"
              exact
              component={withAuth(ImportJobReport)}
            />
            <DefaultView
              path="/resource-import-jobs/:pageNumber?/:pageSize?"
              exact
              component={withAuth(ResourceImportJobsView)}
            />
            <DefaultView
              path="/resource-import-job/:id"
              exact
              component={withAuth(ResourceImportJobView)}
            />
            <DefaultView
              path="/tools/export-jobs/:pageNumber?/:pageSize?"
              exact
              component={withAuth(ExportJobs)}
            />
            <DefaultView
              path="/tools/export-transformations"
              exact
              component={withAuth(TransformationSetsList)}
            />
            <DefaultView
              path="/tools/export-transformation/:id?"
              exact
              component={withAuth(TransformationSetEdit)}
            />
            <DefaultView
              path="/tools/matching"
              exact
              component={withAuth(Matching)}
            />
            <DefaultView
              path="/user-management/users"
              exact
              component={withAuth(UsersList)}
            />
            <DefaultView
              path="/user-management/groups"
              exact
              component={withAuth(UserGroupsList)}
            />
            <DefaultView
              path="/user-management/rights"
              exact
              component={withAuth(UserRightsList)}
            />
            <DefaultView
              path="/triggers"
              exact
              component={withAuth(TriggersList)}
            />
            <DefaultView
              path="/trigger/:id?"
              exact
              component={withAuth(TriggersEdit)}
            />
            <DefaultView
              path="/actions"
              exact
              component={withAuth(ActionsList)}
            />
            <DefaultView
              path="/action/:id?"
              exact
              component={withAuth(ActionsEdit)}
            />
            <DefaultView
              path="/action-precomputing-detail/:id"
              exact
              component={withAuth(ExportPreComputedTradeItemActionDetail)}
            />
            <DefaultView
              path="/action-execution-results"
              exact
              component={withAuth(ActionExecutionResultsList)}
            />
            <DefaultView
              path="/tools/export-formats"
              exact
              component={withAuth(ExportFormatsList)}
            />
            <DefaultView
              path="/tools/export-format/:id?"
              exact
              component={withAuth(ExportFormatsEdit)}
            />
            <DefaultView
              path="/acknowledgement/conflicts"
              exact
              component={withAuth(Conflicts)}
            />
            <DefaultView
              path="/acknowledgement/submissions"
              exact
              component={withAuth(Submissions)}
            />
            <DefaultView
              path="/acknowledgement/submission/:id"
              exact
              component={withAuth(Submission)}
            />
            <DefaultView
              path="/ceremony"
              exact
              component={withAuth(Ceremony)}
            />
            <DefaultView
              path="/transport-configurations"
              exact
              component={withAuth(TransportConfigurationsList)}
            />
            <DefaultView
              path="/transport-configuration/:id?"
              exact
              component={withAuth(TransportConfigurationEdit)}
            />
            <DefaultView
              path="/release-notes"
              exact
              component={withAuth(ReleaseNotes)}
            />
            <DefaultView
              path="/subscription/offers"
              exact
              component={withAuth(Offers)}
            />
            <DefaultView
              path="/subscription/offer/:id?"
              exact
              component={withAuth(Offer)}
            />
            <DefaultView
              path="/subscription/subscriptions"
              exact
              component={withAuth(Subscriptions)}
            />
            <DefaultView
              path="/subscription/subscription/:id?"
              exact
              component={withAuth(RoutedSubscription)}
            />
            <DefaultView
              path="/subscription/connectors"
              exact
              component={withAuth(Connectors)}
            />
            <DefaultView
              path="/subscription/connector/:id?"
              exact
              component={withAuth(RoutedConnector)}
            />
            <DefaultView
              path="/subscription/mass-connectors"
              exact
              component={withAuth(ConnectorMassCreator)}
            />
            <DefaultView
              path="/subscription/connections"
              exact
              component={withAuth(Connections)}
            />
            <DefaultView
              path="/subscription/connection/:id?"
              exact
              component={withAuth(RoutedConnection)}
            />
            <DefaultView
              path="/subscription/mass-connections"
              exact
              component={withAuth(ConnectionsMassManager)}
            />
            <DefaultView
              path="/enrichment-requests"
              exact
              component={withAuth(EnrichmentRequests)}
            />
            <DefaultView
              path="/enrichment-request/:id"
              exact
              component={withAuth(EnrichmentRequestDetail)}
            />
            <DefaultView
              path="/format-processing-rejections"
              exact
              component={withAuth(FormatProcessingRejectionsView)}
            />
            <DefaultView
              path="/format-processing-rejection/:id"
              exact
              component={withAuth(FormatProcessingRejection)}
            />
            <DefaultView
              path="/collections"
              exact
              component={withAuth(CollectionsView)}
            />
            <DefaultView
              path="/collection/:id?"
              exact
              component={withAuth(CollectionView)}
            />
            <DefaultView
              path="/templates"
              exact
              component={withAuth(TemplatesView)}
            />
            <DefaultView
              path="/template/:id?"
              exact
              component={withAuth(TemplateView)}
            />

            <Route path="*" component={PageNotFound} />
          </Switch>
        </ScrollToTop>
      </Router>
    </Provider>
  );
};

export default App;

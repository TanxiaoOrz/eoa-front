import {
  createBrowserRouter,
} from "react-router-dom";
import Root from "./root.tsx";
import ErrorPage from "./error-page.tsx";
import BackModule from "../pages/TableModule/back_module.tsx";
import protable from "../example/protable.tsx";
import Login from "./login.tsx";
import React from "react";
import FrontPage from "./fornt.tsx";
import BackTable from "../pages/TableModule/back_table.tsx";
import BackTableConcrete from "../pages/TableModule/back_table_concrete.tsx";
import BackContent from "../pages/ContentModule/back_content.tsx";
import BackContentConcrete from "../pages/ContentModule/back_content_concrete.tsx";
import FrontContentConcrete from "../pages/ContentModule/front_content.tsx";
import FrontFormConcrete from "../pages/TableModule/front_form_concrete.tsx";
import BackCharacter from "../pages/OrganizationModule/back_character.tsx";
import BaseCharacterConcrete from "../pages/OrganizationModule/back_character_concrete.tsx";
import BackHuman from "../pages/OrganizationModule/back_human.tsx";
import BackHumanConcrete from "../pages/OrganizationModule/back_human_concrete.tsx";
import FrontHuman from "../pages/OrganizationModule/front_human.tsx";
import FrontHumanConcrete from "../pages/OrganizationModule/front_human_concrete.tsx";
import BackDepart from "../pages/OrganizationModule/back_depart.tsx";
import BackDepartConcrete from "../pages/OrganizationModule/back_depart_concrete.tsx";
import FrontDepart from "../pages/OrganizationModule/front_depart.tsx";
import FrontDepartConcrete from "../pages/OrganizationModule/front_depart_concrete.tsx";
import BackSectionConcrete from "../pages/OrganizationModule/back_section_concrete.tsx";
import FrontSection from "../pages/OrganizationModule/front_section.tsx";
import FrontSectionConcrete from "../pages/OrganizationModule/front_section_concrete.tsx";
import BackSection from "../pages/OrganizationModule/back_section.tsx";
import OrganizationTree from "../pages/OrganizationModule/organization_tree.tsx";
import BackWorkflow from "../pages/WorkflowModule/back_workflow.tsx";
import BackWorkflowConcrete from "../pages/WorkflowModule/back_workflow_concrete.tsx";
import BackNode from "../pages/WorkflowModule/back_node.tsx";
import BackRoute from "../pages/WorkflowModule/back_route.tsx";
import BackWorkflowNodeConcrete from "../pages/WorkflowModule/back_node_concrete.tsx";
import BackWorkflowRouteConcrete from "../pages/WorkflowModule/back_route_concrete.tsx";
import CreateWorkflow from "../pages/WorkflowModule/create_workflow.tsx";
import RequestConcrete from "../pages/WorkflowModule/request_concrete.tsx";
import RequestSelf from "../pages/WorkflowModule/request_self.tsx";
import RequestBackLog from "../pages/WorkflowModule/request_backlog.tsx";
import RequestDone from "../pages/WorkflowModule/request_done.tsx";
import BackRequestConcrete from "../pages/WorkflowModule/back_request_concrete.tsx";
import BackRequest from "../pages/WorkflowModule/back_request.tsx";
import FrontSearchConcrete from "../pages/DisplayModule/front_search_concrete.tsx";
import BackSearchList from "../pages/DisplayModule/back_search.tsx";
import BackSearchListColumn from "../pages/DisplayModule/back_search_column.tsx";
import BackSearchListConcrete from "../pages/DisplayModule/back_search_concrete.tsx";
import BackMenuList from "../pages/MenuModule/back_menu.tsx";
import BackMenuConcrete from "../pages/MenuModule/back_menu_concrete.tsx";
import BackLoginConfig from "../pages/MenuModule/back_login.tsx";
import BackPageConfig from "../pages/MenuModule/back_page.tsx";
import BackPage from "./back.tsx";
import MainPage from "./main.tsx";
import BackColumn from "../pages/TableModule/back_column.tsx";

const backs = [
  {
    path: "back_module",
    element: <BackModule />,
  }, {
    path: "back_table",
    element: <BackTable />,
  }, {
    path: "back_column",
    element: <BackColumn />,
  }, {
    path: "back_table/:tableId",
    element: <BackTableConcrete />,
  }, {
    path: "back_content",
    element: <BackContent />
  }, {
    path: "back_content/:contentId",
    element: <BackContentConcrete />
  }, {
    path: "back_character",
    element: <BackCharacter />
  }, {
    path: "back_character/:dataId",
    element: <BaseCharacterConcrete />
  }, {
    path: "back_human",
    element: <BackHuman />
  }, {
    path: "back_human/:dataId",
    element: <BackHumanConcrete />
  }, {
    path: "back_depart",
    element: <BackDepart />
  }, {
    path: "back_depart/:dataId",
    element: <BackDepartConcrete />
  }, {
    path: "back_section",
    element: <BackSection />
  }, {
    path: "back_section/:dataId",
    element: <BackSectionConcrete />
  },{
    path:"/back_organization",
    element:<OrganizationTree showDeprecated={true}/>
  }, {
    path: "/back_workflow",
    element:<BackWorkflow />
  }, {
    path: "/back_workflow/:dataId",
    element: <BackWorkflowConcrete />
  },{
    path: "/back_workflow_node/:dataId",
    element: <BackWorkflowNodeConcrete />
  },{
    path: "/back_workflow_node",
    element: <BackNode />
  },{
    path: "/back_workflow_route",
    element: <BackRoute />
  },{
    path: "/back_workflow_route/:dataId",
    element: <BackWorkflowRouteConcrete />
  },{
    path: '/back_request' ,
    element: <BackRequest />
  },{
    path: '/back_request/:requestId',
    element: <BackRequestConcrete />
  },{
    path:'/back_search_list',
    element: <BackSearchList />
  },{
    path:'/back_search_list_column',
    element: <BackSearchListColumn />
  },{
    path:'/back_search_list/:dataId',
    element: <BackSearchListConcrete />
  },{
    path:'/back_menu',
    element: <BackMenuList />
  },{
    path:'/back_menu/:dataId',
    element: <BackMenuConcrete />
  },{
    path:'/back_login_config',
    element: <BackLoginConfig />
  },{
    path:'/back_page_config',
    element: <BackPageConfig />
  },{
    path:'/back',
    element: <BackPage />
  }
]

const fronts = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  }, {
    path: "login",
    element: <Login />
  }, {
    path: "front",
    element: <FrontPage />
  }, {
    path: "content/:contentId",
    element: <FrontContentConcrete />
  }, {
    path: "form/:formId",
    element: <FrontFormConcrete />
  }, {
    path: "human_resouce",
    element: <FrontHuman />
  }, {
    path: "human_resouce/:dataId",
    element: <FrontHumanConcrete />
  }, {
    path: "depart",
    element: <FrontDepart />
  }, {
    path: "depart/:dataId",
    element: <FrontDepartConcrete />
  }, {
    path: "section",
    element: <FrontSection />
  }, {
    path: "section/:dataId",
    element: <FrontSectionConcrete />
  },{
    path:"/organization",
    element:<OrganizationTree showDeprecated={false}/>
  },{
    path:'/workflow',
    element:<CreateWorkflow />
  },{
    path:'/request/:requestId',
    element:<RequestConcrete />
  },{
    path: '/request/self' ,
    element: <RequestSelf />
  },{
    path: '/request/backlog' ,
    element: <RequestBackLog />
  },{
    path: '/request/done' ,
    element: <RequestDone />
  },{
    path: '/search/:dataId',
    element: <FrontSearchConcrete />
  },{
    path: '/main',
    element: <MainPage />
  }
]


const router = createBrowserRouter(fronts.concat(backs));

export default router
import {
  createBrowserRouter,
} from "react-router-dom";
import Root from "./root.tsx";
import ErrorPage from "./error-page.tsx";
import BackModule from "../pages/TableModule/back_module.tsx";
import protable from "../example/protable.tsx";
import Login from "./login.tsx";
import React from "react";
import { FrontPage } from "./fornt.tsx";
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

const Protable = protable

const backs = [
  {
    path: "back_module",
    element: <BackModule />,
  }, {
    path: "back_table",
    element: <BackTable />,
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
  },
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
  }
]


const router = createBrowserRouter(fronts.concat(backs));

export default router
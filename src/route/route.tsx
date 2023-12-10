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

const Protable = protable

const backs = [
  {
    path: "back_module",
    element: <BackModule />,  
  },{
    path:"back_table",
    element: <BackTable />,
  },{
    path:"back_table/:tableId",
    element: <BackTableConcrete />,
  },{
    path:"back_content",
    element: <BackContent />
  },{
    path:"back_content/:contentId",
    element:<BackContentConcrete />
  }
]

const fronts = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },{
    path: "login",
    element: <Login />
  },{
    path: "front",
    element: <FrontPage />
  },{
    path:"content/:contentId",
    element: <FrontContentConcrete />
  },{
    path:"form/:formId",
    element: <FrontFormConcrete />
  }
]


const router = createBrowserRouter(fronts.concat(backs));

export default router
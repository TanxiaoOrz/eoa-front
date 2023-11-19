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

const Protable = protable

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
    },{
      path: "back_module",
      element: <BackModule />,  
    },{
      path:"back_table",
      element: <BackTable />,
    },{
      path: "login",
      element: <Login />
    },{
      path: "front",
      element: <FrontPage />
    }

]);

export default router
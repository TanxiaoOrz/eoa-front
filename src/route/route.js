import {
    createBrowserRouter,
} from "react-router-dom";
import Root from "./root";
import ErrorPage from "../error-page";
import Contact from "./contact";
import BackModule from "../pages/back_module.tsx";
import protable from "../example/protable.tsx"; 
import Login from "../pages/login.tsx";

const Protable = protable

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
    },{
      path: "contacts/:contactId",
      element: <Contact />,
    },{
      path: "back_module",
      element: <BackModule />,  
    },{
      path: "example/protable",
      element: <Protable />,
    },{
      path: "login",
      element: <Login />
    }

]);

export default router
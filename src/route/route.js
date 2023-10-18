import {
    createBrowserRouter,
} from "react-router-dom";
import Root from "./root";
import ErrorPage from "../error-page";
import Contact from "./contact";
import BackModule from "../pages/back_module.tsx";

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
    }
]);

export default router
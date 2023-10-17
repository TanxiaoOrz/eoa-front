import {
    createBrowserRouter,
} from "react-router-dom";
import Root from "./root";
import ErrorPage from "../error-page";
import Contact from "./contact";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
    },{
      path: "contacts/:contactId",
      element: <Contact />,
    }
]);

export default router
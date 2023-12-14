import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  RouterProvider,
} from "react-router-dom";


import router from "./route/route.tsx"
import config from "./const/config.js";
if (config.globalSrollHidden)
  document.body.parentNode.style.overflowY = "hidden";

document.body.parentNode.style.overflowX = "hidden"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
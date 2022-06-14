import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import RoutesGeneral from "./routes/routesgeneral";

const routes = (
    <>
        {RoutesGeneral}
    </>
)

export default routes
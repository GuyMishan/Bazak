import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Router, Route, Switch, Redirect, withRouter } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'components/Table.css' 
import 'components/TableDark.css' 
import 'components/ExcelButton.css' 
import 'components/EmptyButton.css' 
import 'components/NewButton.css' 
import 'components/NewButtonDelete.css' 
import "assets/css/black-dashboard-react.css";
import ThemeContextWrapper from "./components/general/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/general/BackgroundColorWrapper/BackgroundColorWrapper";

import history from './history'

import routes from 'routes'

ReactDOM.render(
  <>
    <ThemeContextWrapper>
      <ToastContainer autoClose={2000} />
      <BackgroundColorWrapper>
        <Router history={history}>
          <Switch>
            {routes}
            {/*<Redirect from="/" to="/signin"/>*/}
          </Switch>
        </Router>
      </BackgroundColorWrapper>
    </ThemeContextWrapper>
  </>,
  document.getElementById("root")
);

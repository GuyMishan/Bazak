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
import 'components/NewButtonBlue.css' 
import 'components/NewButtonDelete.css' 
import "assets/css/black-dashboard-react.css";
import ThemeContextWrapper from "./components/general/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/general/BackgroundColorWrapper/BackgroundColorWrapper";

import history from './history'

import LoggedinRoute from "auth/LoggedinRoute";
import UnloggedinRoute from "auth/UnloggedinRoute";
import AdminRoute from "auth/AdminRoute.js";

//auth routes
import SignIn from "views/authentication/SignInForm";
import AdminSignIn from "views/authentication/AdminSignInForm";
import SignUp from "views/authentication/SignUpForm";
import ManageUsers from "views/authentication/manageusers/ManageUsers";
import EditUser from "views/authentication/EditUserForm";
//general routes
import DashboardPage from "views/generalpages/dashboardpage/DashboardPage";
import SubUnitsPage from "views/generalpages/subunitspage/SubUnitsPage";
import ZminotPage from "views/generalpages/zminotpage/ZminotPage";
import UnitTreePage from "views/generalpages/unittreepage/UnitTreePage";
import AboutPage from "views/generalpages/aboutpage/AboutPage";
//excel routes
import Exceluploadusers from "views/excelpages/ExcelUploadUsers"
import Exceluploadjobs from "views/excelpages/ExcelUploadJobs"

ReactDOM.render(
  <>
    <ThemeContextWrapper>
      <ToastContainer autoClose={2000} />
      <BackgroundColorWrapper>
        <Router history={history}>
          <Switch>
           {/*///////////////////////////////////////////UnLoggedIn Routes/////////////////////////////////////////////////*/}
           <UnloggedinRoute path="/signin" exact component={SignIn} />
            <UnloggedinRoute path="/adminsignin" exact component={AdminSignIn} />
            <UnloggedinRoute path="/signup" exact component={SignUp} />
            {/*///////////////////////////////////////////UnLoggedIn Routes/////////////////////////////////////////////////*/}

            {/*///////////////////////////////////////////Admin Routes/////////////////////////////////////////////////*/}
            <AdminRoute path="/manageusers" exact component={ManageUsers} />
            <AdminRoute path="/edituser/:userid" exact component={EditUser} />
            {/*///////////////////////////////////////////Admin Routes/////////////////////////////////////////////////*/}

            {/*///////////////////////////////////////////LoggedIn Routes/////////////////////////////////////////////////*/}
            <LoggedinRoute path="/dashboard/:unittype/:unitid/:cartype/:carid" exact component={DashboardPage} />
            <LoggedinRoute path="/subunitspage/:unittype/:unitid/:cartype/:carid" exact component={SubUnitsPage} />
            <LoggedinRoute path="/zminotpage/:unittype/:unitid/:ismushbat" exact component={ZminotPage} />
            <LoggedinRoute path="/unittreepage/:unittype/:unitid" exact component={UnitTreePage} />
            <LoggedinRoute path="/about" exact component={AboutPage} />
            {/*///////////////////////////////////////////LoggedIn Routes/////////////////////////////////////////////////*/}

            {/*////////////////////////////////////////Excel Reading//////////////////////////////////////////////////*/}
            <Route path="/exceluploadusers" exact component={Exceluploadusers} />
            <Route path="/exceluploadjobs" exact component={Exceluploadjobs} />
            {/*////////////////////////////////////////Excel Reading//////////////////////////////////////////////////*/}
            <Redirect from="/" to="/signin" />
          </Switch>
        </Router>
      </BackgroundColorWrapper>
    </ThemeContextWrapper>
  </>,
  document.getElementById("root")
);

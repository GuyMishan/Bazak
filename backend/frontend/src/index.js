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
//redux
import { Provider } from 'react-redux'
import store from 'redux/store'

//auth routes
import SignIn from "views/authentication/SignInForm";
import AdminSignIn from "views/authentication/AdminSignInForm";
import SignUp from "views/authentication/SignUpForm";
import SignUpOtherUsers from "views/authentication/SignUpOtherUsers";
import ManageUsers from "views/authentication/manageusers/ManageUsers";
import EditUser from "views/authentication/EditUserForm";
//general routes
import DashboardPage from "views/generalpages/dashboardpage/DashboardPage";
import SubUnitsPage from "views/generalpages/subunitspage/SubUnitsPage";
import ZminotPage from "views/generalpages/zminotpage/ZminotPage";
import UnitTreePage from "views/generalpages/unittreepage/UnitTreePage";
import AboutPage from "views/generalpages/aboutpage/AboutPage";
import StatisticsPage from "views/generalpages/statisticspage/StatisticsPage";
import AssessmentPage from "views/generalpages/assessmentpage/AssessmentPage";
import SubUnitsRecentFeeds from "views/generalpages/subunitsrecentfeedspage/SubUnitsRecentFeeds";
import ModularChartPage from "views/generalpages/modularchartspage/ModularChartPage";
//excel routes
import Exceluploadusers from "views/excelpages/ExcelUploadUsers"
import Exceluploadjobs from "views/excelpages/ExcelUploadJobs"

ReactDOM.render(
  <>
    <Provider store={store}>
      <ThemeContextWrapper>
        <ToastContainer rtl autoClose={4000} style={{ textAlign: 'right' }} />
        <BackgroundColorWrapper>
          <Router history={history}>
            <Switch>
              {/*///////////////////////////////////////////UnLoggedIn Routes/////////////////////////////////////////////////*/}
              <UnloggedinRoute path="/signin" exact component={SignIn} />
              <UnloggedinRoute path="/adminsignin" exact component={AdminSignIn} />
              <UnloggedinRoute path="/signup" exact component={SignUp} />
              <LoggedinRoute path="/signupotherusers" exact component={SignUpOtherUsers} />
              {/*///////////////////////////////////////////UnLoggedIn Routes/////////////////////////////////////////////////*/}

              {/*///////////////////////////////////////////Admin Routes/////////////////////////////////////////////////*/}
              <AdminRoute path="/manageusers" exact component={ManageUsers} />
              <AdminRoute path="/edituser/:userid" exact component={EditUser} />
              {/*///////////////////////////////////////////Admin Routes/////////////////////////////////////////////////*/}

              {/*///////////////////////////////////////////LoggedIn Routes/////////////////////////////////////////////////*/}
              <LoggedinRoute path="/dashboard/:unittype/:unitid/:cartype/:carid" exact component={DashboardPage} />
              <LoggedinRoute path="/subunitspage/:unittype/:unitid/:cartype/:carid" exact component={SubUnitsPage} />
              <LoggedinRoute path="/zminotpage/:unittype/:unitid/:cartype/:carid/:ismushbat/:isstopped" exact component={ZminotPage} />
              <LoggedinRoute path="/unittreepage/:unittype/:unitid" exact component={UnitTreePage} />
              <LoggedinRoute path="/about" exact component={AboutPage} />
              <LoggedinRoute path="/statisticspage/:unittype/:unitid/:cartype/:carid" exact component={StatisticsPage} />
              <LoggedinRoute path="/assessmentpage" exact component={AssessmentPage} />
              <LoggedinRoute path="/subunitsrecentfeedspage/:unittype/:unitid/:cartype/:carid" exact component={SubUnitsRecentFeeds} />
              <LoggedinRoute path="/modularchartpage/:screenid/:unittype/:unitid/:cartype/:carid" exact component={ModularChartPage} />
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
    </Provider>
  </>,
  document.getElementById("root")
);

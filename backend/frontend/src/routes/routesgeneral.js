import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
//protected routes
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
//excel routes
import Exceluploadusers from "views/excelpages/ExcelUploadUsers"
import Exceluploadjobs from "views/excelpages/ExcelUploadJobs"

const routesgeneral =
    (
        <>
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
            <LoggedinRoute path="/dashboard/:unittype/:unitid" exact component={DashboardPage} />
            <LoggedinRoute path="/subunitspage/:unittype/:unitid" exact component={SubUnitsPage} />
            <LoggedinRoute path="/zminotpage/:unittype/:unitid" exact component={ZminotPage} />
            <LoggedinRoute path="/unittreepage/:unittype/:unitid" exact component={UnitTreePage} />
            {/*///////////////////////////////////////////LoggedIn Routes/////////////////////////////////////////////////*/}

            {/*////////////////////////////////////////Excel Reading//////////////////////////////////////////////////*/}
            <Route path="/exceluploadusers" exact component={Exceluploadusers} />
            <Route path="/exceluploadjobs" exact component={Exceluploadjobs} />
            {/*////////////////////////////////////////Excel Reading//////////////////////////////////////////////////*/}
        </>
    )

export default routesgeneral;
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Router, Route, Switch, Redirect, withRouter } from "react-router-dom";

import LoggedinRoute from "auth/LoggedinRoute";
import UnloggedinRoute from "auth/UnloggedinRoute";
import AdminRoute from "auth/AdminRoute.js";
import CandidateRoute from "auth/CandidateRoute";
import UnitRoute from "auth/UnitRoute";

import SignIn from "views/general/authentication/SignInForm";
import AdminSignIn from "views/general/authentication/AdminSignInForm";
import SignUp from "views/general/authentication/SignUpForm";

import ManageUsers from "views/general/authentication/manageusers/ManageUsers";
import EditUser from "views/general/authentication/EditUserForm";
import ManageJobs from "views/general/adminpages/managejobs/ManageJobs";
import EditJob from "views/general/adminpages/managejobs/EditJobForm";

import AdminDashboard from "views/general/adminpages/admindashboard/AdminDashboard";
import MahzorimPage from "views/general/adminpages/mahzorimpage/MahzorimPage";
import UnitDashboard from "views/general/unitpages/unitdashboard/UnitDashboard";
import CandidateDashboard from "views/general/candidatepages/candidatedashboard/CandidateDashboard";
import CandidatePreferenceForm from "views/general/candidatepages/candidatepreferenceform/CandidatePreferenceForm";
import MahzorForm from "views/general/adminpages/mahzorform/MahzorForm3";
import Usermahzorimpage from "views/general/candidatepages/usermahzorimpage/Usermahzorimpage";
import JobsByMahzor from "views/general/JobsByMahzor";
import JobsByMahzorAndUnit from "views/general/JobsByMahzorAndUnit";
import DisplayMahzor from "views/general/adminpages/displaymahzor/DisplayMahzor";
import DisplayJob from "views/general/DisplayJob";
import Unitmahzorimpage from "views/general/unitpages/unitmahzorimpage/Unitmahzorimpage";
import UnitPreferenceForm from "views/general/unitpages/unitpreferenceform/UnitPreferenceForm";

import EditEshkolForm from "views/general/adminpages/editeshkol/EditEshkolForm";
import DisplayMahzorEshkols from "views/general/adminpages/displaymahzoreshkols/DisplayMahzorEshkols";

import ProfilePage from "views/general/generalpages/profilepage/ProfilePage";
import TafkidipediaPage from "views/general/generalpages/tafkidipediapage/tafkidipediapage";

import Exceluploadusers from "views/general/excelpages/ExcelUploadUsers"
import Exceluploadjobs from "views/general/excelpages/ExcelUploadJobs"

import Mahzorcandidatespreferecespage from "views/general/adminpages/mahzorcandidatespreferencepage/mahzorcandidatespreferencepage";
import Mahzorcunitspreferecespage from "views/general/adminpages/mahzorunitspreferencespage/mahzorunitspreferencespage";

const routesgeneral =
    (
        <>
            {/*///////////////////////////////////////////UnLoggedIn Routes/////////////////////////////////////////////////*/}
            <UnloggedinRoute path="/signin" exact component={SignIn} />
            <UnloggedinRoute path="/adminsignin" exact component={AdminSignIn} />
            <UnloggedinRoute path="/signup" exact component={SignUp} />
            {/*///////////////////////////////////////////UnLoggedIn Routes/////////////////////////////////////////////////*/}
            {/*////////////////////////////////////////Excel Reading//////////////////////////////////////////////////*/}
            <Route path="/exceluploadusers" exact component={Exceluploadusers} />
            <Route path="/exceluploadjobs" exact component={Exceluploadjobs} />
            {/*////////////////////////////////////////Excel Reading//////////////////////////////////////////////////*/}

            {/*///////////////////////////////////////////LoggedIn Routes/////////////////////////////////////////////////*/}
            <LoggedinRoute path="/jobsbymahzor/:mahzorid" exact component={JobsByMahzor} />
            <LoggedinRoute path="/jobsbymahzorandunit/:mahzorid/:unitid" exact component={JobsByMahzorAndUnit} />
            <LoggedinRoute path="/displayjob/:jobid" exact component={DisplayJob} />

            <LoggedinRoute path="/profilepage/:userid" exact component={ProfilePage} />
            <LoggedinRoute path="/tafkidipedia" exact component={TafkidipediaPage} />
            {/*///////////////////////////////////////////LoggedIn Routes/////////////////////////////////////////////////*/}

            {/*///////////////////////////////////////////Form Routes/////////////////////////////////////////////////*/}
            <LoggedinRoute path="/mahzorform/:mahzorid" exact component={MahzorForm} />
            {/*///////////////////////////////////////////Form Routes/////////////////////////////////////////////////*/}

            {/*///////////////////////////////////////////Admin Routes/////////////////////////////////////////////////*/}
            <AdminRoute path="/manageusers" exact component={ManageUsers} />
            <AdminRoute path="/edituser/:userid" exact component={EditUser} />

            <AdminRoute path="/managejobs" exact component={ManageJobs} />
            <AdminRoute path="/editjob/:jobid" exact component={EditJob} />

            <AdminRoute path="/dashboard" exact component={AdminDashboard} />
            <AdminRoute path="/mahzorimpage" exact component={MahzorimPage} />
            <AdminRoute path="/displaymahzor/:mahzorid" exact component={DisplayMahzor} />

            <AdminRoute path="/editeshkol/:iseshkol/:eshkolid" exact component={EditEshkolForm} />
            <Route path="/displaymahzoreshkols/:iseshkols/:mahzorid" exact component={DisplayMahzorEshkols} />

            <AdminRoute path="/mahzorcandidatespreferecespage/:mahzorid" exact component={Mahzorcandidatespreferecespage} />
            <AdminRoute path="/mahzorunitspreferecespage/:mahzorid" exact component={Mahzorcunitspreferecespage} />
            {/*///////////////////////////////////////////Admin Routes/////////////////////////////////////////////////*/}

            {/*////////////////////////////////////////Unit User//////////////////////////////////////////////////*/}
            <UnitRoute path="/unitdashboard/:unitid" exact component={UnitDashboard} />
            <UnitRoute path="/unitmahzorimpage/:unitid" exact component={Unitmahzorimpage} />
            <UnitRoute path="/unitpreferenceform/:mahzorid/:unitid/:jobid" exact component={UnitPreferenceForm} />
            {/*////////////////////////////////////////Unit User//////////////////////////////////////////////////*/}

            {/*////////////////////////////////////////Candidate User//////////////////////////////////////////////////*/}
            <CandidateRoute path="/candidatedashboard/:candidateid" exact component={CandidateDashboard} />
            <CandidateRoute path="/usermahzorimpage/:userid" exact component={Usermahzorimpage} />
            <CandidateRoute path="/candidatepreferenceform/:mahzorid/:candidateid" exact component={CandidatePreferenceForm} />
            {/*////////////////////////////////////////Candidate User//////////////////////////////////////////////////*/}
        </>
    )

export default routesgeneral;
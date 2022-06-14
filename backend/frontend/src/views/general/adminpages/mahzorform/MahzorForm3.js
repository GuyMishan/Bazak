import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Container,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Alert,
  Spinner,
  Label,
  Col
} from "reactstrap";
import axios from 'axios';
import history from 'history.js'
import { toast } from "react-toastify";

import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";
import SettingModal from "../../../../components/general/modal/SettingModal";
import { OutTable, ExcelRenderer } from 'react-excel-renderer';

import MahzorDataComponent from './MahzorDataComponent3';
import MahzorCandidates3 from './MahzorCandidates3';
import MahzorCandidates3Kidum from './MahzorCandidates3Kidum';

const MahzorForm3 = ({ match }) => {
  //mahzor
  const [mahzordata, setMahzorData] = useState({})
  const [iskidum, setIsKidum] = useState(false)
  //mahzor

  //mahzor
  const [oldmahzordata, setOldmahzorData] = useState(undefined)
  //mahzor

  //candidates
  const [mahzororiginalcandidates, setMahzorOriginalCandidates] = useState([]);
  const [users, setUsers] = useState([]); //users to candidate
  //candidates

  //added jobs to mahzor
  const [mahzororiginaljobinmahzors, setMahzorOriginalJobInMhahzors] = useState([]);
  const [jobs, setJobs] = useState([]); //jobs to jobinmahzor
  //added jobs to mahzor

  //new
  const [population, setPopulation] = useState([]);
  const [movement, setMovement] = useState([]);
  //new

  //End Of Data!

  const loadmahzor = async () => {
    await axios.get(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`)
      .then(response => {
        let tempmahzor = response.data;
        IsMahzorKidum(tempmahzor)
        setOldmahzorData(tempmahzor);
        setMahzorData(tempmahzor);
        loadcandidates(tempmahzor);
        loadjobinmahzors(tempmahzor);
        // loadjobsinmahzorbymahzor(tempmahzor);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadcandidates = async (tempmahzor) => {
    let tempusersfromcandidates = [];

    let result = await axios.get(`http://localhost:8000/api/candidatesbymahzorid/${tempmahzor._id}`)
    let candidates = result.data;

    for (let i = 0; i < candidates.length; i++) {
      let tempcandidate = candidates[i].user;
      tempcandidate.candidateid = candidates[i]._id
      tempcandidate.movement = candidates[i].movement
      tempusersfromcandidates.push(tempcandidate)
    }
    setUsers(tempusersfromcandidates);
    setMahzorOriginalCandidates(tempusersfromcandidates)
  }

  const loadjobinmahzors = async (tempmahzor) => {
    let tempjobsfromjobinmahzors = [];

    let result = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${tempmahzor._id}`)
    let jobinmahzors = result.data;

    for (let i = 0; i < jobinmahzors.length; i++) {
      let tempjobinmahzor = jobinmahzors[i].job;
      tempjobinmahzor.jobinmahzorid = jobinmahzors[i]._id
      tempjobinmahzor.certain = jobinmahzors[i].certain
      tempjobsfromjobinmahzors.push(tempjobinmahzor)
    }
    setJobs(tempjobsfromjobinmahzors);
    setMahzorOriginalJobInMhahzors(tempjobsfromjobinmahzors)
  }

  async function IsMahzorKidum(tempmahzor) {
    let temp_population = undefined;
    for (let i = 0; i < population.length; i++) {
      if (tempmahzor.population == population[i]._id) {
        temp_population = population[i];
      }
    }
    if (temp_population != undefined) {
      if (temp_population.iskidum == true) {
        setIsKidum(true);
        if (match.params.mahzorid == 0) {
          loadusersbypopulation(tempmahzor.population);
        }
      }
      else {
        setIsKidum(false);
        if (match.params.mahzorid == 0) {
          loadusersbypopulation(tempmahzor.population);
        }
      }
    }
    // console.log(temp_population)
  }

  async function IsMahzorKidumAndLoadUsersByPopulation(population_id) {
    let temp_population = undefined;
    for (let i = 0; i < population.length; i++) {
      if (population_id == population[i]._id) {
        temp_population = population[i];
      }
    }
    if (temp_population != undefined) {
      if (temp_population.iskidum == true) {
        setIsKidum(true);
        if (match.params.mahzorid == 0) {
          loadusersbypopulation(population_id);
        }
      }
      else {
        setIsKidum(false);
        if (match.params.mahzorid == 0) {
          loadusersbypopulation(population_id);
        }
      }
    }
    // console.log(temp_population)
  }

  const IsjobCertainByUserMovement = (usermovement) => {
    for (let i = 0; i < movement.length; i++) {
      if (movement[i]._id == usermovement) {
        if ((movement[i].name == 'רוחב') || (movement[i].name == 'רוחב לקידום/רוחב') || (movement[i].name == 'שחרור') || (movement[i].name == 'פרישה')) {
          return "ודאי";
        }
        if ((movement[i].name == 'ממשיך/רוחב') || (movement[i].name == 'רוחב לקידום/ממשיך') || (movement[i].name == 'רוחב לקידום/ממשיך/רוחב')) {
          return "אופציה";
        }
        if ((movement[i].name == 'ממשיך')) {
          return "לא נפתח";
        }
      }
    }
  }

  const IsjobMovementthreeCursed = (usermovement) => {
    for (let i = 0; i < movement.length; i++) {
      if (movement[i]._id == usermovement) {
        if ((movement[i].name == 'רוחב לקידום/ממשיך') || (movement[i].name == 'שחרור') || (movement[i].name == 'פרישה')) {
          return true;
        }
      }
    }
    return false;
  }

  const loadpopulation = async () => {
    await axios.get(`http://localhost:8000/api/population`)
      .then(response => {
        setPopulation(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadmovement = async () => {
    await axios.get(`http://localhost:8000/api/movement`)
      .then(response => {
        setMovement(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadusersbypopulation = async (population) => {
    let candidaterole = '2'
    await axios.get(`http://localhost:8000/api/usersbyroleandpopulation/${candidaterole}/${population}`)
      .then(response => {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].movement = movement[0]._id
        }
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadjobsbypopulation = async (population) => {
    await axios.get(`http://localhost:8000/api/jobsbypopulation/${population}`)
      .then(response => {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].certain = 'ודאי'
        }

        let tempjobs = [];
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].status == "פעיל") {
            tempjobs.push(response.data[i])
          }
        }
        setJobs(tempjobs);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  async function init() {
    await loadmovement();
    await loadpopulation();
    if (match.params.mahzorid != 0) {
      await loadmahzor()
    }
  }

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    if (mahzordata.population != undefined) {
      setJobs([]);
      IsMahzorKidumAndLoadUsersByPopulation(mahzordata.population);
    }
  }, [mahzordata.population])

  function handleChangeMahzorData(evt) {
    const value = evt.target.value;
    if (value != "בחר")
      setMahzorData({ ...mahzordata, [evt.target.name]: value });
  }

  function handleChangeKidumPopulation(evt) {
    const value = evt.target.value;
    if (value != "בחר")
      loadjobsbypopulation(value)
  }

  function handleChangeUser(evt) {
    const namevalue = evt.target.name; //index of user in user arr
    const value = evt.target.value; //id of movement

    let tempusers = [...users];
    let tempuser = { ...tempusers[namevalue] };
    tempuser.movement = value;
    tempusers[namevalue] = tempuser;
    setUsers(tempusers);
  }

  function handleChangeJobCertain(evt) {
    const namevalue = evt.target.name; //index of job in job arr
    const value = evt.target.value; // ודאי או אופציה

    let tempjobs = [...jobs];
    let tempjob = { ...tempjobs[namevalue] };
    tempjob.certain = value;
    tempjobs[namevalue] = tempjob;
    setJobs(tempjobs);
  }

  function deletejobfromjobs(index) {//index = index in job arr to delete
    let tempjobs = [...jobs];
    tempjobs.splice(index, 1)
    setJobs(tempjobs);
  }

  const isDuplicate = (data, obj) => {
    let flag = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id == obj._id) {
        flag = true
      }
    }
    return flag;
  }

  async function SerachAndAddJobToJobsList(jobid) {
    let result = await axios.get(`http://localhost:8000/api/jobbyjobcode/${jobid}`)
    let tempjobdata = result.data;

    if (tempjobdata.length > 0) {
      if (tempjobdata[0].status == "פעיל") {
        if (isDuplicate(jobs, tempjobdata[0]) == false) {
          tempjobdata[0].certain = 'ודאי'
          let tempjobs = [...jobs];
          tempjobs.push(tempjobdata[0])
          setJobs(tempjobs);
        }
        else {
          toast.error("תפקיד כפול");
        }
      }
      else {
        toast.error("תפקיד לא פעיל/חיצוני");
      }
    }
    else {
      toast.error("תפקיד לא נמצא");
    }
  }

  const clickSubmit = event => {
    if (CheckFormData()) {
      if (iskidum == false) {
        SubmitData()
      }
      else {
        SubmitDataKidum()
      }
      toast.success("המחזור עודכן בהצלחה")
      history.push(`/mahzorimpage`);
    }
    else {
      toast.error("שגיאה בטופס")
    }
  }

  function CheckFormData() {
    let flag = true;
    let error = "";

    if (((mahzordata.population == undefined) || (mahzordata.population == "")) || ((mahzordata.season == undefined) || (mahzordata.season == "")) || ((mahzordata.status == undefined) || (mahzordata.status == "")) || ((mahzordata.numberofjobpicks == undefined) || (mahzordata.numberofjobpicks == ""))) {
      error += "פרטים כלליים שגויים"
      flag = false;
    }
    return flag;
  }

  async function SubmitData() {
    let tempmahzordata;
    if (match.params.mahzorid == 0) { //new mahzor
      let result = await axios.post("http://localhost:8000/api/mahzor", mahzordata);
      tempmahzordata = result.data;
    }
    else { // update mahzor
      let tempmahzorwithdeleteid = mahzordata;
      delete tempmahzorwithdeleteid._id;
      let result = await axios.put(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`, tempmahzorwithdeleteid);
      tempmahzordata = result.data;
    }

    //candidates
    let originalandnew = [];//to do nothing
    let originalandnewchanged = [];//to update
    let originalandnotnew = [];//to delete
    let notoriginalandnew = [];//to add

    for (let i = 0; i < mahzororiginalcandidates.length; i++) {
      let flag = false;
      let movementchangeflag = -1;
      for (let j = 0; j < users.length; j++) {
        if (mahzororiginalcandidates[i]._id == users[j]._id) {
          flag = true;
          if (mahzororiginalcandidates[i].movement != users[j].movement) {
            movementchangeflag = j;
          }
        }
      }
      if (flag == true) {
        if (movementchangeflag != -1) {
          let tempcandidate = { ...users[movementchangeflag] }
          tempcandidate.candidateid = mahzororiginalcandidates[i].candidateid
          originalandnewchanged.push(tempcandidate)
        }
        else {
          originalandnew.push(mahzororiginalcandidates[i])
        }
      }
      else {
        originalandnotnew.push(mahzororiginalcandidates[i])
      }
    }

    for (let i = 0; i < users.length; i++) {
      let flag = false;
      for (let j = 0; j < mahzororiginalcandidates.length; j++) {
        if (users[i]._id == mahzororiginalcandidates[j]._id) {
          flag = true;
        }
      }
      if (flag == false) {
        notoriginalandnew.push(users[i])
      }
      else {
        //nothing
      }
    }
    console.log("originalandnew")
    console.log(originalandnew)
    console.log("originalandnewchanged")
    console.log(originalandnewchanged)
    console.log("originalandnotnew")
    console.log(originalandnotnew)
    console.log("notoriginalandnew")
    console.log(notoriginalandnew)

    //originalandnew to do nothing

    for (let i = 0; i < originalandnewchanged.length; i++) { //update candidates thats in db but changed
      let tempcandidate = {};
      tempcandidate.mahzor = tempmahzordata._id;
      tempcandidate.user = originalandnewchanged[i]._id;
      tempcandidate.movement = originalandnewchanged[i].movement;
      let result = await axios.put(`http://localhost:8000/api/candidate/${originalandnewchanged[i].candidateid}`, tempcandidate);
    }

    for (let i = 0; i < notoriginalandnew.length; i++) { //add candidates thats no in db
      let tempcandidate = {};
      tempcandidate.mahzor = tempmahzordata._id;
      tempcandidate.user = notoriginalandnew[i]._id;
      tempcandidate.movement = notoriginalandnew[i].movement;
      let result = await axios.post(`http://localhost:8000/api/candidate`, tempcandidate);
    }

    for (let i = 0; i < originalandnotnew.length; i++) {//delete candidates thats in db and unwanted
      let result = await axios.delete(`http://localhost:8000/api/candidate/${originalandnotnew[i].candidateid}`);
    }
    //candidates

    //jobs

    //jobs by candidates

    //originalandnew to do nothing

    for (let i = 0; i < originalandnewchanged.length; i++) { //update jobinmahzors thats in db but changed
      let tempjobinmahzor = {};
      tempjobinmahzor.mahzor = tempmahzordata._id;
      tempjobinmahzor.job = originalandnewchanged[i].job;
      tempjobinmahzor.certain = IsjobCertainByUserMovement(originalandnewchanged[i].movement);
      let result;

      //get old jobinmahzor
      let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`);
      let tempoldjobinmahzor = result1.data[0];
      //get job for status
      let res1 = await axios.get(`http://localhost:8000/api/job/${originalandnewchanged[i].job}`);
      let tempjobresult = res1.data[0];

      if (tempjobinmahzor.certain != 'לא נפתח') {
        //try to update jobinmahzor
        result = await axios.put(`http://localhost:8000/api/updatejobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`, tempjobinmahzor);

        if (result.data.nModified == 0) // ממשיך -> ודאי/אופציה
        {
          if (!tempoldjobinmahzor) {
            if (tempjobresult.status == "פעיל") {
              console.log("ממשיך -> ודאי/אופציה")
              //create jobinmahzor
              result = await axios.post(`http://localhost:8000/api/jobinmahzor`, tempjobinmahzor);
              if (mahzordata.status >= 3)//check status of mahzor  
              {
                let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
                let tempeshkolbymahzorid = response.data;
                if (tempeshkolbymahzorid.length > 0)//check if eshkols created already
                {
                  let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
                  let response1 = await axios.post(`http://localhost:8000/api/eshkol`, tempmahzoreshkol)
                }
                if (mahzordata.status >= 5)//check status of mahzor  
                {
                  let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
                  let tempeshkolbymahzorid = response.data;
                  if (tempeshkolbymahzorid.length > 0)//check if finaleshkols created already
                  {
                    let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
                    let response1 = await axios.post(`http://localhost:8000/api/finaleshkol`, tempmahzoreshkol)
                  }
                }
              }
            }
          }
          else { // ודאי->ודאי / אופציה->אופציה
            console.log("ודאי -> ודאי / אופציה -> אופציה")
            if (IsjobMovementthreeCursed(originalandnewchanged[i].movement)) {
              console.log("3 מקוללים")
              //delete candidatepreference of candidate because of movement  + rankings
              if (mahzordata.status >= 2) {
                let response331 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
                let tempcandidatespreferencesdata = response331.data;

                for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
                  if (tempcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
                    for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                      //delete preferenceranking
                      let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].certjobpreferences[k]}`);
                    }
                    for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                      //delete preferenceranking
                      let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
                    }
                    let result8 = await axios.delete(`http://localhost:8000/api/candidatepreference/${tempcandidatespreferencesdata[j]._id}`);
                  }
                }
                if (mahzordata.status >= 4) {
                  let response332 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
                  let tempfinalcandidatespreferencesdata = response332.data;

                  for (let j = 0; j < tempfinalcandidatespreferencesdata.length; j++) {
                    if (tempfinalcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
                      for (let k = 0; k < tempfinalcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                        //delete preferenceranking
                        let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].certjobpreferences[k]}`);
                      }
                      for (let k = 0; k < tempfinalcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                        //delete preferenceranking
                        let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
                      }
                      let result8 = await axios.delete(`http://localhost:8000/api/finalcandidatepreference/${tempfinalcandidatespreferencesdata[j]._id}`);
                    }
                  }
                }
              }

              //delete unitpreference + rankings related to candidate
              if (mahzordata.status >= 2) {
                let response7 = await axios.get(`http://localhost:8000/api/unitpreferencebymahzorid/${match.params.mahzorid}`)
                let tempunitpreferencesdata = response7.data;

                for (let j = 0; j < tempunitpreferencesdata.length; j++) {
                  let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

                  for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                    let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                    if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                      let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                      tempunitpreference_preferencerankings.splice(k, 1)
                    }
                  }

                  let tempunitpreference = tempunitpreferencesdata[j];
                  let tempunitpreference_id = tempunitpreference._id;
                  tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
                  delete tempunitpreference._id;
                  let response6 = await axios.put(`http://localhost:8000/api/unitpreference/${tempunitpreference_id}`, tempunitpreference);
                }

                if (mahzordata.status >= 4) {
                  let response7 = await axios.get(`http://localhost:8000/api/finalunitpreferencebymahzorid/${match.params.mahzorid}`)
                  let tempunitpreferencesdata = response7.data;

                  for (let j = 0; j < tempunitpreferencesdata.length; j++) {
                    let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

                    for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                      let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                      if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                        let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                        tempunitpreference_preferencerankings.splice(k, 1)
                      }
                    }

                    let tempunitpreference = tempunitpreferencesdata[j];
                    let tempunitpreference_id = tempunitpreference._id;
                    tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
                    delete tempunitpreference._id;
                    let response6 = await axios.put(`http://localhost:8000/api/finalunitpreference/${tempunitpreference_id}`, tempunitpreference);
                  }
                }
              }

              //run over eshkols and delete the candidate in all eshkols based on mahzor stage!!!!!!
              if (mahzordata.status >= 3) {
                let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
                let tempeshkolbymahzorid = response.data;

                for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
                  let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
                  for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
                    if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                      let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                      tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
                    }
                  }
                  if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
                    let tempeshkoltoupdate = tempeshkolbymahzorid[j];
                    let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
                    tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
                    delete tempeshkoltoupdate._id;
                    let response14 = await axios.put(`http://localhost:8000/api/eshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
                  }
                }
                if (mahzordata.status >= 5) {
                  let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
                  let tempeshkolbymahzorid = response.data;

                  for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
                    let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
                    for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
                      if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                        let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                        tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
                      }
                    }
                    if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
                      let tempeshkoltoupdate = tempeshkolbymahzorid[j];
                      let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
                      tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
                      delete tempeshkoltoupdate._id;
                      let response14 = await axios.put(`http://localhost:8000/api/finaleshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
                    }
                  }
                }
              }
            }
          }
        }
        else // אופציה -> ודאי / ודאי -> אופציה 
        {
          console.log("אופציה -> ודאי / ודאי -> אופציה")
          //get updated jobinmahzor
          let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`);
          let tempupdatedjobinmahzor = result1.data[0];

          if (mahzordata.status >= 2) {
            //update candidatepreferences related to jobinmahzor
            let response17 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
            let tempcandidatespreferencestoupdate = response17.data;

            for (let j = 0; j < tempcandidatespreferencestoupdate.length; j++) {
              let ischangedcandidatepreference = false;
              let tempcandidatespreference_cerjobprefs = tempcandidatespreferencestoupdate[j].certjobpreferences;
              let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencestoupdate[j].noncertjobpreferences;

              if (tempupdatedjobinmahzor.certain == 'ודאי') {
                for (let k = 0; k < tempcandidatespreferencestoupdate[j].noncertjobpreferences.length; k++) {
                  let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].noncertjobpreferences[k]}`);
                  if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                    let tempcertjobpreferencerankingid = tempcandidatespreference_noncerjobprefs[k]
                    tempcandidatespreference_noncerjobprefs.splice(k, 1);
                    tempcandidatespreference_cerjobprefs.push(tempcertjobpreferencerankingid);
                    ischangedcandidatepreference = true;

                  }
                }
              }
              if (tempupdatedjobinmahzor.certain == 'אופציה') {
                for (let k = 0; k < tempcandidatespreferencestoupdate[j].certjobpreferences.length; k++) {
                  let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].certjobpreferences[k]}`);
                  if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                    let tempnoncertjobpreferencerankingid = tempcandidatespreference_cerjobprefs[k]
                    tempcandidatespreference_cerjobprefs.splice(k, 1);
                    tempcandidatespreference_noncerjobprefs.push(tempnoncertjobpreferencerankingid);
                    ischangedcandidatepreference = true;
                  }
                }
              }

              if (ischangedcandidatepreference) {
                //fix rankings ranks......
                let tempcandidatespreference = tempcandidatespreferencestoupdate[j];
                let tempcandidatespreference_id = tempcandidatespreference._id;
                tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
                tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;

                for (let k = 0; k < tempcandidatespreference_cerjobprefs.length; k++) {
                  let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`);
                  let tempcandidatespreferenceranking = result8.data;
                  if (tempcandidatespreferenceranking.rank != k + 1) {
                    tempcandidatespreferenceranking.rank = k + 1;
                    let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`, tempcandidatespreferenceranking);
                  }
                }
                for (let k = 0; k < tempcandidatespreference_noncerjobprefs.length; k++) {
                  let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`);
                  let tempcandidatespreferenceranking = result8.data;
                  if (tempcandidatespreferenceranking.rank != k + 1) {
                    tempcandidatespreferenceranking.rank = k + 1;
                    let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`, tempcandidatespreferenceranking);
                  }
                }
                delete tempcandidatespreference._id;
                let response6 = await axios.put(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
              }
            }
            if (mahzordata.status >= 4) {
              //update candidatepreferences related to jobinmahzor
              let response17 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
              let tempcandidatespreferencestoupdate = response17.data;

              for (let j = 0; j < tempcandidatespreferencestoupdate.length; j++) {
                let ischangedcandidatepreference = false;
                let tempcandidatespreference_cerjobprefs = tempcandidatespreferencestoupdate[j].certjobpreferences;
                let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencestoupdate[j].noncertjobpreferences;

                if (tempupdatedjobinmahzor.certain == 'ודאי') {
                  for (let k = 0; k < tempcandidatespreferencestoupdate[j].noncertjobpreferences.length; k++) {
                    let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].noncertjobpreferences[k]}`);
                    if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                      let tempcertjobpreferencerankingid = tempcandidatespreference_noncerjobprefs[k]
                      tempcandidatespreference_noncerjobprefs.splice(k, 1);
                      tempcandidatespreference_cerjobprefs.push(tempcertjobpreferencerankingid);
                      ischangedcandidatepreference = true;

                    }
                  }
                }
                if (tempupdatedjobinmahzor.certain == 'אופציה') {
                  for (let k = 0; k < tempcandidatespreferencestoupdate[j].certjobpreferences.length; k++) {
                    let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].certjobpreferences[k]}`);
                    if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                      let tempnoncertjobpreferencerankingid = tempcandidatespreference_cerjobprefs[k]
                      tempcandidatespreference_cerjobprefs.splice(k, 1);
                      tempcandidatespreference_noncerjobprefs.push(tempnoncertjobpreferencerankingid);
                      ischangedcandidatepreference = true;
                    }
                  }
                }

                if (ischangedcandidatepreference) {
                  //fix rankings ranks......
                  let tempcandidatespreference = tempcandidatespreferencestoupdate[j];
                  let tempcandidatespreference_id = tempcandidatespreference._id;
                  tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
                  tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;

                  for (let k = 0; k < tempcandidatespreference_cerjobprefs.length; k++) {
                    let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`);
                    let tempcandidatespreferenceranking = result8.data;
                    if (tempcandidatespreferenceranking.rank != k + 1) {
                      tempcandidatespreferenceranking.rank = k + 1;
                      let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`, tempcandidatespreferenceranking);
                    }
                  }
                  for (let k = 0; k < tempcandidatespreference_noncerjobprefs.length; k++) {
                    let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`);
                    let tempcandidatespreferenceranking = result8.data;
                    if (tempcandidatespreferenceranking.rank != k + 1) {
                      tempcandidatespreferenceranking.rank = k + 1;
                      let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`, tempcandidatespreferenceranking);
                    }
                  }
                  delete tempcandidatespreference._id;
                  let response6 = await axios.put(`http://localhost:8000/api/finalcandidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
                }
              }
            }
          }
          if (IsjobMovementthreeCursed(originalandnewchanged[i].movement)) {
            console.log("3 מקוללים")
            //delete candidatepreference of candidate because of movement  + rankings
            if (mahzordata.status >= 2) {
              let response331 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
              let tempcandidatespreferencesdata = response331.data;

              for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
                if (tempcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
                  for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                    //delete preferenceranking
                    let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].certjobpreferences[k]}`);
                  }
                  for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                    //delete preferenceranking
                    let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
                  }
                  let result8 = await axios.delete(`http://localhost:8000/api/candidatepreference/${tempcandidatespreferencesdata[j]._id}`);
                }
              }
              if (mahzordata.status >= 4) {
                let response332 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
                let tempfinalcandidatespreferencesdata = response332.data;

                for (let j = 0; j < tempfinalcandidatespreferencesdata.length; j++) {
                  if (tempfinalcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
                    for (let k = 0; k < tempfinalcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                      //delete preferenceranking
                      let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].certjobpreferences[k]}`);
                    }
                    for (let k = 0; k < tempfinalcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                      //delete preferenceranking
                      let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
                    }
                    let result8 = await axios.delete(`http://localhost:8000/api/finalcandidatepreference/${tempfinalcandidatespreferencesdata[j]._id}`);
                  }
                }
              }
            }

            //delete unitpreference + rankings related to candidate
            if (mahzordata.status >= 2) {
              let response7 = await axios.get(`http://localhost:8000/api/unitpreferencebymahzorid/${match.params.mahzorid}`)
              let tempunitpreferencesdata = response7.data;

              for (let j = 0; j < tempunitpreferencesdata.length; j++) {
                let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

                for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                  let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                  if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                    let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                    tempunitpreference_preferencerankings.splice(k, 1)
                  }
                }

                let tempunitpreference = tempunitpreferencesdata[j];
                let tempunitpreference_id = tempunitpreference._id;
                tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
                delete tempunitpreference._id;
                let response6 = await axios.put(`http://localhost:8000/api/unitpreference/${tempunitpreference_id}`, tempunitpreference);
              }

              if (mahzordata.status >= 4) {
                let response7 = await axios.get(`http://localhost:8000/api/finalunitpreferencebymahzorid/${match.params.mahzorid}`)
                let tempunitpreferencesdata = response7.data;

                for (let j = 0; j < tempunitpreferencesdata.length; j++) {
                  let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

                  for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                    let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                    if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                      let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                      tempunitpreference_preferencerankings.splice(k, 1)
                    }
                  }

                  let tempunitpreference = tempunitpreferencesdata[j];
                  let tempunitpreference_id = tempunitpreference._id;
                  tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
                  delete tempunitpreference._id;
                  let response6 = await axios.put(`http://localhost:8000/api/finalunitpreference/${tempunitpreference_id}`, tempunitpreference);
                }
              }
            }

            //run over eshkols and delete the candidate in all eshkols based on mahzor stage!!!!!!
            if (mahzordata.status >= 3) {
              let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
              let tempeshkolbymahzorid = response.data;

              for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
                let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
                for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
                  if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                    let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                    tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
                  }
                }
                if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
                  let tempeshkoltoupdate = tempeshkolbymahzorid[j];
                  let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
                  tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
                  delete tempeshkoltoupdate._id;
                  let response14 = await axios.put(`http://localhost:8000/api/eshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
                }
              }
              if (mahzordata.status >= 5) {
                let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
                let tempeshkolbymahzorid = response.data;

                for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
                  let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
                  for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
                    if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                      let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                      tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
                    }
                  }
                  if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
                    let tempeshkoltoupdate = tempeshkolbymahzorid[j];
                    let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
                    tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
                    delete tempeshkoltoupdate._id;
                    let response14 = await axios.put(`http://localhost:8000/api/finaleshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
                  }
                }
              }
            }
          }
        }
      }
      else // ודאי/אופציה -> ממשיך
      {
        console.log("ודאי/אופציה -> ממשיך")
        //get jobinmahzor to delete
        let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`);
        let tempjobinmahzortodelete = result1.data[0];

        if (mahzordata.status >= 2) {
          //delete candidatepreferences + candidateprefrankings related to jobinmahzor
          let response3 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
          let tempcandidatespreferencesdata = response3.data;

          for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
            let tempcandidatespreference = tempcandidatespreferencesdata[j];
            let tempcandidatespreference_id = tempcandidatespreference._id;

            if (tempjobinmahzortodelete) {
              let tempcandidatespreference_cerjobprefs = tempcandidatespreferencesdata[j].certjobpreferences;
              let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencesdata[j].noncertjobpreferences;

              for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].certjobpreferences[k]}`);
                if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
                  let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
                  tempcandidatespreference_cerjobprefs.splice(k, 1)
                }
              }

              for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
                if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
                  let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
                  tempcandidatespreference_noncerjobprefs.splice(k, 1)
                }
              }
              tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
              tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;
              delete tempcandidatespreference._id;
              let response6 = await axios.put(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
            }

            //delete candidatepreference of candidate which his job is deleted  + rankings
            if (tempcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
              for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                //delete preferenceranking
                let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].certjobpreferences[k]}`);
              }
              for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                //delete preferenceranking
                let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
              }
              let result8 = await axios.delete(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`);
            }
          }

          if (mahzordata.status >= 4) {
            //delete finalcandidatepreferences + candidateprefrankings related to jobinmahzor
            let response31 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
            let tempfinalcandidatespreferencesdata = response31.data;

            for (let j = 0; j < tempfinalcandidatespreferencesdata.length; j++) {
              let tempcandidatespreference = tempfinalcandidatespreferencesdata[j];
              let tempcandidatespreference_id = tempcandidatespreference._id;

              if (tempjobinmahzortodelete) {
                let tempcandidatespreference_cerjobprefs = tempfinalcandidatespreferencesdata[j].certjobpreferences;
                let tempcandidatespreference_noncerjobprefs = tempfinalcandidatespreferencesdata[j].noncertjobpreferences;

                for (let k = 0; k < tempfinalcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                  let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].certjobpreferences[k]}`);
                  if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
                    let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
                    tempcandidatespreference_cerjobprefs.splice(k, 1)
                  }
                }

                for (let k = 0; k < tempfinalcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                  let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
                  if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
                    let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
                    tempcandidatespreference_noncerjobprefs.splice(k, 1)
                  }
                }
                tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
                tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;
                delete tempcandidatespreference._id;
                let response6 = await axios.put(`http://localhost:8000/api/finalcandidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
              }
              //delete candidatepreference of candidate which his job is deleted  + rankings
              if (tempfinalcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
                for (let k = 0; k < tempfinalcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                  //delete preferenceranking
                  let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].certjobpreferences[k]}`);
                }
                for (let k = 0; k < tempfinalcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                  //delete preferenceranking
                  let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
                }
                let result8 = await axios.delete(`http://localhost:8000/api/finalcandidatepreference/${tempcandidatespreference_id}`);
              }
            }
          }
        }

        if (tempjobinmahzortodelete) {
          //delete eshkol of jobinmahzor +delete candidatesineshkol of eshkol based on mahzor stage..
          if (mahzordata.status >= 3) {
            let response = await axios.get(`http://localhost:8000/api/eshkolbyjobinmahzorid/${tempjobinmahzortodelete._id}`)
            let tempeshkolbyjobinmahzorid = response.data[0];
            if (tempeshkolbyjobinmahzorid != null)//check if eshkol exists
            {
              if (tempeshkolbyjobinmahzorid.candidatesineshkol) {
                for (let j = 0; j < tempeshkolbyjobinmahzorid.candidatesineshkol.length; j++) {
                  //delete candidatesineshkol
                  let result9 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbyjobinmahzorid.candidatesineshkol[j]}`);
                }
              }
              let result10 = await axios.delete(`http://localhost:8000/api/eshkol/${tempeshkolbyjobinmahzorid._id}`);
            }
            if (mahzordata.status >= 5) {
              let response = await axios.get(`http://localhost:8000/api/finaleshkolbyjobinmahzorid/${tempjobinmahzortodelete._id}`)
              let tempfinaleshkolbyjobinmahzorid = response.data;
              if (tempfinaleshkolbyjobinmahzorid != null)//check if finaleshkol exists
              {
                if (tempeshkolbyjobinmahzorid.candidatesineshkol) {
                  for (let j = 0; j < tempfinaleshkolbyjobinmahzorid.candidatesinfinaleshkol.length; j++) {
                    //delete candidatesinfinaleshkol
                    let result11 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempfinaleshkolbyjobinmahzorid.candidatesinfinaleshkol[j]}`);
                  }
                }
                let result12 = await axios.delete(`http://localhost:8000/api/finaleshkol/${tempfinaleshkolbyjobinmahzorid._id}`);
              }
            }
          }
        }

        //run over eshkols and delete the candidate in all eshkols based on mahzor stage!!!!!!
        if (mahzordata.status >= 3) {
          let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
          let tempeshkolbymahzorid = response.data;

          for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
            let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
            for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
              if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
              }
            }
            if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
              let tempeshkoltoupdate = tempeshkolbymahzorid[j];
              let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
              tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
              delete tempeshkoltoupdate._id;
              let response14 = await axios.put(`http://localhost:8000/api/eshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
            }
          }
          if (mahzordata.status >= 5) {
            let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
            let tempeshkolbymahzorid = response.data;

            for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
              let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
              for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
                if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                  let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                  tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
                }
              }
              if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
                let tempeshkoltoupdate = tempeshkolbymahzorid[j];
                let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
                tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
                delete tempeshkoltoupdate._id;
                let response14 = await axios.put(`http://localhost:8000/api/finaleshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
              }
            }
          }
        }

        //delete unitpreference + rankings related to candidate
        if (mahzordata.status >= 2) {
          let response7 = await axios.get(`http://localhost:8000/api/unitpreferencebymahzorid/${match.params.mahzorid}`)
          let tempunitpreferencesdata = response7.data;

          for (let j = 0; j < tempunitpreferencesdata.length; j++) {
            let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

            for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
              let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
              if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                tempunitpreference_preferencerankings.splice(k, 1)
              }
            }

            let tempunitpreference = tempunitpreferencesdata[j];
            let tempunitpreference_id = tempunitpreference._id;
            tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
            delete tempunitpreference._id;
            let response6 = await axios.put(`http://localhost:8000/api/unitpreference/${tempunitpreference_id}`, tempunitpreference);

            if (tempjobinmahzortodelete) {
              //delete unitpreference + rankings of jobinmahzor
              if (tempunitpreferencesdata[j].jobinmahzor._id == tempjobinmahzortodelete._id) {
                for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                  //delete preferenceranking
                  let result7 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                }
                let result8 = await axios.delete(`http://localhost:8000/api/unitpreference/${tempunitpreference_id}`);
              }
            }
          }

          if (mahzordata.status >= 4) {
            let response7 = await axios.get(`http://localhost:8000/api/finalunitpreferencebymahzorid/${match.params.mahzorid}`)
            let tempunitpreferencesdata = response7.data;

            for (let j = 0; j < tempunitpreferencesdata.length; j++) {
              let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

              for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                  let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                  tempunitpreference_preferencerankings.splice(k, 1)
                }
              }

              let tempunitpreference = tempunitpreferencesdata[j];
              let tempunitpreference_id = tempunitpreference._id;
              tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
              delete tempunitpreference._id;
              let response6 = await axios.put(`http://localhost:8000/api/finalunitpreference/${tempunitpreference_id}`, tempunitpreference);

              if (tempjobinmahzortodelete) {
                //delete unitpreference + rankings of jobinmahzor
                if (tempunitpreferencesdata[j].jobinmahzor._id == tempjobinmahzortodelete._id) {
                  for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                    //delete preferenceranking
                    let result7 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                  }
                  let result8 = await axios.delete(`http://localhost:8000/api/finalunitpreference/${tempunitpreference_id}`);
                }
              }
            }
          }
        }

        //delete jobinmahzor
        let result2 = await axios.delete(`http://localhost:8000/api/deletejobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`);
      }
    }

    for (let i = 0; i < notoriginalandnew.length; i++) { //add jobinmahzors thats no in db
      let tempresult = await axios.get(`http://localhost:8000/api/job/${notoriginalandnew[i].job}`);
      if (tempresult.data[0] && tempresult.data[0].status == "פעיל") {
        let tempjobinmahzor = {};
        tempjobinmahzor.mahzor = tempmahzordata._id;
        tempjobinmahzor.job = notoriginalandnew[i].job;
        tempjobinmahzor.certain = IsjobCertainByUserMovement(notoriginalandnew[i].movement);
        let result;
        if (tempjobinmahzor.certain != 'לא נפתח')
          result = await axios.post(`http://localhost:8000/api/jobinmahzor`, tempjobinmahzor);
      }
    }

    for (let i = 0; i < originalandnotnew.length; i++) {//delete jobinmahzors thats in db and unwanted
      let result = await axios.delete(`http://localhost:8000/api/deletjobinmahzorbyjobidandmahzorid/${originalandnotnew[i].job}/${tempmahzordata._id}`);
    }
    //jobs by candidates

    //jobs by table

    let jobsoriginalandnew = [];//to do nothing
    let jobsoriginalandnewchanged = [];//to update
    let jobsoriginalandnotnew = [];//to delete
    let jobsnotoriginalandnew = [];//to add

    console.log(mahzororiginaljobinmahzors)
    console.log(jobs)
    
    for (let i = 0; i < jobs.length; i++) {
      if (!jobs[i].meaish) { // only if the job has no user meaish = job in table
        let flag = false;
        let certainchangeflag = -1;
        for (let j = 0; j < mahzororiginaljobinmahzors.length; j++) {
          if (jobs[i]._id == mahzororiginaljobinmahzors[j]._id) {
            flag = true;
            if (mahzororiginaljobinmahzors[j].certain != jobs[i].certain) {
              certainchangeflag = i;
            }
          }
        }
        if (flag == true) {
          if (certainchangeflag != -1) {
            let tempjob = { ...jobs[certainchangeflag] }
            jobsoriginalandnewchanged.push(tempjob)
          }
          else {
            jobsoriginalandnew.push(jobs[i])
          }
        }
        else {
          // jobsoriginalandnotnew.push(jobs[i])
        }
      }
    }

    for (let i = 0; i < jobs.length; i++) {
      let flag = false;
      if (jobs[i].status == 'פעיל') {
        for (let j = 0; j < mahzororiginaljobinmahzors.length; j++) {
          if (jobs[i]._id == mahzororiginaljobinmahzors[j]._id) {
            flag = true;
          }
        }
        if (flag == false) {
          jobsnotoriginalandnew.push(jobs[i])
        }
        else {
          //nothing
        }
      }
    }

    for (let i = 0; i < mahzororiginaljobinmahzors.length; i++) {
      let flag = false;
        for (let j = 0; j < jobs.length; j++) {
          if (mahzororiginaljobinmahzors[i]._id == jobs[j]._id) {
            flag = true;
          }
        }
        if (flag == false) {
          jobsoriginalandnotnew.push(mahzororiginaljobinmahzors[i])
        }
        else {
        //nothing
        }
    }

    console.log("jobsoriginalandnew")
    console.log(jobsoriginalandnew)
    console.log("jobsoriginalandnewchanged")
    console.log(jobsoriginalandnewchanged)
    console.log("jobsoriginalandnotnew")
    console.log(jobsoriginalandnotnew)
    console.log("jobsnotoriginalandnew")
    console.log(jobsnotoriginalandnew)

    //jobsoriginalandnew to do nothing

    for (let i = 0; i < jobsoriginalandnewchanged.length; i++) { //update jobinmahzors thats in db but changed --> originalandnewchanged
      let tempjobinmahzor = {};
      tempjobinmahzor.mahzor = tempmahzordata._id;
      tempjobinmahzor.job = jobsoriginalandnewchanged[i]._id;
      tempjobinmahzor.certain = jobsoriginalandnewchanged[i].certain;
      let result;

      if (tempjobinmahzor.certain != 'לא נפתח') {
        //get old jobinmahzor
        let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${tempjobinmahzor.job}/${tempmahzordata._id}`);
        let tempoldjobinmahzor = result1.data[0];
        //try to update jobinmahzor
        result = await axios.put(`http://localhost:8000/api/updatejobinmahzorbyjobidandmahzorid/${tempjobinmahzor.job}/${tempmahzordata._id}`, tempjobinmahzor);

        if (result.data.nModified == 0) // ממשיך -> ודאי/אופציה
        {
          if (!tempoldjobinmahzor) {
            console.log("ממשיך -> ודאי/אופציה")
            //create jobinmahzor
            result = await axios.post(`http://localhost:8000/api/jobinmahzor`, tempjobinmahzor);
            if (mahzordata.status >= 3)//check status of mahzor  
            {
              let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
              let tempeshkolbymahzorid = response.data;
              if (tempeshkolbymahzorid.length > 0)//check if eshkols created already
              {
                let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
                let response1 = await axios.post(`http://localhost:8000/api/eshkol`, tempmahzoreshkol)
              }
              if (mahzordata.status >= 5)//check status of mahzor  
              {
                let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
                let tempeshkolbymahzorid = response.data;
                if (tempeshkolbymahzorid.length > 0)//check if finaleshkols created already
                {
                  let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
                  let response1 = await axios.post(`http://localhost:8000/api/finaleshkol`, tempmahzoreshkol)
                }
              }
            }
          }
          else { // ודאי->ודאי / אופציה->אופציה
            console.log("ודאי -> ודאי / אופציה -> אופציה")
          }
        }
        else // אופציה -> ודאי / ודאי -> אופציה 
        {
          console.log("אופציה -> ודאי / ודאי -> אופציה")
          //get updated jobinmahzor
          let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${tempjobinmahzor.job}/${tempmahzordata._id}`);
          let tempupdatedjobinmahzor = result1.data[0];

          if (mahzordata.status >= 2) {
            //update candidatepreferences related to jobinmahzor
            let response17 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
            let tempcandidatespreferencestoupdate = response17.data;

            for (let j = 0; j < tempcandidatespreferencestoupdate.length; j++) {
              let ischangedcandidatepreference = false;
              let tempcandidatespreference_cerjobprefs = tempcandidatespreferencestoupdate[j].certjobpreferences;
              let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencestoupdate[j].noncertjobpreferences;

              if (tempupdatedjobinmahzor.certain == 'ודאי') {
                for (let k = 0; k < tempcandidatespreferencestoupdate[j].noncertjobpreferences.length; k++) {
                  let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].noncertjobpreferences[k]}`);
                  if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                    let tempcertjobpreferencerankingid = tempcandidatespreference_noncerjobprefs[k]
                    tempcandidatespreference_noncerjobprefs.splice(k, 1);
                    tempcandidatespreference_cerjobprefs.push(tempcertjobpreferencerankingid);
                    ischangedcandidatepreference = true;

                  }
                }
              }
              if (tempupdatedjobinmahzor.certain == 'אופציה') {
                for (let k = 0; k < tempcandidatespreferencestoupdate[j].certjobpreferences.length; k++) {
                  let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].certjobpreferences[k]}`);
                  if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                    let tempnoncertjobpreferencerankingid = tempcandidatespreference_cerjobprefs[k]
                    tempcandidatespreference_cerjobprefs.splice(k, 1);
                    tempcandidatespreference_noncerjobprefs.push(tempnoncertjobpreferencerankingid);
                    ischangedcandidatepreference = true;
                  }
                }
              }

              if (ischangedcandidatepreference) {
                //fix rankings ranks......
                let tempcandidatespreference = tempcandidatespreferencestoupdate[j];
                let tempcandidatespreference_id = tempcandidatespreference._id;
                tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
                tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;

                for (let k = 0; k < tempcandidatespreference_cerjobprefs.length; k++) {
                  let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`);
                  let tempcandidatespreferenceranking = result8.data;
                  if (tempcandidatespreferenceranking.rank != k + 1) {
                    tempcandidatespreferenceranking.rank = k + 1;
                    let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`, tempcandidatespreferenceranking);
                  }
                }
                for (let k = 0; k < tempcandidatespreference_noncerjobprefs.length; k++) {
                  let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`);
                  let tempcandidatespreferenceranking = result8.data;
                  if (tempcandidatespreferenceranking.rank != k + 1) {
                    tempcandidatespreferenceranking.rank = k + 1;
                    let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`, tempcandidatespreferenceranking);
                  }
                }
                delete tempcandidatespreference._id;
                let response6 = await axios.put(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
              }
            }
            if (mahzordata.status >= 4) {
              //update candidatepreferences related to jobinmahzor
              let response17 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
              let tempcandidatespreferencestoupdate = response17.data;

              for (let j = 0; j < tempcandidatespreferencestoupdate.length; j++) {
                let ischangedcandidatepreference = false;
                let tempcandidatespreference_cerjobprefs = tempcandidatespreferencestoupdate[j].certjobpreferences;
                let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencestoupdate[j].noncertjobpreferences;

                if (tempupdatedjobinmahzor.certain == 'ודאי') {
                  for (let k = 0; k < tempcandidatespreferencestoupdate[j].noncertjobpreferences.length; k++) {
                    let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].noncertjobpreferences[k]}`);
                    if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                      let tempcertjobpreferencerankingid = tempcandidatespreference_noncerjobprefs[k]
                      tempcandidatespreference_noncerjobprefs.splice(k, 1);
                      tempcandidatespreference_cerjobprefs.push(tempcertjobpreferencerankingid);
                      ischangedcandidatepreference = true;

                    }
                  }
                }
                if (tempupdatedjobinmahzor.certain == 'אופציה') {
                  for (let k = 0; k < tempcandidatespreferencestoupdate[j].certjobpreferences.length; k++) {
                    let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].certjobpreferences[k]}`);
                    if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                      let tempnoncertjobpreferencerankingid = tempcandidatespreference_cerjobprefs[k]
                      tempcandidatespreference_cerjobprefs.splice(k, 1);
                      tempcandidatespreference_noncerjobprefs.push(tempnoncertjobpreferencerankingid);
                      ischangedcandidatepreference = true;
                    }
                  }
                }

                if (ischangedcandidatepreference) {
                  //fix rankings ranks......
                  let tempcandidatespreference = tempcandidatespreferencestoupdate[j];
                  let tempcandidatespreference_id = tempcandidatespreference._id;
                  tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
                  tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;

                  for (let k = 0; k < tempcandidatespreference_cerjobprefs.length; k++) {
                    let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`);
                    let tempcandidatespreferenceranking = result8.data;
                    if (tempcandidatespreferenceranking.rank != k + 1) {
                      tempcandidatespreferenceranking.rank = k + 1;
                      let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`, tempcandidatespreferenceranking);
                    }
                  }
                  for (let k = 0; k < tempcandidatespreference_noncerjobprefs.length; k++) {
                    let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`);
                    let tempcandidatespreferenceranking = result8.data;
                    if (tempcandidatespreferenceranking.rank != k + 1) {
                      tempcandidatespreferenceranking.rank = k + 1;
                      let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`, tempcandidatespreferenceranking);
                    }
                  }
                  delete tempcandidatespreference._id;
                  let response6 = await axios.put(`http://localhost:8000/api/finalcandidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
                }
              }
            }
          }
        }
      }
      else // ודאי/אופציה -> ממשיך
      {
        console.log("ודאי/אופציה -> ממשיך")
      }
    }

    for (let i = 0; i < jobsoriginalandnotnew.length; i++) {//delete jobinmahzors thats in db and unwanted
      let tempjobinmahzor = {};
      tempjobinmahzor.mahzor = tempmahzordata._id;
      tempjobinmahzor.job = jobsoriginalandnotnew[i]._id;
      tempjobinmahzor.certain = jobsoriginalandnotnew[i].certain;

      console.log("ודאי/אופציה -> ממשיך")
      //get jobinmahzor to delete
      let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${tempjobinmahzor.job}/${tempmahzordata._id}`);
      let tempjobinmahzortodelete = result1.data[0];

      if (mahzordata.status >= 2) {
        //delete candidatepreferences + candidateprefrankings related to jobinmahzor
        let response3 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
        let tempcandidatespreferencesdata = response3.data;

        for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
          let tempcandidatespreference_cerjobprefs = tempcandidatespreferencesdata[j].certjobpreferences;
          let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencesdata[j].noncertjobpreferences;

          for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
            let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].certjobpreferences[k]}`);
            if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
              let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
              tempcandidatespreference_cerjobprefs.splice(k, 1)
            }
          }

          for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
            let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
            if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
              let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
              tempcandidatespreference_noncerjobprefs.splice(k, 1)
            }
          }
          let tempcandidatespreference = tempcandidatespreferencesdata[j];
          let tempcandidatespreference_id = tempcandidatespreference._id;
          tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
          tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;
          delete tempcandidatespreference._id;
          let response6 = await axios.put(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
        }

        if (mahzordata.status >= 4) {
          //delete finalcandidatepreferences + candidateprefrankings related to jobinmahzor
          let response31 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
          let tempfinalcandidatespreferencesdata = response31.data;

          for (let j = 0; j < tempfinalcandidatespreferencesdata.length; j++) {
            let tempcandidatespreference_cerjobprefs = tempfinalcandidatespreferencesdata[j].certjobpreferences;
            let tempcandidatespreference_noncerjobprefs = tempfinalcandidatespreferencesdata[j].noncertjobpreferences;

            for (let k = 0; k < tempfinalcandidatespreferencesdata[j].certjobpreferences.length; k++) {
              let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].certjobpreferences[k]}`);
              if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
                let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
                tempcandidatespreference_cerjobprefs.splice(k, 1)
              }
            }

            for (let k = 0; k < tempfinalcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
              let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
              if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
                let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
                tempcandidatespreference_noncerjobprefs.splice(k, 1)
              }
            }
            let tempcandidatespreference = tempfinalcandidatespreferencesdata[j];
            let tempcandidatespreference_id = tempcandidatespreference._id;
            tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
            tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;
            delete tempcandidatespreference._id;
            let response6 = await axios.put(`http://localhost:8000/api/finalcandidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
          }
        }
      }

      //delete eshkol of jobinmahzor +delete candidatesineshkol of eshkol based on mahzor stage..
      if (mahzordata.status >= 3) {
        let response = await axios.get(`http://localhost:8000/api/eshkolbyjobinmahzorid/${tempjobinmahzortodelete._id}`)
        let tempeshkolbyjobinmahzorid = response.data[0];
        if (tempeshkolbyjobinmahzorid != null)//check if eshkol exists
        {
          if (tempeshkolbyjobinmahzorid.candidatesineshkol) {
            for (let j = 0; j < tempeshkolbyjobinmahzorid.candidatesineshkol.length; j++) {
              //delete candidatesineshkol
              let result9 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbyjobinmahzorid.candidatesineshkol[j]}`);
            }
          }
          let result10 = await axios.delete(`http://localhost:8000/api/eshkol/${tempeshkolbyjobinmahzorid._id}`);
        }
        if (mahzordata.status >= 5) {
          let response = await axios.get(`http://localhost:8000/api/finaleshkolbyjobinmahzorid/${tempjobinmahzortodelete._id}`)
          let tempfinaleshkolbyjobinmahzorid = response.data;
          if (tempfinaleshkolbyjobinmahzorid != null)//check if finaleshkol exists
          {
            if (tempeshkolbyjobinmahzorid.candidatesineshkol) {
              for (let j = 0; j < tempfinaleshkolbyjobinmahzorid.candidatesinfinaleshkol.length; j++) {
                //delete candidatesinfinaleshkol
                let result11 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempfinaleshkolbyjobinmahzorid.candidatesinfinaleshkol[j]}`);
              }
            }
            let result12 = await axios.delete(`http://localhost:8000/api/finaleshkol/${tempfinaleshkolbyjobinmahzorid._id}`);
          }
        }
      }

      //delete jobinmahzor
      let result2 = await axios.delete(`http://localhost:8000/api/deletejobinmahzorbyjobidandmahzorid/${tempjobinmahzor.job}/${tempmahzordata._id}`);
    }

    for (let i = 0; i < jobsnotoriginalandnew.length; i++) { //add jobinmahzors thats no in db
      let tempjobinmahzor = {};
      tempjobinmahzor.mahzor = tempmahzordata._id;
      tempjobinmahzor.job = jobsnotoriginalandnew[i]._id;
      tempjobinmahzor.certain = jobsnotoriginalandnew[i].certain;
      console.log("ממשיך -> ודאי/אופציה")
      //create jobinmahzor
      let result = await axios.post(`http://localhost:8000/api/jobinmahzor`, tempjobinmahzor);
      if (mahzordata.status >= 3)//check status of mahzor  
      {
        let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
        let tempeshkolbymahzorid = response.data;
        if (tempeshkolbymahzorid.length > 0)//check if eshkols created already
        {
          let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
          let response1 = await axios.post(`http://localhost:8000/api/eshkol`, tempmahzoreshkol)
        }
        if (mahzordata.status >= 5)//check status of mahzor  
        {
          let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
          let tempeshkolbymahzorid = response.data;
          if (tempeshkolbymahzorid.length > 0)//check if finaleshkols created already
          {
            let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
            let response1 = await axios.post(`http://localhost:8000/api/finaleshkol`, tempmahzoreshkol)
          }
        }
      }
    }
    //jobs by table

    //jobs

    if (mahzordata.status >= 3) {
      await CalculateUpdateMahzorEshkol();
      if (mahzordata.status >= 5) {
        await CalculateUpdateMahzorFinalEshkol();
      }
    }
  }

  async function SubmitDataKidum() {

    let tempmahzordata;
    if (match.params.mahzorid == 0) { //new mahzor
      let result = await axios.post("http://localhost:8000/api/mahzor", mahzordata);
      tempmahzordata = result.data;
    }
    else { // update mahzor
      let tempmahzorwithdeleteid = mahzordata;
      delete tempmahzorwithdeleteid._id;
      let result = await axios.put(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`, tempmahzorwithdeleteid);
      tempmahzordata = result.data;
    }

    //candidates
    let originalandnew = [];//to do nothing
    let originalandnewchanged = [];//to update
    let originalandnotnew = [];//to delete
    let notoriginalandnew = [];//to add

    for (let i = 0; i < mahzororiginalcandidates.length; i++) {
      let flag = false;
      let movementchangeflag = -1;
      for (let j = 0; j < users.length; j++) {
        if (mahzororiginalcandidates[i]._id == users[j]._id) {
          flag = true;
          if (mahzororiginalcandidates[i].movement != users[j].movement) {
            movementchangeflag = j;
          }
        }
      }
      if (flag == true) {
        if (movementchangeflag != -1) {
          let tempcandidate = { ...users[movementchangeflag] }
          tempcandidate.candidateid = mahzororiginalcandidates[i].candidateid
          originalandnewchanged.push(tempcandidate)
        }
        else {
          originalandnew.push(mahzororiginalcandidates[i])
        }
      }
      else {
        originalandnotnew.push(mahzororiginalcandidates[i])
      }
    }

    for (let i = 0; i < users.length; i++) {
      let flag = false;
      for (let j = 0; j < mahzororiginalcandidates.length; j++) {
        if (users[i]._id == mahzororiginalcandidates[j]._id) {
          flag = true;
        }
      }
      if (flag == false) {
        notoriginalandnew.push(users[i])
      }
      else {
        //nothing
      }
    }
    console.log("originalandnew")
    console.log(originalandnew)
    console.log("originalandnewchanged")
    console.log(originalandnewchanged)
    console.log("originalandnotnew")
    console.log(originalandnotnew)
    console.log("notoriginalandnew")
    console.log(notoriginalandnew)

    //originalandnew to do nothing

    for (let i = 0; i < originalandnewchanged.length; i++) { //update candidates thats in db but changed
      let tempcandidate = {};
      tempcandidate.mahzor = tempmahzordata._id;
      tempcandidate.user = originalandnewchanged[i]._id;
      tempcandidate.movement = originalandnewchanged[i].movement;
      let result = await axios.put(`http://localhost:8000/api/candidate/${originalandnewchanged[i].candidateid}`, tempcandidate);
    }

    for (let i = 0; i < originalandnewchanged.length; i++) { //update candidates data in db
      let tempjobinmahzor = {};
      tempjobinmahzor.mahzor = tempmahzordata._id;
      tempjobinmahzor.job = originalandnewchanged[i].job;
      tempjobinmahzor.certain = IsjobCertainByUserMovement(originalandnewchanged[i].movement);
      let result;

      if (tempjobinmahzor.certain != 'לא נפתח') {
        //get old jobinmahzor
        let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${originalandnewchanged[i].job}/${tempmahzordata._id}`);
        let tempoldjobinmahzor = result1.data[0];

        if (!tempoldjobinmahzor) {
          console.log("ממשיך -> ודאי/אופציה")
        }
        else { // ודאי->ודאי / אופציה->אופציה
          console.log("ודאי -> ודאי / אופציה -> אופציה")
          console.log("אופציה -> ודאי / ודאי -> אופציה")
          if (IsjobMovementthreeCursed(originalandnewchanged[i].movement)) {
            console.log("3 מקוללים")
            //delete candidatepreference of candidate because of movement  + rankings
            if (mahzordata.status >= 2) {
              let response331 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
              let tempcandidatespreferencesdata = response331.data;

              for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
                if (tempcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
                  for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                    //delete preferenceranking
                    let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].certjobpreferences[k]}`);
                  }
                  for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                    //delete preferenceranking
                    let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
                  }
                  let result8 = await axios.delete(`http://localhost:8000/api/candidatepreference/${tempcandidatespreferencesdata[j]._id}`);
                }
              }
              if (mahzordata.status >= 4) {
                let response332 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
                let tempfinalcandidatespreferencesdata = response332.data;

                for (let j = 0; j < tempfinalcandidatespreferencesdata.length; j++) {
                  if (tempfinalcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
                    for (let k = 0; k < tempfinalcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                      //delete preferenceranking
                      let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].certjobpreferences[k]}`);
                    }
                    for (let k = 0; k < tempfinalcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                      //delete preferenceranking
                      let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
                    }
                    let result8 = await axios.delete(`http://localhost:8000/api/finalcandidatepreference/${tempfinalcandidatespreferencesdata[j]._id}`);
                  }
                }
              }
            }

            //delete unitpreference + rankings related to candidate
            if (mahzordata.status >= 2) {
              let response7 = await axios.get(`http://localhost:8000/api/unitpreferencebymahzorid/${match.params.mahzorid}`)
              let tempunitpreferencesdata = response7.data;

              for (let j = 0; j < tempunitpreferencesdata.length; j++) {
                let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

                for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                  let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                  if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                    let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                    tempunitpreference_preferencerankings.splice(k, 1)
                  }
                }

                let tempunitpreference = tempunitpreferencesdata[j];
                let tempunitpreference_id = tempunitpreference._id;
                tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
                delete tempunitpreference._id;
                let response6 = await axios.put(`http://localhost:8000/api/unitpreference/${tempunitpreference_id}`, tempunitpreference);
              }

              if (mahzordata.status >= 4) {
                let response7 = await axios.get(`http://localhost:8000/api/finalunitpreferencebymahzorid/${match.params.mahzorid}`)
                let tempunitpreferencesdata = response7.data;

                for (let j = 0; j < tempunitpreferencesdata.length; j++) {
                  let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

                  for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                    let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                    if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                      let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                      tempunitpreference_preferencerankings.splice(k, 1)
                    }
                  }

                  let tempunitpreference = tempunitpreferencesdata[j];
                  let tempunitpreference_id = tempunitpreference._id;
                  tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
                  delete tempunitpreference._id;
                  let response6 = await axios.put(`http://localhost:8000/api/finalunitpreference/${tempunitpreference_id}`, tempunitpreference);
                }
              }
            }

            //run over eshkols and delete the candidate in all eshkols based on mahzor stage!!!!!!
            if (mahzordata.status >= 3) {
              let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
              let tempeshkolbymahzorid = response.data;

              for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
                let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
                for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
                  if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                    let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                    tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
                  }
                }
                if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
                  let tempeshkoltoupdate = tempeshkolbymahzorid[j];
                  let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
                  tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
                  delete tempeshkoltoupdate._id;
                  let response14 = await axios.put(`http://localhost:8000/api/eshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
                }
              }
              if (mahzordata.status >= 5) {
                let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
                let tempeshkolbymahzorid = response.data;

                for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
                  let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
                  for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
                    if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                      let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                      tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
                    }
                  }
                  if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
                    let tempeshkoltoupdate = tempeshkolbymahzorid[j];
                    let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
                    tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
                    delete tempeshkoltoupdate._id;
                    let response14 = await axios.put(`http://localhost:8000/api/finaleshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
                  }
                }
              }
            }
          }
        }
      }
      else // ודאי/אופציה -> ממשיך
      {
        console.log("ודאי/אופציה -> ממשיך")

        if (mahzordata.status >= 2) {
          let response3 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
          let tempcandidatespreferencesdata = response3.data;

          for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
            let tempcandidatespreference_cerjobprefs = tempcandidatespreferencesdata[j].certjobpreferences;
            let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencesdata[j].noncertjobpreferences;

            let tempcandidatespreference = tempcandidatespreferencesdata[j];
            let tempcandidatespreference_id = tempcandidatespreference._id;
            tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
            tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;
            delete tempcandidatespreference._id;
            let response6 = await axios.put(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);

            //delete candidatepreference of candidate which his job is deleted  + rankings
            if (tempcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
              for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                //delete preferenceranking
                let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].certjobpreferences[k]}`);
              }
              for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                //delete preferenceranking
                let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
              }
              let result8 = await axios.delete(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`);
            }
          }

          if (mahzordata.status >= 4) {
            let response31 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
            let tempfinalcandidatespreferencesdata = response31.data;

            for (let j = 0; j < tempfinalcandidatespreferencesdata.length; j++) {
              let tempcandidatespreference_cerjobprefs = tempfinalcandidatespreferencesdata[j].certjobpreferences;
              let tempcandidatespreference_noncerjobprefs = tempfinalcandidatespreferencesdata[j].noncertjobpreferences;

              let tempcandidatespreference = tempfinalcandidatespreferencesdata[j];
              let tempcandidatespreference_id = tempcandidatespreference._id;
              tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
              tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;
              delete tempcandidatespreference._id;
              let response6 = await axios.put(`http://localhost:8000/api/finalcandidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);

              //delete candidatepreference of candidate which his job is deleted  + rankings
              if (tempfinalcandidatespreferencesdata[j].candidate._id == originalandnewchanged[i].candidateid) {
                for (let k = 0; k < tempfinalcandidatespreferencesdata[j].certjobpreferences.length; k++) {
                  //delete preferenceranking
                  let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].certjobpreferences[k]}`);
                }
                for (let k = 0; k < tempfinalcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
                  //delete preferenceranking
                  let result7 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
                }
                let result8 = await axios.delete(`http://localhost:8000/api/finalcandidatepreference/${tempcandidatespreference_id}`);
              }
            }
          }
        }

        //run over eshkols and delete the candidate in all eshkols based on mahzor stage!!!!!!
        if (mahzordata.status >= 3) {
          let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
          let tempeshkolbymahzorid = response.data;

          for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
            let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
            for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
              if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
              }
            }
            if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
              let tempeshkoltoupdate = tempeshkolbymahzorid[j];
              let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
              tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
              delete tempeshkoltoupdate._id;
              let response14 = await axios.put(`http://localhost:8000/api/eshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
            }
          }
          if (mahzordata.status >= 5) {
            let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
            let tempeshkolbymahzorid = response.data;

            for (let j = 0; j < tempeshkolbymahzorid.length; j++) {
              let tempeshkolbymahzorid_candidatesineshkol = tempeshkolbymahzorid[j].candidatesineshkol;
              for (let k = 0; k < tempeshkolbymahzorid[j].candidatesineshkol.length; k++) {
                if (tempeshkolbymahzorid[j].candidatesineshkol[k].candidate == originalandnewchanged[i].candidateid) {
                  let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbymahzorid[j].candidatesineshkol[k]._id}`);
                  tempeshkolbymahzorid_candidatesineshkol.splice(k, 1)
                }
              }
              if (tempeshkolbymahzorid_candidatesineshkol.length != tempeshkolbymahzorid[j].candidatesineshkol) {
                let tempeshkoltoupdate = tempeshkolbymahzorid[j];
                let tempeshkoltoupdate_id = tempeshkoltoupdate._id;
                tempeshkoltoupdate.candidatesineshkol = tempeshkolbymahzorid_candidatesineshkol;
                delete tempeshkoltoupdate._id;
                let response14 = await axios.put(`http://localhost:8000/api/finaleshkol/${tempeshkoltoupdate_id}`, tempeshkoltoupdate);
              }
            }
          }
        }

        //delete unitpreference + rankings related to candidate
        if (mahzordata.status >= 2) {
          let response7 = await axios.get(`http://localhost:8000/api/unitpreferencebymahzorid/${match.params.mahzorid}`)
          let tempunitpreferencesdata = response7.data;

          for (let j = 0; j < tempunitpreferencesdata.length; j++) {
            let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

            for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
              let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
              if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                tempunitpreference_preferencerankings.splice(k, 1)
              }
            }

            let tempunitpreference = tempunitpreferencesdata[j];
            let tempunitpreference_id = tempunitpreference._id;
            tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
            delete tempunitpreference._id;
            let response6 = await axios.put(`http://localhost:8000/api/unitpreference/${tempunitpreference_id}`, tempunitpreference);
          }

          if (mahzordata.status >= 4) {
            let response7 = await axios.get(`http://localhost:8000/api/finalunitpreferencebymahzorid/${match.params.mahzorid}`)
            let tempunitpreferencesdata = response7.data;

            for (let j = 0; j < tempunitpreferencesdata.length; j++) {
              let tempunitpreference_preferencerankings = tempunitpreferencesdata[j].preferencerankings;

              for (let k = 0; k < tempunitpreferencesdata[j].preferencerankings.length; k++) {
                let result15 = await axios.get(`http://localhost:8000/api/unitpreferenceranking/${tempunitpreferencesdata[j].preferencerankings[k]._id}`);
                if (result15.data.candidate == originalandnewchanged[i].candidateid) {
                  let result16 = await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${result15.data._id}`);
                  tempunitpreference_preferencerankings.splice(k, 1)
                }
              }

              let tempunitpreference = tempunitpreferencesdata[j];
              let tempunitpreference_id = tempunitpreference._id;
              tempunitpreference.preferencerankings = tempunitpreference_preferencerankings;
              delete tempunitpreference._id;
              let response6 = await axios.put(`http://localhost:8000/api/finalunitpreference/${tempunitpreference_id}`, tempunitpreference);
            }
          }
        }
      }
    }

    for (let i = 0; i < notoriginalandnew.length; i++) { //add candidates thats no in db
      let tempcandidate = {};
      tempcandidate.mahzor = tempmahzordata._id;
      tempcandidate.user = notoriginalandnew[i]._id;
      tempcandidate.movement = notoriginalandnew[i].movement;
      let result = await axios.post(`http://localhost:8000/api/candidate`, tempcandidate);
    }

    for (let i = 0; i < originalandnotnew.length; i++) {//delete candidates thats in db and unwanted
      let result = await axios.delete(`http://localhost:8000/api/candidate/${originalandnotnew[i].candidateid}`);
    }
    //candidates

    //jobs
    let jobsoriginalandnew = [];//to do nothing
    let jobsoriginalandnewchanged = [];//to update
    let jobsoriginalandnotnew = [];//to delete
    let jobsnotoriginalandnew = [];//to add

    for (let i = 0; i < mahzororiginaljobinmahzors.length; i++) {
      let flag = false;
      let certainchangeflag = -1;
      for (let j = 0; j < jobs.length; j++) {
        if (mahzororiginaljobinmahzors[i]._id == jobs[j]._id) {
          flag = true;
          if (mahzororiginaljobinmahzors[i].certain != jobs[j].certain) {
            certainchangeflag = j;
          }
        }
      }
      if (flag == true) {
        if (certainchangeflag != -1) {
          let tempjob = { ...jobs[certainchangeflag] }
          jobsoriginalandnewchanged.push(tempjob)
        }
        else {
          jobsoriginalandnew.push(mahzororiginaljobinmahzors[i])
        }
      }
      else {
        jobsoriginalandnotnew.push(mahzororiginaljobinmahzors[i])
      }
    }

    for (let i = 0; i < jobs.length; i++) {
      let flag = false;
      if (jobs[i].status == "פעיל") {
        for (let j = 0; j < mahzororiginaljobinmahzors.length; j++) {
          if (jobs[i]._id == mahzororiginaljobinmahzors[j]._id) {
            flag = true;
          }
        }
        if (flag == false) {
          jobsnotoriginalandnew.push(jobs[i])
        }
        else {
          //nothing
        }
      }
    }
    console.log("jobsoriginalandnew")
    console.log(jobsoriginalandnew)
    console.log("jobsoriginalandnewchanged")
    console.log(jobsoriginalandnewchanged)
    console.log("jobsoriginalandnotnew")
    console.log(jobsoriginalandnotnew)
    console.log("jobsnotoriginalandnew")
    console.log(jobsnotoriginalandnew)

    //jobsoriginalandnew to do nothing

    for (let i = 0; i < jobsoriginalandnewchanged.length; i++) { //update jobinmahzors thats in db but changed --> originalandnewchanged
      let tempjobinmahzor = {};
      tempjobinmahzor.mahzor = tempmahzordata._id;
      tempjobinmahzor.job = jobsoriginalandnewchanged[i]._id;
      tempjobinmahzor.certain = jobsoriginalandnewchanged[i].certain;
      let result;

      if (tempjobinmahzor.certain != 'לא נפתח') {
        //get old jobinmahzor
        let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${tempjobinmahzor.job}/${tempmahzordata._id}`);
        let tempoldjobinmahzor = result1.data[0];
        //try to update jobinmahzor
        result = await axios.put(`http://localhost:8000/api/updatejobinmahzorbyjobidandmahzorid/${tempjobinmahzor.job}/${tempmahzordata._id}`, tempjobinmahzor);

        if (result.data.nModified == 0) // ממשיך -> ודאי/אופציה
        {
          if (!tempoldjobinmahzor) {
            console.log("ממשיך -> ודאי/אופציה")
            //create jobinmahzor
            result = await axios.post(`http://localhost:8000/api/jobinmahzor`, tempjobinmahzor);
            if (mahzordata.status >= 3)//check status of mahzor  
            {
              let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
              let tempeshkolbymahzorid = response.data;
              if (tempeshkolbymahzorid.length > 0)//check if eshkols created already
              {
                let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
                let response1 = await axios.post(`http://localhost:8000/api/eshkol`, tempmahzoreshkol)
              }
              if (mahzordata.status >= 5)//check status of mahzor  
              {
                let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
                let tempeshkolbymahzorid = response.data;
                if (tempeshkolbymahzorid.length > 0)//check if finaleshkols created already
                {
                  let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
                  let response1 = await axios.post(`http://localhost:8000/api/finaleshkol`, tempmahzoreshkol)
                }
              }
            }
          }
          else { // ודאי->ודאי / אופציה->אופציה
            console.log("ודאי -> ודאי / אופציה -> אופציה")
          }
        }
        else // אופציה -> ודאי / ודאי -> אופציה 
        {
          console.log("אופציה -> ודאי / ודאי -> אופציה")
          //get updated jobinmahzor
          let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${tempjobinmahzor.job}/${tempmahzordata._id}`);
          let tempupdatedjobinmahzor = result1.data[0];

          if (mahzordata.status >= 2) {
            //update candidatepreferences related to jobinmahzor
            let response17 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
            let tempcandidatespreferencestoupdate = response17.data;

            for (let j = 0; j < tempcandidatespreferencestoupdate.length; j++) {
              let ischangedcandidatepreference = false;
              let tempcandidatespreference_cerjobprefs = tempcandidatespreferencestoupdate[j].certjobpreferences;
              let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencestoupdate[j].noncertjobpreferences;

              if (tempupdatedjobinmahzor.certain == 'ודאי') {
                for (let k = 0; k < tempcandidatespreferencestoupdate[j].noncertjobpreferences.length; k++) {
                  let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].noncertjobpreferences[k]}`);
                  if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                    let tempcertjobpreferencerankingid = tempcandidatespreference_noncerjobprefs[k]
                    tempcandidatespreference_noncerjobprefs.splice(k, 1);
                    tempcandidatespreference_cerjobprefs.push(tempcertjobpreferencerankingid);
                    ischangedcandidatepreference = true;

                  }
                }
              }
              if (tempupdatedjobinmahzor.certain == 'אופציה') {
                for (let k = 0; k < tempcandidatespreferencestoupdate[j].certjobpreferences.length; k++) {
                  let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].certjobpreferences[k]}`);
                  if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                    let tempnoncertjobpreferencerankingid = tempcandidatespreference_cerjobprefs[k]
                    tempcandidatespreference_cerjobprefs.splice(k, 1);
                    tempcandidatespreference_noncerjobprefs.push(tempnoncertjobpreferencerankingid);
                    ischangedcandidatepreference = true;
                  }
                }
              }

              if (ischangedcandidatepreference) {
                //fix rankings ranks......
                let tempcandidatespreference = tempcandidatespreferencestoupdate[j];
                let tempcandidatespreference_id = tempcandidatespreference._id;
                tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
                tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;

                for (let k = 0; k < tempcandidatespreference_cerjobprefs.length; k++) {
                  let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`);
                  let tempcandidatespreferenceranking = result8.data;
                  if (tempcandidatespreferenceranking.rank != k + 1) {
                    tempcandidatespreferenceranking.rank = k + 1;
                    let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`, tempcandidatespreferenceranking);
                  }
                }
                for (let k = 0; k < tempcandidatespreference_noncerjobprefs.length; k++) {
                  let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`);
                  let tempcandidatespreferenceranking = result8.data;
                  if (tempcandidatespreferenceranking.rank != k + 1) {
                    tempcandidatespreferenceranking.rank = k + 1;
                    let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`, tempcandidatespreferenceranking);
                  }
                }
                delete tempcandidatespreference._id;
                let response6 = await axios.put(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
              }
            }
            if (mahzordata.status >= 4) {
              //update candidatepreferences related to jobinmahzor
              let response17 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
              let tempcandidatespreferencestoupdate = response17.data;

              for (let j = 0; j < tempcandidatespreferencestoupdate.length; j++) {
                let ischangedcandidatepreference = false;
                let tempcandidatespreference_cerjobprefs = tempcandidatespreferencestoupdate[j].certjobpreferences;
                let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencestoupdate[j].noncertjobpreferences;

                if (tempupdatedjobinmahzor.certain == 'ודאי') {
                  for (let k = 0; k < tempcandidatespreferencestoupdate[j].noncertjobpreferences.length; k++) {
                    let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].noncertjobpreferences[k]}`);
                    if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                      let tempcertjobpreferencerankingid = tempcandidatespreference_noncerjobprefs[k]
                      tempcandidatespreference_noncerjobprefs.splice(k, 1);
                      tempcandidatespreference_cerjobprefs.push(tempcertjobpreferencerankingid);
                      ischangedcandidatepreference = true;

                    }
                  }
                }
                if (tempupdatedjobinmahzor.certain == 'אופציה') {
                  for (let k = 0; k < tempcandidatespreferencestoupdate[j].certjobpreferences.length; k++) {
                    let result7 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencestoupdate[j].certjobpreferences[k]}`);
                    if (result7.data.jobinmahzor == tempupdatedjobinmahzor._id) {
                      let tempnoncertjobpreferencerankingid = tempcandidatespreference_cerjobprefs[k]
                      tempcandidatespreference_cerjobprefs.splice(k, 1);
                      tempcandidatespreference_noncerjobprefs.push(tempnoncertjobpreferencerankingid);
                      ischangedcandidatepreference = true;
                    }
                  }
                }

                if (ischangedcandidatepreference) {
                  //fix rankings ranks......
                  let tempcandidatespreference = tempcandidatespreferencestoupdate[j];
                  let tempcandidatespreference_id = tempcandidatespreference._id;
                  tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
                  tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;

                  for (let k = 0; k < tempcandidatespreference_cerjobprefs.length; k++) {
                    let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`);
                    let tempcandidatespreferenceranking = result8.data;
                    if (tempcandidatespreferenceranking.rank != k + 1) {
                      tempcandidatespreferenceranking.rank = k + 1;
                      let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_cerjobprefs[k]}`, tempcandidatespreferenceranking);
                    }
                  }
                  for (let k = 0; k < tempcandidatespreference_noncerjobprefs.length; k++) {
                    let result8 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`);
                    let tempcandidatespreferenceranking = result8.data;
                    if (tempcandidatespreferenceranking.rank != k + 1) {
                      tempcandidatespreferenceranking.rank = k + 1;
                      let response6 = await axios.put(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreference_noncerjobprefs[k]}`, tempcandidatespreferenceranking);
                    }
                  }
                  delete tempcandidatespreference._id;
                  let response6 = await axios.put(`http://localhost:8000/api/finalcandidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
                }
              }
            }
          }
        }
      }
      else // ודאי/אופציה -> ממשיך
      {
        console.log("ודאי/אופציה -> ממשיך")
      }
    }

    for (let i = 0; i < jobsoriginalandnotnew.length; i++) {//delete jobinmahzors thats in db and unwanted
      let tempjobinmahzor = {};
      tempjobinmahzor.mahzor = tempmahzordata._id;
      tempjobinmahzor.job = jobsoriginalandnotnew[i]._id;
      tempjobinmahzor.certain = jobsoriginalandnotnew[i].certain;

      console.log("ודאי/אופציה -> ממשיך")
      //get jobinmahzor to delete
      let result1 = await axios.get(`http://localhost:8000/api/jobinmahzorbyjobidandmahzorid/${tempjobinmahzor.job}/${tempmahzordata._id}`);
      let tempjobinmahzortodelete = result1.data[0];

      if (mahzordata.status >= 2) {
        //delete candidatepreferences + candidateprefrankings related to jobinmahzor
        let response3 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
        let tempcandidatespreferencesdata = response3.data;

        for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
          let tempcandidatespreference_cerjobprefs = tempcandidatespreferencesdata[j].certjobpreferences;
          let tempcandidatespreference_noncerjobprefs = tempcandidatespreferencesdata[j].noncertjobpreferences;

          for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
            let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].certjobpreferences[k]}`);
            if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
              let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
              tempcandidatespreference_cerjobprefs.splice(k, 1)
            }
          }

          for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
            let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
            if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
              let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
              tempcandidatespreference_noncerjobprefs.splice(k, 1)
            }
          }
          let tempcandidatespreference = tempcandidatespreferencesdata[j];
          let tempcandidatespreference_id = tempcandidatespreference._id;
          tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
          tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;
          delete tempcandidatespreference._id;
          let response6 = await axios.put(`http://localhost:8000/api/candidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
        }

        if (mahzordata.status >= 4) {
          //delete finalcandidatepreferences + candidateprefrankings related to jobinmahzor
          let response31 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
          let tempfinalcandidatespreferencesdata = response31.data;

          for (let j = 0; j < tempfinalcandidatespreferencesdata.length; j++) {
            let tempcandidatespreference_cerjobprefs = tempfinalcandidatespreferencesdata[j].certjobpreferences;
            let tempcandidatespreference_noncerjobprefs = tempfinalcandidatespreferencesdata[j].noncertjobpreferences;

            for (let k = 0; k < tempfinalcandidatespreferencesdata[j].certjobpreferences.length; k++) {
              let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].certjobpreferences[k]}`);
              if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
                let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
                tempcandidatespreference_cerjobprefs.splice(k, 1)
              }
            }

            for (let k = 0; k < tempfinalcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
              let result4 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempfinalcandidatespreferencesdata[j].noncertjobpreferences[k]}`);
              if (result4.data.jobinmahzor == tempjobinmahzortodelete._id) {
                let result5 = await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${result4.data._id}`);
                tempcandidatespreference_noncerjobprefs.splice(k, 1)
              }
            }
            let tempcandidatespreference = tempfinalcandidatespreferencesdata[j];
            let tempcandidatespreference_id = tempcandidatespreference._id;
            tempcandidatespreference.certjobpreferences = tempcandidatespreference_cerjobprefs;
            tempcandidatespreference.noncertjobpreferences = tempcandidatespreference_noncerjobprefs;
            delete tempcandidatespreference._id;
            let response6 = await axios.put(`http://localhost:8000/api/finalcandidatepreference/${tempcandidatespreference_id}`, tempcandidatespreference);
          }
        }
      }

      //delete eshkol of jobinmahzor +delete candidatesineshkol of eshkol based on mahzor stage..
      if (mahzordata.status >= 3) {
        let response = await axios.get(`http://localhost:8000/api/eshkolbyjobinmahzorid/${tempjobinmahzortodelete._id}`)
        let tempeshkolbyjobinmahzorid = response.data[0];
        if (tempeshkolbyjobinmahzorid != null)//check if eshkol exists
        {
          if (tempeshkolbyjobinmahzorid.candidatesineshkol) {
            for (let j = 0; j < tempeshkolbyjobinmahzorid.candidatesineshkol.length; j++) {
              //delete candidatesineshkol
              let result9 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempeshkolbyjobinmahzorid.candidatesineshkol[j]}`);
            }
          }
          let result10 = await axios.delete(`http://localhost:8000/api/eshkol/${tempeshkolbyjobinmahzorid._id}`);
        }
        if (mahzordata.status >= 5) {
          let response = await axios.get(`http://localhost:8000/api/finaleshkolbyjobinmahzorid/${tempjobinmahzortodelete._id}`)
          let tempfinaleshkolbyjobinmahzorid = response.data;
          if (tempfinaleshkolbyjobinmahzorid != null)//check if finaleshkol exists
          {
            if (tempeshkolbyjobinmahzorid.candidatesineshkol) {
              for (let j = 0; j < tempfinaleshkolbyjobinmahzorid.candidatesinfinaleshkol.length; j++) {
                //delete candidatesinfinaleshkol
                let result11 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${tempfinaleshkolbyjobinmahzorid.candidatesinfinaleshkol[j]}`);
              }
            }
            let result12 = await axios.delete(`http://localhost:8000/api/finaleshkol/${tempfinaleshkolbyjobinmahzorid._id}`);
          }
        }
      }

      //delete jobinmahzor
      let result2 = await axios.delete(`http://localhost:8000/api/deletejobinmahzorbyjobidandmahzorid/${tempjobinmahzor.job}/${tempmahzordata._id}`);
    }

    for (let i = 0; i < jobsnotoriginalandnew.length; i++) { //add jobinmahzors thats no in db
      let tempjobinmahzor = {};
      tempjobinmahzor.mahzor = tempmahzordata._id;
      tempjobinmahzor.job = jobsnotoriginalandnew[i]._id;
      tempjobinmahzor.certain = jobsnotoriginalandnew[i].certain;
      console.log("ממשיך -> ודאי/אופציה")
      //create jobinmahzor
      let result = await axios.post(`http://localhost:8000/api/jobinmahzor`, tempjobinmahzor);
      if (mahzordata.status >= 3)//check status of mahzor  
      {
        let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
        let tempeshkolbymahzorid = response.data;
        if (tempeshkolbymahzorid.length > 0)//check if eshkols created already
        {
          let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
          let response1 = await axios.post(`http://localhost:8000/api/eshkol`, tempmahzoreshkol)
        }
        if (mahzordata.status >= 5)//check status of mahzor  
        {
          let response = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
          let tempeshkolbymahzorid = response.data;
          if (tempeshkolbymahzorid.length > 0)//check if finaleshkols created already
          {
            let tempmahzoreshkol = ({ mahzor: match.params.mahzorid, jobinmahzor: result.data._id, finalconfirmation: false, candidatesineshkol: [] })
            let response1 = await axios.post(`http://localhost:8000/api/finaleshkol`, tempmahzoreshkol)
          }
        }
      }
    }
    //jobs

    if (mahzordata.status >= 3) {
      await CalculateUpdateMahzorEshkol();
      if (mahzordata.status >= 5) {
        await CalculateUpdateMahzorFinalEshkol();
      }
    }
  }

  async function CalculateUpdateMahzorEshkol() {
    //delete all candidatesineshkol that not added from Admin + update
    let response22 = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
    let temptesteshkolbymahzorid = response22.data;
    let tempeshkolbymahzorid = [];

    for (let j = 0; j < temptesteshkolbymahzorid.length; j++) {
      tempeshkolbymahzorid[j] = { ...temptesteshkolbymahzorid[j] }
      tempeshkolbymahzorid[j].candidatesineshkol = [];
      tempeshkolbymahzorid[j].jobinmahzor = tempeshkolbymahzorid[j].jobinmahzor._id;
      tempeshkolbymahzorid[j].mahzor = tempeshkolbymahzorid[j].mahzor._id;
      for (let k = 0; k < temptesteshkolbymahzorid[j].candidatesineshkol.length; k++) {
        //  if candidatesineshkol is not admin inserted -> delete it.
        if (!((temptesteshkolbymahzorid[j].candidatesineshkol[k].candidaterank) || (temptesteshkolbymahzorid[j].candidatesineshkol[k].unitrank))) {
          tempeshkolbymahzorid[j].candidatesineshkol.push({ ...temptesteshkolbymahzorid[j].candidatesineshkol[k] })
        }
        else {
          let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${temptesteshkolbymahzorid[j].candidatesineshkol[k]._id}`);
        }
      }
    }
    // console.log("eshkols with only admin added prefs")
    // console.log(tempeshkolbymahzorid)

    //get all jobs of mahzor
    let response2 = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${match.params.mahzorid}`)
    let tempmahzorjobs = response2.data;
    // console.log(tempmahzorjobs)

    //get all candidatepreferences of mahzor
    let response3 = await axios.get(`http://localhost:8000/api/candidatepreferencebymahzorid/${match.params.mahzorid}`)
    let tempcandidatespreferencesdata = response3.data;
    for (let i = 0; i < tempcandidatespreferencesdata.length; i++) {
      for (let j = 0; j < tempcandidatespreferencesdata[i].certjobpreferences.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].certjobpreferences[j]}`);
        tempcandidatespreferencesdata[i].certjobpreferences[j] = result1.data;
        delete tempcandidatespreferencesdata[i].certjobpreferences[j].__v;
        delete tempcandidatespreferencesdata[i].certjobpreferences[j]._id;
      }
      for (let j = 0; j < tempcandidatespreferencesdata[i].noncertjobpreferences.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].noncertjobpreferences[j]}`);
        tempcandidatespreferencesdata[i].noncertjobpreferences[j] = result1.data;
        delete tempcandidatespreferencesdata[i].noncertjobpreferences[j].__v;
        delete tempcandidatespreferencesdata[i].noncertjobpreferences[j]._id;
      }
    }
    //  console.log(tempcandidatespreferencesdata)

    //get all unitpreferences of mahzor
    let response4 = await axios.get(`http://localhost:8000/api/unitpreferencebymahzorid/${match.params.mahzorid}`)
    let tempunitspreferences = response4.data;
    //  console.log(tempunitspreferences)

    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      //calculate eshkols candidate preferences 
      for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
        for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
          if (tempcandidatespreferencesdata[j].certjobpreferences[k].jobinmahzor == tempeshkolbymahzorid[i].jobinmahzor) {
            tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].certjobpreferences[k].rank })
          }
        }
        for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
          if (tempcandidatespreferencesdata[j].noncertjobpreferences[k].jobinmahzor == tempeshkolbymahzorid[i].jobinmahzor) {
            tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].noncertjobpreferences[k].rank })
          }
        }
      }

      //calculate eshkols unit preferences 
      for (let l = 0; l < tempunitspreferences.length; l++) {
        if (tempunitspreferences[l].jobinmahzor._id == tempeshkolbymahzorid[i].jobinmahzor) {
          for (let m = 0; m < tempunitspreferences[l].preferencerankings.length; m++) {
            let flag = false;  //flag = is candidate exists in certain eshkol 
            for (let n = 0; n < tempeshkolbymahzorid[i].candidatesineshkol.length; n++) {
              if (tempeshkolbymahzorid[i].candidatesineshkol[n].candidate == tempunitspreferences[l].preferencerankings[m].candidate) {
                flag = true;
                tempeshkolbymahzorid[i].candidatesineshkol[n].unitrank = tempunitspreferences[l].preferencerankings[m].rank;
              }
            }
            if (flag == false) {
              tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempunitspreferences[l].preferencerankings[m].candidate, unitrank: tempunitspreferences[l].preferencerankings[m].rank })
            }
          }
        }
      }
    }
    // console.log("eshkols with admin prefs + calculated prefs:")
    // console.log(tempeshkolbymahzorid)

    //post mahzor eshkols candidatesineshkol to db
    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      for (let j = 0; j < tempeshkolbymahzorid[i].candidatesineshkol.length; j++) {
        if ((tempeshkolbymahzorid[i].candidatesineshkol[j].candidaterank) || (tempeshkolbymahzorid[i].candidatesineshkol[j].unitrank)) {
          let response1 = await axios.post(`http://localhost:8000/api/candidateineshkol`, tempeshkolbymahzorid[i].candidatesineshkol[j])
          let tempdata = response1.data;
          tempeshkolbymahzorid[i].candidatesineshkol[j] = tempdata._id
        }
      }
    }
    // console.log("eshkols with admin prefs + calculated prefs ids:")
    // console.log(tempeshkolbymahzorid)

    //post mahzor eshkols to db
    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      let tempeshkolbymahzorid_id = tempeshkolbymahzorid[i]._id;
      delete tempeshkolbymahzorid[i]._id;
      let response1 = await axios.put(`http://localhost:8000/api/eshkol/${tempeshkolbymahzorid_id}`, tempeshkolbymahzorid[i])
      // let tempdata = response1.data;
    }
  }

  async function CalculateUpdateMahzorFinalEshkol() {
    //delete all candidatesineshkol that not added from Admin + update
    let response22 = await axios.get(`http://localhost:8000/api/finaleshkolbymahzorid/${match.params.mahzorid}`)
    let temptesteshkolbymahzorid = response22.data;
    let tempeshkolbymahzorid = [];

    for (let j = 0; j < temptesteshkolbymahzorid.length; j++) {
      tempeshkolbymahzorid[j] = { ...temptesteshkolbymahzorid[j] }
      tempeshkolbymahzorid[j].candidatesineshkol = [];
      tempeshkolbymahzorid[j].jobinmahzor = tempeshkolbymahzorid[j].jobinmahzor._id;
      tempeshkolbymahzorid[j].mahzor = tempeshkolbymahzorid[j].mahzor._id;
      for (let k = 0; k < temptesteshkolbymahzorid[j].candidatesineshkol.length; k++) {
        //  if candidatesineshkol is not admin inserted -> delete it.
        if (!((temptesteshkolbymahzorid[j].candidatesineshkol[k].candidaterank) || (temptesteshkolbymahzorid[j].candidatesineshkol[k].unitrank))) {
          tempeshkolbymahzorid[j].candidatesineshkol.push({ ...temptesteshkolbymahzorid[j].candidatesineshkol[k] })
        }
        else {
          let result13 = await axios.delete(`http://localhost:8000/api/candidateineshkol/${temptesteshkolbymahzorid[j].candidatesineshkol[k]._id}`);
        }
      }
    }
    // console.log("finaleshkols with only admin added prefs")
    // console.log(tempeshkolbymahzorid)

    //get all jobs of mahzor
    let response2 = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${match.params.mahzorid}`)
    let tempmahzorjobs = response2.data;
    // console.log(tempmahzorjobs)

    //get all candidatepreferences of mahzor
    let response3 = await axios.get(`http://localhost:8000/api/finalcandidatepreferencebymahzorid/${match.params.mahzorid}`)
    let tempcandidatespreferencesdata = response3.data;
    for (let i = 0; i < tempcandidatespreferencesdata.length; i++) {
      for (let j = 0; j < tempcandidatespreferencesdata[i].certjobpreferences.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].certjobpreferences[j]}`);
        tempcandidatespreferencesdata[i].certjobpreferences[j] = result1.data;
        delete tempcandidatespreferencesdata[i].certjobpreferences[j].__v;
        delete tempcandidatespreferencesdata[i].certjobpreferences[j]._id;
      }
      for (let j = 0; j < tempcandidatespreferencesdata[i].noncertjobpreferences.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatespreferencesdata[i].noncertjobpreferences[j]}`);
        tempcandidatespreferencesdata[i].noncertjobpreferences[j] = result1.data;
        delete tempcandidatespreferencesdata[i].noncertjobpreferences[j].__v;
        delete tempcandidatespreferencesdata[i].noncertjobpreferences[j]._id;
      }
    }
    //  console.log(tempcandidatespreferencesdata)

    //get all unitpreferences of mahzor
    let response4 = await axios.get(`http://localhost:8000/api/finalunitpreferencebymahzorid/${match.params.mahzorid}`)
    let tempunitspreferences = response4.data;
    //  console.log(tempunitspreferences)

    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      //calculate eshkols candidate preferences 
      for (let j = 0; j < tempcandidatespreferencesdata.length; j++) {
        for (let k = 0; k < tempcandidatespreferencesdata[j].certjobpreferences.length; k++) {
          if (tempcandidatespreferencesdata[j].certjobpreferences[k].jobinmahzor == tempeshkolbymahzorid[i].jobinmahzor) {
            tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].certjobpreferences[k].rank })
          }
        }
        for (let k = 0; k < tempcandidatespreferencesdata[j].noncertjobpreferences.length; k++) {
          if (tempcandidatespreferencesdata[j].noncertjobpreferences[k].jobinmahzor == tempeshkolbymahzorid[i].jobinmahzor) {
            tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempcandidatespreferencesdata[j].candidate._id, candidaterank: tempcandidatespreferencesdata[j].noncertjobpreferences[k].rank })
          }
        }
      }

      //calculate eshkols unit preferences 
      for (let l = 0; l < tempunitspreferences.length; l++) {
        if (tempunitspreferences[l].jobinmahzor._id == tempeshkolbymahzorid[i].jobinmahzor) {
          for (let m = 0; m < tempunitspreferences[l].preferencerankings.length; m++) {
            let flag = false;  //flag = is candidate exists in certain eshkol 
            for (let n = 0; n < tempeshkolbymahzorid[i].candidatesineshkol.length; n++) {
              if (tempeshkolbymahzorid[i].candidatesineshkol[n].candidate == tempunitspreferences[l].preferencerankings[m].candidate) {
                flag = true;
                tempeshkolbymahzorid[i].candidatesineshkol[n].unitrank = tempunitspreferences[l].preferencerankings[m].rank;
              }
            }
            if (flag == false) {
              tempeshkolbymahzorid[i].candidatesineshkol.push({ candidate: tempunitspreferences[l].preferencerankings[m].candidate, unitrank: tempunitspreferences[l].preferencerankings[m].rank })
            }
          }
        }
      }
    }
    // console.log("finaleshkols with admin prefs + calculated prefs:")
    // console.log(tempeshkolbymahzorid)

    //post mahzor eshkols candidatesineshkol to db
    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      for (let j = 0; j < tempeshkolbymahzorid[i].candidatesineshkol.length; j++) {
        if ((tempeshkolbymahzorid[i].candidatesineshkol[j].candidaterank) || (tempeshkolbymahzorid[i].candidatesineshkol[j].unitrank)) {
          let response1 = await axios.post(`http://localhost:8000/api/candidateineshkol`, tempeshkolbymahzorid[i].candidatesineshkol[j])
          let tempdata = response1.data;
          tempeshkolbymahzorid[i].candidatesineshkol[j] = tempdata._id
        }
      }
    }
    // console.log("finaleshkols with admin prefs + calculated prefs ids:")
    // console.log(tempeshkolbymahzorid)

    //post mahzor eshkols to db
    for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
      let tempeshkolbymahzorid_id = tempeshkolbymahzorid[i]._id;
      delete tempeshkolbymahzorid[i]._id;
      let response1 = await axios.put(`http://localhost:8000/api/finaleshkol/${tempeshkolbymahzorid_id}`, tempeshkolbymahzorid[i])
      // let tempdata = response1.data;
    }
  }

  return (
    <div style={{ direction: 'rtl' }}>
      <MahzorDataComponent mahzordata={mahzordata} oldmahzordata={oldmahzordata} population={population} handleChangeMahzorData={handleChangeMahzorData} />

      {iskidum == false ?
        <MahzorCandidates3 mahzordata={mahzordata} users={users} movement={movement} handleChangeUser={handleChangeUser} jobs={jobs} deletejobfromjobs={deletejobfromjobs} handleChangeJobCertain={handleChangeJobCertain} SerachAndAddJobToJobsList={SerachAndAddJobToJobsList} />
        : <MahzorCandidates3Kidum mahzordata={mahzordata} users={users} movement={movement} population={population} jobs={jobs} handleChangeUser={handleChangeUser} handleChangeKidumPopulation={handleChangeKidumPopulation} deletejobfromjobs={deletejobfromjobs} handleChangeJobCertain={handleChangeJobCertain} SerachAndAddJobToJobsList={SerachAndAddJobToJobsList} />}

      <Button type="primary" onClick={() => clickSubmit()}>אישור</Button>
    </div>
  );
}
export default withRouter(MahzorForm3);;
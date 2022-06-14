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

import Select from 'components/tafkidipedia/Select/CandidatePreferenceAnimatedMultiSelect'

const CandidatePreferenceForm = ({ match }) => {
  //mahzor
  const [mahzordata, setMahzorData] = useState({})
  //mahzor

  //jobs
  const [certmahzorjobs, setCertMahzorJobs] = useState([]);
  const [noncertmahzorjobs, setNonCertMahzorJobs] = useState([]);
  //jobs

  //old-preference
  const [oldcandidatepreference, setOldcandidatePreference] = useState({})
  //old-preference

  //preference
  const [candidatepreference, setCandidatePreference] = useState({})
  //preference

  function handleChangecertjobpreferences(evt) {
    const value = evt.value;
    const index = parseInt(evt.name);
    let rank = index + 1;

    let tempcandidatepreference = [...candidatepreference.certjobpreferences];
    tempcandidatepreference[index] = { jobinmahzor: value, rank: rank }
    setCandidatePreference({ ...candidatepreference, certjobpreferences: tempcandidatepreference });
  }

  function handleChangenoncertjobpreferences(evt) {
    const value = evt.value;
    const index = parseInt(evt.name);
    let rank = index + 1;

    let tempcandidatepreference = [...candidatepreference.noncertjobpreferences];
    tempcandidatepreference[index] = { jobinmahzor: value, rank: rank }
    setCandidatePreference({ ...candidatepreference, noncertjobpreferences: tempcandidatepreference });
  }

  function handleChangePreferenceRemarks(evt) {
    const value = evt.target.value;
    setCandidatePreference({ ...candidatepreference, [evt.target.name]: value });
  }

  const loadmahzor = async () => {
    await axios.get(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`)
      .then(response => {
        let tempmahzor = response.data;
        setMahzorData(tempmahzor);
        loadmahzorjobs(tempmahzor)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadcandidatepreference = async () => {
    let tempcandidatepreferencedata; //look for existing preference

    if (mahzordata.status == 2) {
      let result = await axios.get(`http://localhost:8000/api/candidatepreference/candidatepreferencebycandidateid/${match.params.candidateid}`);
      tempcandidatepreferencedata = result.data[0];
    }
    else if (mahzordata.status == 4) {
      let result = await axios.get(`http://localhost:8000/api/finalcandidatepreference/finalcandidatepreferencebycandidateid/${match.params.candidateid}`);
      tempcandidatepreferencedata = result.data[0];
    }

    if (tempcandidatepreferencedata) //has existing pref
    {
      for (let i = 0; i < tempcandidatepreferencedata.certjobpreferences.length; i++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatepreferencedata.certjobpreferences[i]}`);
        tempcandidatepreferencedata.certjobpreferences[i] = result1.data;
        delete tempcandidatepreferencedata.certjobpreferences[i].__v;
        delete tempcandidatepreferencedata.certjobpreferences[i]._id;
      }
      for (let i = 0; i < tempcandidatepreferencedata.noncertjobpreferences.length; i++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidatepreferenceranking/${tempcandidatepreferencedata.noncertjobpreferences[i]}`);
        tempcandidatepreferencedata.noncertjobpreferences[i] = result1.data;
        delete tempcandidatepreferencedata.noncertjobpreferences[i].__v;
        delete tempcandidatepreferencedata.noncertjobpreferences[i]._id;
      }

      delete tempcandidatepreferencedata.mahzor;
      delete tempcandidatepreferencedata.candidate;
      setCandidatePreference(tempcandidatepreferencedata)

      if (mahzordata.status == 2) {
        let tempoldcandidatepreferencedata; //if has existing preference save the old one
        let oldresult = await axios.get(`http://localhost:8000/api/candidatepreference/candidatepreferencebycandidateid/${match.params.candidateid}`);
        tempoldcandidatepreferencedata = oldresult.data[0];
        setOldcandidatePreference(tempoldcandidatepreferencedata)
      }
      else if (mahzordata.status == 4) {
        let tempoldcandidatepreferencedata; //if has existing preference save the old one
        let oldresult = await axios.get(`http://localhost:8000/api/finalcandidatepreference/finalcandidatepreferencebycandidateid/${match.params.candidateid}`);
        tempoldcandidatepreferencedata = oldresult.data[0];
        setOldcandidatePreference(tempoldcandidatepreferencedata)
      }
    }
    else { //dont have existing pref
      let tempcandidatepreferencedata2 = {};
      tempcandidatepreferencedata2.certjobpreferences = []
      tempcandidatepreferencedata2.noncertjobpreferences = []
      setCandidatePreference(tempcandidatepreferencedata2)
    }
    // console.log(tempcandidatepreferencedata)
  }

  const loadmahzorjobs = async (tempmahzordata) => {
    let tempcertjobs = [];
    let tempnoncertjobs = [];

    if (tempmahzordata.status == 2) {
      let result = await axios.get(`http://localhost:8000/api/jobinmahzorsbymahzorid/${match.params.mahzorid}`)
      let jobs = result.data;

      for (let i = 0; i < jobs.length; i++) {
        if (jobs[i].certain == "ודאי") // תפקיד ודאי
        {
          let tempjob = jobs[i];
          tempcertjobs.push(tempjob)
        }
        else {// תפקיד אופציה
          let tempjob = jobs[i];
          tempnoncertjobs.push(tempjob)
        }
      }
    }

    if (tempmahzordata.status == 4) {
      //get all eshkols
      let response = await axios.get(`http://localhost:8000/api/eshkolbymahzorid/${match.params.mahzorid}`)
      let tempeshkolbymahzorid = response.data;

      //check what eshkol jobs, user is in them.
      for (let i = 0; i < tempeshkolbymahzorid.length; i++) {
        let is_user_in_eshkol = false;
        for (let j = 0; j < tempeshkolbymahzorid[i].candidatesineshkol.length; j++) {
          if (tempeshkolbymahzorid[i].candidatesineshkol[j].candidate == match.params.candidateid) {
            is_user_in_eshkol = true;
          }
        }
        if (is_user_in_eshkol == true) {
          if (tempeshkolbymahzorid[i].jobinmahzor.certain == "ודאי") // תפקיד ודאי
          {
            let tempjob = tempeshkolbymahzorid[i].jobinmahzor;
            tempcertjobs.push(tempjob)
          }
          else {// תפקיד אופציה
            let tempjob = tempeshkolbymahzorid[i].jobinmahzor;
            tempnoncertjobs.push(tempjob)
          }
        }
      }
    }
    setCertMahzorJobs(tempcertjobs);
    setNonCertMahzorJobs(tempnoncertjobs);
  }

  const clickSubmit = event => {//CheckPreferenceData->AddPreferenceToDb
    if (CheckPreferenceData() == true)
      AddPreferenceToDb();
  }

  function countInArray(array, what) {
    return array.filter(item => item.jobinmahzor == what.jobinmahzor).length;
  }

  function CheckPreferenceData() {
    let flag = true;

    let certjobsflag = true;
    let noncertjobsflag = true;
    let error = [];

    //ודאי-בדיקה
    for (let i = 0; i < candidatepreference.certjobpreferences.length; i++) {
      if (candidatepreference.certjobpreferences[i] != null && candidatepreference.certjobpreferences[i] != undefined && candidatepreference.certjobpreferences[i].jobinmahzor != "בחר תפקיד") {
        if (countInArray(candidatepreference.certjobpreferences, candidatepreference.certjobpreferences[i]) != 1) {
          certjobsflag = false;
        }
      }
    }

    //אופציה- בדיקה
    for (let i = 0; i < candidatepreference.noncertjobpreferences.length; i++) {
      if (candidatepreference.noncertjobpreferences[i] != null && candidatepreference.noncertjobpreferences[i] != undefined && candidatepreference.noncertjobpreferences[i].jobinmahzor != "בחר תפקיד") {
        if (countInArray(candidatepreference.noncertjobpreferences, candidatepreference.noncertjobpreferences[i]) != 1) {
          noncertjobsflag = false;
        }
      }
    }

    if (certjobsflag == false)
      error.push('אין להזין אותו תפקיד פעמיים - ודאי')

    if (noncertjobsflag == false)
      error.push('אין להזין אותו תפקיד פעמיים - אופציה')
    //

    if (error.length != 0) {
      for (let i = 0; i < error.length; i++)
        toast.error(error[i])
      flag = false;
    }
    return flag;
  }

  async function AddPreferenceToDb() { //if candidatepref has id- means it exists and needs to be updated else its new..
    let tempcandidatepreference = candidatepreference;
    tempcandidatepreference.mahzor = match.params.mahzorid;
    tempcandidatepreference.candidate = match.params.candidateid;

    if (!tempcandidatepreference._id) {
      //create all candidate preference rankings 
      let tempcandidatepreference_certjobpreferencesid = [];
      let tempcandidatepreference_noncertjobpreferencesid = [];

      let certrankindex = 1;
      for (let i = 0; i < tempcandidatepreference.certjobpreferences.length; i++) {
        if ((candidatepreference.certjobpreferences[i]) && (candidatepreference.certjobpreferences[i] != null) && (candidatepreference.certjobpreferences[i] != undefined) && (candidatepreference.certjobpreferences[i].jobinmahzor != "בחר תפקיד")) {
          let tempcertjobpreference = candidatepreference.certjobpreferences[i];
          tempcertjobpreference.rank = certrankindex;
          await axios.post(`http://localhost:8000/api/candidatepreferenceranking`, tempcertjobpreference)
            .then(res => {
              tempcandidatepreference_certjobpreferencesid.push(res.data._id);
              certrankindex++;
            })
        }
      }

      let noncertrankindex = 1;
      for (let i = 0; i < tempcandidatepreference.noncertjobpreferences.length; i++) {
        if ((candidatepreference.noncertjobpreferences[i]) && (candidatepreference.noncertjobpreferences[i] != null) && (candidatepreference.noncertjobpreferences[i] != undefined) && (candidatepreference.noncertjobpreferences[i].jobinmahzor != "בחר תפקיד")) {
          let tempnoncertjobpreference = candidatepreference.noncertjobpreferences[i];
          tempnoncertjobpreference.rank = noncertrankindex;
          await axios.post(`http://localhost:8000/api/candidatepreferenceranking`, tempnoncertjobpreference)
            .then(res => {
              tempcandidatepreference_noncertjobpreferencesid.push(res.data._id);
              noncertrankindex++;
            })
        }
      }

      //create new candidate preference
      tempcandidatepreference.certjobpreferences = tempcandidatepreference_certjobpreferencesid;
      tempcandidatepreference.noncertjobpreferences = tempcandidatepreference_noncertjobpreferencesid;

      if (mahzordata.status == 2) {
        await axios.post(`http://localhost:8000/api/candidatepreference`, tempcandidatepreference)
          .then(res => {
            toast.success("העדפה עודכנה בהצלחה")
            history.goBack();
          })
      }
      else if (mahzordata.status == 4) {
        await axios.post(`http://localhost:8000/api/finalcandidatepreference`, tempcandidatepreference)
          .then(res => {
            toast.success("העדפה עודכנה בהצלחה")
            history.goBack();
          })
      }
    }

    else {
      // delete all previous preference rankings
      for (let i = 0; i < oldcandidatepreference.certjobpreferences.length; i++) {
        await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${oldcandidatepreference.certjobpreferences[i]}`)
          .then(res => {

          })
      }
      for (let i = 0; i < oldcandidatepreference.noncertjobpreferences.length; i++) {
        await axios.delete(`http://localhost:8000/api/candidatepreferenceranking/${oldcandidatepreference.noncertjobpreferences[i]}`)
          .then(res => {

          })
      }

      // create all candidate preference rankings
      let tempcandidatepreference_certjobpreferencesid = [];
      let tempcandidatepreference_noncertjobpreferencesid = [];

      let certrankindex = 1;
      for (let i = 0; i < tempcandidatepreference.certjobpreferences.length; i++) {
        if ((candidatepreference.certjobpreferences[i]) && (candidatepreference.certjobpreferences[i] != null) && (candidatepreference.certjobpreferences[i] != undefined) && (candidatepreference.certjobpreferences[i].jobinmahzor != "בחר תפקיד")) {
          let tempcertjobpreference = candidatepreference.certjobpreferences[i];
          tempcertjobpreference.rank = certrankindex;
          await axios.post(`http://localhost:8000/api/candidatepreferenceranking`, tempcertjobpreference)
            .then(res => {
              tempcandidatepreference_certjobpreferencesid.push(res.data._id);
              certrankindex++;
            })
        }
      }

      let noncertrankindex = 1;
      for (let i = 0; i < tempcandidatepreference.noncertjobpreferences.length; i++) {
        if ((candidatepreference.noncertjobpreferences[i]) && (candidatepreference.noncertjobpreferences[i] != null) && (candidatepreference.noncertjobpreferences[i] != undefined) && (candidatepreference.noncertjobpreferences[i].jobinmahzor != "בחר תפקיד")) {
          let tempnoncertjobpreference = candidatepreference.noncertjobpreferences[i];
          tempnoncertjobpreference.rank = noncertrankindex;
          await axios.post(`http://localhost:8000/api/candidatepreferenceranking`, tempnoncertjobpreference)
            .then(res => {
              tempcandidatepreference_noncertjobpreferencesid.push(res.data._id);
              noncertrankindex++;
            })
        }
      }

      //update candidate preference
      tempcandidatepreference.certjobpreferences = tempcandidatepreference_certjobpreferencesid;
      tempcandidatepreference.noncertjobpreferences = tempcandidatepreference_noncertjobpreferencesid;
      let candidateidtochange = tempcandidatepreference._id;
      delete tempcandidatepreference._id;

      if (mahzordata.status == 2) {
        await axios.put(`http://localhost:8000/api/candidatepreference/${candidateidtochange}`, tempcandidatepreference)
          .then(res => {
            toast.success("העדפה עודכנה בהצלחה")
            history.goBack();
          })
      }
      else if (mahzordata.status == 4) {
        await axios.put(`http://localhost:8000/api/finalcandidatepreference/${candidateidtochange}`, tempcandidatepreference)
          .then(res => {
            toast.success("העדפה עודכנה בהצלחה")
            history.goBack();
          })
      }
    }
  }

  function init() {
    loadmahzor()
    // loadmahzorjobs()
  }

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    loadcandidatepreference()
  }, [mahzordata])

  return (
    mahzordata.status == 2 || mahzordata.status == 4 ?
      <Container style={{ paddingTop: '80px', direction: 'rtl' }}>
        <Row>
          <Card>
            <CardHeader style={{ direction: 'rtl' }}>
              <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>טופס העדפות מועמד</CardTitle>{/*headline*/}
            </CardHeader>

            <CardBody style={{ direction: 'rtl' }}>
              <Container>
                {/*edit existing*/}
                {(candidatepreference.certjobpreferences && candidatepreference._id) ?
                  <>
                    <h5 style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>העדפות תפקידים - ודאי (1- גבוה ביותר)</h5>
                    <Row>
                      {mahzordata.numberofjobpicks >= candidatepreference.certjobpreferences.length ?
                        [...Array(mahzordata.numberofjobpicks)].map((x, i) =>
                          <Col xs={12} md={4}>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>תפקיד {i + 1}</div>
                            {/* <FormGroup dir="rtl" >
                              {candidatepreference.certjobpreferences[i] ?
                                <Input type="select" name={i} value={candidatepreference.certjobpreferences[i].jobinmahzor} onChange={handleChangecertjobpreferences}>
                                  <option value={undefined}>{"בחר תפקיד"}</option>
                                  {certmahzorjobs.map((job, index) => (
                                    <option value={job._id}>{job.job.jobname + "/" + job.job.unit.name}</option>
                                  ))}
                                </Input> :
                                <Input type="select" name={i} onChange={handleChangecertjobpreferences}>
                                  <option value={undefined}>{"בחר תפקיד"}</option>
                                  {certmahzorjobs.map((job, index) => (
                                    <option value={job._id}>{job.job.jobname + "/" + job.job.unit.name}</option>
                                  ))}
                                </Input>}
                            </FormGroup> */}
                            <div style={{ textAlign: 'right' }}>
                              <Select data={certmahzorjobs} index={i} handleChangejobpreferences={handleChangecertjobpreferences} val={candidatepreference.certjobpreferences[i] ? candidatepreference.certjobpreferences[i].jobinmahzor : undefined} />
                            </div>
                          </Col>) :
                        candidatepreference.certjobpreferences.map((x, i) =>
                          <Col xs={12} md={4}>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>תפקיד {i + 1}</div>
                            {/* <FormGroup dir="rtl" >
                              {candidatepreference.certjobpreferences[i] ?
                                <Input type="select" name={i} value={candidatepreference.certjobpreferences[i].jobinmahzor} onChange={handleChangecertjobpreferences}>
                                  <option value={undefined}>{"בחר תפקיד"}</option>
                                  {certmahzorjobs.map((job, index) => (
                                    <option value={job._id}>{job.job.jobname + "/" + job.job.unit.name}</option>
                                  ))}
                                </Input> :
                                <Input type="select" name={i} onChange={handleChangecertjobpreferences}>
                                  <option value={undefined}>{"בחר תפקיד"}</option>
                                  {certmahzorjobs.map((job, index) => (
                                    <option value={job._id}>{job.job.jobname + "/" + job.job.unit.name}</option>
                                  ))}
                                </Input>}
                            </FormGroup> */}
                            <div style={{ textAlign: 'right' }}>
                              <Select data={certmahzorjobs} index={i} handleChangejobpreferences={handleChangecertjobpreferences} val={candidatepreference.certjobpreferences[i] ? candidatepreference.certjobpreferences[i].jobinmahzor : undefined} />
                            </div>
                          </Col>)}
                    </Row>


                    <h5 style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>העדפות תפקידים - אופציה (1- גבוה ביותר)</h5>
                    <Row>
                      {mahzordata.numberofjobpicks >= candidatepreference.noncertjobpreferences.length ?
                        [...Array(mahzordata.numberofjobpicks)].map((x, i) =>
                          <Col xs={12} md={4}>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>תפקיד {i + 1}</div>
                            {/* <FormGroup dir="rtl" >
                              {candidatepreference.noncertjobpreferences[i] ?
                                <Input type="select" name={i} value={candidatepreference.noncertjobpreferences[i].jobinmahzor} onChange={handleChangenoncertjobpreferences}>
                                  <option value={undefined}>{"בחר תפקיד"}</option>
                                  {noncertmahzorjobs.map((job, index) => (
                                    <option value={job._id}>{job.job.jobname + "/" + job.job.unit.name}</option>
                                  ))}
                                </Input> :
                                <Input type="select" name={i} onChange={handleChangenoncertjobpreferences}>
                                  <option value={undefined}>{"בחר תפקיד"}</option>
                                  {noncertmahzorjobs.map((job, index) => (
                                    <option value={job._id}>{job.job.jobname + "/" + job.job.unit.name}</option>
                                  ))}
                                </Input>}
                            </FormGroup> */}
                            <div style={{ textAlign: 'right' }}>
                              <Select data={noncertmahzorjobs} index={i} handleChangejobpreferences={handleChangenoncertjobpreferences} val={candidatepreference.noncertjobpreferences[i] ? candidatepreference.noncertjobpreferences[i].jobinmahzor : undefined} />
                            </div>
                          </Col>) :
                        candidatepreference.noncertjobpreferences.map((x, i) =>
                          <Col xs={12} md={4}>
                            <div style={{ textAlign: 'center', paddingTop: '10px' }}>תפקיד {i + 1}</div>
                            {/* <FormGroup dir="rtl" >
                              {candidatepreference.noncertjobpreferences[i] ?
                                <Input type="select" name={i} value={candidatepreference.noncertjobpreferences[i].jobinmahzor} onChange={handleChangenoncertjobpreferences}>
                                  <option value={undefined}>{"בחר תפקיד"}</option>
                                  {noncertmahzorjobs.map((job, index) => (
                                    <option value={job._id}>{job.job.jobname + "/" + job.job.unit.name}</option>
                                  ))}
                                </Input> :
                                <Input type="select" name={i} onChange={handleChangenoncertjobpreferences}>
                                  <option value={undefined}>{"בחר תפקיד"}</option>
                                  {noncertmahzorjobs.map((job, index) => (
                                    <option value={job._id}>{job.job.jobname + "/" + job.job.unit.name}</option>
                                  ))}
                                </Input>}
                            </FormGroup> */}
                            <div style={{ textAlign: 'right' }}>
                              <Select data={noncertmahzorjobs} index={i} handleChangejobpreferences={handleChangenoncertjobpreferences} val={candidatepreference.noncertjobpreferences[i] ? candidatepreference.noncertjobpreferences[i].jobinmahzor : undefined} />
                            </div>
                          </Col>)}
                    </Row>
                  </>
                  : null}

                {/*edit new*/}
                {(candidatepreference.noncertjobpreferences && candidatepreference.certjobpreferences && !candidatepreference._id) ?
                  <>
                    <h5 style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>העדפות תפקידים - ודאי (1- גבוה ביותר)</h5>
                    <Row>
                      {[...Array(mahzordata.numberofjobpicks)].map((x, i) =>
                        <Col xs={12} md={4}>
                          <div style={{ textAlign: 'center', paddingTop: '10px' }}>תפקיד {i + 1}</div>
                          {/* <FormGroup dir="rtl" >
                            <Input type="select" name={i}  onChange={handleChangecertjobpreferences}>
                              <option value={undefined}>{"בחר תפקיד"}</option>
                              {certmahzorjobs.map((job, index) => (
                                <option value={job._id}>{job.job.jobname + "/" + job.job.unit.name}</option>
                              ))}
                            </Input>
                          </FormGroup> */}
                          <div style={{ textAlign: 'right' }}>
                            <Select data={certmahzorjobs} index={i} handleChangejobpreferences={handleChangecertjobpreferences} val={candidatepreference.certjobpreferences[i] ? candidatepreference.certjobpreferences[i].jobinmahzor : undefined} />
                          </div>
                        </Col>)}
                    </Row>


                    <h5 style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}>העדפות תפקידים - אופציה (1- גבוה ביותר)</h5>
                    <Row>
                      {[...Array(mahzordata.numberofjobpicks)].map((x, j) =>
                        <Col xs={12} md={4}>
                          <div style={{ textAlign: 'center', paddingTop: '10px' }}>תפקיד {j + 1}</div>
                          {/* <FormGroup dir="rtl" >
                            <Input type="select" name={i} onChange={handleChangenoncertjobpreferences}>
                              <option value={undefined}>{"בחר תפקיד"}</option>
                              {noncertmahzorjobs.map((job, index) => (
                                <option value={job._id}>{job.job.jobname + "/" + job.job.unit.name}</option>
                              ))}
                            </Input>
                          </FormGroup> */}
                          <div style={{ textAlign: 'right' }}>
                            <Select data={noncertmahzorjobs} index={j} handleChangejobpreferences={handleChangenoncertjobpreferences} val={candidatepreference.noncertjobpreferences[j] ? candidatepreference.noncertjobpreferences[j].jobinmahzor : undefined} />
                          </div>
                        </Col>)}
                    </Row>
                  </>
                  : null}

                <div style={{ textAlign: 'right', paddingTop: '10px' }}>הערות</div>
                <Input placeholder="הערות" type="string" name="remarks" value={candidatepreference.remarks} onChange={handleChangePreferenceRemarks} />

                <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                  <button className="btn" onClick={clickSubmit}>עדכן העדפות</button>
                </div>
              </Container>
            </CardBody>
          </Card>
        </Row>
      </Container>
      :
      <Container style={{ paddingTop: '80px', direction: 'rtl' }}>
        <Card>
          <CardHeader style={{ direction: 'rtl' }}>
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>שלב המחזור לא תואם - לא ניתן להזין העדפה כרגע</CardTitle>
          </CardHeader>
        </Card>
      </Container>
  );
}
export default withRouter(CandidatePreferenceForm);;
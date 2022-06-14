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
  Col,
  Modal,
  ModalBody
} from "reactstrap";
import axios from 'axios';
import history from 'history.js'
import { toast } from "react-toastify";

import Select from 'components/tafkidipedia/Select/EshkolAnimatedMultiSelect'

import Select1 from 'components/tafkidipedia/Select/EshkolFinalCandidateAnimatedMultiSelect'

const EditEshkolForm = (props) => {
  //mahzor
  const [oldeshkoldata, setOldEshkolData] = useState({})

  const [eshkoldata, setEshkolData] = useState({})
  //mahzor

  //
  const [candidates, setCandidates] = useState([])
  //
  //End Of Data!

  const loadeshkol = async () => {
    let id = props.eshkolid;
    let response;
    let eshkoldata;
    if (props.iseshkol == 'true') {
      let response = await axios.get(`http://localhost:8000/api/eshkolbyid/${id}`)
      eshkoldata = response.data[0];
      for (let j = 0; j < eshkoldata.candidatesineshkol.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidate/smartcandidatebyid/${eshkoldata.candidatesineshkol[j].candidate}`);
        eshkoldata.candidatesineshkol[j].candidate = result1.data[0];
      }
      setEshkolData(eshkoldata);
      setOldEshkolData(eshkoldata);
    }
    else {
      response = await axios.get(`http://localhost:8000/api/finaleshkolbyid/${id}`)
      eshkoldata = response.data[0];
      for (let j = 0; j < eshkoldata.candidatesineshkol.length; j++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidate/smartcandidatebyid/${eshkoldata.candidatesineshkol[j].candidate}`);
        eshkoldata.candidatesineshkol[j].candidate = result1.data[0];
      }
      if (eshkoldata.finalcandidate) {
        let result2 = await axios.get(`http://localhost:8000/api/candidate/smartcandidatebyid/${eshkoldata.finalcandidate}`);
        eshkoldata.finalcandidate = result2.data[0];
      }
      setEshkolData(eshkoldata);
    }
    loadcandidates(eshkoldata.mahzor._id);
    setOldEshkolData(eshkoldata);
  }

  const loadcandidates = async (mahzorid) => {
    let result = await axios.get(`http://localhost:8000/api/activecandidatesbymahzorid/${mahzorid}`)
    let candidates = result.data;
    setCandidates(candidates);
  }

  const isDuplicate = (data, obj) => {
    let flag = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].candidate._id == obj._id) {
        flag = true
      }
    }
    return flag;
  }

  const handleChangeCandidatesInEshkol = event => {
    let tempcandidate = candidates[event.value];
    let tempeshkoldatacandidatesineshkol = [...eshkoldata.candidatesineshkol];

    if (!isDuplicate(tempeshkoldatacandidatesineshkol, tempcandidate)) {
      tempeshkoldatacandidatesineshkol.push({ candidate: tempcandidate })
      setEshkolData({ ...eshkoldata, candidatesineshkol: tempeshkoldatacandidatesineshkol });
    }
    console.log(event)
  }

  const handleChangeFinalCandidateInEshkol = event => {
    if (event.target.value != "בחר מועמד") {
      let tempfinalcandidate = candidates[event.target.value];

      setEshkolData({ ...eshkoldata, finalcandidate: tempfinalcandidate });
    }
  }

  const handleChangeFinalCandidateInEshkol2 = event => {
    let tempcandidate = candidates[event.value];

    setEshkolData({ ...eshkoldata, finalcandidate: tempcandidate });
    console.log(event)
  }

  async function DeleteCandidateInEshkolFromEshkol(candidateineshkol) {
    let tempcandidatesineshkol = await eshkoldata.candidatesineshkol;
    tempcandidatesineshkol = tempcandidatesineshkol.filter(function (item) {
      return item !== candidateineshkol
    })
    setEshkolData({ ...eshkoldata, candidatesineshkol: tempcandidatesineshkol });
  }

  async function DeleteFinalCandidateFromEshkol() {
    setEshkolData({ ...eshkoldata, finalcandidate: null });
  }

  const clickSubmit = async event => {
    let tempeshkol = eshkoldata;

    let originalandnew = [];//to do nothing
    let originalandnotnew = [];//to delete
    let notoriginalandnew = [];//to add

    for (let i = 0; i < oldeshkoldata.candidatesineshkol.length; i++) {
      let flag = false;
      for (let j = 0; j < eshkoldata.candidatesineshkol.length; j++) {
        if (oldeshkoldata.candidatesineshkol[i]._id == eshkoldata.candidatesineshkol[j]._id) {
          flag = true;
        }
      }
      if (flag == true) {
        originalandnew.push(oldeshkoldata.candidatesineshkol[i])
      }
      else {
        originalandnotnew.push(oldeshkoldata.candidatesineshkol[i])
      }
    }

    for (let i = 0; i < eshkoldata.candidatesineshkol.length; i++) {
      let flag = false;
      for (let j = 0; j < oldeshkoldata.candidatesineshkol.length; j++) {
        if (eshkoldata.candidatesineshkol[i]._id == oldeshkoldata.candidatesineshkol[j]._id) {
          flag = true;
        }
      }
      if (flag == false) {
        notoriginalandnew.push(eshkoldata.candidatesineshkol[i])
      }
      else {
        //nothing
      }
    }
    console.log("originalandnew")
    console.log(originalandnew)
    console.log("originalandnotnew")
    console.log(originalandnotnew)
    console.log("notoriginalandnew")
    console.log(notoriginalandnew)

    //init eshkol
    tempeshkol.candidatesineshkol = [];
    tempeshkol.jobinmahzor = tempeshkol.jobinmahzor._id;
    tempeshkol.mahzor = tempeshkol.mahzor._id;
    delete tempeshkol._id;

    for (let i = 0; i < originalandnew.length; i++) {
      tempeshkol.candidatesineshkol.push(originalandnew[i]._id)
    }

    for (let i = 0; i < notoriginalandnew.length; i++) { //add candidates thats no in db
      let tempcandidateineshkol = {};
      tempcandidateineshkol.candidate = notoriginalandnew[i].candidate._id;
      let response1 = await axios.post(`http://localhost:8000/api/candidateineshkol`, tempcandidateineshkol)
      let tempdata = response1.data;
      tempeshkol.candidatesineshkol.push(tempdata._id)
    }

    for (let i = 0; i < originalandnotnew.length; i++) {//delete candidates thats in db and unwanted
      let result = await axios.delete(`http://localhost:8000/api/candidateineshkol/${originalandnotnew[i]._id}`);
    }

    //post eshkol to db
    if (props.iseshkol == 'true') {
      let response1 = await axios.put(`http://localhost:8000/api/eshkol/${props.eshkolid}`, tempeshkol)
    }
    else {
      if (tempeshkol.finalcandidate != null) {
        tempeshkol.finalcandidate = tempeshkol.finalcandidate._id
      }
      else {
        // delete tempeshkol.finalcandidate;
      }
      let response1 = await axios.put(`http://localhost:8000/api/finaleshkol/${props.eshkolid}`, tempeshkol)
    }

    console.log(tempeshkol)
    toast.success("אשכול עודכן בהצלחה")
    props.ToggleForModal();
    init();
    // history.goBack();
  }

  async function init() {
    await loadeshkol();
  }

  useEffect(() => {
    if (props.eshkolid != undefined)
      init();
  }, [props.eshkolid])

  return (
    eshkoldata.jobinmahzor && candidates.length > 0 && eshkoldata.jobinmahzor.job ?
      <Modal
        style={{ minHeight: '100%', maxHeight: '100%', minWidth: '80%', maxWidth: '80%', justifyContent: 'center', alignSelf: 'center', margin: '0px', margin: 'auto', direction: 'rtl' }}
        isOpen={props.isOpen}
        centered
        fullscreen
        scrollable
        size=""
        toggle={props.Toggle}>
        <ModalBody>
          <Row>
            <Card>
              <CardHeader style={{ direction: 'rtl' }}>
                <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>טופס עריכת אשכול: {eshkoldata.jobinmahzor ? eshkoldata.jobinmahzor.job.jobname : null}/{eshkoldata.jobinmahzor ? eshkoldata.jobinmahzor.job.unit.name : null}</CardTitle>{/*headline*/}
              </CardHeader>

              <CardBody style={{ direction: 'rtl' }}>
                <div style={{ width: '90%', margin: 'auto' }}>
                  {/* <Row>
                  <Col xs={12} md={12}>
                    <div style={{ textAlign: 'center', paddingTop: '10px' }}>הוסף מועמד</div>
                    <FormGroup dir="rtl" >
                      <Input type="select" onChange={handleChangeCandidatesInEshkol}>
                        <option value={"בחר מועמד"}>בחר מועמד</option>
                        {candidates.map((candidate, index) => (
                          <option key={index} value={index}>{candidate.user.name} {candidate.user.lastname}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row> */}

                  <Row>
                    <Col xs={12} md={12}>
                      <div style={{ textAlign: 'center', paddingTop: '10px' }}>הוסף מועמד</div>
                      <div style={{ textAlign: 'right' }}>
                        <Select data={candidates} handleChangeCandidatesInEshkol={handleChangeCandidatesInEshkol} />
                      </div>
                    </Col>
                  </Row>

                  <Row style={{ direction: "rtl", paddingTop: '10px' }} >
                    {eshkoldata && eshkoldata.candidatesineshkol ? eshkoldata.candidatesineshkol.map((candidateineshkol, index) => (
                      candidateineshkol.candidaterank && candidateineshkol.unitrank ?
                        <Col xs={12} md={6} key={index} style={{ direction: "rtl", paddingTop: '15px' }}>
                          <Row style={{ backgroundColor: 'rgb(190 255 184)', direction: "rtl", boxShadow: '0px 0px 5px 0px rgb(0 0 0 / 40%)', borderRadius: '10px', width: 'inherit', margin: '0px' }}>
                            <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                              <h5 style={{ textAlign: "right", margin: '0px' }}>{candidateineshkol.candidate.user.name} {candidateineshkol.candidate.user.lastname}</h5>
                            </Col>
                            <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                              <h5 style={{ textAlign: "right", margin: '0px' }}>העדפת מתמודד: {candidateineshkol.candidaterank}</h5>
                            </Col>
                            <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                              <h5 style={{ textAlign: "right", margin: '0px' }}>העדפת יחידה: {candidateineshkol.unitrank}</h5>
                            </Col>
                            <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                              <Button className="btn btn-danger" onClick={(e) => DeleteCandidateInEshkolFromEshkol(candidateineshkol, e)} style={{ padding: '11px 20px 11px 20px' }}>X</Button>
                            </Col>
                          </Row>
                        </Col> :
                        candidateineshkol.candidaterank ?
                          <Col xs={12} md={6} key={index} style={{ direction: "rtl", paddingTop: '15px' }}>
                            <Row style={{ backgroundColor: 'rgb(255 204 204)', direction: "rtl", boxShadow: '0px 0px 5px 0px rgb(0 0 0 / 40%)', borderRadius: '10px', width: 'inherit', margin: '0px' }}>
                              <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                <h5 style={{ textAlign: "right", margin: '0px' }}>{candidateineshkol.candidate.user.name} {candidateineshkol.candidate.user.lastname}</h5>
                              </Col>
                              <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                <h5 style={{ textAlign: "right", margin: '0px' }}>העדפת מתמודד: {candidateineshkol.candidaterank}</h5>
                              </Col>
                              <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                <h5 style={{ textAlign: "right", margin: '0px' }}>העדפת יחידה: -</h5>
                              </Col>
                              <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                <Button className="btn btn-danger" onClick={(e) => DeleteCandidateInEshkolFromEshkol(candidateineshkol, e)} style={{ padding: '11px 20px 11px 20px' }}>X</Button>
                              </Col>
                            </Row>
                          </Col> : candidateineshkol.unitrank ?
                            <Col xs={12} md={6} key={index} style={{ direction: "rtl", paddingTop: '15px' }}>
                              <Row style={{ backgroundColor: 'rgb(255 248 204)', direction: "rtl", boxShadow: '0px 0px 5px 0px rgb(0 0 0 / 40%)', borderRadius: '10px', width: 'inherit', margin: '0px' }}>
                                <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                  <h5 style={{ textAlign: "right", margin: '0px' }}>{candidateineshkol.candidate.user.name} {candidateineshkol.candidate.user.lastname}</h5>
                                </Col>
                                <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                  <h5 style={{ textAlign: "right", margin: '0px' }}>העדפת מתמודד: -</h5>
                                </Col>
                                <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                  <h5 style={{ textAlign: "right", margin: '0px' }}>העדפת יחידה: {candidateineshkol.unitrank}</h5>
                                </Col>
                                <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                  <Button className="btn btn-danger" onClick={(e) => DeleteCandidateInEshkolFromEshkol(candidateineshkol, e)} style={{ padding: '11px 20px 11px 20px' }}>X</Button>
                                </Col>
                              </Row>
                            </Col> :
                            <Col xs={12} md={6} key={index} style={{ direction: "rtl", paddingTop: '15px' }}>
                              <Row style={{ backgroundColor: 'rgb(208 204 255)', direction: "rtl", boxShadow: '0px 0px 5px 0px rgb(0 0 0 / 40%)', borderRadius: '10px', width: 'inherit', margin: '0px' }}>
                                <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                  <h5 style={{ textAlign: "right", margin: '0px' }}>{candidateineshkol.candidate.user.name} {candidateineshkol.candidate.user.lastname}</h5>
                                </Col>
                                <Col xs={12} md={6} style={{ alignSelf: 'center' }}>
                                  <h5 style={{ textAlign: "right", margin: '0px' }}>הוסף ע"י מנהל מערכת</h5>
                                </Col>
                                <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                                  <Button className="btn btn-danger" onClick={(e) => DeleteCandidateInEshkolFromEshkol(candidateineshkol, e)} style={{ padding: '11px 20px 11px 20px' }}>X</Button>
                                </Col>
                              </Row>
                            </Col>
                    )) : null}
                  </Row>

                  {props.iseshkol == 'false' ?
                    <>
                      <Row style={{ paddingTop: '20px' }}>
                        <Col xs={12} md={12}>
                          <div style={{ textAlign: 'center', paddingTop: '10px' }}>בחר שיבוץ סופי</div>
                          {/* <FormGroup dir="rtl" >
                            <Input type="select" onChange={handleChangeFinalCandidateInEshkol}>
                              <option value={"בחר מועמד"}>בחר מועמד</option>
                              {candidates.map((candidate, index) => (
                                <option key={index} value={index}>{candidate.user.name} {candidate.user.lastname}</option>
                              ))}
                            </Input>
                          </FormGroup> */}
                          <div style={{ textAlign: 'right' }}>
                            <Select1 data={candidates} handleChangeFinalCandidateInEshkol2={handleChangeFinalCandidateInEshkol2} />
                          </div>
                        </Col>
                      </Row>

                      {eshkoldata.finalcandidate ?
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '15px' }}>
                          <Row style={{ backgroundColor: 'rgb(228 228 228)', direction: "rtl", boxShadow: '0px 0px 5px 0px rgb(0 0 0 / 40%)', borderRadius: '10px', width: '50%', margin: '0px' }}>
                            <Col xs={12} md={6} style={{ alignSelf: 'center' }}>
                              <h5 style={{ textAlign: "right", margin: '0px' }}>{eshkoldata.finalcandidate.user.name} {eshkoldata.finalcandidate.user.lastname}</h5>
                            </Col>
                            <Col xs={12} md={6} style={{ alignSelf: 'center' }}>
                              <Button className="btn btn-danger" onClick={(e) => DeleteFinalCandidateFromEshkol(e)} style={{ padding: '11px 20px 11px 20px' }}>X</Button>
                            </Col>
                          </Row>
                        </div> : null}

                    </>
                    : null}

                  <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                    <button className="btn" onClick={clickSubmit}>עדכן אשכול</button>
                  </div>

                </div>
              </CardBody>
            </Card>
          </Row>
        </ModalBody>
      </Modal> : null
  );
}
export default withRouter(EditEshkolForm);;
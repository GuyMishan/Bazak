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
import soldier from "assets/img/soldier.png";
import UnitPreferenceAnimatedMultiSelect from 'components/tafkidipedia/Select/UnitPreferenceAnimatedMultiSelect';

const UnitPreferenceForm = ({ match }) => {
  //mahzor data
  const [mahzordata, setMahzorData] = useState({})
  const [mahzorcandidates, setMahzorCandidates] = useState([]);
  const [job, setJob] = useState([]);
  //mahzor data

  //old-preference
  const [oldunitpreference, setOldunitPreference] = useState({})
  //old-preference

  //unitpreference data
  const [unitpreference, setUnitPreference] = useState({})
  //unitpreference data

  const isDuplicate = (data, obj) => {
    let flag = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].candidate._id == obj._id) {
        flag = true
      }
    }
    return flag;
  }

  const handleChangCandidatesOfPreference = event => {
    if (event.target.value != "בחר מועמד") {
      let tempcandidate = mahzorcandidates[event.target.value];
      let tempunitpreferencepreferencerankings = [...unitpreference.preferencerankings];

      if (!isDuplicate(tempunitpreferencepreferencerankings, tempcandidate)) {
        tempunitpreferencepreferencerankings.push({ candidate: tempcandidate, rank: 1 })
        setUnitPreference({ ...unitpreference, preferencerankings: tempunitpreferencepreferencerankings });
      }
    }
  }

  const handleChangCandidatesOfPreference2 = event => {
    if (event.value != "בחר מועמד") {
      let tempcandidate = mahzorcandidates[event.value];
      let tempunitpreferencepreferencerankings = [...unitpreference.preferencerankings];

      if (!isDuplicate(tempunitpreferencepreferencerankings, tempcandidate)) {
        tempunitpreferencepreferencerankings.push({ candidate: tempcandidate, rank: 1 })
        setUnitPreference({ ...unitpreference, preferencerankings: tempunitpreferencepreferencerankings });
      }
    }
  }

  const handleChangePreferenceRank = event => {
    let temprank = parseInt(event.target.value);
    let tempindex = parseInt(event.target.name);

    let tempunitpreferencepreferencerankings = [...unitpreference.preferencerankings];
    tempunitpreferencepreferencerankings[tempindex].rank = temprank;
    setUnitPreference({ ...unitpreference, preferencerankings: tempunitpreferencepreferencerankings });
  }

  function handleChangePreferenceRemarks(evt) {
    const value = evt.target.value;
    setUnitPreference({ ...unitpreference, [evt.target.name]: value });
  }

  const loadmahzordata = async () => {
    //mahzor - for knowing the status..
    let tempmahzor;
    await axios.get(`http://localhost:8000/api/mahzor/${match.params.mahzorid}`)
      .then(response => {
        tempmahzor = response.data;
        setMahzorData(tempmahzor);
      })
      .catch((error) => {
        console.log(error);
      })

    //jobs
    let result2 = await axios.get(`http://localhost:8000/api/jobinmahzorbyid/${match.params.jobid}`)
    let job = result2.data[0];
    setJob(job);

    if(tempmahzor.status== 2){
      let result1 = await axios.get(`http://localhost:8000/api/activecandidatesbymahzorid/${match.params.mahzorid}`)
      let candidates = result1.data;
      let tempmahzorcandidates = [];
      for (let i = 0; i < candidates.length; i++) {
        tempmahzorcandidates.push({ user: candidates[i].user, mahzor: candidates[i].mahzor._id, _id: candidates[i]._id })
      }
      setMahzorCandidates(tempmahzorcandidates);
    }

    if(tempmahzor.status== 4){
      let result3 = await axios.get(`http://localhost:8000/api/eshkolbyjobinmahzorid/${match.params.jobid}`)
      if(result3.data.length>0)
      {
        let result4 = await axios.get(`http://localhost:8000/api/eshkolbyid/${result3.data[0]._id}`)
        let tempeshkol = result4.data[0];

        let response5 = await axios.get(`http://localhost:8000/api/candidatesbymahzorid/${match.params.mahzorid}`)
        let tempcandidatesinmahzor = response5.data;

        let tempcandidates=[]
        for (let j = 0; j < tempeshkol.candidatesineshkol.length; j++) {
          for (let k = 0; k < tempcandidatesinmahzor.length; k++) {
            if (tempeshkol.candidatesineshkol[j].candidate == tempcandidatesinmahzor[k]._id) {
              tempcandidates.push(tempcandidatesinmahzor[k])
            }
          }
        }
        setMahzorCandidates(tempcandidates);
      }
      else{
        let result1 = await axios.get(`http://localhost:8000/api/activecandidatesbymahzorid/${match.params.mahzorid}`)
        let candidates = result1.data;
        let tempmahzorcandidates = [];
        for (let i = 0; i < candidates.length; i++) {
          tempmahzorcandidates.push({ user: candidates[i].user, mahzor: candidates[i].mahzor._id, _id: candidates[i]._id })
        }
        setMahzorCandidates(tempmahzorcandidates);
      }
    }
  }

  const loadunitpreference = async () => {
    //users
    let result = await axios.get(`http://localhost:8000/api/users`)
    let users = result.data;
    //unitpreference
    let tempunitpreference;
    if (mahzordata.status == 2) {
      let result1 = await axios.get(`http://localhost:8000/api/unitpreferencebyjobinmahzorid/${match.params.jobid}`)
      tempunitpreference = result1.data[0];
    }
    else if (mahzordata.status == 4) {
      let result1 = await axios.get(`http://localhost:8000/api/finalunitpreferencebyjobinmahzorid/${match.params.jobid}`)
      tempunitpreference = result1.data[0];
    }

    if (tempunitpreference) //has unitprefernce to the job
    {
      for (let i = 0; i < tempunitpreference.preferencerankings.length; i++) {
        let result1 = await axios.get(`http://localhost:8000/api/candidate/smartcandidatebyid/${tempunitpreference.preferencerankings[i].candidate}`);
        tempunitpreference.preferencerankings[i].candidate = result1.data[0];
        delete tempunitpreference.preferencerankings[i].__v;
        delete tempunitpreference.preferencerankings[i]._id;
        delete tempunitpreference.preferencerankings[i].candidate.__v;
      }
      tempunitpreference.jobinmahzor = match.params.jobid;
      tempunitpreference.mahzor = match.params.mahzorid;
      setUnitPreference(tempunitpreference);

      let tempoldunitpreferencedata; //if has existing preference save the old one
      if (mahzordata.status == 2) {
        let oldresult = await axios.get(`http://localhost:8000/api/unitpreferencebyjobinmahzorid/${match.params.jobid}`)
        tempoldunitpreferencedata = oldresult.data[0];
        setOldunitPreference(tempoldunitpreferencedata)
      }
      else if (mahzordata.status == 4) {
        let oldresult = await axios.get(`http://localhost:8000/api/finalunitpreferencebyjobinmahzorid/${match.params.jobid}`)
        tempoldunitpreferencedata = oldresult.data[0];
        setOldunitPreference(tempoldunitpreferencedata)
      }
    }
    else { //doesnt has unitprefernce to the job
      setUnitPreference({ preferencerankings: [], jobinmahzor: match.params.jobid, mahzor: match.params.mahzorid })
    }
  }

  async function DeletePreferencerankingFromUnitPreference(preferenceranking) {
    let temppreferencerankings = await unitpreference.preferencerankings;
    temppreferencerankings = temppreferencerankings.filter(function (item) {
      return item !== preferenceranking
    })
    setUnitPreference({ ...unitpreference, preferencerankings: temppreferencerankings });
  }

  const clickSubmit = event => {
    if (unitpreference._id) {
      UpdateUnitPreferenceInDb();
    }
    else {
      AddUnitPreferenceToDb();
    }
  }

  async function AddUnitPreferenceToDb() {
    let tempunitpreference = unitpreference;
    //init preferencerankings candidates to only ids..
    for (let i = 0; i < tempunitpreference.preferencerankings.length; i++) {
      tempunitpreference.preferencerankings[i].candidate = tempunitpreference.preferencerankings[i].candidate._id
    }

    //create all unit preferencerankings 
    let tempunitpreference_preferencerankings_ids = [];

    for (let i = 0; i < tempunitpreference.preferencerankings.length; i++) {
      await axios.post(`http://localhost:8000/api/unitpreferenceranking`, tempunitpreference.preferencerankings[i])
        .then(res => {
          tempunitpreference_preferencerankings_ids.push(res.data._id)
        })
    }

    //create new unit preference
    tempunitpreference.preferencerankings = tempunitpreference_preferencerankings_ids;

    if (mahzordata.status == 2) {
      await axios.post(`http://localhost:8000/api/unitpreference`, tempunitpreference)
        .then(res => {
          toast.success("העדפה עודכנה בהצלחה")
          history.goBack();
        })
    }
    else if (mahzordata.status == 4) {
      await axios.post(`http://localhost:8000/api/finalunitpreference`, tempunitpreference)
        .then(res => {
          toast.success("העדפה עודכנה בהצלחה")
          history.goBack();
        })
    }
  }

  async function UpdateUnitPreferenceInDb() {
    let tempunitpreference = unitpreference;
    //init preferencerankings candidates to only ids..
    for (let i = 0; i < tempunitpreference.preferencerankings.length; i++) {
      tempunitpreference.preferencerankings[i].candidate = tempunitpreference.preferencerankings[i].candidate._id
    }

    //delete all old unit preferencerankings 
    for (let i = 0; i < oldunitpreference.preferencerankings.length; i++) {
      await axios.delete(`http://localhost:8000/api/unitpreferenceranking/${oldunitpreference.preferencerankings[i]._id}`)
        .then(res => {

        })
    }

    //create all unit preferencerankings 
    let tempunitpreference_preferencerankings_ids = [];

    for (let i = 0; i < tempunitpreference.preferencerankings.length; i++) {
      await axios.post(`http://localhost:8000/api/unitpreferenceranking`, tempunitpreference.preferencerankings[i])
        .then(res => {
          tempunitpreference_preferencerankings_ids.push(res.data._id)
        })
    }

    //create new unit preference
    tempunitpreference.preferencerankings = tempunitpreference_preferencerankings_ids;

    if (mahzordata.status == 2) {
      await axios.put(`http://localhost:8000/api/unitpreference/${unitpreference._id}`, tempunitpreference)
        .then(res => {
          toast.success("העדפה עודכנה בהצלחה")
          history.goBack();
        })
    }
    else if (mahzordata.status == 4) {
      await axios.put(`http://localhost:8000/api/finalunitpreference/${unitpreference._id}`, tempunitpreference)
        .then(res => {
          toast.success("העדפה עודכנה בהצלחה")
          history.goBack();
        })
    }
  }

  async function init() {
    await loadmahzordata();
  }

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    loadunitpreference()
  }, [mahzordata])

  return (
    mahzordata.status == 2 || mahzordata.status == 4 ?
      <Container style={{ paddingTop: '80px', direction: 'rtl' }}>
        <Row>
          <Card>
            <CardHeader style={{ direction: 'rtl' }}>
              <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>טופס העדפות יחידה: {job.job ? job.job.jobname : null}</CardTitle>{/*headline*/}
            </CardHeader>

            <CardBody style={{ direction: 'rtl' }}>
              <Container>
                <Row>
                  <Col xs={12} md={12}>
                    {/* <div style={{ textAlign: 'center', paddingTop: '10px' }}>הוסף מועמד</div>
                  <FormGroup dir="rtl" >
                    <Input type="select" onChange={handleChangCandidatesOfPreference}>
                      <option value={"בחר מועמד"}>בחר מועמד</option>
                      {mahzorcandidates.map((candidate, index) => (
                        <option key={index} value={index}>{candidate.user.name} {candidate.user.lastname}</option>
                      ))}
                    </Input>
                  </FormGroup> */}
                    <div style={{ direction: 'rtl', textAlign: 'right' }}>
                      <UnitPreferenceAnimatedMultiSelect data={mahzorcandidates} handleChangCandidatesOfPreference={handleChangCandidatesOfPreference2} />
                    </div>
                  </Col>
                </Row>

                <Row style={{ direction: "rtl", paddingTop: '10px' }} >
                  {unitpreference && unitpreference.preferencerankings ? unitpreference.preferencerankings.map((ranking, index) => (
                    <Col xs={12} md={4} key={index}>
                      <Row style={{ direction: "rtl", boxShadow: '0px 0px 5px 0px rgb(0 0 0 / 40%)', borderRadius: '10px', width: 'inherit' }}>
                        <Col xs={12} md={2} style={{ textAlign: 'center', alignSelf: 'center' }}>
                          <img src={soldier} alt="bookmark" style={{ height: "2rem" }} />
                        </Col>
                        <Col xs={12} md={4} style={{ alignSelf: 'center' }}>
                          <h5 style={{ textAlign: "right", margin: '0px' }}>{ranking.candidate.user.name} {ranking.candidate.user.lastname}</h5>
                        </Col>
                        <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                          <Input type="select" name={index} value={ranking.rank} onChange={handleChangePreferenceRank}>
                            <option value={"1"}>1</option>
                            <option value={"2"}>2</option>
                            <option value={"3"}>3</option>
                            <option value={"4"}>4</option>
                            <option value={"5"}>5</option>
                            <option value={"6"}>6</option>
                          </Input>
                        </Col>
                        <Col xs={12} md={3} style={{ alignSelf: 'center' }}>
                          <Button className="btn btn-danger" onClick={(e) => DeletePreferencerankingFromUnitPreference(ranking, e)} style={{ padding: '11px 20px 11px 20px' }}>X</Button>
                        </Col>
                      </Row>
                    </Col>
                  )) : null}
                </Row>

                <div style={{ textAlign: 'right', paddingTop: '10px' }}>הערות</div>
                <Input placeholder="הערות" type="string" name="remarks" value={unitpreference.remarks} onChange={handleChangePreferenceRemarks} />

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
export default withRouter(UnitPreferenceForm);;
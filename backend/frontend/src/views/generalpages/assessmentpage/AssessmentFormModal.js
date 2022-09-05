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
import { signin, authenticate, isAuthenticated } from 'auth/index';
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";
import Select from 'components/general/Select/AnimatedSelect'
import deletepic from "assets/img/delete.png";
import { singleFileUpload } from "data/api";

const AssessmentFormModal = (props) => {
  const { user } = isAuthenticated()
  //assessmentdata
  const [assessmentdata, setAssessmentData] = useState({})
  const [singleFile, setSingleFile] = useState("");
  const SingleFileChange = (e) => {
    setSingleFile(e.target.files[0]);
  };
  //
  const [pikods, setPikods] = useState([]);

  const loadassessmentdata = async () => {
    await axios.get(`http://localhost:8000/api/assessment/${props.assessmentdataid}`)
      .then(response => {
        let tempassessmentdata = response.data[0];
        if (tempassessmentdata.latest_recalibration_date)
          tempassessmentdata.latest_recalibration_date = tempassessmentdata.latest_recalibration_date.slice(0, 10);
        setAssessmentData(tempassessmentdata);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const loadPikods = async () => {
    await axios.get("http://localhost:8000/api/pikod",)
      .then(response => {
        setPikods(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function handleChange(evt) {
    const value = evt.target.value;
    if (value != "בחר") {
      setAssessmentData({ ...assessmentdata, [evt.target.name]: value });
    }
    else {

    }
  }

  function handleChange2(selectedOption, name) {
    if (!(selectedOption.value == "בחר"))
      setAssessmentData({ ...assessmentdata, [name]: selectedOption.value });
    else {

    }
  }

  const clickSubmit = event => {
    CheckFormData()
  }

  const CheckFormData = () => {//check for stuff isnt empty -> specially cartypes/units
    var flag = true;
    var ErrorReason = "";

    //   if (((assessmentdata.carnumber == undefined) || (assessmentdata.carnumber == ""))) {
    //     ErrorReason += ", שדה חסר צ'"
    //     flag = false;
    //   }

    //   if (((assessmentdata.pikod == undefined) || (assessmentdata.pikod == "")) || ((assessmentdata.ogda == undefined) || (assessmentdata.ogda == "")) || ((assessmentdata.hativa == undefined) || (assessmentdata.hativa == "")) || ((assessmentdata.gdod == undefined) || (assessmentdata.gdod == ""))) {
    //     ErrorReason += ", פרטי יחידה לא מלאים"
    //     flag = false;
    //   }

    //   if (((assessmentdata.magadal == undefined) || (assessmentdata.magadal == "")) || ((assessmentdata.magad == undefined) || (assessmentdata.magad == "")) || ((assessmentdata.mkabaz == undefined) || (assessmentdata.mkabaz == "")) || ((assessmentdata.makat == undefined) || (assessmentdata.makat == ""))) {
    //     ErrorReason += ", פרטי סוג הכלי לא מלאים"
    //     flag = false;
    //   }

    //   if (((assessmentdata.zminot == undefined) || (assessmentdata.zminot == "")) || ((assessmentdata.kshirot == undefined) || (assessmentdata.kshirot == ""))) {
    //     ErrorReason += ",חובה להזין האם הכלי זמין/כשיר"
    //     flag = false;
    //   }

    //   if ((assessmentdata.zminot == 'לא זמין') || (assessmentdata.kshirot == 'לא כשיר')) {
    //     if (finalspecialkeytwo.length == 0) {
    //       ErrorReason += "חובה להזין את סיבת אי-הזמינות/אי-הכשירות"
    //       flag = false;
    //     }
    //   }

    if (flag == true) {
      if (props.assessmentdataid != undefined) {
        UpdateAssessmentData();
      }
      else {
        CreateAssessmentData();
      }
    } else {
      toast.error(ErrorReason);
    }
  }


  async function CreateAssessmentData() {
    //create assessmentdata
    let tempassessmentdata = { ...assessmentdata }
    delete tempassessmentdata._id;
    let result = await axios.post(`http://localhost:8000/api/assessment`, tempassessmentdata);
    if (singleFile != "" || singleFile != undefined) {
      await UploadFile(result.data._id);
    }
    toast.success("הערכת מצב נוספה");
    props.ToggleForModal();
    // window.location.reload();
  }

  async function UpdateAssessmentData() {
    //update assessmentdata
    var tempassessmentdataid = props.assessmentdataid;
    let tempassessmentdata = { ...assessmentdata }
    let result = await axios.put(`http://localhost:8000/api/assessment/${tempassessmentdataid}`, tempassessmentdata)
    if (singleFile != "" || singleFile != undefined) {
      await UploadFile(result.data._id);
    }
    toast.success("הערכת מצב עודכנה");
    props.ToggleForModal();
  }

  const UploadFile = async (filenameindb) => {
    const formData = new FormData();
    formData.append("file", singleFile);
    await singleFileUpload(formData, "assessment", filenameindb);
  };

  function init() {
    if (props.assessmentdataid != undefined) {
      loadassessmentdata();
    }
    else {

    }
    loadPikods();
    //loadogdas maybe to be added
  }

  useEffect(() => {
    if (props.isOpen == true)
      init();
    else {
      setAssessmentData({});
      setSingleFile("");
    }
  }, [props.isOpen])

  return (
    <Modal
      style={{ minHeight: '100%', maxHeight: '100%', minWidth: '80%', maxWidth: '80%', justifyContent: 'center', alignSelf: 'center', margin: '0px', margin: 'auto', direction: 'rtl' }}
      isOpen={props.isOpen}
      centered
      fullscreen
      scrollable
      size=""
      toggle={props.Toggle}>
      <ModalBody>
        <Card>
          <CardHeader style={{ direction: 'rtl' }}>
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>טופס הערכת מצב</CardTitle>{/*headline*/}
          </CardHeader>
          <CardBody style={{ direction: 'rtl' }}>
            <Container>

              {props.user.role == '0' ?
                <Row>
                  {(!(assessmentdata.pikod)) ?
                    <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                      <div style={{ textAlign: 'right', paddingTop: '10px' }}>פיקוד</div>
                      <Select data={pikods} handleChange2={handleChange2} name={'pikod'} val={assessmentdata.pikod ? assessmentdata.pikod : undefined} />
                    </Col> :
                    <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                      <div style={{ textAlign: 'right', paddingTop: '10px' }}>פיקוד</div>
                      <Select data={pikods} handleChange2={handleChange2} name={'pikod'} val={assessmentdata.pikod ? assessmentdata.pikod : undefined} />
                    </Col>}

                  <Col>
                    <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם היחידה באנגלית (שם תואם לתמונה במערכת)</div>
                    <Input placeholder="שם היחידה באנגלית (שם תואם לתמונה במערכת)" type="text" name="englishname" value={assessmentdata.englishname} onChange={handleChange} />
                  </Col>
                </Row>
                : null}

              <Row>
                <Col >
                  <div style={{ textAlign: "center", paddingTop: "10px" }}>
                    צירוף מסמך
                  </div>
                  <Input
                    type="file"
                    name="documentUpload"
                    // value={document.documentUpload}
                    onChange={(e) => SingleFileChange(e)}
                  ></Input>
                </Col>
              </Row>

              <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                <button className="btn" onClick={clickSubmit}>עדכן</button>
              </div>
            </Container>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(AssessmentFormModal);;
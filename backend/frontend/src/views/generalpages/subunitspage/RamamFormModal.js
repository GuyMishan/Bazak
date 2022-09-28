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

const RamamFormModal = (props) => {
  const { user } = isAuthenticated()
  //ramam
  const [ramam, setRamam] = useState({})

  const loadramam = async () => {
    await axios.get(`http://localhost:8000/api/ramam/${props.ramamid}`)
      .then(response => {
        let tempramam = response.data[0];
        setRamam(tempramam);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function handleChange(evt) {
    const value = evt.target.value;
    if (value != "בחר") {
      setRamam({ ...ramam, [evt.target.name]: value });
    }
  }

  const clickSubmit = event => {
    CheckFormData()
  }

  const CheckFormData = () => {//check for stuff isnt empty 
    var flag = true;
    var ErrorReason = "";

    if (((ramam.see == undefined) || (ramam.see == ""))) {
      ErrorReason += ", שדה חסר רואה"
      flag = false;
    }

    if (((ramam.estimate == undefined) || (ramam.estimate == ""))) {
      ErrorReason += ", שדה חסר מעריך"
      flag = false;
    }

    if (((ramam.suggest == undefined) || (ramam.suggest == ""))) {
      ErrorReason += ", שדה חסר ממליץ"
      flag = false;
    }

    if (flag == true) {
      if (props.ramamid != undefined) {
        UpdateRamam();
      }
      else {
        CreateRamam();
      }
    } else {
      toast.error(ErrorReason);
    }
  }


  async function CreateRamam() {
    //create ramam
    let tempramam = { ...ramam }
    tempramam.unitid = props.unitid;
    tempramam.userid = user._id;
    let result = await axios.post(`http://localhost:8000/api/ramam`, tempramam);
    toast.success(`רמ"מ נוסף בהצלחה`);
    props.ToggleForModal();
  }

  async function UpdateRamam() {
    //update ramam
    var tempramamid = props.ramamid;
    let tempramam = { ...ramam }
    let result = await axios.put(`http://localhost:8000/api/ramam/${tempramamid}`, tempramam)
    toast.success(`רמ"מ עודכן בהצלחה`);
    props.ToggleForModal();
  }

  function init() {
    if (props.ramamid != undefined) {
      loadramam();
    }
  }

  useEffect(() => {
    if (props.isOpen == true)
      init();
    else {
      setRamam({})
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
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>טופס רמ"מ</CardTitle>{/*headline*/}
          </CardHeader>
          <CardBody style={{ direction: 'rtl' }}>
            <Container>

              <Row>
                <Col xs={12} md={4}>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>רואה</div>
                  <Input placeholder="רואה" type="textarea" name="see" value={ramam.see} onChange={handleChange} />
                </Col>

                <Col xs={12} md={4}>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>מעריך</div>
                  <Input placeholder="מעריך" type="textarea" name="estimate" value={ramam.estimate} onChange={handleChange} />
                </Col>

                <Col xs={12} md={4}>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>ממליץ</div>
                  <Input placeholder="ממליץ" type="textarea" name="suggest" value={ramam.suggest} onChange={handleChange} />
                </Col>
              </Row>

              {(user.site_permission == undefined || user.site_permission == 'צפייה ועריכה') ?
                <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                  <button className="btn" onClick={clickSubmit}>עדכן</button>
                </div> : null}
            </Container>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(RamamFormModal);;
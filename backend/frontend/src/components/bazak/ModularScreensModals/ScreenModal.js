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

const ScreenModal = (props) => {
  const { user } = isAuthenticated()
  //
  const [screendata, setScreenData] = useState({})

  function handleChange(evt) {
    const value = evt.target.value;
    if (value != "בחר") {
      setScreenData({ ...screendata, [evt.target.name]: value });
    }
  }

  const clickSubmit = async () => {
    CheckFormData();
  }

  const CheckFormData = async () => {
    var flag = true;
    var ErrorReason = "";
    if (((screendata.name == undefined) || (screendata.name == ""))) {
      ErrorReason += ", חסר שם מסך"
      flag = false;
    }
    if (((screendata.screenid == undefined) || (screendata.screenid == ""))) {
      ErrorReason += ", חסר מזהה מסך"
      flag = false;
    }
    if (((screendata.chartsinline == undefined) || (screendata.chartsinline == ""))) {
      ErrorReason += ", חסר מספר תרשימים בשורה "
      flag = false;
    }

    if (flag == true) {
      if (props.screenid != undefined) {
        UpdateScreen();
      }
      else {
        createNewScreen();
      }
    } else {
      toast.error(ErrorReason);
    }
  }

  const createNewScreen = async () => {
    let tempscreendata = { ...screendata }
    tempscreendata.userpersonalnumber = user.personalnumber;
    let response = axios.post(`http://localhost:8000/api/modularscreens/screen`, tempscreendata)
    .then(respone=>{
      toast.success(`מסך נשמר בהצלחה`);
      props.init();
      props.ToggleForModal();
    })
  }

  async function UpdateScreen() {
    var tempscreenid = props.screenid;
    let tempscreendata = { ...screendata }
    let result = await axios.put(`http://localhost:8000/api/modularscreens/screen/${tempscreenid}`, tempscreendata)
    .then(respone=>{
      toast.success(`מסך עודכן בהצלחה`);
      props.init();
      props.ToggleForModal();
    })
  }

  const loadscreendata = async () => {
    var tempscreenid = props.screenid;
    await axios.get(`http://localhost:8000/api/modularscreens/screenbyscreenid/${tempscreenid}`)
      .then(response => {
        let tempscreen = response.data[0];
        setScreenData(tempscreen);
      })
      .catch((error) => {
        console.log(error);
      })
  }


  function init() {
    if (props.screenid != undefined) {
      loadscreendata();
    }
    else {

    }
  }

  useEffect(() => {
    if (props.isOpen == true)
      init();
    else {
      setScreenData({})
    }
  }, [props.isOpen])

  return (
    <Modal
      style={{ minHeight: '100%', maxHeight: '100%', minWidth: '30%', maxWidth: '40%', justifyContent: 'center', alignSelf: 'center', margin: '0px', margin: 'auto', direction: 'rtl' }}
      isOpen={props.isOpen}
      centered
      fullscreen
      scrollable
      size=""
      toggle={props.Toggle}>
      <ModalBody>
        {props.screenid ?
          <h1 style={{ textAlign: 'center' }}>עריכת מסך</h1>
          :
          <h1 style={{ textAlign: 'center' }}>יצירת מסך</h1>
        }
        <div>
          <Col xs={12} md={4}>
            <div style={{ textAlign: 'right', paddingTop: '10px' }}>מזהה מסך: </div>
            {props.screenid ?
              <Input type="text" name="screenid" value={screendata.screenid} onChange={handleChange} disabled />
              :
              <Input type="text" name="screenid" value={screendata.screenid} onChange={handleChange} />
            }
          </Col>
          <Col xs={12} md={4}>
            <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם מסך: </div>
            <Input type="text" name="name" value={screendata.name} onChange={handleChange} />
          </Col>
          <Col xs={12} md={4}>
            <div style={{ textAlign: 'right', paddingTop: '10px' }}>מספר תרשימים בשורה: </div>
            <Input type="select" name="chartsinline" value={screendata.chartsinline} onChange={handleChange}>
              <option value={'בחר'}>בחר</option>
              <option value={'4'}>4</option>
              <option value={'3'}>3</option>
              <option value={'2'}>2</option>
              <option value={'1'}>1</option>
            </Input>
          </Col>
          <Col>
            <button className='btn-new-blue' style={{ margin: '3rem' }} onClick={clickSubmit}>שמור</button>
          </Col>
        </div>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(ScreenModal);
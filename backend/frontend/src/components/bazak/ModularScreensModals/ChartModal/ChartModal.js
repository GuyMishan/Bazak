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

const ChartModal = (props) => {
  const { user } = isAuthenticated()
  //
  const [chartdata, setChartData] = useState({})

  function handleChange(evt) {
    const value = evt.target.value;
    if (value != "בחר") {
      setChartData({ ...chartdata, [evt.target.name]: value });
    }
  }

  const clickSubmit = async () => {//add יחידות וכלים
    CheckFormData();
  }

  const CheckFormData = async () => {
    var flag = true;
    var ErrorReason = "";
    if (((chartdata.name == undefined) || (chartdata.name == ""))) {
      ErrorReason += ", חסר שם תרשים"
      flag = false;
    }
    if (((chartdata.chartid == undefined) || (chartdata.chartid == ""))) {
      ErrorReason += ", חסר מזהה תרשים"
      flag = false;
    }

    if (flag == true) {
      if (props.chartid != undefined) {
        UpdateChart();
      }
      else {
        createNewChart();
      }
    } else {
      toast.error(ErrorReason);
    }
  }

  const createNewChart = async () => {//chartid must be unique
    let tempchartdata = { ...chartdata }
    tempchartdata.screenid = props.screenid;
    console.log(tempchartdata);
    let response = await axios.post(`http://localhost:8000/api/modularscreens/chart`, tempchartdata)
    .then(response =>{
        toast.success(`תרשים נשמר בהצלחה`);
        props.init();
        props.ToggleForModal();
        })
  }

  async function UpdateChart() {
    var tempchartid = props.chartid;
    let tempchartdata = { ...chartdata }
    let result = await axios.put(`http://localhost:8000/api/modularscreens/chart/${tempchartid}`, tempchartdata)
    toast.success(`תרשים עודכן בהצלחה`);
    props.init();
    props.ToggleForModal();
  }

  const loadchartdata = async () => {
    var tempchartid = props.chartid;
    await axios.get(`http://localhost:8000/api/modularscreens/chartbychartid/${tempchartid}`)
      .then(response => {
        let tempchart = response.data[0];
        setChartData(tempchart);
      })
      .catch((error) => {
        console.log(error);
      })
  }


  function init() {
    if (props.chartid != undefined) {
      loadchartdata();
    }
    else {

    }
  }

  useEffect(() => {
    if (props.isOpen == true)
      init();
    else {
      setChartData({})
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
        {props.chartid ?
          <h1 style={{ textAlign: 'center' }}>עריכת תרשים</h1>
          :
          <h1 style={{ textAlign: 'center' }}>יצירת תרשים</h1>
        }
        <div>
          <Col xs={12} md={4}>
            <div style={{ textAlign: 'right', paddingTop: '10px' }}>מזהה תרשים: </div>
            {props.chartid ?
              <Input type="text" name="chartid" value={chartdata.chartid} onChange={handleChange} disabled />
              :
              <Input type="text" name="chartid" value={chartdata.chartid} onChange={handleChange} />
            }
          </Col>
          <Col xs={12} md={4}>
            <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם תרשים: </div>
            <Input type="text" name="name" value={chartdata.name} onChange={handleChange} />
          </Col>
          <Col xs={12} md={4}>
            
          </Col>
          <Col>
            <button className='btn-new-blue' style={{ margin: '3rem' }} onClick={clickSubmit}>שמור</button>
          </Col>
        </div>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(ChartModal);
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
import deletepic from "assets/img/delete.png";
import UnitsFilterObject from './UnitsFilterObject';
import CarTypesFilterObject from './CarTypesFilterObject';
import NormalAnimatedMultiSelect from 'components/general/Select/NormalAnimatedMultiSelect'

const ChartModal = (props) => {
  const { user } = isAuthenticated()
  //chartdata
  const [chartdata, setChartData] = useState({})
  const [unitsfilterarray, setUnitsfilterarray] = useState([])
  const [cartypesfilterarray, setCartypesfilterarray] = useState([])
  //form
  const [chartidimport, setChartidimport] = useState('')
  const [possiblestands, setPossiblestands] = useState([{ label: 'סדיר', value: 'סדיר' }, { label: 'הכן', value: 'הכן' }, { label: 'הח"י', value: 'הח"י' }])
  const [possiblestatusses, setPossiblestatusses] = useState([{ label: 'פעיל', value: 'פעיל' }, { label: 'מושבת', value: 'מושבת' }, { label: 'מיועד להשבתה', value: 'מיועד להשבתה' }])

  const shortid = require('shortid')
  shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

  function handleChangeChartidimport(evt) {
    const value = evt.target.value;
    setChartidimport(value);
  }

  const ImportChartfunc = async () => {
    let tempchartidimport = chartidimport;
    if (tempchartidimport != '') {
      let response = await axios.get(`http://localhost:8000/api/modularscreens/chartbychartid/${tempchartidimport}`)
      if (response.data.length > 0) {//תרשים נמצא
        let tempchart = { ...response.data[0] };
        delete tempchart._id;
        delete tempchart.chartid;
        if (chartdata.chartid) { //for update
          tempchart.chartid = chartdata.chartid;
        }
        setChartData(tempchart);
        setUnitsfilterarray([]);
        setCartypesfilterarray([]);
        setUnitsfilterarray(tempchart.units);
        setCartypesfilterarray(tempchart.tenetree);
        toast.success(`תרשים נמצא`);
      }
      else {//תרשים לא נמצא
        toast.error(`תרשים לא נמצא`);
      }
    }
  }

  function handleChange(evt) {
    const value = evt.target.value;
    if (value != "בחר") {
      setChartData({ ...chartdata, [evt.target.name]: value });
    }
  }

  function handleChange8(selectedOption, name) {
    if (!(selectedOption.value == "בחר")) {
      let tempvalues = [];
      for (let i = 0; i < selectedOption.length; i++) {
        tempvalues.push(selectedOption[i].value);
      }
      setChartData({ ...chartdata, [name]: tempvalues });
    }
    else {
      let tempchartdata = { ...chartdata };
      delete tempchartdata[name];
      setChartData(tempchartdata);
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

    if (((unitsfilterarray.length==0))) {
      ErrorReason += ", יחידות לא מוגדרות"
      flag = false;
    }

    if (((cartypesfilterarray.length==0))) {
      ErrorReason += ", כלים לא מוגדרים"
      flag = false;
    }

    if (((chartdata.stand == undefined) || (chartdata.stand.length==0))) {
      ErrorReason += ", מעמד רכבים לא מוגדר"
      flag = false;
    }

    if (((chartdata.status == undefined) || (chartdata.status.length==0))) {
      ErrorReason += ", סטאטוס רכבים לא מוגדר"
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

  const createNewChart = async () => {
    let tempchartdata = { ...chartdata }
    tempchartdata.screenid = props.screenid;
    tempchartdata.chartid = await GenerateChartid();

    let tempunitsfilterarray = unitsfilterarray;
    let tempunitsfilterarray2 = [];
    let lastUnitKey;
    let lastUnitValue;
    for (let i = 0; i < tempunitsfilterarray.length; i++) {
      let tempobject = {};
      tempobject.id = tempunitsfilterarray[i].id;
      if(tempunitsfilterarray[i].pikod){
        if(tempunitsfilterarray[i].ogda){
          if(tempunitsfilterarray[i].hativa){
            if(tempunitsfilterarray[i].gdod){
              lastUnitKey = 'gdod'
              lastUnitValue = tempunitsfilterarray[i].gdod
            }
            else{
              lastUnitKey = 'hativa'
              lastUnitValue = tempunitsfilterarray[i].hativa
            }
          }
          else{
            lastUnitKey = 'ogda'
            lastUnitValue = tempunitsfilterarray[i].ogda
          }
        }
        else{
          lastUnitKey = 'pikod'
          lastUnitValue = tempunitsfilterarray[i].pikod
        }
      }
      tempobject[lastUnitKey] = lastUnitValue;
      tempunitsfilterarray2.push(tempobject);
    }
    tempchartdata.units = tempunitsfilterarray2;

    let tempcartypesfilterarray = cartypesfilterarray;
    let tempcartypesfilterarray2 = [];
    let lastCarKey;
    let lastCarValue;
    for (let i = 0; i < tempcartypesfilterarray.length; i++) {
      let tempobject = {};
      tempobject.id = tempcartypesfilterarray[i].id;
      if(tempcartypesfilterarray[i].magadal){
        if(tempcartypesfilterarray[i].magad){
          if(tempcartypesfilterarray[i].mkabaz){
            if(tempcartypesfilterarray[i].makat){
              lastCarKey = 'makat'
              lastCarValue = tempcartypesfilterarray[i].makat
            }
            else{
              lastCarKey = 'mkabaz'
              lastCarValue = tempcartypesfilterarray[i].mkabaz
            }
          }
          else{
            lastCarKey = 'magad'
            lastCarValue = tempcartypesfilterarray[i].magad
          }
        }
        else{
          lastCarKey = 'magadal'
          lastCarValue = tempcartypesfilterarray[i].magadal
        }
      }
      tempobject[lastCarKey] = lastCarValue;
      tempcartypesfilterarray2.push(tempobject);
    }
    tempchartdata.tenetree = tempcartypesfilterarray2;

    let response = await axios.post(`http://localhost:8000/api/modularscreens/chart`, tempchartdata)
      .then(response => {
        toast.success(`תרשים נשמר בהצלחה`);
        props.init();
        props.ToggleForModal();
      })
  }

  const GenerateChartid = async () => {
    let flag = true;
    let tempgeneratedid;
    while (flag) {
      tempgeneratedid = shortid.generate();
      tempgeneratedid = tempgeneratedid.substring(0, 5);
      tempgeneratedid = 'ch-' + tempgeneratedid;
      let response = await axios.get(`http://localhost:8000/api/modularscreens/chartbychartid/${tempgeneratedid}`)
      if (response.data.length == 0) {
        flag = false;
        return tempgeneratedid;
      }
      else {
        flag = true;
      }
    }
  }

  async function UpdateChart() {
    var tempchartid = props.chartid;
    let tempchartdata = { ...chartdata }

    let tempunitsfilterarray = unitsfilterarray;
    let tempunitsfilterarray2 = [];
    let lastUnitKey;
    let lastUnitValue;
    for (let i = 0; i < tempunitsfilterarray.length; i++) {
      let tempobject = {};
      tempobject.id = tempunitsfilterarray[i].id;
      if(tempunitsfilterarray[i].pikod){
        if(tempunitsfilterarray[i].ogda){
          if(tempunitsfilterarray[i].hativa){
            if(tempunitsfilterarray[i].gdod){
              lastUnitKey = 'gdod'
              lastUnitValue = tempunitsfilterarray[i].gdod
            }
            else{
              lastUnitKey = 'hativa'
              lastUnitValue = tempunitsfilterarray[i].hativa
            }
          }
          else{
            lastUnitKey = 'ogda'
            lastUnitValue = tempunitsfilterarray[i].ogda
          }
        }
        else{
          lastUnitKey = 'pikod'
          lastUnitValue = tempunitsfilterarray[i].pikod
        }
      }
      tempobject[lastUnitKey] = lastUnitValue;
      tempunitsfilterarray2.push(tempobject);
    }
    tempchartdata.units = tempunitsfilterarray2;

    let tempcartypesfilterarray = cartypesfilterarray;
    let tempcartypesfilterarray2 = [];
    let lastCarKey;
    let lastCarValue;
    for (let i = 0; i < tempcartypesfilterarray.length; i++) {
      let tempobject = {};
      tempobject.id = tempcartypesfilterarray[i].id;
      if(tempcartypesfilterarray[i].magadal){
        if(tempcartypesfilterarray[i].magad){
          if(tempcartypesfilterarray[i].mkabaz){
            if(tempcartypesfilterarray[i].makat){
              lastCarKey = 'makat'
              lastCarValue = tempcartypesfilterarray[i].makat
            }
            else{
              lastCarKey = 'mkabaz'
              lastCarValue = tempcartypesfilterarray[i].mkabaz
            }
          }
          else{
            lastCarKey = 'magad'
            lastCarValue = tempcartypesfilterarray[i].magad
          }
        }
        else{
          lastCarKey = 'magadal'
          lastCarValue = tempcartypesfilterarray[i].magadal
        }
      }
      tempobject[lastCarKey] = lastCarValue;
      tempcartypesfilterarray2.push(tempobject);
    }
    tempchartdata.tenetree = tempcartypesfilterarray2;

    let result = await axios.put(`http://localhost:8000/api/modularscreens/chart/${tempchartid}`, tempchartdata)
      .then(respone => {
        toast.success(`תרשים עודכן בהצלחה`);
        props.init();
        props.ToggleForModal();
      })
  }

  const loadchartdata = async () => {
    var tempchartid = props.chartid;
    await axios.get(`http://localhost:8000/api/modularscreens/chartbychartid/${tempchartid}`)
      .then(response => {
        let tempchart = response.data[0];
        setChartData(tempchart);
        setUnitsfilterarray(tempchart.units);
        setCartypesfilterarray(tempchart.tenetree);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function init() {
    if (props.chartid != undefined) {
      loadchartdata();
    }
  }

  useEffect(() => {
    if (props.isOpen == true)
      init();
    else {
      setChartData({})
      setUnitsfilterarray([])
      setCartypesfilterarray([])
      setChartidimport('')
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
          <Row style={{ padding: '0px' }}>
            <Col style={{ padding: '0px' }} xs={12} md={4}>
              <div style={{ textAlign: 'right', paddingTop: '10px' }}>ייבוא תרשים: </div>
              <Input type="text" value={chartidimport} onChange={handleChangeChartidimport} />
            </Col>
            <Col xs={12} md={4} style={{ justifyContent: 'center' }}>
              <button className='btn-new-blue' style={{ margin: '0px', marginTop: '32px' }} onClick={ImportChartfunc}>חפש תרשים</button>
            </Col>
          </Row>

          {chartdata.chartid ?
            <Row style={{ padding: '0px' }}>
              <Col style={{ padding: '0px' }} xs={12} md={12}>
                <div style={{ textAlign: 'right', paddingTop: '10px' }}>מזהה תרשים:  {chartdata.chartid}</div>
              </Col>
            </Row>
            :
            null}

          <Row style={{ padding: '0px' }}>
            <Col style={{ padding: '0px' }} xs={12} md={4}>
              <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם תרשים: </div>
              <Input type="text" name="name" value={chartdata.name} onChange={handleChange} />
            </Col>
          </Row>

          {/* unitsfilterarray */}
          <Row style={{ padding: '0px' }}>
            <Col style={{ display: 'flex', justifyContent: 'right', paddingTop: '15px', paddingRight: '0px' }}>
              <Button style={{ width: '100px', padding: '10px' }} type="button" onClick={() => { setUnitsfilterarray(currentSpec => [...currentSpec, { id: generate() }]) }}>הוסף יחידה</Button>
            </Col>
          </Row>

          {unitsfilterarray.map((unitfilterobject, index) => {
            return (
              <UnitsFilterObject user={user} unitfilterobject={unitfilterobject} index={index} setUnitsfilterarray={setUnitsfilterarray} />
            )
          })}
          {/* unitsfilterarray */}

          {/* cartypesfilterarray */}
          <Row style={{ padding: '0px' }}>
            <Col style={{ display: 'flex', justifyContent: 'right', paddingTop: '15px', paddingRight: '0px' }}>
              <Button style={{ width: '100px', padding: '10px' }} type="button" onClick={() => { setCartypesfilterarray(currentSpec => [...currentSpec, { id: generate() }]) }}>הוסף כלים</Button>
            </Col>
          </Row>

          {cartypesfilterarray.map((cartypesfilterobject, index) => {
            return (
              <CarTypesFilterObject user={user} cartypesfilterobject={cartypesfilterobject} index={index} setCartypesfilterarray={setCartypesfilterarray} />
            )
          })}
          {/* cartypesfilterarray */}

          <Row style={{ padding: '0px' }}>
            <Col style={{ paddingRight: '0px', justifyContent: 'right', alignContent: 'right', textAlign: 'right' }} xs={12} md={6}>
              <div style={{ textAlign: 'right', paddingTop: '10px' }}>מעמד</div>
              <NormalAnimatedMultiSelect data={possiblestands} handleChange2={handleChange8} name={'stand'} val={chartdata.stand}/>
            </Col>

            <Col style={{ paddingRight: '0px', justifyContent: 'right', alignContent: 'right', textAlign: 'right' }} xs={12} md={6}>
              <div style={{ textAlign: 'right', paddingTop: '10px' }}>סטאטוס כלים</div>
              <NormalAnimatedMultiSelect data={possiblestatusses} handleChange2={handleChange8} name={'status'} val={chartdata.status}/>
            </Col>
          </Row>

          <Row style={{ paddingTop: '10px' }}>
            <Col style={{ padding: '0px' }} xs={12} md={8}>
            </Col>
            <Col style={{ padding: '0px' }} xs={12} md={4}>
              <button className='btn-new-blue' style={{ margin: '0px' }} onClick={clickSubmit}>שמור</button>
            </Col>
          </Row>
        </div>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(ChartModal);
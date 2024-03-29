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
import red from "assets/img/red.png";
import yellow from "assets/img/yellow.png";
import green from "assets/img/green.png";

const ChartModal = (props) => {
  const { user } = isAuthenticated()
  //chartdata
  const [chartdata, setChartData] = useState({})
  const [unitsfilterarray, setUnitsfilterarray] = useState([])
  const [cartypesfilterarray, setCartypesfilterarray] = useState([])
  //form
  const [chartidimport, setChartidimport] = useState('')
  const [possiblestands, setPossiblestands] = useState([{ label: 'סדיר', value: 'סדיר' }, { label: 'הכן', value: 'הכן' }, { label: 'הח"י', value: 'הח"י' }])
  const [possiblestatusses, setPossiblestatusses] = useState([{ label: 'פעיל', value: 'פעיל' }, { label: 'מושבת', value: 'מושבת' }, { label: 'מיועד להשבתה', value: 'מיועד להשבתה' }, { label: 'עצור', value: 'עצור' }])
  //
  const [redchange, setRedchange] = useState(false)
  const [yellowchange, SetYellowchange] = useState(false)

  const shortid = require('shortid')
  shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

  function handleColorClick(evt) {
    const name = evt.currentTarget.getAttribute('name');
    if(name == 'red'){
      if(redchange == true){
        setRedchange(false);
      }else{
        setRedchange(true);
        setChartData({ ...chartdata, ["redcolor"]: 0 });
      }
    }
    if(name == 'yellow'){
      if(yellowchange == true){
        SetYellowchange(false);
      }else{
        SetYellowchange(true);
        setChartData({ ...chartdata, ["yellowcolor"]: 0 });
      }    
    }
  }

  function handleChangeChartidimport(evt) {
    const value = evt.target.value;
    setChartidimport(value);
  }

  const ImportChartfunc = async () => {
    let tempchartidimport = chartidimport;
    if (tempchartidimport != '') {
      let response = await axios.get(`http://localhost:8000/api/modularscreens/chartbychartid/${tempchartidimport}`)
      if (response.data.length > 0) {//שעון נמצא
        let tempchart = { ...response.data[0] };
        delete tempchart._id;
        delete tempchart.chartid;
        delete tempchart.screenid;
        if (chartdata.chartid) { //for update
          tempchart.chartid = chartdata.chartid;
        }
        if (chartdata.screenid) { //for update
          tempchart.screenid = chartdata.screenid;
        }
        if (user.role != '0' || user.role != '5') {
          var flag = true;
          for (var i = 0; i < tempchart.units.length; i++) {
             var targetUnitId = Object.values(tempchart.units[i])[1]
              for(let j=0;j<Object.values(tempchart.units[i])[1].length;j++){
                flag = await importHierarchyCheck(Object.keys(tempchart.units[i])[1], targetUnitId[j], Object.keys(tempchart.units[i])[1]);
                if (!flag) {
                  Object.values(tempchart.units[i])[1].splice(j, 1);
                  j = j - 1;
                }
              }
            if(Object.values(tempchart.units[i])[1].length == 0){
              tempchart.units.splice(i, 1);
              i = i -1;
            }
          }
        }
        setChartData(tempchart);
        setUnitsfilterarray([]);
        setCartypesfilterarray([]);
        setUnitsfilterarray(tempchart.units);
        setCartypesfilterarray(tempchart.tenetree);
        toast.success(`שעון נמצא`);
      }
      else {//שעון לא נמצא
        toast.error(`שעון לא נמצא`);
      }
    }
  }

  async function importHierarchyCheck(targetUnitType, targetUnitId, firstUnitType) {
    if (targetUnitId == unitIdByUserRole() && (unitTypeByUnitRole(firstUnitType) < user.role)) {
      return true;
    } else {
      if (targetUnitType != 'pikod') {
        targetUnitId = await getTargetParentId(targetUnitId, targetUnitType);
        if (targetUnitType == 'gdod') {
          targetUnitType = 'hativa';
        }
        else {
          if (targetUnitType == 'hativa') {
            targetUnitType = 'ogda';
          }
          else {
            if (targetUnitType == 'ogda') {
              targetUnitType = 'pikod';
            }
          }
        }
        return importHierarchyCheck(targetUnitType, targetUnitId, firstUnitType);
      } else {
        return false;
      }
    }
  }

  function unitIdByUserRole() {
    if (user.role === "1") {
      return user.gdodid;
    }
    if (user.role === "2") {
      return user.hativaid;
    }
    if (user.role === "3") {
      return user.ogdaid;
    }
    if (user.role === "4") {
      return user.pikodid;
    }
  }
  function unitTypeByUnitRole(targetUnitType) {
    if (targetUnitType == "gdod") {
      return "1";
    }
    if (targetUnitType == "hativa") {
      return "2";
    }
    if (targetUnitType == "ogda") {
      return "3";
    }
    if (targetUnitType == "pikod") {
      return "4";
    }
  }
  async function getTargetParentId(targetUnitId, targetUnitType) {
    let response = await axios.get(`http://localhost:8000/api/${targetUnitType}/${targetUnitId}`)
    if (targetUnitType == 'gdod') {
      return response.data.hativa;
    }
    if (targetUnitType == 'hativa') {
      return response.data.ogda;
    }
    if (targetUnitType == 'ogda') {
      return response.data.pikod;
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
      ErrorReason += ", חסר שם שעון"
      flag = false;
    }
    else{
      if(chartdata.name.length>40){
        ErrorReason += ", שם תרשים ארוך מ-40 תווים"
        flag = false;
      }
    }

    if(chartdata.description){
      if(chartdata.description.length>40){
        ErrorReason += ", פירוט ארוך מ-40 תווים"
        flag = false;
      }
    }

    // if(((chartdata.yellowcolor == undefined) || (chartdata.yellowcolor == ""))){
    //   ErrorReason += ", חסר טווח צהוב"
    //   flag = false;
    // }
    // if(((chartdata.redcolor == undefined) || (chartdata.redcolor == ""))){
    //   ErrorReason += ", חסר טווח אדום"
    //   flag = false;
    // }
    if(chartdata.yellowcolor && chartdata.redcolor){
      if(chartdata.yellowcolor>90 || chartdata.yellowcolor<0){
        ErrorReason += ", טווח צהוב חייב להיות גדול מ-0 וקטן או שווה ל-90"
        flag = false;
      }
      if(chartdata.redcolor>90 || chartdata.redcolor<0){
        ErrorReason += ", טווח אדום חייב להיות גדול מ-0 וקטן או שווה ל-90"
        flag = false;
      }
      if(chartdata.yellowcolor<=chartdata.redcolor && (chartdata.yellowcolor != 0 && chartdata.redcolor != 0)){
        ErrorReason += ", טווח צהוב חייב להיות גדול מטווח אדום"
        flag = false;
      }
    }

    if (((unitsfilterarray.length > 0))) {
      let tempflag1 = true;
      for (let i = 0; i < unitsfilterarray.length; i++) {
        if (user.role == '1') {

        } else if (user.role == '2') {
          if (!unitsfilterarray[i].gdod) {
            tempflag1 = false;
          }
        } else if (user.role == '3') {
          if (!unitsfilterarray[i].hativa) {
            tempflag1 = false;
          }
        }
        else if (user.role == '4') {
          if (!unitsfilterarray[i].ogda) {
            tempflag1 = false;
          }
        } else if (user.role == '0' || user.role == '5') {
          if (!unitsfilterarray[i].pikod) {
            tempflag1 = false;
          }
        }
      }
      if (tempflag1 == false) {
        ErrorReason += ", יחידות לא מוגדרות כראוי"
        flag = false;
      }
    }

    if (((cartypesfilterarray.length > 0))) {
      let tempflag2 = true;
      for (let i = 0; i < cartypesfilterarray.length; i++) {
        if (!cartypesfilterarray[i].magadal) {
          tempflag2 = false;
        }
      }
      if (tempflag2 == false) {
        ErrorReason += ", כלים לא מוגדרים כראוי"
        flag = false;
      }
    }

    if (((chartdata.stand == undefined) || (chartdata.stand.length == 0))) {
      ErrorReason += ", מעמד רכבים לא מוגדר"
      flag = false;
    }

    if (((chartdata.status == undefined) || (chartdata.status.length == 0))) {
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
    tempchartdata.index = props.index;

    if(tempchartdata.yellowcolor == undefined){
      tempchartdata.yellowcolor = 0;
    }
    if(tempchartdata.redcolor == undefined){
      tempchartdata.redcolor = 0;
    }

    if (user.role=='1') {
      let tempunitsfilterarray = []
      let tempobject = {};
      tempobject.id = generate();
      tempobject['gdod'] = [user.gdodid];
      tempunitsfilterarray.push(tempobject);
      tempchartdata.units = tempunitsfilterarray;
    }
    else {
      let tempunitsfilterarray = unitsfilterarray;
      let tempunitsfilterarray2 = [];
      let lastUnitKey;
      let lastUnitValue;
      for (let i = 0; i < tempunitsfilterarray.length; i++) {
        let tempobject = {};
        tempobject.id = tempunitsfilterarray[i].id;
        if (tempunitsfilterarray[i].pikod) {
          lastUnitKey = 'pikod'
          lastUnitValue = tempunitsfilterarray[i].pikod
        }

        if (tempunitsfilterarray[i].ogda) {
          lastUnitKey = 'ogda'
          lastUnitValue = tempunitsfilterarray[i].ogda
        }

        if (tempunitsfilterarray[i].hativa) {
          lastUnitKey = 'hativa'
          lastUnitValue = tempunitsfilterarray[i].hativa
        }

        if (tempunitsfilterarray[i].gdod) {
          lastUnitKey = 'gdod'
          lastUnitValue = tempunitsfilterarray[i].gdod
        }

        tempobject[lastUnitKey] = lastUnitValue;
        tempunitsfilterarray2.push(tempobject);
      }
      tempchartdata.units = tempunitsfilterarray2;
    }

    let tempcartypesfilterarray = cartypesfilterarray;
    let tempcartypesfilterarray2 = [];
    let lastCarKey;
    let lastCarValue;
    for (let i = 0; i < tempcartypesfilterarray.length; i++) {
      let tempobject = {};
      tempobject.id = tempcartypesfilterarray[i].id;
      if (tempcartypesfilterarray[i].magadal) {
        lastCarKey = 'magadal'
        lastCarValue = tempcartypesfilterarray[i].magadal
      }

      if (tempcartypesfilterarray[i].magad) {
        lastCarKey = 'magad'
        lastCarValue = tempcartypesfilterarray[i].magad
      }

      if (tempcartypesfilterarray[i].mkabaz) {
        lastCarKey = 'mkabaz'
        lastCarValue = tempcartypesfilterarray[i].mkabaz
      }

      if (tempcartypesfilterarray[i].makat) {
        lastCarKey = 'makat'
        lastCarValue = tempcartypesfilterarray[i].makat
      }

      tempobject[lastCarKey] = lastCarValue;
      tempcartypesfilterarray2.push(tempobject);
    }
    tempchartdata.tenetree = tempcartypesfilterarray2;
    console.log(tempchartdata)
    let response = await axios.post(`http://localhost:8000/api/modularscreens/chart`, tempchartdata)
      .then(response => {
        toast.success(`שעון נשמר בהצלחה`);
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
      if (tempgeneratedid.charAt(0) == '@' || tempgeneratedid.charAt(0) == '$') {
        flag = true;
      }
      else {
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
      if (tempunitsfilterarray[i].pikod) {
        lastUnitKey = 'pikod'
        lastUnitValue = tempunitsfilterarray[i].pikod
      }

      if (tempunitsfilterarray[i].ogda) {
        lastUnitKey = 'ogda'
        lastUnitValue = tempunitsfilterarray[i].ogda
      }

      if (tempunitsfilterarray[i].hativa) {
        lastUnitKey = 'hativa'
        lastUnitValue = tempunitsfilterarray[i].hativa
      }

      if (tempunitsfilterarray[i].gdod) {
        lastUnitKey = 'gdod'
        lastUnitValue = tempunitsfilterarray[i].gdod
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
      if (tempcartypesfilterarray[i].magadal) {
        lastCarKey = 'magadal'
        lastCarValue = tempcartypesfilterarray[i].magadal
      }

      if (tempcartypesfilterarray[i].magad) {
        lastCarKey = 'magad'
        lastCarValue = tempcartypesfilterarray[i].magad
      }

      if (tempcartypesfilterarray[i].mkabaz) {
        lastCarKey = 'mkabaz'
        lastCarValue = tempcartypesfilterarray[i].mkabaz
      }

      if (tempcartypesfilterarray[i].makat) {
        lastCarKey = 'makat'
        lastCarValue = tempcartypesfilterarray[i].makat
      }

      tempobject[lastCarKey] = lastCarValue;
      tempcartypesfilterarray2.push(tempobject);
    }
    tempchartdata.tenetree = tempcartypesfilterarray2;

    let result = await axios.put(`http://localhost:8000/api/modularscreens/chart/${tempchartid}`, tempchartdata)
      .then(respone => {
        toast.success(`שעון עודכן בהצלחה`);
        props.init();
        props.ToggleForModal();
      })
  }

  const loadchartdata = async () => {
    var tempchartid = props.chartid;
    await axios.get(`http://localhost:8000/api/modularscreens/chartbychartid/${tempchartid}`)
      .then(response => {
        let tempchart = response.data[0];
        if(tempchart.redcolor==0){
          setRedchange(true)
        }
        if(tempchart.yellowcolor==0){
          SetYellowchange(true)
        }
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
      setRedchange(false)
      SetYellowchange(false)
    }
  }, [props.isOpen])

  return (
    <Modal
      style={{ minHeight: '100%', maxHeight: '100%', minWidth: '60%', maxWidth: '70%', justifyContent: 'center', alignSelf: 'center', marginTop: (cartypesfilterarray.length+unitsfilterarray.length)>3 ? (cartypesfilterarray.length+unitsfilterarray.length-3)*117/2+'px' : 'auto', direction: 'rtl' }}
      isOpen={props.isOpen}
      centered
      fullscreen
      scrollable
      size=""
      toggle={props.Toggle}>
      <ModalBody>

        {props.chartid ?
          <h1 style={{ textAlign: 'center' }}>עריכת שעון</h1>
          :
          <h1 style={{ textAlign: 'center' }}>יצירת שעון</h1>
        }
        <div>
          <Row style={{ padding: '0px',flexWrap:'nowrap'}}>
            <Col style={{ padding: '0px' }} xs={12} md={4}>
              <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>ייבוא שעון: </h6></div>
              <Input type="text" value={chartidimport} onChange={handleChangeChartidimport} placeholder="ניתן להזין קוד שעון שקיבלת לייבוא!"/> 
            </Col>
            <Col xs={8} md={2} style={{ textAlign: 'right' }}>
              <button className='btn-new-blue' style={{ margin: '0px', marginTop: '33px' }} onClick={ImportChartfunc}>חפש שעון</button>
            </Col>
            <Row style={{flexWrap:'nowrap'}}>
            <Col style={{ padding: '0px',paddingRight:'15px',paddingLeft:'15px'}}>
              <div style={{ textAlign: 'center', paddingTop: '10px'}}>ירוק <img height="20px" src={green}/></div>
              <div style={{display:"flex", alignItems: 'center', width:'140px'}}><Input style={{marginLeft:'3px'}} type="number"  value={100} disabled/> - <Input style={{marginRight:'3px'}} type="number" value={yellowchange? redchange? '0' :chartdata.redcolor :chartdata.yellowcolor} onChange={handleChange} disabled/> </div>
            </Col>
            <Col style={{ padding: '0px',paddingRight:'15px',paddingLeft:'15px'}}>
              <div name='yellow' onClick={handleColorClick} style={{ textAlign: 'center', paddingTop: '10px', cursor: 'pointer', color:'white', textDecoration: yellowchange ? 'line-through' :'none' }}>צהוב <img height="20px" src={yellow}/></div>
              {yellowchange?
              <div style={{display:"flex", alignItems: 'center', width:'140px'}}><Input style={{marginLeft:'3px'}} type="number" name="yellowcolor" value={0} onChange={handleChange} step="10" min="0" max="90" disabled/>-<Input style={{marginRight:'3px'}} type="number"  value={0} disabled/> </div>
              :
              <div style={{display:"flex", alignItems: 'center', width:'140px'}}><Input style={{marginLeft:'3px'}} type="number" name="yellowcolor" value={chartdata.yellowcolor} onChange={handleChange} step="10" min="0" max="90"/>-<Input style={{marginRight:'3px'}} type="number"  value={chartdata.redcolor} disabled/> </div>
              }
            </Col>
            <Col style={{ padding: '0px',paddingRight:'15px',paddingLeft:'15px'}}>
              <div name='red' onClick={handleColorClick}  style={{ textAlign: 'center', paddingTop: '10px', cursor: 'pointer', textDecoration: redchange ? 'line-through' :'none'  }}>אדום <img height="20px" src={red}/></div>
              {redchange?
              <div style={{display:"flex", alignItems: 'center', width:'140px'}}><Input style={{marginLeft:'3px'}} type="number" name="redcolor" value={0} onChange={handleChange} step="10" min="0" max="90" disabled/>-<Input style={{marginRight:'3px'}} type="number"  value={0} disabled/> </div>
              :
              <div style={{display:"flex", alignItems: 'center', width:'140px'}}><Input style={{marginLeft:'3px'}} type="number" name="redcolor" value={chartdata.redcolor} onChange={handleChange} step="10" min="0" max="90"/>-<Input style={{marginRight:'3px'}} type="number"  value={0} disabled/> </div>
              }
            </Col>
            </Row>
          </Row>

          {chartdata.chartid ?
            <Row style={{ padding: '0px' }}>
              <Col style={{ padding: '0px' }} xs={12} md={12}>
                <div style={{ textAlign: 'right', paddingTop: '10px' }}>מזהה שעון:  {chartdata.chartid}</div>
              </Col>
            </Row>
            :
            null}

          <Row style={{ padding: '0px' }}>
            <Col style={{ padding: '0px' }} xs={12} md={4}>
              <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם שעון: </div>
              <Input type="text" name="name" value={chartdata.name} onChange={handleChange} />
              <div style={{ textAlign: 'right', paddingTop: '10px' }}>(שם התרשים לא יכול להיות ארוך יותר מ-40 תווים)</div>
            </Col>
          </Row>
          <Row style={{ padding: '0px' }}>
            <Col style={{ padding: '0px' }} xs={12} md={4}>
              <div style={{ textAlign: 'right', paddingTop: '10px' }}> פירוט(לא חובה): </div>
              <Input type="text" name="description" value={chartdata.description} onChange={handleChange} />
              <div style={{ textAlign: 'right', paddingTop: '10px' }}>(פירוט לא יכול להיות ארוך יותר מ-40 תווים)</div>
            </Col>
          </Row>

          {/* unitsfilterarray */}
          {user.role != '1' ?
            <Row style={{ padding: '0px' }}>
              <Col style={{ display: 'flex', justifyContent: 'right', paddingTop: '15px', paddingRight: '0px' }}>
                <Button style={{ width: '100px', padding: '10px' }} type="button" onClick={() => { setUnitsfilterarray(currentSpec => [...currentSpec, { id: generate() }]) }}>הוסף יחידה</Button>
              </Col>
            </Row>
            :
            null
          }

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
              <NormalAnimatedMultiSelect data={possiblestands} handleChange2={handleChange8} name={'stand'} val={chartdata.stand} />
            </Col>

            <Col style={{ paddingRight: '0px', justifyContent: 'right', alignContent: 'right', textAlign: 'right' }} xs={12} md={6}>
              <div style={{ textAlign: 'right', paddingTop: '10px' }}>סטאטוס כלים</div>
              <NormalAnimatedMultiSelect data={possiblestatusses} handleChange2={handleChange8} name={'status'} val={chartdata.status} />
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
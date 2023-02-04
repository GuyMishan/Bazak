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

const CarDataFilterModal = (props) => {
    const { user } = isAuthenticated()
    const [filtername,SetFiltername] = useState(undefined);

    const shortid = require('shortid')
    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

    const GenerateFilterid = async () => {
        let flag = true;
        let tempgeneratedid;
        while (flag) {
          tempgeneratedid = shortid.generate();
          tempgeneratedid = tempgeneratedid.substring(0, 5);
          if (tempgeneratedid.charAt(0) == '@' || tempgeneratedid.charAt(0) == '$') {
            flag = true;
          }
          else {
            tempgeneratedid = 'fltr-' + tempgeneratedid;
            // let response = await axios.get(`http://localhost:8000/api/filters/cardatafilterbyfilterid/${tempgeneratedid}`)
            // if (response.data.length == 0) {
              flag = false;
              return tempgeneratedid;
            // }
            // else {
            //   flag = true;
            // }
          }
        }
      }

      function handleChange(evt) {
        const value = evt.target.value;
        SetFiltername(value);
      }

    const clickSubmit = async () => {//add יחידות וכלים
        var flag = true;
        var ErrorReason = "";
        if (((filtername == undefined) || (filtername == ""))) {
          ErrorReason += ", חסר שם שעון"
          flag = false;
        }
        else{
            if(filtername.length>40){
            ErrorReason += ", שם תרשים ארוך מ-40 תווים"
            flag = false;
            }
        }

        if (flag == true) {
          createNewChart();
        } else {
          toast.error(ErrorReason);
        }
      }

      const createNewChart = async () => {
        let tempcardatafilterdata = {}
        tempcardatafilterdata.zminots=props.zminots;
        tempcardatafilterdata.kshirots=props.kshirots;
        tempcardatafilterdata.stands=props.stands;
        tempcardatafilterdata.userpersonalnumber = user.personalnumber;
        tempcardatafilterdata.filterid = await GenerateFilterid();
        console.log(tempcardatafilterdata);

        // let tempunitsfilterarray = unitsfilterarray;
        // let tempunitsfilterarray2 = [];
        // let lastUnitKey;
        // let lastUnitValue;
        //   for (let i = 0; i < tempunitsfilterarray.length; i++) {
        //     let tempobject = {};
        //     tempobject.id = tempunitsfilterarray[i].id;
        //     if (tempunitsfilterarray[i].pikod) {
        //       lastUnitKey = 'pikod'
        //       lastUnitValue = tempunitsfilterarray[i].pikod
        //     }
    
        //     if (tempunitsfilterarray[i].ogda) {
        //       lastUnitKey = 'ogda'
        //       lastUnitValue = tempunitsfilterarray[i].ogda
        //     }
    
        //     if (tempunitsfilterarray[i].hativa) {
        //       lastUnitKey = 'hativa'
        //       lastUnitValue = tempunitsfilterarray[i].hativa
        //     }
    
        //     if (tempunitsfilterarray[i].gdod) {
        //       lastUnitKey = 'gdod'
        //       lastUnitValue = tempunitsfilterarray[i].gdod
        //     }
    
        //     tempobject[lastUnitKey] = lastUnitValue;
        //     tempunitsfilterarray2.push(tempobject);
        //   }
        //   tempchartdata.units = tempunitsfilterarray2;
    
        // let tempcartypesfilterarray = cartypesfilterarray;
        // let tempcartypesfilterarray2 = [];
        // let lastCarKey;
        // let lastCarValue;
        // for (let i = 0; i < tempcartypesfilterarray.length; i++) {
        //   let tempobject = {};
        //   tempobject.id = tempcartypesfilterarray[i].id;
        //   if (tempcartypesfilterarray[i].magadal) {
        //     lastCarKey = 'magadal'
        //     lastCarValue = tempcartypesfilterarray[i].magadal
        //   }
    
        //   if (tempcartypesfilterarray[i].magad) {
        //     lastCarKey = 'magad'
        //     lastCarValue = tempcartypesfilterarray[i].magad
        //   }
    
        //   if (tempcartypesfilterarray[i].mkabaz) {
        //     lastCarKey = 'mkabaz'
        //     lastCarValue = tempcartypesfilterarray[i].mkabaz
        //   }
    
        //   if (tempcartypesfilterarray[i].makat) {
        //     lastCarKey = 'makat'
        //     lastCarValue = tempcartypesfilterarray[i].makat
        //   }
    
        //   tempobject[lastCarKey] = lastCarValue;
        //   tempcartypesfilterarray2.push(tempobject);
        // }
        // tempchartdata.tenetree = tempcartypesfilterarray2;
        // console.log(tempchartdata)
        // let response = await axios.post(`http://localhost:8000/api/modularscreens/chart`, tempchartdata)
        //   .then(response => {
        //     toast.success(`שעון נשמר בהצלחה`);
        //     props.init();
        //     props.ToggleForModal();
        //   })
      }

    return (
        <Modal
          style={{ minHeight: '100%', maxHeight: '100%', minWidth: '30%', maxWidth: '30%', justifyContent: 'center', alignSelf: 'center', marginTop: 'auto', direction: 'rtl' }}
          isOpen={props.isOpen}
          centered
          fullscreen
          scrollable
          size=""
          toggle={props.Toggle}>
          <ModalBody>
            <h1 style={{ textAlign: 'center', marginBottom:'0px' }}>שמירת סינון</h1>
            <div>
    
              <Row style={{ padding: '0px' }}>
                <Col style={{ padding: '5px'}} xs={12} md={4}>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}>שם הסינון: </div>
                  <Input type="text" name="name" onChange={handleChange}/>
                </Col>
              </Row>
    
              <Row style={{ paddingTop: '10px' }}>
                <Col style={{ padding: '0px' }} xs={12} md={8}>
                </Col>
                <Col style={{ padding: '5px'}} xs={12} md={4}>
                  <button className='btn-new-blue' style={{ margin: '0px' }} onClick={clickSubmit}>שמור</button>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      );
}
export default withRouter(CarDataFilterModal);
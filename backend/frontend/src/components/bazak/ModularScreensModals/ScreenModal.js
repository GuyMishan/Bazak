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
  const [screendata, setScreenData] = useState({})

  const loadscreendata = async () => {
    await axios.get(`http://localhost:8000/api/modularscreens/${props.screenid}`)
      .then(response => {
        let tempscreen = response.data[0];
        setScreenData(tempscreen);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const clickSubmit = event => {
    CheckFormData()
  }

  const CheckFormData = () => {//check for stuff isnt empty -> specially cartypes/units
    // var flag = true;
    // var ErrorReason = "";

    // if (((cardata.carnumber == undefined) || (cardata.carnumber == ""))) {
    //   ErrorReason += ", שדה חסר צ'"
    //   flag = false;
    // }

    // if (((cardata.pikod == undefined) || (cardata.pikod == "")) || ((cardata.ogda == undefined) || (cardata.ogda == "")) || ((cardata.hativa == undefined) || (cardata.hativa == "")) || ((cardata.gdod == undefined) || (cardata.gdod == ""))) {
    //   ErrorReason += ", פרטי יחידה לא מלאים"
    //   flag = false;
    // }

    // if (((cardata.magadal == undefined) || (cardata.magadal == "")) || ((cardata.magad == undefined) || (cardata.magad == "")) || ((cardata.mkabaz == undefined) || (cardata.mkabaz == "")) || ((cardata.makat == undefined) || (cardata.makat == ""))) {
    //   ErrorReason += ", פרטי סוג הכלי לא מלאים"
    //   flag = false;
    // }

    // if (((cardata.zminot == undefined) || (cardata.zminot == "")) || ((cardata.kshirot == undefined) || (cardata.kshirot == ""))) {
    //   ErrorReason += ",חובה להזין האם הכלי זמין/כשיר"
    //   flag = false;
    // }

    // if ((cardata.zminot == 'לא זמין') || (cardata.kshirot == 'לא כשיר')) {
    //   if (finalspecialkeytwo.length == 0) {
    //     ErrorReason += "חובה להזין את סיבת אי-הזמינות/אי-הכשירות"
    //     flag = false;
    //   }
    // }

    // if (flag == true) {
    //   if (props.cardataid != undefined) {
    //     UpdateCarData();
    //   }
    //   else {
    //     CreateCarData();
    //   }
    // } else {
    //   toast.error(ErrorReason);
    // }
  }


  async function CreateCarData() {
    // let response = await axios.get(`http://localhost:8000/api/cardata/cardatabycarnumber/${cardata.carnumber}`)
    // if (response.data.length > 0) {
    //   if ((!response.data[0].gdod) || (response.data[0].gdod == null) && (!response.data[0].hativa) || (response.data[0].hativa == null) && (!response.data[0].ogda) || (response.data[0].ogda == null) && (!response.data[0].pikod) || (response.data[0].pikod == null)) {
    //     //update cardata
    //     var tempcardataid = response.data[0]._id;
    //     let tempcardata = { ...cardata }
    //     if (tempcardata.zminot == 'זמין' && tempcardata.kshirot == 'כשיר') {
    //       tempcardata.tipuls = [];
    //       tempcardata.takala_info = '';
    //       tempcardata.expected_repair = '';
    //     }
    //     else {
    //       tempcardata.tipuls = finalspecialkeytwo;
    //     }
        
    //     tempcardata.updatedBy = user.personalnumber;
    //     let result = await axios.put(`http://localhost:8000/api/cardata/${tempcardataid}`, tempcardata)
    //     //create archivecardata
    //     delete tempcardata._id;
    //     let result2 = await axios.post(`http://localhost:8000/api/archivecardata`, tempcardata)
    //     toast.success(`צ' עודכן בהצלחה`);
    //     props.ToggleForModal();
    //   }
    //   else {
    //     //find which unit car is already in.
    //     let cardata_unitstr = "";
    //     let gdod_result = await axios.get(`http://localhost:8000/api/gdod/${response.data[0].gdod}`);
    //     let hativa_result = await axios.get(`http://localhost:8000/api/hativa/${response.data[0].hativa}`);
    //     let ogda_result = await axios.get(`http://localhost:8000/api/ogda/${response.data[0].ogda}`);
    //     let pikod_result = await axios.get(`http://localhost:8000/api/pikod/${response.data[0].pikod}`);
    //     cardata_unitstr = pikod_result.data.name + "/" + ogda_result.data.name + "/" + hativa_result.data.name + "/" + gdod_result.data.name;
    //     toast.error(`צ' כבר שייך ליחידה - ${cardata_unitstr} לא ניתן לשנות יחידה`);
    //   }
    // }
    // else {
    //   //create cardata
    //   let tempcardata = { ...cardata }
    //   tempcardata.updatedBy = user.personalnumber;
    //   delete tempcardata._id;
    //   if (tempcardata.zminot == 'זמין' && tempcardata.kshirot == 'כשיר') {
    //     tempcardata.tipuls = [];
    //     delete tempcardata.takala_info;
    //     delete tempcardata.expected_repair;
    //   }
    //   else {
    //     tempcardata.tipuls = finalspecialkeytwo;
    //   }
    //   let result = await axios.post(`http://localhost:8000/api/cardata`, tempcardata);
    //   toast.success(`צ' נוסף בהצלחה`);
    //   props.ToggleForModal();
    // }
  }

  async function UpdateCarData() {
    // let response = await axios.get(`http://localhost:8000/api/cardata/cardatabycarnumber/${cardata.carnumber}`)
    //   //update cardata
    //   var tempcardataid = props.cardataid;
    //   let tempcardata = { ...cardata }
    //   if (tempcardata.zminot == 'זמין' && tempcardata.kshirot == 'כשיר') {
    //     tempcardata.tipuls = [];
    //     tempcardata.takala_info = '';
    //     tempcardata.expected_repair = '';
    //   }
    //   else {
    //     tempcardata.tipuls = finalspecialkeytwo;
    //   }
    //   tempcardata.updatedBy = user.personalnumber;
    //   let result = await axios.put(`http://localhost:8000/api/cardata/${tempcardataid}`, tempcardata)
    //   //create archivecardata
    //   delete tempcardata._id;
    //   let result2 = axios.post(`http://localhost:8000/api/archivecardata`, tempcardata);
    //   toast.success(`צ' עודכן בהצלחה`);
    //   console.log(tempcardata.updatedBy,result.updatedBy);
    //   props.ToggleForModal();
  }
  

  function init() {
    if (props.screendataid != undefined) {
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
      style={{ minHeight: '100%', maxHeight: '100%', minWidth: '80%', maxWidth: '80%', justifyContent: 'center', alignSelf: 'center', margin: '0px', margin: 'auto', direction: 'rtl' }}
      isOpen={props.isOpen}
      centered
      fullscreen
      scrollable
      size=""
      toggle={props.Toggle}>
      <ModalBody>
BBBBBBBBBBBBBBBBBBBBBBBBBBB
      </ModalBody>
    </Modal>
  );
}
export default withRouter(ScreenModal);;
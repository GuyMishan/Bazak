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
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";
import deletepic from "assets/img/delete.png";

const CarDataFormModalDelete = (props) => {
  //cardata
  const [cardata, setCarData] = useState({})

  const loadcardata = async () => {
    await axios.get(`http://localhost:8000/api/cardata/${props.cardataid}`)
      .then(response => {
        let tempcardata = response.data[0];
        if (tempcardata.latest_recalibration_date)
          tempcardata.latest_recalibration_date = tempcardata.latest_recalibration_date.slice(0, 10);
        setCarData(tempcardata);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const clickSubmit = event => {
    DeleteCarDatasUnits();
  }

  async function DeleteCarDatasUnits() {
    //create archivecardata
    await axios.get(`http://localhost:8000/api/cardata/${props.cardataid}`)
    .then(response => {
      let tempcardata = response.data[0];
      delete tempcardata._id;
      let result = axios.post(`http://localhost:8000/api/archivecardata`, tempcardata);
    })
    .catch((error) => {
      console.log(error);
    })
    //delete cardata units
    var tempcardataid = props.cardataid;
    let tempcardata = { ...cardata }
    tempcardata.gdod=null;
    tempcardata.hativa=null;
    tempcardata.ogda=null;
    tempcardata.pikod=null;
    let result = await axios.put(`http://localhost:8000/api/cardata/${tempcardataid}`, tempcardata)
    toast.success(`צ' נמחק בהצלחה`);
    props.ToggleForModal();
  }

  function init() {
    if (props.cardataid != undefined) {
      loadcardata();
    }
  }

  useEffect(() => {
    if (props.isOpen == true)
      init();
    else {
      setCarData({})
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
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>מחיקת כלי מהיחידה</CardTitle>{/*headline*/}
          </CardHeader>
          <CardBody style={{ direction: 'rtl' }}>
            <Container>
              <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                <h3>האם אתה בטוח שברצונך למחוק את הכלי מהיחידה?</h3>
                <h3>נתוני הצ' לא ימחקו ויהיה ניתן לשייך אותו ליחידה בעתיד</h3>
                <button className="btn-new-delete" onClick={clickSubmit}>מחק</button>
              </div>
            </Container>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(CarDataFormModalDelete);;
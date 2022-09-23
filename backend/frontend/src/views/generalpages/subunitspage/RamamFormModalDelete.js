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

const RamamFormModalDelete = (props) => {
  const { user } = isAuthenticated()
  //ramam
  // const [ramam, setRamam] = useState({})

  // const loadramam = async () => {
  //   await axios.get(`http://localhost:8000/api/ramam/${props.ramamid}`)
  //     .then(response => {
  //       let tempramam = response.data[0];
  //       setRamam(tempramam);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }

  const clickSubmit = event => {
    DeleteRamamsUnits();
  }

  async function DeleteRamamsUnits() {
    //delete ramam units
    var tempramamid = props.ramamid;
    // let tempramam = { ...ramam }
    let result = await axios.post(`http://localhost:8000/api/ramam/remove/${tempramamid}`)
    toast.success(`רמ"מ נמחק בהצלחה`);
    props.ToggleForModal();
  }

  function init() {
    // if (props.ramamid != undefined) {
    //   loadramam();
    // }
  }

  useEffect(() => {
    if (props.isOpen == true)
      init();
    else {
      // setRamam({})
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
            <CardTitle tag="h4" style={{ direction: 'rtl', textAlign: 'center', fontWeight: "bold" }}>מחיקת רמ"מ</CardTitle>{/*headline*/}
          </CardHeader>
          <CardBody style={{ direction: 'rtl' }}>
            <Container>
              <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                <h3>האם אתה בטוח שברצונך למחוק את הרמ"מ?</h3>

                {(user.site_permission == undefined || user.site_permission == 'צפייה ועריכה') ?
                  <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                    <button className="btn-new-delete" onClick={clickSubmit}>מחק</button>
                  </div> : null}
              </div>
            </Container>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
}
export default withRouter(RamamFormModalDelete);;
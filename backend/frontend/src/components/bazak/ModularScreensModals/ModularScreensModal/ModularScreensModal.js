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
  ModalBody,
  CardFooter
} from "reactstrap";
import axios from 'axios';
import history from 'history.js'
import { signin, authenticate, isAuthenticated } from 'auth/index';
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";
import ScreenModal from './ScreenModal';
import ScreenCard from './ScreenCard';

const ModularScreensModal = (props) => {
  const [mode, setMode] = useState('normal');// normal/edit
  const [screens, setScreens] = useState([]);

  const [filteredscreens, setFilteredscreens] = useState([]);
  //screen modal
  const [isscreenmodalopen, setIsscreenmodalopen] = useState(false);
  const [screenidformodal, setScreenidformodal] = useState(undefined);

  const searchOrder = (evt) => {
    if (evt.target.value == "") {
      setFilteredscreens(screens)
    }
    setFilteredscreens(screens.filter((screen) => screen.name.toString().includes(evt.target.value.toString())))
  }

  function ToggleMode(evt) {
    if (mode == 'normal') {
      setMode('edit');
    }
    else {
      setMode('normal');
    }
  }

  const Togglescreenmodal = (value) => {
    if (value == undefined) {
      setScreenidformodal(undefined);
    }
    else {
      setScreenidformodal(value);
    }
    setIsscreenmodalopen(!isscreenmodalopen);
  }

  function ToggleForModal(evt) {
    setIsscreenmodalopen(!isscreenmodalopen);
  }

  function init() {
    getscreensbyuser();
  }

  async function getscreensbyuser() {
    let response = await axios.get(`http://localhost:8000/api/modularscreens/screensbyuserpersonalnumber/${props.user.personalnumber}`)
    let tempcardata = response.data;
    setScreens(tempcardata)
    setFilteredscreens(tempcardata)
  }

  useEffect(() => {
    if (props.isOpen == true)
      init();
    else {
      setMode('normal');
      setScreens([]);
      setFilteredscreens([]);
      setIsscreenmodalopen(false);
      setScreenidformodal(undefined);
    }
  }, [props.isOpen])

  return (
    <>
      <ScreenModal isOpen={isscreenmodalopen} Toggle={() => Togglescreenmodal()} ToggleForModal={ToggleForModal} screenid={screenidformodal} init={() => init()} />
      <Modal
        style={{ minHeight: '100%', maxHeight: '100%', minWidth: '80%', maxWidth: '90%', justifyContent: 'center', alignSelf: 'center', marginTop: filteredscreens.length>15 ? (Math.ceil((filteredscreens.length-16)/4)*(120)+'px') : 'auto', direction: 'rtl' }}
        isOpen={props.isOpen}
        centered
        fullscreen
        scrollable
        size=""
        toggle={props.Togglemodularscreensmodal}>
        <ModalBody>
          <Row style={{ textAlign: 'right', marginBottom: (mode != 'normal' && (screens.length == 0)) ? '170px': '20px' }}>
            {mode == 'normal' ?
              <>
                <Col xs={12} md={8}>
                  <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleMode}>ערוך</button>
                </Col>
                <Col xs={12} md={4}>
                  <Input placeholder="חפש..." onChange={(text) => searchOrder(text)} />
                </Col>
              </>
              : <>
                <Col xs={12} md={8}>
                  <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleMode}>שמור</button>
                  <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={() => Togglescreenmodal(undefined)}>צור מסך</button>
                </Col>
                <Col xs={12} md={4}>
                  <Input placeholder="חפש..." onChange={(text) => searchOrder(text)} />
                </Col>
              </>}
          </Row>

          <Row>
          {mode == "normal" ?
            <Col xs={12} md={3} onClick={()=>{
              props.Togglemodularscreensmodal();
              if (isAuthenticated().user.role == "0") {
                history.push(`/dashboard/admin/0/magadal/0/true`);
              }
              if (isAuthenticated().user.role == "4") {
                history.push(`/dashboard/pikod/${isAuthenticated().user.pikodid}/magadal/0/true`);
              }
              if (isAuthenticated().user.role == "3") {
                history.push(`/dashboard/ogda/${isAuthenticated().user.ogdaid}/magadal/0/true`);
              }
              if (isAuthenticated().user.role == "2") {
                history.push(`/dashboard/hativa/${isAuthenticated().user.hativaid}/magadal/0/true`);
              }
              if (isAuthenticated().user.role == "1") {
                history.push(`/dashboard/gdod/${isAuthenticated().user.gdodid}/magadal/0/true`);
              }
              if (isAuthenticated().user.role == "5") {
                history.push(`/dashboard/general/5/magadal/0/true`);
              }
            }} style={{ cursor: 'pointer' }}>

            <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                <CardBody style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
                    <h2 style={{ margin: 'auto' }}>מסך ברירת מחדל</h2>
                </CardBody>
            </Card>
            </Col>
           :null}
            {filteredscreens.map((screen, i) => (
              screen ?
                <ScreenCard screen={screen} mode={mode} screenid={screen.screenid} init={() => init()} Toggle={() => Togglescreenmodal(screen.screenid)} user={props.user} Togglemodularscreensmodal={props.Togglemodularscreensmodal} />
                : null))}
          </Row>

        </ModalBody>
      </Modal>
    </>
  );
}
export default withRouter(ModularScreensModal);
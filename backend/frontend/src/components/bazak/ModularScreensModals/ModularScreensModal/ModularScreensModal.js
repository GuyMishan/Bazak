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
import ScreenModal from '../ScreenModal';
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

  const Togglescreenmodal= (value)=> {
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
    init(); // update screens
  }

  const clickSubmit = event => {

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

    }
  }, [props.isOpen])

  return (
    <>
      <ScreenModal isOpen={isscreenmodalopen} Toggle={() => Togglescreenmodal()} ToggleForModal={ToggleForModal} screenid={screenidformodal} />
      <Modal
        style={{ minHeight: '100%', maxHeight: '100%', minWidth: '80%', maxWidth: '90%', justifyContent: 'center', alignSelf: 'center', margin: '0px', margin: 'auto', direction: 'rtl' }}
        isOpen={props.isOpen}
        centered
        fullscreen
        scrollable
        size=""
        toggle={props.Toggle}>
        <ModalBody>
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            {mode == 'normal' ?
              <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleMode}>ערוך</button>
              : <>
                <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={ToggleMode}>שמור</button>
                <button className='btn-new-blue' style={{ marginLeft: '5px' }} onClick={() => Togglescreenmodal(undefined)}>צור מסך</button>
              </>}
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Row>
              <Col xs={12} md={4}>
                <Input placeholder="חפש..." onChange={(text) => searchOrder(text)} />
              </Col>
              <Col xs={12} md={8}>
              </Col>
            </Row>
          </div>

          <Row>
            {filteredscreens.map((screen, i) => (
              screen ?
                <ScreenCard screen={screen} mode={mode} screenid={screen.screenid} init={init} Toggle={() => Togglescreenmodal(screen.screenid)}/>
                : null))}
          </Row>

        </ModalBody>
      </Modal>
    </>
  );
}
export default withRouter(ModularScreensModal);;
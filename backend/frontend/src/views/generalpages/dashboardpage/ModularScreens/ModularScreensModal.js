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
import ScreenModal from './ScreenModal';

const ModularScreensModal = (props) => {
  //screen modal
  const [isscreenmodalopen, setIsscreenmodalopen] = useState(false);
  const [screenidformodal, setScreenidformodal] = useState(undefined);

  function Togglescreenmodal(evt) {
    if (evt.currentTarget.value == '') {
      setScreenidformodal(undefined)
    }
    else {
      setScreenidformodal(evt.currentTarget.value)
    }
    setIsscreenmodalopen(!isscreenmodalopen);
  }

  const clickSubmit = event => {

  }

  function init() {

  }

  useEffect(() => {
    if (props.isOpen == true)
      init();
    else {

    }
  }, [props.isOpen])

  return (
    <>
      <ScreenModal isOpen={isscreenmodalopen} Toggle={Togglescreenmodal} screenid={screenidformodal}/>
      <Modal
        style={{ minHeight: '100%', maxHeight: '100%', minWidth: '80%', maxWidth: '80%', justifyContent: 'center', alignSelf: 'center', margin: '0px', margin: 'auto', direction: 'rtl' }}
        isOpen={props.isOpen}
        centered
        fullscreen
        scrollable
        size=""
        toggle={props.Toggle}>
        <ModalBody>
          ffgfggfgffgfg

        <button className='btn-new-blue' style={{ marginLeft: '5px' }} value={undefined} onClick={Togglescreenmodal}>יצירת מסך</button>

      </ModalBody>
      </Modal>
    </>
  );
}
export default withRouter(ModularScreensModal);;
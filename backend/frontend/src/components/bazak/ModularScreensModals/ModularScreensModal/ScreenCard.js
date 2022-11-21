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

const ScreenCard = (props) => {
    //   const [screens, setScreens] = useState([]);
    //   //screen modal
    //   const [isscreenmodalopen, setIsscreenmodalopen] = useState(false);
    //   const [screenidformodal, setScreenidformodal] = useState(undefined);

    //   function Togglescreenmodal(evt) {
    //     if (evt.currentTarget.value == '') {
    //       setScreenidformodal(undefined)
    //     }
    //     else {
    //       setScreenidformodal(evt.currentTarget.value)
    //     }
    //     setIsscreenmodalopen(!isscreenmodalopen);
    //   }

    const clickSubmit = event => {
        console.log('delete');
    }

    //   function init() {
    //     getscreensbyuser();
    //   }

    //   async function getscreensbyuser() {
    //     let response = await axios.get(`http://localhost:8000/api/modularscreens/screensbyuserpersonalnumber/${props.user.personalnumber}`)
    //     let tempcardata = response.data;
    //     setScreens(tempcardata)
    //   }

    //   useEffect(() => {
    //     if (props.isOpen == true)
    //       init();
    //     else {

    //     }
    //   }, [props.isOpen])

    return (
        props.mode == 'normal' ?
            <Col xs={12} md={3}>
                <Link to="/signin">
                    <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                        <CardBody style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
                            <h2 style={{ margin: 'auto' }}>{props.screen.name}</h2>
                        </CardBody>
                    </Card>
                </Link>
            </Col> :
            <Col xs={12} md={3}>
                <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                    <CardHeader>
                        <div style={{ textAlign: 'left' }}>
                            <button className='btn-new-delete' style={{ padding: '11px 17px' }} onClick={clickSubmit}>X</button>
                        </div>
                    </CardHeader>
                    <CardBody style={{ textAlign: 'center' }}>
                        <h2 style={{ margin: 'auto' }}>{props.screen.name}</h2>
                    </CardBody>
                    <CardFooter>
                        <div style={{ textAlign: 'right' }}>
                            <button className='btn-new-delete' style={{ padding: '11px 17px' }} onClick={clickSubmit}>O</button>
                        </div>
                    </CardFooter>
                </Card>
            </Col>
    );
}
export default withRouter(ScreenCard);;
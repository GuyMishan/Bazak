import React, { useState, useEffect, useRef } from 'react';
import { useParams,Link, withRouter, Redirect } from "react-router-dom";
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
import radioempty from "assets/img/radio-empty.png";
import radiotick from "assets/img/radio-tick.png";

const ScreenCard = (props) => {
    const {unitid} = useParams();
    const {unittype} = useParams();

    const clickDelete = async () => {
       await findDependedCharts()
       .then(()=>{
            let response = axios.post(`http://localhost:8000/api/modularscreens/screen/remove/${props.screenid}`)
            toast.success(`מסך נמחק בהצלחה`);
            props.init();
       })
    }

    const findDependedCharts = async () =>{
        var tempscreentid = props.screenid;
        await axios.get(`http://localhost:8000/api/modularscreens/chartsbyscreenid/${tempscreentid}`)
          .then(response => {
            let tempchart = response.data[0];
            for(let i=0;i<response.data.length;i++){
                deleteDependedCharts(response.data[i]);
            }
          })
          .catch((error) => {
            console.log(error);
          })
    }

    const linkandclosemodal = async () =>{
        props.Togglemodularscreensmodal();
        history.push(`/modularchartpage/${props.screenid}/${unittype}/${unitid}/magadal/0`);
    }

    const deleteDependedCharts = async (tempchart) =>{
        let response = axios.post(`http://localhost:8000/api/modularscreens/chart/remove/${tempchart.chartid}`)
    }

    const clearusermainscreen = event => {
        console.log('clearusermainscreen');
    }

    const setusermainscreen = event => {
        console.log('setusermainscreen');
    }

    return (
        props.mode == 'normal' ?
            <Col xs={12} md={3} onClick={linkandclosemodal} style={{cursor:'pointer'}}>
                {/* <Link to={`/modularchartpage/${props.screenid}/${unittype}/${unitid}/magadal/0`}> */}
                    <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                        <CardBody style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
                            <h2 style={{ margin: 'auto' }}>{props.screen.name}</h2>
                        </CardBody>
                    </Card>
                {/* </Link> */}
            </Col> :
            <Col xs={12} md={3}>
                <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                    <CardHeader>
                        <div style={{ textAlign: 'left' }}>
                            <button className='btn-new-delete' style={{ padding: '11px 17px' }} onClick={clickDelete}>X</button>
                        </div>
                    </CardHeader>
                    <div style={{ padding: "1px 8px", cursor: 'pointer' }} onClick={props.Toggle}>
                        <CardBody style={{ textAlign: 'center' }}>
                            <h2 style={{ margin: 'auto' }}>{props.screen.name}</h2>
                        </CardBody>
                    </div>
                    <CardFooter>
                        <div style={{ textAlign: 'right' }}>
                            {props.user.mainscreenid && props.user.mainscreenid == props.screen.screenid ?
                                <button className='btn-empty' style={{ padding: '0px' }} onClick={clearusermainscreen}><img style={{ height: '30px' }} src={radiotick}></img></button>
                                : <button className='btn-empty' style={{ padding: '0px' }} onClick={setusermainscreen}><img style={{ height: '30px' }} src={radioempty}></img></button>}

                        </div>
                    </CardFooter>
                </Card>
            </Col>
    );
}
export default withRouter(ScreenCard);;
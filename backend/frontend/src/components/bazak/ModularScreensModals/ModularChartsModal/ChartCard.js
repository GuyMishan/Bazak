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

const ChartCard = (props) => {

    const clickDelete = async () => {
        let response = axios.post(`http://localhost:8000/api/modularscreens/chart/remove/${props.chartid}`)
        toast.success(`מסך נמחק בהצלחה`);
        props.init();
    }

    return (
        props.mode == 'normal' ?
            <Col xs={12} md={3}>
                <Link to="/signin">
                    <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                        <CardBody style={{ textAlign: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
                            <h2 style={{ margin: 'auto' }}>{props.chart.name}</h2>
                        </CardBody>
                    </Card>
                </Link>
            </Col> :
            <Col xs={12} md={3}>
                <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                        <CardBody style={{ textAlign: 'center' }}>
                         <div style={{ textAlign: 'left' }}>
                            <button className='btn-new-delete' style={{ padding: '11px 17px' }} onClick={clickDelete}>X</button>
                         </div>
                          <div style={{ padding: "1px 8px", cursor: 'pointer' }} onClick={props.Toggle}>
                            <h2 style={{ margin: 'auto' }}>{props.chart.name}</h2>
                          </div>
                          <div style={{ padding: "1rem" }}>

                          </div>
                        </CardBody>
                </Card>
            </Col>
    );
}
export default withRouter(ChartCard);;
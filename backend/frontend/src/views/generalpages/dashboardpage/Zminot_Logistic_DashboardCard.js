import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Container,
    Col,
    Collapse,
} from "reactstrap";

function Zminot_Logistic_DashboardCard(props) {

    return (
        <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
            <CardHeader>
                <h3 style={{ textAlign: 'center', fontWeight: 'bold',margin:'0px'}}>זמינות מכפילי כח לוגיסטיים</h3>
            </CardHeader>
            <CardBody style={{ textAlign: 'center', margin: 'auto' }}>
                <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                    <CircularProgressbar value={40} text={`${40}%`} styles={{
                        root: {},
                        path: {
                            stroke: `#9925be`,
                            strokeLinecap: 'butt',
                            transition: 'stroke-dashoffset 0.5s ease 0s',
                        },
                        trail: {
                            stroke: 'rgb(141 141 141 / 30%)',
                            strokeLinecap: 'butt',
                            transform: 'rotate(0.25turn)',
                            transformOrigin: 'center center',
                        },
                        text: {
                            fill: '#9925be',
                            fontSize: '18px',
                        },
                        background: {
                            fill: '#3e98c7',
                        },
                    }} />
                </div>
            </CardBody>
        </Card>
    );
}

export default withRouter(Zminot_Logistic_DashboardCard);
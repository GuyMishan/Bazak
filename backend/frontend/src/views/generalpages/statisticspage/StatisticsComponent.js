import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Container,
    Col,
    Collapse,
    Input,
} from "reactstrap";
import axios from 'axios';

import { Line, Pie, Doughnut, PolarArea } from 'react-chartjs-2';

import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from "components/general/CircularProgressBarAnimation/ProgressProvider";

function StatisticsComponent(props) {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    }

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels,
        datasets: [
            {
                fill: false,
                label: 'Dataset 1',
                data: labels.map(() => 20),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                fill: false,
                label: 'Dataset 2',
                data: labels.map(() => 40),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const data2 = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const data3 = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const data4 = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        // init();
    }, [])

    return (
        <div dir='rtl' style={{ width: '100%' }}>
            <Row>
                <Col xs={12} md={6}>
                    <div style={{ textAlign: 'right' }}>תאריך התחלה</div>
                    <Input placeholder="תאריך התחלה" type="date" name="latest_recalibration_date" /*value={cardata.latest_recalibration_date} onChange={handleChange}*/ />
                </Col>
                <Col xs={12} md={6}>
                    <div style={{ textAlign: 'right' }}>תאריך סיום</div>
                    <Input placeholder="תאריך סיום" type="date" name="latest_recalibration_date" /*value={cardata.latest_recalibration_date} onChange={handleChange}*/ />
                </Col>
            </Row>
            <Row style={{paddingTop:'10px'}}>
                <Col xs={12} md={8}>
                    <Card>
                        <CardBody>
                            <Line options={options} data={data} />
                        </CardBody>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card>
                        <CardBody style={{textAlign:'center'}}>
                            <div style={{paddingBottom:'15px'}}>זמינות כוללת</div>
                            <div style={{width:'80%',margin:'auto'}}>
                            <ProgressProvider valueStart={0} valueEnd={100}>
                                {value => <CircularProgressbarWithChildren value={value} /*text={`${value}%`}*/ styles={{
                                    root: {},
                                    path: {
                                        stroke: `#8ac926`,
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
                                        fill: '#8ac926',
                                        fontSize: '18px',
                                    },
                                    background: {
                                        fill: '#3e98c7',
                                    },
                                }}>
                                    <div>
                                        <h2 style={{ margin: '0px' }}>{`${value.toFixed(0)}%`}</h2>
                                    </div>
                                </CircularProgressbarWithChildren>}
                            </ProgressProvider>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={8}>
                    {/* <Row>
                        <Col xs={12} md={6}>
                            <Card>
                                <CardBody>
                                    sddsds66
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs={12} md={6}>
                            <Card>
                                <CardBody>
                                    sddsds88
                                </CardBody>
                            </Card>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col xs={12} md={4}>
                                            <Pie data={data2} />
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <Doughnut data={data3} />
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <PolarArea data={data4} />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} md={4}>
                    {/* <Card>
                        <CardBody>
                            sddsds12
                        </CardBody>
                    </Card> */}
                </Col>
            </Row>
        </div>
    );
}
export default withRouter(StatisticsComponent);